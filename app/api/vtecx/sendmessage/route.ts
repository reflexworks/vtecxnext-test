import { NextRequest } from 'next/server'
import { VtecxNext, VtecxNextError } from '@vtecx/vtecxnext'
import * as testutil from 'utils/testutil'

/**
 * GETメソッド
 * @param req リクエスト
 * @returns レスポンス
 */
export const GET = async (req:NextRequest):Promise<Response> => {
  console.log(`[api sendmessage] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }

  // キーを取得
  const key:string = vtecxnext.getParameter('key') ?? ''
  const targetservice:string = vtecxnext.getParameter('targetservice') ?? ''
  console.log(`[api sendmessage] key=${key} ${targetservice ? 'targetservice=' + targetservice : ''}`)
  // エントリー取得
  let resStatus:number
  let resJson:any
  try {
    const status:number = testutil.getParamNumberRequired(vtecxnext, 'status')
    const message:string = vtecxnext.getParameter('message') ?? ''
    const response:Response = vtecxnext.sendMessage(status, message)
    console.log('[api sendmessage] end.')
    return response

  } catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError) {
      console.log(`[api sendmessage] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[api sendmessage] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {'feed' : {'title' : resErrMsg}}
  }

  console.log('[api sendmessage] end.')
  return vtecxnext.response(resStatus, resJson)
}
