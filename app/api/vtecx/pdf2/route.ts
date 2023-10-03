import { NextRequest } from 'next/server'
import { VtecxNext, VtecxNextError } from '@vtecx/vtecxnext'

/**
 * GETメソッド
 * @param req リクエスト
 * @returns レスポンス
 */
export const GET = async (req:NextRequest):Promise<Response> => {
  console.log(`[api pdf2] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  let resStatus:number = 200
  let resJson:any

  const htmlTemplate:string = `<html>
  <head>
    <meta name="pdf" content="title=helloworld.pdf" />
  </head>
  <body>
    <div class="_page" style="pagesize:A4;orientation:portrait">
      <p>PDF表示テスト</p>
    </div>
  </body>
</html>
`
  const filename:string|undefined = vtecxnext.getParameter('pdf') ?? undefined

  // PDF生成
  try {
    await vtecxnext.toPdf(htmlTemplate, filename)
  } catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError) {
      console.log(`[api pdf2] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[api pdf2] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {'feed' : {'title' : resErrMsg}}
  }

  console.log(`[api pdf2] end. resJson=${resJson}`)
  return vtecxnext.response(resStatus, resJson) 
}
