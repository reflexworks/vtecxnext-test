import { NextApiRequest, NextApiResponse } from 'next'
import * as vtecxnext from '@vtecx/vtecxnext'
import { VtecxNextError } from '@vtecx/vtecxnext'
import * as testutil from 'utils/testutil'
import { ApiRouteTestError } from 'utils/testutil'

const handler = async (req:NextApiRequest, res:NextApiResponse) => {
  console.log(`[pdf2] start.`)
  // X-Requested-With ヘッダチェック
  //if (!vtecxnext.checkXRequestedWith(req, res)) {
  //  return
  //}

  let resStatus:number
  let resJson:any
  // 引数を取得
  //if (typeof req.body !== 'string') {
  //  resJson = {feed : {'title' : 'html template is required.'}}
  //  res.status(400).json(resJson)
  //  res.end()
  //  return false
  //}
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
  const filename = testutil.getParam(req, 'pdf')

  // PDF生成
  try {
    await vtecxnext.toPdf(req, res, htmlTemplate, filename)
  } catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError) {
      console.log(`[pdf] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[pdf] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {feed : {'title' : resErrMsg}}
    res.status(resStatus)
    res.json(resJson)
    res.end()
  }

  console.log(`[pdf2] end. res.closed=${res.closed} resJson=${resJson}`)
}

export default handler
