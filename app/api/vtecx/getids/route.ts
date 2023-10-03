import { NextRequest } from 'next/server'
import { VtecxNext, VtecxNextError } from '@vtecx/vtecxnext'

/**
 * GETメソッド
 * @param req リクエスト
 * @returns レスポンス
 */
export const GET = async (req:NextRequest):Promise<Response> => {
  console.log(`[api getids] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }

  let resStatus:number
  let resMessage:string
  try {
    // キーを取得
    const key:string = vtecxnext.getParameter('key') ?? ''
    const targetservice:string = vtecxnext.getParameter('targetservice') ?? ''
    console.log(`[api getids] key=${key} ${targetservice ? 'targetservice=' + targetservice : ''}`)

    resMessage = String(await vtecxnext.getids(key, targetservice))
    resStatus = 200
  } catch (error) {
    if (error instanceof VtecxNextError) {
      console.log(`[api getids] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resMessage = error.message
    } else {
      console.log(`[api getids] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resMessage = 'Error occured.'
    }
  }
  const feed = {'feed' : {'title' : resMessage}}

  console.log('[api getids] end.')
  return vtecxnext.response(resStatus, feed)
}
