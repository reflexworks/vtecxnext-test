import { NextApiRequest, NextApiResponse } from 'next'
import * as vtecxnext from '@vtecx/vtecxnext'
import { VtecxNextError } from '@vtecx/vtecxnext'

/**
 * LINEログイン処理.
 * @param req リクエスト
 * @param res レスポンス
 * @returns ログイン成功の場合、SIDをSet-Cookieする。
 */
const handler = async (req:NextApiRequest, res:NextApiResponse) => {
  // X-Requested-With ヘッダチェック
  //if (!vtecxnext.checkXRequestedWith(req, res)) {
  //  return
  //}
  console.log(`[loginline] start.`)
  // LINEログイン
  try {
    const isLoggedin = await vtecxnext.oauthLine(req, res)
  } catch (error) {
    let resStatus:number
    let resMessage:string
      if (error instanceof VtecxNextError) {
      console.log(`[loginline] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resMessage = error.message
    } else {
      console.log(`[loginline] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resMessage = 'Error occured.'
    }
    const resJson = {feed : {'title' : resMessage}}
    res.status(resStatus).json(resJson)
    res.end()
  }
}

export default handler
