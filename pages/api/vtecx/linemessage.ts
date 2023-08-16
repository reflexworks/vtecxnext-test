import { NextApiRequest, NextApiResponse } from 'next'
import * as vtecxnext from '@vtecx/vtecxnext'
import { VtecxNextError } from '@vtecx/vtecxnext'
import * as testutil from 'utils/testutil'
import { ApiRouteTestError } from 'utils/testutil'
import * as lineutil from 'utils/lineutil'

const handler = async (req:NextApiRequest, res:NextApiResponse) => {
  console.log(`[linemessage] start. x-requested-with=${req.headers['x-requested-with']}`)
  // X-Requested-With ヘッダチェック
  if (!vtecxnext.checkXRequestedWith(req, res)) {
    return
  }
  // LINEプッシュメッセージ送信
  let resStatus:number = 200
  let resJson:any
  try {
    const reqJson = testutil.getRequestJson(req)
    console.log(`[linemessage] reqJson = ${JSON.stringify(reqJson)}`)
    const textMessages = []
    for (const entry of reqJson) {
      if ('title' in entry) {
        textMessages.push(entry.title)
      }
    }
    console.log(`[linemessage] textMessages = ${JSON.stringify(textMessages)}`)

    // TODO チャネルアクセストークンは対象の公式アカウントのものを取得してください。
    //const token = process.env.LINE_CHANNEL_ACCESSTOKEN ?? ''
    const token = reqJson[0].rights
    resJson = await lineutil.broadcastMessage(textMessages, token)

  } catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError || error instanceof ApiRouteTestError) {
      console.log(`[linemessage] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[linemessage] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {feed : {'title' : resErrMsg}}
  }

  console.log(`[linemessage] end. resJson=${JSON.stringify(resJson)}`)
  res.status(resStatus)
  resJson ? res.json(resJson) : 
  res.end()
}

export default handler
