import { NextApiRequest, NextApiResponse } from 'next'
import * as vtecxnext from '@vtecx/vtecxnext'
import { VtecxNextError } from '@vtecx/vtecxnext'
import * as testutil from 'utils/testutil'

const handler = async (req:NextApiRequest, res:NextApiResponse) => {
  console.log(`[postentry] start. x-requested-with=${req.headers['x-requested-with']}`)
  // X-Requested-With ヘッダチェック
  if (!vtecxnext.checkXRequestedWith(req, res)) {
    return
  }
  // 引数を取得
  const key:string = testutil.getParam(req, 'key')
  const targetservice:string = testutil.getParam(req, 'targetservice')
  console.log(`[postentry] key=${key} ${targetservice ? 'targetservice=' + targetservice : ''}`)

  // 登録
  let resStatus:number
  let resJson:any
  let feed
  try {
    feed = req.body ? JSON.parse(req.body) : null
  } catch (e) {
    let resErrMsg:string
    if (e instanceof Error) {
      const error:Error = e
      resErrMsg = `${error.name}: ${error.message}`
    } else {
      resErrMsg = String(e)
    }
    resJson = {feed : {'title' : resErrMsg}}
    res.status(400).json(resJson)
    res.end()
    return
  }

  try {
    resJson = await vtecxnext.post(req, res, feed, key, targetservice)
    resStatus = 200
  } catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError) {
      console.log(`[postentry] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[postentry] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {feed : {'title' : resErrMsg}}
  }

  console.log('[postentry] end.')
  res.status(resStatus).json(resJson)
  res.end()
}

export default handler
