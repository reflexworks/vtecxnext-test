import { NextRequest } from 'next/server'
import { VtecxNext, VtecxNextError } from '@vtecx/vtecxnext'
import * as testutil from 'utils/testutil'

/**
 * POSTメソッド
 * @param req リクエスト
 * @returns レスポンス
 */
export const POST = async (req:NextRequest):Promise<Response> => {
  console.log(`[api sendmail] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }

  // 引数を取得
  const tmpTo:string = vtecxnext.getParameter('to') ?? ''
  const tos = tmpTo ? tmpTo.split(',') : []
  const tmpCc:string = vtecxnext.getParameter('cc') ?? ''
  const ccs = tmpCc ? tmpCc.split(',') : undefined
  const tmpBcc:string = vtecxnext.getParameter('bcc') ?? ''
  const bccs = tmpBcc ? tmpBcc.split(',') : undefined
  const tmpAttachment:string = vtecxnext.getParameter('attachment') ?? ''
  const attachments = tmpAttachment ? tmpAttachment.split(',') : undefined
  console.log(`[api sendmail] tos=${tos} ccs=${ccs} bccs=${bccs} attachments=${attachments}`)

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

  // メール送信
  let resStatus:number
  let resMessage:string
  try {
    await vtecxnext.sendMail(data, tos, ccs, bccs, attachments)
    resStatus = 200
    resMessage = `sent the email.`
  } catch (error) {
    if (error instanceof VtecxNextError) {
      console.log(`[api sendmail] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resMessage = error.message
    } else {
      console.log(`[api sendmail] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resMessage = 'Error occured.'
    }
  }

  console.log('[api sendmail] end.')
  const resJson = {'feed' : {'title' : resMessage}}
  return vtecxnext.response(resStatus, resJson)
}
