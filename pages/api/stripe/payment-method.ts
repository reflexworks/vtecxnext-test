import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import * as stripeutil from 'utils/stripeutil'
import * as stripeapiutil from 'utils/stripeapiutil'
import * as vtecxnext from '@vtecx/vtecxnext'
import { getCustomerId } from 'pages/api/stripe/customer'

const stripe = stripeutil.getStripe()

const handler = async (req:NextApiRequest, res:NextApiResponse) => {
  console.log(`[payment-method] start. `)
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
  // customerId取得
  const customerId:string = await getCustomerId(req, res)
  if (!customerId) {
    res.status(204)
    res.end()
    return
  }

  if (req.method === 'GET') {
    // Stripe顧客の支払い方法を取得
    try {
      const paymentMethods = await getPaymentMethod(customerId, 'card', 10)
      //console.log(`[payment-method] paymentMethods = ${JSON.stringify(paymentMethods)}`)
      res.status(200).json(paymentMethods)
    } catch (e) {
      stripeapiutil.errorHandling(e, res)
    }

  } else {
    console.log(`[payment-method] invalid method: ${req.method}`)
    res.status(405)
  }
}

export default handler

/**
 * payment-methodを取得.
 * @param customerId customer_id
 * @param type 'card'など
 * @param limit 件数
 * @returns payment-method
 */
export const getPaymentMethod = async (customerId:string, type:Stripe.PaymentMethodListParams.Type, limit:number):Promise<Stripe.PaymentMethod[]> => {
  const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: type,
      limit: limit,
  })
  return paymentMethods.data
}
