import { NextRequest } from 'next/server'
import { VtecxNext, isVtecxNextError } from '@vtecx/vtecxnext'

/**
 * GETメソッド
 * @param req リクエスト
 * @returns レスポンス
 */
export const GET = async (req:NextRequest):Promise<Response> => {
  console.log(`[api property] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }

  // エントリー取得
  let resStatus:number
  let resMessage:string
  try {
    // キーを取得
    const name:string = vtecxnext.getParameter('name') ?? ''
    console.log(`[api property] name=${name}`)

    const val = await vtecxnext.property(name)
    if (val) {
      resStatus = 200
      resMessage = val
    } else {
      resStatus = 204
      resMessage = ''
    }
  } catch (error) {
    if (isVtecxNextError(error)) {
      console.log(`[api property] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resMessage = error.message
    } else {
      console.log(`[api property] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resMessage = 'Error occured.'
    }
  }
  const feed = {'feed' : {'title' : resMessage}}

  console.log('[api property] end.')
  return vtecxnext.response(resStatus, feed)
}
