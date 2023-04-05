import { NextApiRequest, NextApiResponse } from 'next'
import * as vtecxnext from '@vtecx/vtecxnext'
import { VtecxNextError } from '@vtecx/vtecxnext'
import * as testutil from 'utils/testutil'
import { ApiRouteTestError } from 'utils/testutil'

const handler = async (req:NextApiRequest, res:NextApiResponse) => {
  console.log(`[getfeed] start. x-requested-with=${req.headers['x-requested-with']} url=${req.url} query=${JSON.stringify(req.query)}`)
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
    param = '?' + decodeURIComponent(param)
  }
  const targetservice:string = testutil.getParam(req, 'targetservice')
  console.log(`[getfeed] key=${key} param=${param} ${targetservice ? 'targetservice=' + targetservice : ''}`)

  // フィード取得
  let resStatus:number
  let resJson:any
  try {
    const requesturi = `${key}${param}`
    //console.log(`[getFeed] requesuri=${requesturi}`)
    resJson = await vtecxnext.getFeed(req, res, requesturi, targetservice)
    resStatus = resJson ? 200 : 204
  } catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError) {
      console.log(`[getfeed] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[getfeed] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {feed : {'title' : resErrMsg}}
  }

  console.log('[getfeed] end.')
  res.status(resStatus)
  resJson ? res.json(resJson) : 
  res.end()
}

export default handler
