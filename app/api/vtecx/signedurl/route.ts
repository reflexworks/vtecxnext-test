import { NextRequest } from 'next/server'
import { VtecxNext, VtecxNextError } from '@vtecx/vtecxnext'

export const GET = async (req:NextRequest):Promise<Response> => {
  console.log(`[api signedurl get] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }

  // キーを取得
  const key:string = vtecxnext.getParameter('key') ?? ''
  console.log(`[api signedurl get] key=${key}`)
  // エントリー取得
  let resStatus:number|undefined = undefined
  let resJson:any|undefined = undefined
  try {
    // レスポンスステータスと取得したコンテンツはvtecxnextに格納される。
    resJson = await vtecxnext.getcontentSignedUrl(key)
  } catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError) {
      console.log(`[api signedurl get] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[api signedurl get] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {'feed' : {'title' : resErrMsg}}
  }

  console.log('[api signedurl get] end.')
  return vtecxnext.response(resStatus, resJson)
}

export const POST = async (req:NextRequest):Promise<Response> => {
  console.log(`[api signedurl post] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }

  // キーを取得
  const key:string = vtecxnext.getParameter('key') ?? ''
  const ext:string = vtecxnext.getParameter('ext') ?? ''
  console.log(`[api signedurl post] key=${key} ext=${ext}`)
  // エントリー取得
  let resStatus:number|undefined = undefined
  let resJson:any|undefined = undefined
  try {
    // レスポンスステータスと取得したコンテンツはvtecxnextに格納される。
    resJson = await vtecxnext.getcontentSignedUrl(key)
  } catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError) {
      console.log(`[api signedurl post] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[api signedurl post] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {'feed' : {'title' : resErrMsg}}
  }

  console.log('[api signedurl post] end.')
  return vtecxnext.response(resStatus, resJson)
}

export const PUT = async (req:NextRequest):Promise<Response> => {
  console.log(`[api signedurl put] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }

  // キーを取得
  const key:string = vtecxnext.getParameter('key') ?? ''
  console.log(`[api signedurl put] key=${key}`)
  // エントリー取得
  let resStatus:number|undefined = undefined
  let resJson:any|undefined = undefined
  try {
    // レスポンスステータスと取得したコンテンツはvtecxnextに格納される。
    resJson = await vtecxnext.putcontentSignedUrl(key)
  } catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError) {
      console.log(`[api signedurl put] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[api signedurl put] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {'feed' : {'title' : resErrMsg}}
  }

  console.log('[api signedurl put] end.')
  return vtecxnext.response(resStatus, resJson)
}
