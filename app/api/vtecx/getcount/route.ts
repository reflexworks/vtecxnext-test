import { NextRequest } from 'next/server'
import { VtecxNext, VtecxResponse, VtecxNextError } from '@vtecx/vtecxnext'
import * as testutil from 'utils/testutil'

export const POST = async (req:NextRequest):Promise<Response> => {
  console.log(`[api getcount] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }

  const key:string = vtecxnext.getParameter('key') ?? ''
  const targetservice:string = vtecxnext.getParameter('targetservice') ?? ''
  const type:string = vtecxnext.getParameter('type') ?? ''

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
  console.log(`[api getcount] key=${key} param=${param}${targetservice ? ' targetservice=' + targetservice : ''}${type ? ' type=' + type : ''}`)

  // 件数取得
  let resStatus:number
  let resMessage:string
  try {
    const requesturi = `${key}${param ? '?' + param : ''}`
    if (type === 'response') {
      // type=response の場合、countResponse を実行する。(戻り値にstatus、headerがある。)
      // カーソルを取得する場合はこちらを使用する。
      const vtecxRes:VtecxResponse = await vtecxnext.countResponse(requesturi, targetservice)
      const data = vtecxRes.data
      resStatus = vtecxRes.status
      if (vtecxRes.header) {
        for (const name in vtecxRes.header) {
          vtecxnext.setResponseHeader(name, vtecxRes.header[name])
        }
      }
      resMessage = vtecxRes.data.feed.title ? data.feed.title : null
    } else {
      resMessage = String(await vtecxnext.count(requesturi, targetservice))
      resStatus = 200
    }
  } catch (error) {
    if (error instanceof VtecxNextError) {
      console.log(`[api getcount] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resMessage = error.message
    } else {
      console.log(`[api getcount] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resMessage = 'Error occured.'
    }
  }
  const feed = {'feed' : {'title' : resMessage}}

  console.log('[api getcount] end.')
  return vtecxnext.response(resStatus, feed)
}
