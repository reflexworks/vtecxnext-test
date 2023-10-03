import { NextRequest } from 'next/server'
import { VtecxNext, VtecxNextError } from '@vtecx/vtecxnext'
import * as testutil from 'utils/testutil'

/**
 * GETメソッド
 * @param req リクエスト
 * @returns レスポンス
 */
export const GET = async (req:NextRequest):Promise<Response> => {
  console.log(`[api messagequeue get] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }

  // パラメータを取得
  const channel:string = vtecxnext.getParameter('channel') ?? ''
  const type:string = vtecxnext.getParameter('type') ?? ''
  console.log(`[api messagequeue get] channel=${channel} type=${type}`)

  let resStatus:number = 200
  let resJson:any
  try {
    if (type === 'status') {
      // メッセージキューステータス取得
      resJson = await vtecxnext.getMessageQueueStatus(channel)
    } else {
      // メッセージキュー受信
      resJson = await vtecxnext.getMessageQueue(channel)
    }
    resStatus = resJson ? 200 : 204
} catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError) {
      console.log(`[api messagequeue get] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[api messagequeue get] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {'feed' : {'title' : resErrMsg}}
  }

  console.log('[api messagequeue get] end.')
  return vtecxnext.response(resStatus, resJson)
}

/**
 * POSTメソッド
 * @param req リクエスト
 * @returns レスポンス
 */
export const POST = async (req:NextRequest):Promise<Response> => {
  console.log(`[api messagequeue post] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }

  // パラメータを取得
  const channel:string = vtecxnext.getParameter('channel') ?? ''

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
      // メッセージキュー送信
      await vtecxnext.setMessageQueue(data, channel)
      const message = `set message queue. channel=${channel}`
      resJson = {'feed' : {'title' : message}}
  } catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError) {
      console.log(`[api messagequeue post] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[api messagequeue post] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {'feed' : {'title' : resErrMsg}}
  }

  console.log('[api messagequeue post] end.')
  return vtecxnext.response(resStatus, resJson)
}

/**
 * PUTメソッド
 * @param req リクエスト
 * @returns レスポンス
 */
export const PUT = async (req:NextRequest):Promise<Response> => {
  console.log(`[api messagequeue put] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }

  let resStatus:number = 200
  let resJson:any
  try {
      // メッセージキューステータス設定
      const channel:string = vtecxnext.getParameter('channel') ?? ''
      const flagStr:string = vtecxnext.getParameter('flag') ?? ''
      const flag:boolean = testutil.toBoolean(flagStr)
      await vtecxnext.setMessageQueueStatus(flag, channel)
      const message = `set message queue status. channel=${channel} flag=${flagStr}`
      resJson = {'feed' : {'title' : message}}
  } catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError) {
      console.log(`[api messagequeue put] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[api messagequeue put] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {'feed' : {'title' : resErrMsg}}
  }

  console.log('[api messagequeue put] end.')
  return vtecxnext.response(resStatus, resJson)
}
