import { NextRequest } from 'next/server'
import { VtecxNext, VtecxNextError } from '@vtecx/vtecxnext'

/**
 * PUTメソッド
 * @param req リクエスト
 * @returns レスポンス
 */
export const PUT = async (req:NextRequest):Promise<Response> => {
  console.log(`[api putcontent] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }

  // キーを取得
  const key:string = vtecxnext.getParameter('key') ?? ''
  const bysize = vtecxnext.hasParameter('bysize')
  const filename:string = vtecxnext.getParameter('filename') ?? ''

  let resStatus:number
  let resJson:any
  try {
    if (bysize) {
      console.log(`[api putcontent] putcontentBySize key=${key}`)
      resJson = await vtecxnext.putcontentBySize(key)
    } else {
      console.log(`[api putcontent] putcontent key=${key}${filename ? ' filename=' + filename : ''}`)
      resJson = await vtecxnext.putcontent(key, filename)
    }
    resStatus = 200
  } catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError) {
      console.log(`[api putcontent] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[api putcontent] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {'feed' : {'title' : resErrMsg}}
  }

  console.log('[api putcontent] end.')
  return vtecxnext.response(resStatus, resJson)
}
