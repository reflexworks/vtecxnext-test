import { NextRequest } from 'next/server'
import { VtecxNext, VtecxNextError } from '@vtecx/vtecxnext'

/**
 * PUTメソッド
 * @param req リクエスト
 * @returns レスポンス
 */
export const PUT = async (req:NextRequest):Promise<Response> => {
  console.log(`[api addids] start. x-requested-with=${req.headers.get('x-requested-with')}`)

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
    const tmpNum:string = vtecxnext.getParameter('num') ?? ''
    const num:number = tmpNum ? Number(tmpNum) : 0
    const targetservice:string = vtecxnext.getParameter('targetservice') ?? ''
    console.log(`[api addids] key=${key} num=${num} ${targetservice ? 'targetservice=' + targetservice : ''}`)

    resMessage = String(await vtecxnext.addids(key, num, targetservice))
    resStatus = 200
  } catch (error) {
    if (error instanceof VtecxNextError) {
      console.log(`[api addids] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resMessage = error.message
    } else {
      console.log(`[api addids] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resMessage = 'Error occured.'
    }
  }
  const feed = {'feed' : {'title' : resMessage}}

  console.log('[api addids] end.')
  return vtecxnext.response(resStatus, feed)
}
