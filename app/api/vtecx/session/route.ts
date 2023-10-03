import { NextRequest } from 'next/server'
import { VtecxNext, VtecxNextError } from '@vtecx/vtecxnext'
import * as testutil from 'utils/testutil'
import { ApiRouteTestError } from 'utils/testutil'

/**
 * GETメソッド
 * @param req リクエスト
 * @returns レスポンス
 */
export const GET = async (req:NextRequest):Promise<Response> => {
  console.log(`[api session get] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }
  // パラメータを取得
  const name:string = vtecxnext.getParameter('name') ?? ''
  const type:string = vtecxnext.getParameter('type') ?? ''
  console.log(`[api session get] name=${name} type=${type}`)

  // セッション操作
  let resStatus:number = 200
  let resJson:any
  try {
    if (type === 'feed') {
      resJson = await vtecxnext.getSessionFeed(name)
      resStatus = resJson ? 200 : 204
    } else if (type == 'entry') {
      resJson = await vtecxnext.getSessionEntry(name)
      resStatus = resJson ? 200 : 204
    } else if (type == 'string') {
      const result = await vtecxnext.getSessionString(name)
      if (result) {
        resJson = {'feed' : {'title' : result}}
      } else {
        resStatus = 204
      }
    } else if (type == 'long') {
      const result = await vtecxnext.getSessionLong(name)
      if (result) {
        resJson = {'feed' : {'title' : result}}
      } else {
        resStatus = 204
      }
    } else {
      console.log(`[api session get] invalid type. type=${type}`)
      throw new ApiRouteTestError(400, `[api session get] invalid type. type=${type}`)
    }

  } catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError || error instanceof ApiRouteTestError) {
      console.log(`[api session get] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[api session get] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {'feed' : {'title' : resErrMsg}}
  }

  console.log(`[api session get] end. resJson=${resJson}`)
  return vtecxnext.response(resStatus, resJson) 
}

/**
 * PUTメソッド
 * @param req リクエスト
 * @returns レスポンス
 */
export const PUT = async (req:NextRequest):Promise<Response> => {
  console.log(`[api session put] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }
  // パラメータを取得
  const name:string = vtecxnext.getParameter('name') ?? ''
  const type:string = vtecxnext.getParameter('type') ?? ''
  console.log(`[api session put] name=${name} type=${type}`)

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

  // セッション操作
  let resStatus:number = 200
  let resJson:any
  try {
    const val:string = vtecxnext.getParameter('val') ?? ''
    let message
    if (type === 'feed') {
      const result = await vtecxnext.setSessionFeed(name, data)
      message = `session ${type} set. name=${name} result=${result}`
    } else if (type == 'entry') {
      const result = await vtecxnext.setSessionEntry(name, data)
      message = `session ${type} set. name=${name} result=${result}`
    } else if (type == 'string') {
      const result = await vtecxnext.setSessionString(name, val)
      message = `session ${type} set. name=${name} result=${result}`
    } else if (type == 'long') {
      const result = await vtecxnext.setSessionLong(name, testutil.toNumber(val))
      message = `session ${type} set. name=${name} result=${result}`
    } else if (type == 'incr') {
      message = await vtecxnext.incrementSession(name, testutil.toNumber(val))
    } else {
      console.log(`[api session put] invalid type. type=${type}`)
      throw new ApiRouteTestError(400, `[api session put] invalid type. ${type}`)
    }
    resJson = {'feed' : {'title' : message}}

  } catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError || error instanceof ApiRouteTestError) {
      console.log(`[api session put] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[api session put] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {'feed' : {'title' : resErrMsg}}
  }

  console.log(`[api session put] end. resJson=${resJson}`)
  return vtecxnext.response(resStatus, resJson) 
}

/**
 * DELETEメソッド
 * @param req リクエスト
 * @returns レスポンス
 */
export const DELETE = async (req:NextRequest):Promise<Response> => {
  console.log(`[api session delete] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }
  // パラメータを取得
  const name:string = vtecxnext.getParameter('name') ?? ''
  const type:string = vtecxnext.getParameter('type') ?? ''
  console.log(`[api session delete] name=${name} type=${type}`)

  // セッション操作
  let resStatus:number = 200
  let resJson:any
  try {
    let result
    if (type === 'feed') {
      result = await vtecxnext.deleteSessionFeed(name)
    } else if (type == 'entry') {
      result = await vtecxnext.deleteSessionEntry(name)
    } else if (type == 'string') {
      result = await vtecxnext.deleteSessionString(name)
    } else if (type == 'long') {
      result = await vtecxnext.deleteSessionLong(name)
    } else {
      console.log(`[api session delete] invalid type. type=${type}`)
      throw new ApiRouteTestError(400, `[api session delete] invalid type. ${type}`)
    }
    resJson = {'feed' : {'title' : `session ${type} deleted. name=${name} result=${result}`}}

  } catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError || error instanceof ApiRouteTestError) {
      console.log(`[api session delete] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[api session delete] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {'feed' : {'title' : resErrMsg}}
  }

  console.log(`[api session delete] end. resJson=${resJson}`)
  return vtecxnext.response(resStatus, resJson) 
}
