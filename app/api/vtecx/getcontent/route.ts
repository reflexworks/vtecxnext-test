import { NextRequest } from 'next/server'
import { VtecxNext, VtecxNextError } from '@vtecx/vtecxnext'

export const GET = async (req:NextRequest):Promise<Response> => {
  console.log(`[api getcontent] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }

  // キーを取得
  const key:string = vtecxnext.getParameter('key') ?? ''
  console.log(`[api getcontent] key=${key}`)
  // エントリー取得
  let resStatus:number|undefined = undefined
  let resJson:any|undefined = undefined
  try {
    // レスポンスステータスと取得したコンテンツはvtecxnextに格納される。
    await vtecxnext.getcontent(key)
  } catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError) {
      console.log(`[api getcontent] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[api getcontent] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {'feed' : {'title' : resErrMsg}}
  }

  console.log('[api getcontent] end.')
  return vtecxnext.response(resStatus, resJson)
}
