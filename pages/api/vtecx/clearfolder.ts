import { NextApiRequest, NextApiResponse } from 'next'
import * as vtecxnext from 'utils/vtecxnext'
import { VtecxNextError } from 'utils/vtecxnext'
import * as testutil from 'utils/testutil'

const handler = async (req:NextApiRequest, res:NextApiResponse) => {
  console.log(`[clearfolder] start. x-requested-with=${req.headers['x-requested-with']}`)
  // X-Requested-With ヘッダチェック
  if (!vtecxnext.checkXRequestedWith(req, res)) {
    return
  }
  // キーを取得
  const key:string = testutil.getParam(req, 'key')
  const async:boolean = testutil.hasParam(req, 'async')
  const targetservice:string = testutil.getParam(req, 'targetservice')
  console.log(`[clearfolder] key=${key} async=${async} ${targetservice ? 'targetservice=' + targetservice : ''}`)

  // 削除
  let resStatus:number
  let resMessage:string
  try {
    await vtecxnext.clearFolder(req, res, key, async, targetservice)
    resStatus = async ? 202 : 200
    resMessage = `folder cleared. ${async ? '(accepted)' : ''} ${key}`
  } catch (error) {
    if (error instanceof VtecxNextError) {
      console.log(`[clearfolder] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resMessage = error.message
    } else {
      console.log(`[deletefolder] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resMessage = 'Error occured.'
    }
  }
  const feed = {feed : {'title' : resMessage}}

  console.log('[clearfolder] end.')
  res.status(resStatus).json(feed)
  res.end()
}

export default handler
