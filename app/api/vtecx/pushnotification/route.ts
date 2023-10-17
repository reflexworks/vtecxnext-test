import { NextRequest } from 'next/server'
import { VtecxNext, VtecxNextError } from '@vtecx/vtecxnext'
import * as testutil from 'utils/testutil'

/**
 * POSTメソッド
 * @param req リクエスト
 * @returns レスポンス
 */
export const POST = async (req:NextRequest):Promise<Response> => {
  console.log(`[api pushnotification] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }

  // パラメータを取得
  const tmpTo:string = vtecxnext.getParameter('to') ?? ''
  const to = tmpTo ? tmpTo.split(',') : []
  console.log(`[api pushnotification] to=${to}`)
  const imageUrl:string = vtecxnext.getParameter('imageurl') ?? ''

  // リクエストJSON取得
  const contentLength:number = testutil.toNumber(req.headers.get('content-length'), 0)
  let entry:any
  if (contentLength > 0) {
    try {
      entry = await req.json()
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
    // title: Push通知タイトル
    // subtitle: Push通知サブタイトル
    // content: Push通知メッセージ本文(body)
    // summary: dataに設定するメッセージ(Expo用)
    // category _$scheme={dataのキー} _$label={dataの値}(Expo用)
    let message
    let title
    let subtitle
    let data:any
    if (entry) {
      message = 'content' in entry && '______text' in entry.content ? entry.content['______text'] : undefined
      title = 'title' in entry ? entry['title'] : undefined
      subtitle = 'subtitle' in entry ? entry['subtitle'] : undefined
      data = {}
      if ('category' in entry) {
        for (const category of entry['category']) {
          data[category['___scheme']] = category['___label']
        }
      }
    }

    await vtecxnext.pushNotification(message, to, title, subtitle, imageUrl, data)
    resStatus = 200
    resMessage = `sent a push notification.`

  } catch (error) {
    if (error instanceof VtecxNextError) {
      console.log(`[api pushnotification] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resMessage = error.message
    } else if (error instanceof Error) {
      console.log(`[api pushnotification] Error occured. (not VtecxNextError) ${error.name}: ${error.message} ${error.stack}`)
      resStatus = 503
      resMessage = 'Error occured.'
    } else {
      console.log(`[api pushnotification] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resMessage = 'Error occured.'
    }
  }

  console.log('[api pushnotification] end.')
  const resJson = {'feed' : {'title' : resMessage}}
  return vtecxnext.response(resStatus, resJson)
}
