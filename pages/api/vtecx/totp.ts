import { NextApiRequest, NextApiResponse } from 'next'
import * as vtecxnext from '@vtecx/vtecxnext'
import { VtecxNextError } from '@vtecx/vtecxnext'
import * as testutil from 'utils/testutil'
import { ApiRouteTestError } from 'utils/testutil'

const handler = async (req:NextApiRequest, res:NextApiResponse) => {
  console.log(`[totp] start. x-requested-with=${req.headers['x-requested-with']}`)
  // X-Requested-With ヘッダチェック
  if (!vtecxnext.checkXRequestedWith(req, res)) {
    return
  }
  // methodを取得
  const method = req.method
  // パラメータを取得
  const type:string = testutil.getParam(req, 'type')
  console.log(`[totp] type=${type}`)
  // 二段階認証
  let resStatus:number = 200
  let resJson:any
  try {
    if (method === 'POST') {
      if (type === 'getlink') {
        resJson = await vtecxnext.getTotpLink(req, res, testutil.getParamNumber(req, 'chs'))
        resStatus = resJson ? 200 : 204
      } else if (type === 'create') {
        resJson = await vtecxnext.createTotp(req, res, testutil.getRequestJson(req))
        resStatus = resJson ? 200 : 204
      } else {
        console.log(`[totp] invalid type. method=${method} type=${type}`)
        throw new ApiRouteTestError(400, `[totp] invalid type. type=${type}`)
      }
    } else if (method === 'DELETE') {
      if (type === 'totp') {
        resJson = await vtecxnext.deleteTotp(req, res, testutil.getParam(req, 'account'))
        resStatus = resJson ? 200 : 204
      } else {
        console.log(`[totp] invalid type. method=${method} type=${type}`)
        throw new ApiRouteTestError(400, `[totp] invalid type. type=${type}`)
      }
    } else if (method === 'PUT') {
      if (type === 'changetdid') {
        resJson = await vtecxnext.changeTdid(req, res)
        resStatus = resJson ? 200 : 204
      } else {
        console.log(`[totp] invalid type. method=${method} type=${type}`)
        throw new ApiRouteTestError(400, `[totp] invalid type. type=${type}`)
      }
    } else {
      throw new ApiRouteTestError(405, `[totp] invalid method. method=${method}`)
    }

  } catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError || error instanceof ApiRouteTestError) {
      console.log(`[totp] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[totp] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {feed : {'title' : resErrMsg}}
  }

  console.log(`[totp] end. resJson=${resJson}`)
  res.status(resStatus)
  resJson ? res.json(resJson) : 
  res.end()
}

export default handler
