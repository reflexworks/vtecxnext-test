import { NextApiRequest, NextApiResponse } from 'next'
import * as vtecxnext from '@vtecx/vtecxnext'
import { VtecxNextError } from '@vtecx/vtecxnext'

/**
 * LINEログインのコールバック処理.
 * @param req リクエスト
 * @param res レスポンス
 * @returns ログイン成功の場合、SIDをSet-Cookieする。
 */
const handler = async (req:NextApiRequest, res:NextApiResponse) => {
  console.log(`[loginline_callback] start.`)
  // LINEログイン
  let resStatus:number
  let resMessage:string
  try {
    await vtecxnext.oauthCallbackLine(req, res)
    resStatus = 200
    resMessage = 'Logged in.'
  } catch (error) {
    if (error instanceof VtecxNextError) {
      console.log(`[login] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resMessage = error.message
    } else {
      console.log(`[login] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resMessage = 'Error occured.'
    }
  }
  const resJson = {feed : {'title' : resMessage}}
  res.status(resStatus).json(resJson)
  res.end()
}

export default handler
