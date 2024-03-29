import { NextRequest } from 'next/server'
import { VtecxNext } from '@vtecx/vtecxnext'
import * as lineutil from 'utils/webhook_lineutil'

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
          "text": "画像"
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
              "url": "https://terada-test-vtecxnext.vte.cx/d/img/balloon2.png",
              "size": "md"
            }
          ]
        }
      }
    ]
  })
}

/**
 * POSTメソッド
 * LINE Messaging API Webhook
 * @param req リクエスト
 * @returns レスポンス
 */
export const POST = async (req:NextRequest):Promise<Response> => {
  console.log(`[LINE webhook_inquiry] start.`)

  const vtecxnext = new VtecxNext(req)

  // LINE署名の検証
  const buf = await vtecxnext.buffer()
  if (!lineutil.checkSignature(req, buf)) {
    console.log(`[LINE webhook_inquiry] signature is invalid.`)
    //await vtecxnext.log(`Line signature is invalid.`, 'LINE Webhook inquiry')
    return vtecxnext.response(400, 'Line signature is invalid.')
  }
  const str = buf.toString()
  const data = JSON.parse(str)
  console.log(`[LINE webhook_inquiry] request data = ${JSON.stringify(data)}`)
  //await vtecxnext.log(`request data = ${JSON.stringify(data)}`, 'LINE Webhook inquiry')
  if (!data || !data.events || data.events.length < 1) {
    // 処理終了
    return vtecxnext.response(200)
  }

  const ACTION_MENU = 'お問い合わせ'
  const ACTION_Q1 = '1'
  const ACTION_Q2 = '2'
  const ACTION_Q3 = '3'
  const ACTION_IMAGE = '画像'

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
        console.log(`[LINE webhook_inquiry] send data = ${JSON.stringify(body)}`)
        //await vtecxnext.log(`send data = ${JSON.stringify(body)}`, 'LINE Webhook inquiry')
        try {
          const response = await lineutil.fetchLine(body)
          console.log(`[LINE webhook] send line message. response = ${JSON.stringify(response)}`)
          //const resDataStr = await response.text()
          //await vtecxnext.log(`lineutil.fetchLine end. status=${response.status} response data = ${resDataStr}`, 'LINE Webhook inquiry')
          
        } catch (e) {
          let msg = ''
          if (e instanceof Error) {
            msg = `${e.name}: ${e.message}`
          } else {
            msg = 'Unexpected error.'
          }
          console.log(`[LINE webhook_inquiry] Error occured. ${msg}`)
          await vtecxnext.log(`Error occured. ${msg}`, 'LINE Webhook')
        }
      }
    }
  }
  return vtecxnext.response(200, 'send flex message.')
}
