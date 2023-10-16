import { NextRequest } from 'next/server'
import { VtecxNext } from '@vtecx/vtecxnext'
import * as lineutil from 'utils/lineutil'
import * as testutil from 'utils/testutil'

const getFlexMenu = (userId:string, replyToken:string) => {
  return JSON.stringify({
    to: userId,
    replyToken: replyToken,
    messages: [
      {
        type: 'flex',
        altText: 'お問い合わせFlex Message',
        contents: CONTENTS
      }
    ]
  })
}

const CONTENTS = {
  "type": "bubble",
  "body": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "button",
        "action": {
          "type": "message",
          "label": "問い合わせ1",
          "text": "1"
        },
        "style": "primary",
        "margin": "10px"
      },
      {
        "type": "button",
        "action": {
          "type": "message",
          "label": "問い合わせ2",
          "text": "2"
        },
        "style": "primary",
        "margin": "10px"
      },
      {
        "type": "button",
        "action": {
          "type": "message",
          "label": "問い合わせ3",
          "text": "3"
        },
        "margin": "10px",
        "style": "primary"
      },
      {
        "type": "button",
        "action": {
          "type": "message",
          "label": "画像メッセージ",
          "text": "画像2"
        },
        "margin": "10px",
        "style": "primary"
      }
    ]
  }
}

const getAnswer = (userId:string, replyToken:string, reqtext:string) => {
  return JSON.stringify({
    //to: userId,
    replyToken: replyToken,
    messages: [
      {
        type: 'text',
        text: `お問い合わせ ${reqtext} の回答`,
      }
    ]
  })
}

const getImage = (userId:string, replyToken:string) => {
  return JSON.stringify({
    //to: userId,
    replyToken: replyToken,
    messages: [
      {
        "type": "bubble",
        "body": {
          "type": "box",
          "layout": "horizontal",
          "contents": [
            {
              "type": "image",
              "url": "http://terada-test-vtecxnext.vte.cx/d/img/balloon2.png",
              "size": "md"
            }
          ]
        }
      }
    ]
  })
}

/**
 * チャネルシークレットを取得.
 * @param vtecxnext vtecxnext
 * @param name Webhook URL識別名
 * @returns チャネルシークレット
 */
const getChannelSecret = async (vtecxnext:VtecxNext, name:string):Promise<string> => {
  // TODO 以下はテスト用処理。実際の処理ではチャネルシークレットはnameを元にデータ取得してください。
  return process.env[`LINE_CHANNEL_SECRET_${name}`] ?? ''
}

/**
 * チャネルアクセストークンを取得.
 * @param vtecxnext vtecxnext
 * @param name Webhook URL識別名
 * @returns チャネルアクセストークン
 */
const getChannelAccessToken = async (vtecxnext:VtecxNext, name:string):Promise<string> => {
  // TODO 以下はテスト用処理。実際の処理ではチャネルアクセストークンはnameを元にデータ取得してください。
  return process.env[`LINE_CHANNEL_ACCESSTOKEN_${name}`] ?? ''
}

/**
 * POSTメソッド
 * LINE Messaging API Webhook
 * @param req リクエスト
 * @returns レスポンス
 */
export const POST = async (req:NextRequest, { params }:any):Promise<Response> => {

  const vtecxnext = new VtecxNext(req)

  const name = params.name
  const nameStr = testutil.toString(name)
  console.log(`[LINE webhook] start. name=${nameStr}`)
  // LINE署名の検証
  const buf = await vtecxnext.buffer()
  // チャネルシークレットを取得
  const channelSecret = await getChannelSecret(vtecxnext, nameStr)
  console.log(`[LINE webhook] channelSecret=${channelSecret}`)
  if (!lineutil.checkSignature(req, buf, channelSecret)) {
    console.log(`[LINE webhook] signature is invalid.`)
    await vtecxnext.log(`name=${nameStr} Line signature is invalid.`, 'LINE Webhook')
    return vtecxnext.response(400, 'Line signature is invalid.')
  }
  const signatureJson = new TextDecoder().decode(buf)
  console.log(`[LINE webhook] request data = ${signatureJson}`)
  const data = JSON.parse(signatureJson)
  await vtecxnext.log(`name=${nameStr} request data = ${JSON.stringify(data)}`, 'LINE Webhook')
  if (!data || !data.events || data.events.length < 1) {
    // LINE Webhook検証データは {"destination":"xxx","events":[]}
    // 処理終了
    console.log(`[LINE webhook] end. (no events)`)
    return vtecxnext.response(200)
  }

  // チャネルアクセストークンを取得
  const channelAccessToken = await getChannelAccessToken(vtecxnext, nameStr)
  console.log(`[LINE webhook] channelAccessToken=${channelAccessToken}`)

  const ACTION_MENU = 'お問い合わせ'
  const ACTION_Q1 = '1'
  const ACTION_Q2 = '2'
  const ACTION_Q3 = '3'
  const ACTION_IMAGE = '画像2'

  for (const event of data.events) {
    const eventType = event.type ?? 'no type'

    // 特定のメッセージ受信であれば、Flex Messageを送信する。
    if (eventType === 'message' && event.message?.type === 'text' &&
        event.mode === 'active') {
      let body
      if (event.message.text === ACTION_MENU) {
        body = getFlexMenu(event.source?.userId, event.replyToken)
      } else if (event.message.text === ACTION_Q1) {
        body = getAnswer(event.source?.userId, event.replyToken, ACTION_Q1)
      } else if (event.message.text === ACTION_Q2) {
        body = getAnswer(event.source?.userId, event.replyToken, ACTION_Q2)
      } else if (event.message.text === ACTION_Q3) {
        body = getAnswer(event.source?.userId, event.replyToken, ACTION_Q3)
      } else if (event.message.text === ACTION_IMAGE) {
        body = getImage(event.source?.userId, event.replyToken)
      }

      if (body) {
        console.log(`[LINE webhook] send data = ${JSON.stringify(body)}`)
        await vtecxnext.log(`name=${nameStr} send data = ${JSON.stringify(body)}`, 'LINE Webhook')
        try {
          const response = await lineutil.replyMessage(body, channelAccessToken)
          console.log(`[LINE webhook] await lineutil.replyMessage end.`)
          const resDataStr = await response.text()
          console.log(`[LINE webhook] await response.text end.`)
          await vtecxnext.log(`name=${nameStr} lineutil.replyMessage end. status=${response.status} response data = ${resDataStr}`, 'LINE Webhook')
          
        } catch (e) {
          let msg = ''
          if (e instanceof Error) {
            msg = `${e.name}: ${e.message}`
          } else {
            msg = 'Unexpected error.'
          }
          console.log(`[LINE webhook] Error occured. ${msg}`)
          await vtecxnext.log(`name=${nameStr} Error occured. ${msg}`, 'LINE Webhook')
        }
      }

    }
  }
  
  console.log(`[LINE webhook] end. (send flex message.)`)
  return vtecxnext.response(200, 'send flex message.')
}
