import { NextRequest } from 'next/server'
import { VtecxNext, VtecxNextError } from '@vtecx/vtecxnext'
import * as testutil from 'utils/testutil'
import { ApiRouteTestError } from 'utils/testutil'

/**
 * GETメソッド
 * @param req リクエスト
 * @returns レスポンス
 */
export const POST = async (req:NextRequest):Promise<Response> => {
  console.log(`[api paging] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }

  const key:string = vtecxnext.getParameter('key') ?? ''
  const pagerange:string = vtecxnext.getParameter('_pagination') ?? ''
  const num:number|undefined = testutil.getParamNumber(vtecxnext, 'n')
  const targetservice:string = vtecxnext.getParameter('targetservice') ?? ''

  // リクエストJSON取得
  const contentLength:number = testutil.toNumber(req.headers.get('content-length'), 0)
  let param:string|undefined = undefined
  if (contentLength > 0) {
    try {
      const data = await req.json()
      if (data && data.length > 0) {
        param = data[0].title
      }
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
  console.log(`[api paging] key=${key} param=${param} pagerange=${pagerange} num=${String(num)} ${targetservice ? 'targetservice=' + targetservice : ''}`)

  // ページング
  let resStatus:number = 200
  let resJson:any
  try {
    const requesturi = `${key}${param ? '?' + param : ''}`
    if (pagerange !== null && pagerange !== undefined && pagerange !== '') {
      // ページネーション
      resJson = await vtecxnext.pagination(requesturi, pagerange, targetservice)
      resStatus = resJson ? 200 : 204
    } else if (num !== null && num !== undefined) {
      // ページ数取得
      resJson = await vtecxnext.getPage(requesturi, num, targetservice)
      resStatus = resJson ? 200 : 204
    } else {
      console.log(`[api paging] invalid type. key=${key}`)
      throw new ApiRouteTestError(400, `[paging] invalid type. key=${key}`)
    }

  } catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError || error instanceof ApiRouteTestError) {
      console.log(`[api paging] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[api paging] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {'feed' : {'title' : resErrMsg}}
  }

  //console.log(`[api paging] end. resJson=${JSON.stringify(resJson)}`)
  return vtecxnext.response(resStatus, resJson) 
}
