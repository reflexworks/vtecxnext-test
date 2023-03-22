import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import * as stripeutil from 'utils/stripeutil'
import * as vtecxnext from '@vtecx/vtecxnext'
import * as testutil from 'utils/testutil'
import { getCustomerId } from 'pages/api/stripe/customer'

const stripe = stripeutil.getStripe()

const getPriceInfo = async (req:NextApiRequest, res:NextApiResponse, item:string):Promise<any> => {
  // TODO vte.cxに登録されたprice_idを取得

  let price:Stripe.Price
  if (item) {
    price = await stripe.prices.retrieve(item)
  } else {
    const priceList = await stripe.prices.list({limit: 1})
    price = priceList.data[0]
  }
  //console.log(`[create-subscription][getPriceInfo] price = ${JSON.stringify(price)}`)
  const ret = {
    'priceId': price.id,
    'amount': price.unit_amount,
    'interval': price.recurring?.interval,
  }
  //console.log(`[create-subscription][getPriceInfo] ret = ${JSON.stringify(ret)}`)
  return ret
}

const handler = async (req:NextApiRequest, res:NextApiResponse) => {
  console.log(`[create-subscription] start. ${JSON.stringify(req.body)}`)
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
    // customer_idを取得
    const customerId = await getCustomerId(req, res, true)
    // price_idを取得
    const { item, paymentMethodId, startTimestamp }: {item: string, paymentMethodId:string, startTimestamp:number} = req.body
    const priceInfo = await getPriceInfo(req, res, item)
    const priceId = priceInfo.priceId
    const amount = priceInfo.amount

    if (!customerId) {
      console.log('[create-subscription] customer id is required.')
      res.status(400).json({'feed': {'title': 'Failed to get customer id.'}})
    }
    if (!priceId) {
      console.log('[create-subscription] price id is required.')
      res.status(400).json({'feed': {'title': 'No parameters.'}})
    }
    console.log(`[create-subscription] customerId=${customerId} priceId=${priceId} amount=${amount} paymentMethodId=${paymentMethodId}`)

    const params:Stripe.SubscriptionCreateParams = {
      currency: 'jpy',
      customer: customerId,
      items: [{
        price: priceId,
      }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    }
    if (paymentMethodId) {
      params.default_payment_method = paymentMethodId
      params.off_session = true
    }
    if (startTimestamp) {
      params.trial_end = startTimestamp
    }

    try {
      // サブスクリプションの生成
      const subscription = await stripe.subscriptions.create(params)
      console.log(`[create-subscription] subscriptions.create = ${JSON.stringify(subscription)}`)

      // payment-intentの確認
      const suPaymentIntent = (subscription.latest_invoice as Stripe.Invoice).payment_intent as Stripe.PaymentIntent
      if (suPaymentIntent && suPaymentIntent.id) {
        const paymentIntent = await stripe.paymentIntents.confirm(suPaymentIntent.id) 
        console.log(`[create-subscription] paymentIntents.confirm = ${JSON.stringify(paymentIntent)}`)
      }

      res.status(200).json({
        subscriptionId: subscription.id,
        clientSecret: suPaymentIntent?.client_secret,
        amount: amount,
      })
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
      } else if (e instanceof Error) {
        message = `Unexpected error. ${e.message}`
        console.log(`[create-subscription] Error occured. ${e.name}: ${e.message}`)
      } else {
        console.log(`[create-subscription] Error occured. e is not Error.`)
      }
      res.status(status).json({
        feed: {title: message}
      })
    }

  } else if (req.method === 'GET') {
    // price_id、価格を取得
    const item = testutil.getParam(req, 'item')
    const priceInfo = await getPriceInfo(req, res, item)
    res.status(200).json(priceInfo)

  } else {
    console.log(`[create-subscription] invalid method: ${req.method}`)
    res.status(405)
  }
}

export default handler
