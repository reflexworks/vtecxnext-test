import { NextRequest } from 'next/server'
import { VtecxNext, VtecxResponse, VtecxNextError } from '@vtecx/vtecxnext'
import * as testutil from 'utils/testutil'

export const POST = async (req:NextRequest):Promise<Response> => {
  console.log(`[api getfeed] start. x-requested-with=${req.headers.get('x-requested-with')}`)

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
      if (data) {
        console.log(`[api getfeed] condition data = ${JSON.stringify(data)}`)
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
  console.log(`[api getfeed] key=${key} param=${param}${targetservice ? ' targetservice=' + targetservice : ''}${type ? ' type=' + type : ''}`)

  // フィード取得
  let resStatus:number
  let resJson:any
  try {
    const requesturi = `${key}${param ? '?' + param : ''}`
    console.log(`[api getFeed] requesuri=${requesturi}`)
    if (type === 'response') {
      // type=response の場合、getFeedResponse を実行する。(戻り値にstatus、headerがある。)
      // カーソルを取得する場合はこちらを使用する。
      const vtecxRes:VtecxResponse = await vtecxnext.getFeedResponse(requesturi, targetservice)
      resJson = vtecxRes.data
      resStatus = vtecxRes.status
      if (vtecxRes.header) {
        for (const name in vtecxRes.header) {
          const val = vtecxRes.header[name]
          console.log(`[api getfeed] vtecxRes.header name=${name} value=${val}`)
          vtecxnext.setResponseHeader(name, vtecxRes.header[name])
        }
      }

    } else {
      resJson = await vtecxnext.getFeed(requesturi, targetservice)
      resStatus = resJson ? 200 : 204
    }
  } catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError) {
      console.log(`[api getfeed] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[api getfeed] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {'feed' : {'title' : resErrMsg}}
  }

  console.log('[api getfeed] end.')
  return vtecxnext.response(resStatus, resJson)
}
