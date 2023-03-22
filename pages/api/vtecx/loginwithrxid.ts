import { NextApiRequest, NextApiResponse } from 'next'
import * as vtecxnext from '@vtecx/vtecxnext'
import { VtecxNextError } from '@vtecx/vtecxnext'
import * as testutil from 'utils/testutil'

/**
 * RXIDによるログイン処理.
 * @param req リクエスト
 * @param res レスポンス
 * @returns ログイン成功の場合、SIDをSet-Cookieする。
 */
const handler = async (req:NextApiRequest, res:NextApiResponse) => {
  // X-Requested-With ヘッダチェック
  if (!vtecxnext.checkXRequestedWith(req, res)) {
    return
  }
  // ログイン
  let resStatus:number
  let resMessage:string
  try {
    console.log(`[loginwithrxid] start.`)
    const rxid = testutil.getParam(req, 'rxid')
    const statusMessage = await vtecxnext.loginWithRxid(req, res, rxid)
    resMessage = statusMessage.message
    resStatus = statusMessage.status
  } catch (error) {
    if (error instanceof VtecxNextError) {
      console.log(`[loginwithrxid] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resMessage = error.message
    } else {
      console.log(`[loginwithrxid] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resMessage = 'Error occured.'
    }
  }
  const resJson = {feed : {'title' : resMessage}}
  res.status(resStatus).json(resJson)
  res.end()
}

export default handler
