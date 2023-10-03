import { NextRequest } from 'next/server'
import { VtecxNext, VtecxNextError } from '@vtecx/vtecxnext'
import * as testutil from 'utils/testutil'

export const POST = async (req:NextRequest):Promise<Response> => {
  console.log(`[api log] start. x-requested-with=${req.headers.get('x-requested-with')}`)

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
  let resMessage:string
  try {
    // vte.cxへリクエスト
    console.log(`[api log] body : ${JSON.stringify(data)}`)
    let message:string = ''
    let title:string | undefined
    let subtitle:string | undefined
    if (data && data.length > 0) {
      message = data[0].summary
      title = data[0].title
      subtitle =  data[0].subtitle
    }

    console.log(`[api log] message=${message} title=${title} subtitle=${subtitle}`)

    await vtecxnext.log(message, title, subtitle)
    resStatus = 200
    resMessage = 'post log entry.'
  } catch (error) {
    if (error instanceof VtecxNextError) {
      console.log(`[api log] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resMessage = error.message
    } else {
      console.log(`[api log] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resMessage = 'Error occured.'
    }
  }
  const feed = {'feed' : {'title' : resMessage}}

  console.log('[api log] end.')
  return vtecxnext.response(resStatus, feed)
}
