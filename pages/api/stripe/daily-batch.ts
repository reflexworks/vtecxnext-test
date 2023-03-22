import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import * as vtecxnext from '@vtecx/vtecxnext'
import { createPaymentIntent } from 'pages/api/stripe/create-payment-intent'
import { getPaymentMethod } from 'pages/api/stripe/payment-method'

// vte.cxのバッチジョブで1日1回リクエストされることを想定
const handler = async (req:NextApiRequest, res:NextApiResponse) => {
  console.log(`[daily-batch] start. headers = ${JSON.stringify(req.headers)}`)
  // サービス管理者チェック
  const isAdmin = await vtecxnext.isAdmin(req, res)
  console.log(`[daily-batch] isAdmin=${isAdmin}`)
  if (!isAdmin) {
    res.status(404)
    res.end()
    return
  }
  // X-Requested-With ヘッダチェック
  if (!vtecxnext.checkXRequestedWith(req, res)) {
    return
  }

  if (req.method === 'POST') {
    console.log(`[daily-batch] req.body = ${JSON.stringify(req.body)}`)
    const { amount, customerId }: {amount: number, customerId:string} = req.body
    const paymentMethod = await getPaymentMethod(customerId, 'card', 1)
    const paymentMethodId = paymentMethod[0].id

    try {
      const paymentIntent = await createPaymentIntent(amount, customerId, paymentMethodId)
      console.log(`[daily-batch] paymentIntent=${JSON.stringify(paymentIntent)}`)

      res.status(200).json({'feed': {'title': 'daily-batch finished.'}})  

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
      }
      res.status(status).json({
        feed: {title: message}
      })
    }
  } else {
    console.log(`[daily-batch] invalid method: ${req.method}`)
    res.status(405)
  }
}

export default handler
