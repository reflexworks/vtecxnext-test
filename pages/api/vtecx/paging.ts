import { NextApiRequest, NextApiResponse } from 'next'
import * as vtecxnext from '@vtecx/vtecxnext'
import { VtecxNextError } from '@vtecx/vtecxnext'
import * as testutil from 'utils/testutil'
import { ApiRouteTestError } from 'utils/testutil'

const handler = async (req:NextApiRequest, res:NextApiResponse) => {
  console.log(`[paging] start. x-requested-with=${req.headers['x-requested-with']}`)
  // X-Requested-With ヘッダチェック
  if (!vtecxnext.checkXRequestedWith(req, res)) {
    return
  }
  // パラメータを取得
  // req.queryだとOR検索の綴じカッコ")"パラメータが消えてしまうので、urlの値を直接切り取ってリクエストする。
  let key = ''
  let param = ''
  let pagerange = ''
  let num = undefined
  /*
  for (const tmpkey in req.query) {
    if (tmpkey === 'key') {
      key = testutil.toString(req.query[tmpkey])
    } else if (tmpkey === '_pagination') {
      pagerange = testutil.toString(req.query[tmpkey])
    } else if (tmpkey === 'n') {
      num = testutil.toNumber(req.query[tmpkey])
    } else {
      param = `${param}${param ? '&' : '?'}${encodeURIComponent(tmpkey)}${req.query[tmpkey] ? '=' + encodeURIComponent(testutil.toString(req.query[tmpkey])) : ''}`
    }
  }
  */

  let idx1
  let idx1End
  let idx2
  let idx2End

  const requestUrl:string = req.url ?? ''
  let idxKey = requestUrl.indexOf('?key=')
  let idxKeyEnd
  if (idxKey == -1) {
    idxKey = requestUrl.indexOf('&key=')
  }
  if (idxKey > -1) {
    key = testutil.toString(req.query['key'])
    idxKeyEnd = requestUrl.indexOf('&', idxKey + 1)
    if (idxKeyEnd == -1) {
      idxKeyEnd = requestUrl.length
    }
  }
  let idxPagination = requestUrl.indexOf('&_pagination=')
  let idxPaginationEnd
  if (idxPagination == -1) {
    idxPagination = requestUrl.indexOf('?_pagination=')
  }
  if (idxPagination > -1) {
    pagerange = testutil.toString(req.query['_pagination'])
    idxPaginationEnd = requestUrl.indexOf('&', idxPagination + 1)
    if (idxPaginationEnd == -1) {
      idxPaginationEnd = requestUrl.length
    }
    if (idxKey > -1) {
      if (idxKey < idxPagination) {
        idx1 = idxKey
        idx1End = idxKeyEnd
        idx2 = idxPagination
        idx2End = idxPaginationEnd
      } else {
        idx1 = idxPagination
        idx1End = idxPaginationEnd
        idx2 = idxKey
        idx2End = idxKeyEnd
      }
    } else {
      idx1 = idxPagination
      idx1End = idxPaginationEnd
    }
  }
  let idxN = requestUrl.indexOf('&n=')
  let idxNEnd
  if (idxN == -1) {
    idxN = requestUrl.indexOf('?n=')
  }
  if (idxN > -1) {
    num = testutil.toNumber(req.query['n'])
    idxNEnd = requestUrl.indexOf('&', idxN + 1)
    if (idxNEnd == -1) {
      idxNEnd = requestUrl.length
    }

    if (idxPagination == -1) {
      if (idxKey > -1) {
        if (idxKey < idxN) {
          idx1 = idxKey
          idx1End = idxKeyEnd
          idx2 = idxN
          idx2End = idxNEnd
        } else {
          idx1 = idxN
          idx1End = idxNEnd
          idx2 = idxKey
          idx2End = idxKeyEnd
        }
      } else {
        idx1 = idxN
        idx1End = idxNEnd
      }
    }
  }
  if (idxPagination == -1 && idxN == -1 && idxKey > -1) {
    idx1 = idxKey
    idx1End = idxKeyEnd
  }

  if (idx1 && idx1End) {
    param = requestUrl.substring(requestUrl.indexOf('?') + 1, idx1)
    if (idx2 && idx2End) {
      param += requestUrl.substring(idx1End, idx2)
      param += requestUrl.substring(idx2End)
    } else {
      param += requestUrl.substring(idx1End)
    }
  } else {
    param = requestUrl.substring(requestUrl.indexOf('?') + 1)
  }

  const requesturi = `${key}${param}`
  const targetservice:string = testutil.getParam(req, 'targetservice')
  console.log(`[paging] key=${key} param=${param} pagerange=${pagerange} num=${String(num)} ${targetservice ? 'targetservice=' + targetservice : ''}`)

  // ページング
  let resStatus:number = 200
  let resJson:any
  try {
    if (pagerange) {
      // ページネーション
      resJson = await vtecxnext.pagination(req, res, requesturi, pagerange, targetservice)
      resStatus = resJson ? 200 : 204
    } else if (num) {
      // ページ数取得
      resJson = await vtecxnext.getPage(req, res, requesturi, testutil.toNumber(num), targetservice)
      resStatus = resJson ? 200 : 204
    } else {
      console.log(`[paging] invalid type. key=${key}`)
      throw new ApiRouteTestError(400, `[paging] invalid type. key=${key}`)
    }

  } catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError || error instanceof ApiRouteTestError) {
      console.log(`[paging] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[paging] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {feed : {'title' : resErrMsg}}
  }

  console.log(`[paging] end. resJson=${JSON.stringify(resJson)}`)
  res.status(resStatus)
  resJson ? res.json(resJson) : 
  res.end()
}

export default handler

