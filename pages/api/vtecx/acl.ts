import { NextApiRequest, NextApiResponse } from 'next'
import * as vtecxnext from '@vtecx/vtecxnext'
import { VtecxNextError } from '@vtecx/vtecxnext'
import * as testutil from 'utils/testutil'
import { ApiRouteTestError } from 'utils/testutil'

const handler = async (req:NextApiRequest, res:NextApiResponse) => {
  console.log(`[acl] start. x-requested-with=${req.headers['x-requested-with']}`)
  // X-Requested-With ヘッダチェック
  if (!vtecxnext.checkXRequestedWith(req, res)) {
    return
  }
  // パラメータを取得
  const type:string = testutil.getParam(req, 'type')
  console.log(`[acl] type=${type}`)
  // ACL操作
  let resStatus:number = 200
  let resJson:any
  try {
    if (type === 'add') {
      resJson = await vtecxnext.addacl(req, res, testutil.getRequestJson(req))
      resStatus = resJson ? 200 : 204
    } else if (type === 'remove') {
      resJson = await vtecxnext.removeacl(req, res, testutil.getRequestJson(req))
      resStatus = resJson ? 200 : 204
    } else {
      console.log(`[acl] invalid type. type=${type}`)
      throw new ApiRouteTestError(400, `[acl] invalid type. type=${type}`)
    }

  } catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError || error instanceof ApiRouteTestError) {
      console.log(`[acl] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[acl] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {feed : {'title' : resErrMsg}}
  }

  console.log(`[acl] end. resJson=${resJson}`)
  res.status(resStatus)
  resJson ? res.json(resJson) : 
  res.end()
}

export default handler
