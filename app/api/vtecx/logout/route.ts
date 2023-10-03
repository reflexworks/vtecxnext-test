import { NextRequest } from 'next/server'
import { VtecxNext, VtecxNextError } from '@vtecx/vtecxnext'

export const GET = async (req:NextRequest):Promise<Response> => {
  console.log(`[api logout] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }

  // ログアウト
  let resStatus:number
  let resMessage:string
  try {
    const statusMessage = await vtecxnext.logout()
    resMessage = statusMessage.message
    resStatus = statusMessage.status
  } catch (error) {
    if (error instanceof VtecxNextError) {
      console.log(`[api logout] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resMessage = error.message
    } else {
      console.log(`[api logout] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resMessage = 'Error occured.'
    }
  }
  const resJson = {'feed' : {'title' : resMessage}}

  console.log('[api logout] end.')
  return vtecxnext.response(200, resJson)
}
