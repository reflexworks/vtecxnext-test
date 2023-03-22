import { NextApiRequest, NextApiResponse } from 'next'
import * as vtecxnext from '@vtecx/vtecxnext'
import { VtecxNextError } from '@vtecx/vtecxnext'
import * as testutil from 'utils/testutil'

// 注) リクエストデータがバイナリデータの場合、必ず以下の設定を行う。
export const config = {
  api: {
    bodyParser: false,
  },
}

const handler = async (req:NextApiRequest, res:NextApiResponse) => {
  console.log(`[savefiles] start. x-requested-with=${req.headers['x-requested-with']}`)
  // X-Requested-With ヘッダチェック
  if (!vtecxnext.checkXRequestedWith(req, res)) {
    return
  }
  // キーを取得
  const key:string = testutil.getParam(req, 'key')
 
  // コンテンツ登録
  let resStatus:number
  let resJson:any
  try {
    resJson = await vtecxnext.savefiles(req, res, key)
    resStatus = 200
  } catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError) {
      console.log(`[savefiles] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[savefiles] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {feed : {'title' : resErrMsg}}
  }

  console.log('[savefiles] end.')
  res.status(resStatus).json(resJson)
  res.end()
}

export default handler
