import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import * as stripeutil from 'utils/stripeutil'
import * as vtecxnext from '@vtecx/vtecxnext'
import * as testutil from 'utils/testutil'

const stripe = stripeutil.getStripe()

const handler = async (req:NextApiRequest, res:NextApiResponse) => {
  console.log(`[refund] start. `)
  // X-Requested-With ヘッダチェック
  if (!vtecxnext.checkXRequestedWith(req, res)) {
    return
  }
  // パラメータを取得
  const payment_intent:string = testutil.getParam(req, 'payment_intent')
  const amount:number|undefined = testutil.getParamNumber(req, 'amount')
  console.log(`[refund] payment_intent=${payment_intent} amount=${amount}`)

  const refundCreateParams:Stripe.RefundCreateParams = {payment_intent: payment_intent}
  if (amount) {
    refundCreateParams.amount = amount
  }

  let status:number = 500
  let message:string = 'Unexpected error.'
  try {
    const refund = await stripe.refunds.create(refundCreateParams)
    console.log(`[refund] create. ${JSON.stringify(refund)}`)
    status = 200
    message = `refunds.create succeeded. payment_intent=${payment_intent} amount=${amount ?? 'all'}`
  } catch (e) {
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
    }
  }
  res.status(status).json({
    feed: {title: message}
  })
}

export default handler
