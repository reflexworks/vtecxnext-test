import { NextRequest } from 'next/server'
import { VtecxNext, VtecxNextError } from 'utils/vtecxnext'
import { ApiRouteTestError } from 'utils/testutil'
import * as testutil from 'utils/testutil'

/**
 * POSTメソッド
 * @param req リクエスト
 * @returns レスポンス
 */
export const POST = async (req:NextRequest):Promise<Response> => {
  console.log(`[api bdbq post] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }

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
    // BDB更新+BigQuery登録
    const key:string = vtecxnext.getParameter('key') ?? ''
    const tablenamesStr:string = vtecxnext.getParameter('tablenames') ?? ''
    console.log(`[api bdbq post] postBq. key=${key} tablenamesStr=${tablenamesStr}`)
    const tablenames:any = testutil.getBqTablenames(tablenamesStr)
    resJson = await vtecxnext.postBDBQ(data, key, tablenames)
    resStatus = 200

  } catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError || error instanceof ApiRouteTestError) {
      console.log(`[api bdbq post] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[api bdbq post] Error occured. (not VtecxNextError) ${error}`)
      if (error instanceof Error) {
        console.log(`[api bdbq post] ${error.stack}`)
      }
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {'feed' : {'title' : resErrMsg}}
  }
  console.log('[api bdbq post] end.')
  return vtecxnext.response(resStatus, resJson)
}

/**
 * PUT
 * @param req リクエスト
 * @returns レスポンス
 */
export const PUT = async (req:NextRequest):Promise<Response> => {
  console.log(`[api bdbq put] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }

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
    // BDB更新+BigQuery登録
    const key:string = vtecxnext.getParameter('key') ?? ''
    const tablenamesStr:string = vtecxnext.getParameter('tablenames') ?? ''
    console.log(`[api bdbq put] putBq. key=${key} tablenamesStr=${tablenamesStr}`)
    const tablenames:any = testutil.getBqTablenames(tablenamesStr)
    resJson = await vtecxnext.putBDBQ(data, key, tablenames)
    resStatus = 200

  } catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError || error instanceof ApiRouteTestError) {
      console.log(`[api bdbq put] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[api bdbq put] Error occured. (not VtecxNextError) ${error}`)
      if (error instanceof Error) {
        console.log(`[api bdbq put] ${error.stack}`)
      }
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {'feed' : {'title' : resErrMsg}}
  }
  console.log('[api bdbq put] end.')
  return vtecxnext.response(resStatus, resJson)
}

/**
 * DELETEメソッド
 * @param req リクエスト
 * @returns レスポンス
 */
export const DELETE = async (req:NextRequest):Promise<Response> => {
  console.log(`[api bdbq delete] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }

  let resStatus:number
  let resJson:any
  try {
    // BigQuery削除
    const tmpKey:string = vtecxnext.getParameter('key') ?? ''
    const keys:string[] = tmpKey.split(',')
    const tablenamesStr:string = vtecxnext.getParameter('tablenames') ?? ''
    const tablenames:any = testutil.getBqTablenames(tablenamesStr)
    const result = await vtecxnext.deleteBDBQ(keys, tablenames)
    const message = `delete bdbq. result=${result}`
    resJson = {'feed' : {'title' : message}}
    resStatus = 200

  } catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError || error instanceof ApiRouteTestError) {
      console.log(`[api bdbq delete] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[api bdbq delete] Error occured. (not VtecxNextError) ${error}`)
      if (error instanceof Error) {
        console.log(`[api bdbq delete] ${error.stack}`)
      }
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {'feed' : {'title' : resErrMsg}}
  }
  console.log('[api bdbq delete] end.')
  return vtecxnext.response(resStatus, resJson) 
}
