import { NextRequest } from 'next/server'
import { VtecxNext, VtecxNextError } from '@vtecx/vtecxnext'

/**
 * DELETEメソッド
 * @param req リクエスト
 * @returns レスポンス
 */
export const DELETE = async (req:NextRequest):Promise<Response> => {
  console.log(`[api deleteentry] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }

  // 削除
  let resStatus:number
  let resMessage:string
  try {
    // キーを取得
    const key:string = vtecxnext.getParameter('key') ?? ''
    const async:boolean = vtecxnext.hasParameter('async')
    const targetservice:string = vtecxnext.getParameter('targetservice') ?? ''

    console.log(`[api deletefolder] key=${key} async=${async} ${targetservice ? 'targetservice=' + targetservice : ''}`)
    await vtecxnext.deleteFolder(key, async, targetservice)
    resStatus = async ? 202 : 200
    resMessage = `folder deleted. ${async ? '(accepted)' : ''} ${key}`
  } catch (error) {
    if (error instanceof VtecxNextError) {
      console.log(`[api deletefolder] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resMessage = error.message
    } else {
      console.log(`[api deletefolder] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resMessage = 'Error occured.'
    }
  }
  const feed ={'feed' : {'title' : resMessage}}

  console.log('[api deletefolder] end.')
  return vtecxnext.response(resStatus, feed) 
}
