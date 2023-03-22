import { NextApiRequest, NextApiResponse } from 'next'
import * as vtecxnext from '@vtecx/vtecxnext'
import { VtecxNextError } from '@vtecx/vtecxnext'
import * as testutil from 'utils/testutil'
import { ApiRouteTestError } from 'utils/testutil'

const handler = async (req:NextApiRequest, res:NextApiResponse) => {
  console.log(`[sendmessage] start. x-requested-with=${req.headers['x-requested-with']}`)
  // X-Requested-With ヘッダチェック
  if (!vtecxnext.checkXRequestedWith(req, res)) {
    return
  }

  // メッセージを戻す
  try {
    // 引数を取得
    const status:number = testutil.getParamNumberRequired(req, 'status')
    const message:string = testutil.getParam(req, 'message')
    vtecxnext.sendMessage(res, status, message)
  } catch (error) {
    let resStatus
    let resErrMsg:string
    if (error instanceof VtecxNextError) {
      console.log(`[sendmessage] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else if (error instanceof ApiRouteTestError) {
      console.log(`[sendmessage] Error occured. (ApiRouteTestError) status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[sendmessage] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    const resJson = {feed : {'title' : resErrMsg}}
    res.status(resStatus)
    res.json(resJson)
    res.end()
  }
}

export default handler
