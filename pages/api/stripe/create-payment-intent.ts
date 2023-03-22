import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import * as stripeutil from 'utils/stripeutil'
import * as stripeapiutil from 'utils/stripeapiutil'
import * as vtecxnext from '@vtecx/vtecxnext'
import * as testutil from 'utils/testutil'
import { getCustomerId } from 'pages/api/stripe/customer'

const stripe = stripeutil.getStripe()

// セキュリティ上、金額はサーバ側で指定する
// https://stripe.com/docs/payments/accept-a-payment?platform=web&ui=elements#web-create-intent
export const getAmount = (item:string):number => {
  if (item === '1') {
    return 300
  } else if (item === '2') {
    return 600
  } else if (item === '3') {
    return 900
  } else if (item === '4') {
    return 1200
  } else if (item === '5') {
    return 1500
  } else {
    return 100
  }
}

export const createPaymentIntent = async (amount:number, customerId:string, paymentMethodId?:string):Promise<Stripe.PaymentIntent> => {
  const params:Stripe.PaymentIntentCreateParams = {
    amount: amount,
    currency: 'jpy',
    customer: customerId,
  }
  if (paymentMethodId) {
    // 前回のカード利用。payment_intent作成から請求・支払いまで一気に行う。
    console.log(`[create-payment-intent] create -> charge -> succeeded paymentMethodId=${paymentMethodId}`)
    params.payment_method = paymentMethodId
    params.off_session = true
    params.confirm = true
  } else {
    console.log(`[create-payment-intent] create only.`)
    // payment_intent作成。この後、画面側でカード入力フォームを表示する。
    params.setup_future_usage = 'off_session'
    params.automatic_payment_methods = {
      enabled: true,
    }
  }

  // setup_future_usage='off_session'、automatic_payment_methods.enabled=trueは
  // 次回も同じカードを使用する場合に指定
  console.log(`[create-payment-intent] stripe.paymentIntents.create params = ${JSON.stringify(params)}`)
  return await stripe.paymentIntents.create(params)
}

const handler = async (req:NextApiRequest, res:NextApiResponse) => {
  console.log(`[create-payment-intent] start. ${JSON.stringify(req.body)}`)
  // X-Requested-With ヘッダチェック
  if (!vtecxnext.checkXRequestedWith(req, res)) {
    return
  }
  // ログインチェック
  const isLoggedIn = await vtecxnext.isLoggedin(req, res)
  if (!isLoggedIn) {
    res.status(403).json({'feed': {'title': 'Permission denied.'}})
    res.end()
    return
  }

  if (req.method === 'POST') {
    const { item, paymentMethodId }: {item: string, paymentMethodId:string} = req.body
    const amount = getAmount(item)
    if (!amount) {
      console.log('[create-payment-intent] amount is required.')
      res.status(400).json({'feed': {'title': 'No parameters.'}})
    }
    console.log(`[create-payment-intent] amount=${amount} paymentMethodId=${paymentMethodId}`)

    // customer_idを取得
    let customerId:string
    try {
      customerId = await getCustomerId(req, res, true)
    } catch (e) {
      stripeapiutil.errorHandling(e, res)
      return
    }
    if (!customerId) {
      console.log('[create-payment-intent] customer id is required.')
      res.status(400).json({'feed': {'title': 'Failed to get customer id.'}})
    }

    // setup_future_usage='off_session'、automatic_payment_methods.enabled=trueは
    // 次回も同じカードを使用する場合に指定
    try {
      const paymentIntent: Stripe.PaymentIntent = await createPaymentIntent(amount, customerId, paymentMethodId)

      console.log(`[create-payment-intent] paymentIntent = ${JSON.stringify(paymentIntent)}`)

      const resData = {
        clientSecret: paymentIntent.client_secret,
        payment_intent: paymentIntent.id,
        amount: amount,
      }
      res.status(200).json(resData)
    } catch (e) {
      let status:number = 500
      let message:string = 'Unexpected error.'
      if (e instanceof Stripe.errors.StripeError) {
        switch (e.type) {
          case 'StripeCardError':
            status = 400
            message = `A payment error occurred: ${e.message}`
            break
          case 'StripeInvalidRequestError':
            status = 400
            message = `An invalid request occurred: ${e.message}`
            break
          default:
            status = 400
            message = `Another problem occurred, maybe unrelated to Stripe: ${e.message}`
            break
        }
        console.log(`[create-payment-intent] Error occured. e.type=${e.type} status=${status} message=${message}`)
      } else {
        console.log(`[create-payment-intent] Error occured. status=${status} message=${message}`)
      }
      res.status(status).json({
        feed: {title: message}
      })
    }

  } else if (req.method === 'GET') {
    const item = testutil.getParam(req, 'item')
    const amount = getAmount(item)
    res.status(200).json({amount: amount})

  } else {
    console.log(`[create-payment-intent] invalid method: ${req.method}`)
    res.status(405)
  }
}

export default handler
