import { NextRequest } from 'next/server'
import { VtecxNext, VtecxNextError } from '@vtecx/vtecxnext'
import { ApiRouteTestError } from 'utils/testutil'

export const GET = async (req:NextRequest):Promise<Response> => {
  console.log(`[api info] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }

  // 処理区分を取得
  const type:string = vtecxnext.getParameter('type') ?? ''
  // uid取得
  let resStatus:number
  let resMessage:string
  try {
    if (type === 'account') {
      resMessage = await vtecxnext.account()
    } else if (type === 'service') {
      resMessage = await vtecxnext.service()
    } else if (type === 'rxid') {
      resMessage = await vtecxnext.rxid()
    } else if (type === 'now') {
      resMessage = await vtecxnext.now()
    } else {
      throw new ApiRouteTestError(400, `invalid type: ${type}`)
    }
    resStatus = 200
  } catch (error) {
    if (error instanceof VtecxNextError) {
      console.log(`[api info] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resMessage = error.message
    } else if (error instanceof ApiRouteTestError) {
      console.log(`[api info] ApiRouteTestError: status=${error.status} ${error.message}`)
      resStatus = error.status
      resMessage = error.message
    } else {
      console.log(`[api info] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resMessage = 'Error occured.'
    }
  }
  const feed = {'feed' : {'title' : resMessage}}

  console.log('[api info] end.')
  return vtecxnext.response(resStatus, feed)
}
