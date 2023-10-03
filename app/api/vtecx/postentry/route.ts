import { NextRequest } from 'next/server'
import { VtecxNext, VtecxNextError } from '@vtecx/vtecxnext'
import * as testutil from 'utils/testutil'

/**
 * POSTメソッド
 * @param req リクエスト
 * @returns レスポンス
 */
export const POST = async (req:NextRequest):Promise<Response> => {
  console.log(`[api postentry] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }

  // 引数を取得
  const key:string = vtecxnext.getParameter('key') ?? ''
  const targetservice:string = vtecxnext.getParameter('targetservice') ?? ''
  console.log(`[api postentry] key=${key} ${targetservice ? 'targetservice=' + targetservice : ''}`)

  // リクエストJSON取得
  const contentLength:number = testutil.toNumber(req.headers.get('content-length'), 0)
  let feed:any
  if (contentLength > 0) {
    try {
      feed = await req.json()
    } catch (error) {
      let resErrMsg:string
      if (error instanceof Error) {
        resErrMsg = `${error.name}: ${error.message}`
      } else {
        resErrMsg = 'Error occured by req.json()'
      }
      return vtecxnext.response(400, {'feed' : {'title' : resErrMsg}})
    }
  }

  let cnt = 0
  if (Array.isArray(feed)) {
    cnt = feed.length
  } else if ('feed' in feed && 'entry' in feed.feed) {
    cnt = feed.feed.entry.length
  }
  console.log(`[api postentry] count of entries=${cnt}`)

  let resStatus:number
  let resJson:any
  try {
    resJson = await vtecxnext.post(feed, key, targetservice)
    resStatus = 200
  } catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError) {
      console.log(`[api postentry] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[api postentry] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {'feed' : {'title' : resErrMsg}}
  }

  console.log('[api postentry] end.')
  return vtecxnext.response(resStatus, resJson)
}
