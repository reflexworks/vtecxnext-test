import { NextRequest } from 'next/server'
import { VtecxNext, VtecxNextError } from '@vtecx/vtecxnext'
import * as testutil from 'utils/testutil'

/**
 * POSTメソッド
 * @param req リクエスト
 * @returns レスポンス
 */
export const POST = async (req:NextRequest):Promise<Response> => {
  console.log(`[api changepass] start. x-requested-with=${req.headers.get('x-requested-with')}`)

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
    console.log(`[api changepass] vtecxnext.passreset start.`)

    const pass:string = data.newpswd ?? ''
    const oldpass = data.oldpswd
    const passresetToken = data.passresetToken
    resJson = await vtecxnext.changepass(pass, oldpass, passresetToken)
    resStatus = 200
  } catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError) {
      console.log(`[api changepass] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[api changepass] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {'feed' : {'title' : resErrMsg}}
  }

  console.log('[api changepass] end.')
  return vtecxnext.response(resStatus, resJson)
}
