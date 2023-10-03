import { NextRequest } from 'next/server'
import { VtecxNext, VtecxNextError } from '@vtecx/vtecxnext'
import * as testutil from 'utils/testutil'

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
    const revision = testutil.getParamNumber(vtecxnext, 'r')
    const targetservice:string = vtecxnext.getParameter('targetservice') ?? ''
    console.log(`[api deleteentry] key=${key} r=${revision} ${targetservice ? 'targetservice=' + targetservice : ''}`)
  
    await vtecxnext.deleteEntry(key, revision, targetservice)
    resStatus = 200
    resMessage = `entry deleted. ${key}`
  } catch (error) {
    if (error instanceof VtecxNextError) {
      console.log(`[api deleteentry] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resMessage = error.message
    } else {
      console.log(`[api deleteentry] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resMessage = 'Error occured.'
    }
  }
  const feed = {'feed' : {'title' : resMessage}}

  console.log('[deleteentry] end.')
  return vtecxnext.response(resStatus, feed) 
}
