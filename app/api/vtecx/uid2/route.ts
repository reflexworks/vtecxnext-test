import { NextRequest } from 'next/server'
import { VtecxNext, VtecxNextError } from '@vtecx/vtecxnext'

export const GET = async (req:NextRequest):Promise<Response> => {
  console.log(`[api uid2] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }

  // uid取得
  let resStatus:number
  let resMessage:string

  // 1回目
  console.log(`[api uid2](1) start.`)
  try {
    resMessage = await vtecxnext.uid()
    resStatus = 200
  } catch (error) {
    // エラーの場合は抜ける
    if (error instanceof VtecxNextError) {
      console.log(`[api uid2](1) Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resMessage = `(1) ${error.message}`
    } else {
      console.log(`[api uid2](1) Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resMessage = '(1) Error occured.'
    }
    const feed = {'feed' : {'title' : resMessage}}
    return vtecxnext.response(resStatus, feed)
  }

  // ２回目
  console.log(`[api uid2](2) start.`)
  try {
    resMessage = await vtecxnext.uid()
    resStatus = 200
  } catch (error) {
    if (error instanceof VtecxNextError) {
      console.log(`[api uid2](2) Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resMessage = `(2) ${error.message}`
    } else {
      console.log(`[api uid2](2) Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resMessage = '(2) Error occured.'
    }
  }

  const feed = {'feed' : {'title' : resMessage}}

  console.log('[api uid2] end.')
  return vtecxnext.response(resStatus, feed)
}
