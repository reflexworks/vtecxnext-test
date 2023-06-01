import { NextApiRequest, NextApiResponse } from 'next'
import * as vtecxnext from '@vtecx/vtecxnext'
import { VtecxNextError } from '@vtecx/vtecxnext'
import * as testutil from 'utils/testutil'

const handler = async (req:NextApiRequest, res:NextApiResponse) => {
    console.log(`[getcount] start. x-requested-with=${req.headers['x-requested-with']}`)
  // X-Requested-With ヘッダチェック
  if (!vtecxnext.checkXRequestedWith(req, res)) {
    return
  }
  // リクエストパラメータ
  // req.queryだとOR検索の綴じカッコ")"パラメータが消えてしまうので、urlの値を直接リクエストする。
  /*
  let key = ''
  let param = ''
  for (const tmpkey in req.query) {
    if (tmpkey === 'key') {
      key = testutil.toString(req.query[tmpkey])
    } else {
      param = `${param}${param ? '&' : '?'}${tmpkey}${req.query[tmpkey] ? '=' + req.query[tmpkey] : ''}`
    }
  }
  */
  const key = testutil.getParam(req, 'key')
  // key以外のURLパラメータをparamにセットする
  const requestUrl:string = req.url ?? ''
  let idx = requestUrl.indexOf('?key=')
  let param = ''
  if (idx == -1) {
    // keyの前の条件を取得
    idx = requestUrl.indexOf('&key=')
    param = requestUrl.substring(requestUrl.indexOf('?') + 1, idx)
  }
  const startIdx = idx + 5
  const idx2 = requestUrl.indexOf('&', startIdx)
  if (idx2 >= startIdx) {
    if (param) {
      param += '&'
    }
    param += requestUrl.substring(idx2 + 1)
  }
  if (param) {
    //param = '?' + decodeURIComponent(param)
    param = '?' + param
  }
  const targetservice:string = testutil.getParam(req, 'targetservice')
  const type:string = testutil.getParam(req, 'type')
  console.log(`[getcount] key=${key} param=${param}${targetservice ? ' targetservice=' + targetservice : ''}${type ? ' type=' + type : ''}`)

  // 件数取得
  let resStatus:number
  let resMessage:string
  try {
    const requesturi = `${key}${param}`

    if (type === 'response') {
      // type=response の場合、countResponse を実行する。(戻り値にstatus、headerがある。)
      // カーソルを取得する場合はこちらを使用する。
      const vtecxRes:vtecxnext.VtecxResponse = await vtecxnext.countResponse(req, res, requesturi, targetservice)
      const data = vtecxRes.data
      resStatus = vtecxRes.status
      if (vtecxRes.header) {
        for (const name in vtecxRes.header) {
          res.setHeader(name, vtecxRes.header[name])
        }
      }
      resMessage = vtecxRes.data.feed.title ? data.feed.title : null
    } else {
      resMessage = String(await vtecxnext.count(req, res, requesturi, targetservice))
      resStatus = 200
    }
  } catch (error) {
    if (error instanceof VtecxNextError) {
      console.log(`[getcount] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resMessage = error.message
    } else {
      console.log(`[getcount] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resMessage = 'Error occured.'
    }
  }
  const feed = {feed : {'title' : resMessage}}

  console.log('[getcount] end.')
  res.status(resStatus).json(feed)
  res.end()
}

export default handler
