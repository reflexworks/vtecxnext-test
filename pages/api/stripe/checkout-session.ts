import type { NextApiRequest, NextApiResponse } from 'next'
import * as stripeutil from 'utils/stripeutil'
import * as stripeapiutil from 'utils/stripeapiutil'
import * as vtecxnext from '@vtecx/vtecxnext'
import { getCustomerId } from 'pages/api/stripe/customer'

const stripe = stripeutil.getStripe()

const handler = async (req:NextApiRequest, res:NextApiResponse) => {
  console.log(`[checkout-session] start. ${JSON.stringify(req.body)}`)
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
    let customerId:string
    try {
      customerId = await getCustomerId(req, res, true)
    } catch (e) {
      stripeapiutil.errorHandling(e, res)
      return
    }
    if (!customerId) {
      console.log('[checkout-session] customer id is required.')
      res.status(400).json({'feed': {'title': 'Failed to get customer id.'}})
    }
    const { action }: { action:string } = req.body

    const url = stripeutil.getRedirectUrl(action)
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'setup',
      success_url: url,
      cancel_url: url,
      currency: 'jpy',
      payment_method_types: ['card'],
      customer: customerId,
      customer_update: {
        name: 'auto'
      }
    })
    return res.status(200).json({
      session_id: checkoutSession.id,
      checkout_url: checkoutSession.url,
      customer_id: customerId,
    })

  } else {
    console.log(`[checkout-session] invalid method: ${req.method}`)
    res.status(405)
  }
}

export default handler
