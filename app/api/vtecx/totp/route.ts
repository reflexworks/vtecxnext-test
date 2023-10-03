import { NextRequest } from 'next/server'
import { VtecxNext, VtecxNextError } from '@vtecx/vtecxnext'
import * as testutil from 'utils/testutil'
import { ApiRouteTestError } from 'utils/testutil'

/**
 * POSTメソッド
 * @param req リクエスト
 * @returns レスポンス
 */
export const POST = async (req:NextRequest):Promise<Response> => {
  console.log(`[api totp post] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }
  // パラメータを取得
  const type:string = vtecxnext.getParameter('type') ?? ''
  console.log(`[api totp post] type=${type}`)

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

  let resStatus:number
  let resJson:any
  try {
    if (type === 'getlink') {
      const chs = testutil.getParamNumber(vtecxnext, 'chs')
      resJson = await vtecxnext.getTotpLink(chs)
      resStatus = resJson ? 200 : 204
    } else if (type === 'create') {
      resJson = await vtecxnext.createTotp(data)
      resStatus = resJson ? 200 : 204
    } else {
      console.log(`[api totp post] invalid type. type=${type}`)
      throw new ApiRouteTestError(400, `[api totp post] invalid type. type=${type}`)
    }
} catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError) {
      console.log(`[api totp post] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[api totp post] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {'feed' : {'title' : resErrMsg}}
  }

  console.log('[api totp post] end.')
  return vtecxnext.response(resStatus, resJson)
}

/**
 * PUTメソッド
 * @param req リクエスト
 * @returns レスポンス
 */
export const PUT = async (req:NextRequest):Promise<Response> => {
  console.log(`[api totp put] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }
  // パラメータを取得
  const type:string = vtecxnext.getParameter('type') ?? ''
  console.log(`[api totp put] type=${type}`)

  let resStatus:number
  let resJson:any
  try {
    if (type === 'changetdid') {
      resJson = await vtecxnext.changeTdid()
      resStatus = resJson ? 200 : 204
    } else {
      console.log(`[api totp put] invalid type. type=${type}`)
      throw new ApiRouteTestError(400, `[api totp put] invalid type. type=${type}`)
    }
} catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError) {
      console.log(`[api totp put] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[api totp put] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {'feed' : {'title' : resErrMsg}}
  }

  console.log('[api totp put] end.')
  return vtecxnext.response(resStatus, resJson)
}

/**
 * DELETEメソッド
 * @param req リクエスト
 * @returns レスポンス
 */
export const DELETE = async (req:NextRequest):Promise<Response> => {
  console.log(`[api totp delete] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }
  // パラメータを取得
  const type:string = vtecxnext.getParameter('type') ?? ''
  console.log(`[api totp delete] type=${type}`)

  let resStatus:number
  let resJson:any
  try {
    if (type === 'totp') {
      const account:string = vtecxnext.getParameter('account') ?? ''
      resJson = await vtecxnext.deleteTotp(account)
      resStatus = resJson ? 200 : 204
    } else {
      console.log(`[api totp delete] invalid type. type=${type}`)
      throw new ApiRouteTestError(400, `[api totp delete] invalid type. type=${type}`)
    }
} catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError) {
      console.log(`[api totp delete] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[api totp delete] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {'feed' : {'title' : resErrMsg}}
  }

  console.log('[api totp delete] end.')
  return vtecxnext.response(resStatus, resJson)
}
