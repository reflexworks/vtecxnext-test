import { NextApiRequest, NextApiResponse } from 'next'
import * as vtecxnext from '@vtecx/vtecxnext'
import { VtecxNextError } from '@vtecx/vtecxnext'
import * as testutil from 'utils/testutil'

const handler = async (req:NextApiRequest, res:NextApiResponse) => {
  console.log(`[getcontent] start. x-requested-with=${req.headers['x-requested-with']}`)
  // X-Requested-With ヘッダチェック
  if (!vtecxnext.checkXRequestedWith(req, res)) {
    return
  }
  // キーを取得
  const key:string = testutil.getParam(req, 'key')
 
  // コンテンツ取得
  try {
    await vtecxnext.getcontent(req, res, key)
  } catch (error) {
    let resErrMsg:string
    let resStatus:number
    let resJson:any
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
}

export default handler
