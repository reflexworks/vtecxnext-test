import { NextRequest } from 'next/server'
import { VtecxNext, VtecxNextError } from '@vtecx/vtecxnext'

/**
 * PUTメソッド
 * @param req リクエスト
 * @returns レスポンス
 */
export const PUT = async (req:NextRequest):Promise<Response> => {
  console.log(`[api pdf] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }

  let resStatus:number = 200
  let resJson:any

  const buffer:ArrayBuffer = await req.arrayBuffer()
  if (!buffer) {
    resJson = {'feed' : {'title' : 'html template is required.'}}
    return vtecxnext.response(400, resJson)
  }
  const htmlTemplate = new TextDecoder().decode(buffer)
  if (!htmlTemplate) {
    resJson = {'feed' : {'title' : 'html template is required.'}}
    return vtecxnext.response(400, resJson)
  }
  const filename:string = vtecxnext.getParameter('pdf') ?? 'default.pdf'

  // PDF生成
  try {
    // 取得されたPDFデータはvtecxnextに一時保存される。
    await vtecxnext.toPdf(htmlTemplate, filename)
  } catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError) {
      console.log(`[api pdf] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[api pdf] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {'feed' : {'title' : resErrMsg}}
  }

  console.log(`[api pdf] end. resJson=${resJson}`)
  return vtecxnext.response(resStatus, resJson) 
}
