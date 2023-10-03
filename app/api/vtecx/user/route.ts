import { NextRequest } from 'next/server'
import { VtecxNext, VtecxNextError } from '@vtecx/vtecxnext'
import * as vtecxauth from '@vtecx/vtecxauth'
import * as testutil from 'utils/testutil'
import { ApiRouteTestError } from 'utils/testutil'

/**
 * GETメソッド
 * @param req リクエスト
 * @returns レスポンス
 */
export const GET = async (req:NextRequest):Promise<Response> => {
  console.log(`[api user get] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }

  // パラメータを取得
  const type:string = vtecxnext.getParameter('type') ?? ''
  console.log(`[api user get] type=${type}`)

  // ユーザ操作
  let resStatus:number = 200
  let resJson:any
  try {
    if (type === 'userstatus') {
      resJson = await vtecxnext.userstatus(vtecxnext.getParameter('account') ?? '')
      resStatus = resJson ? 200 : 204
    } else {
      console.log(`[api user get] invalid type. type=${type}`)
      throw new ApiRouteTestError(400, `[api user get] invalid type. type=${type}`)
    }

  } catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError || error instanceof ApiRouteTestError) {
      console.log(`[api user get] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[api user get] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {'feed' : {'title' : resErrMsg}}
  }

  console.log(`[api user get] end. resJson=${resJson}`)
  return vtecxnext.response(resStatus, resJson) 
}

/**
 * POSTメソッド
 * @param req リクエスト
 * @returns レスポンス
 */
export const POST = async (req:NextRequest):Promise<Response> => {
  console.log(`[api user post] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }
  // パラメータを取得
  const type:string = vtecxnext.getParameter('type') ?? ''
  console.log(`[api user post] type=${type}`)

  // リクエストJSON取得
  const contentLength:number = testutil.toNumber(req.headers.get('content-length'), 0)
  let data:any
  if (contentLength > 0) {
    try {
      data = await req.json()
    } catch (error) {
      let resErrMsg:string
      if (error instanceof Error) {
        resErrMsg = `${error.name}: ${error.message}`
      } else {
        resErrMsg = 'Error occured by req.json()'
      }
      return vtecxnext.response(400, {'feed' : {'title' : resErrMsg}})
    }
  }

  let resStatus:number = 200
  let resJson:any
  try {
    if (type === 'adduserbyadmin') {
      resJson = await vtecxnext.adduserByAdmin(data)
    } else {
      console.log(`[api user post] invalid type. type=${type}`)
      throw new ApiRouteTestError(400, `[user] invalid type. type=${type}`)
    }

  } catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError || error instanceof ApiRouteTestError) {
      console.log(`[api user post] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[api user post] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {'feed' : {'title' : resErrMsg}}
  }

  console.log(`[api user post] end. resJson=${resJson}`)
  return vtecxnext.response(resStatus, resJson) 
}

/**
 * PUTメソッド
 * @param req リクエスト
 * @returns レスポンス
 */
export const PUT = async (req:NextRequest):Promise<Response> => {
  console.log(`[api user put] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }
  // パラメータを取得
  const type:string = vtecxnext.getParameter('type') ?? ''
  console.log(`[api user put] type=${type}`)

  // リクエストJSON取得
  const contentLength:number = testutil.toNumber(req.headers.get('content-length'), 0)
  let data:any
  if (contentLength > 0) {
    try {
      data = await req.json()
    } catch (error) {
      let resErrMsg:string
      if (error instanceof Error) {
        resErrMsg = `${error.name}: ${error.message}`
      } else {
        resErrMsg = 'Error occured by req.json()'
      }
      return vtecxnext.response(400, {'feed' : {'title' : resErrMsg}})
    }
  }

  let resStatus:number = 200
  let resJson:any
  try {
    if (type === 'changepassbyadmin') {
      resJson = await vtecxnext.changepassByAdmin(data)
    } else if (type === 'changeaccount') {
      resJson = await vtecxnext.changeaccount(data)
    } else if (type === 'changeaccount_verify') {
      resJson = await vtecxnext.changeaccount_verify(vtecxnext.getParameter('verify') ?? '')
    } else if (type === 'revokeuser') {
      resJson = await vtecxnext.revokeuser(vtecxnext.getParameter('account') ?? '')
    } else if (type === 'revokeusers') {
      resJson = await vtecxnext.revokeusers(data)
    } else if (type === 'activateuser') {
      resJson = await vtecxnext.activateuser(vtecxnext.getParameter('account') ?? '')
    } else if (type === 'activateusers') {
      resJson = await vtecxnext.activateusers(data)
    } else if (type === 'deleteusers') {  // API RouteではDELETEメソッドでリクエストデータを受け取れなかった
      resJson = await vtecxnext.deleteusers(data)
    } else if (type === 'mergeoauthuser_line') {
      resJson = await mergeoauthuserLine(vtecxnext, vtecxnext.getParameter('account') ?? '', vtecxnext.getParameter('pass') ?? '')
    } else {
      console.log(`[api user put] invalid type. type=${type}`)
      throw new ApiRouteTestError(400, `[api user put] invalid type. type=${type}`)
    }

  } catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError || error instanceof ApiRouteTestError) {
      console.log(`[api user put] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[api user put] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {'feed' : {'title' : resErrMsg}}
  }

  console.log(`[api user put] end. resJson=${resJson}`)
  return vtecxnext.response(resStatus, resJson) 
}

/**
 * DELETEメソッド
 * @param req リクエスト
 * @returns レスポンス
 */
export const DELETE = async (req:NextRequest):Promise<Response> => {
  console.log(`[api user delete] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }

  // パラメータを取得
  const type:string = vtecxnext.getParameter('type') ?? ''
  console.log(`[api user delete] type=${type}`)

  // ユーザ操作
  let resStatus:number = 200
  let resJson:any
  try {
    if (type === 'canceluser') {
      resJson = await vtecxnext.canceluser()
    } else if (type === 'deleteuser') {
      resJson = await vtecxnext.deleteuser(vtecxnext.getParameter('account') ?? '')
    } else {
      console.log(`[api user delete] invalid type. type=${type}`)
      throw new ApiRouteTestError(400, `[api user delete] invalid type. type=${type}`)
    }

  } catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError || error instanceof ApiRouteTestError) {
      console.log(`[api user delete] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[api user delete] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {'feed' : {'title' : resErrMsg}}
  }

  console.log(`[api user delete] end. resJson=${resJson}`)
  return vtecxnext.response(resStatus, resJson) 
}

const mergeoauthuserLine = async (vtecxnext:VtecxNext, account:string, pass:string):Promise<any> => {
  const rxid = vtecxauth.getRXID(account, pass, 
    process.env.VTECX_SERVICENAME ?? '', 
    process.env.VTECX_APIKEY ?? '')
    console.log(`[mergeoauthuserLine] start. account=${account} pass=${pass} serviceName=${process.env.VTECX_SERVICENAME ?? ''} apiKey=${process.env.VTECX_APIKEY ?? ''} rxid=${rxid}`)
    return vtecxnext.mergeOAuthUserLine(rxid)
}
