import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import * as stripeutil from 'utils/stripeutil'
import * as stripeapiutil from 'utils/stripeapiutil'
import * as vtecxnext from '@vtecx/vtecxnext'
import * as testutil from 'utils/testutil'

const stripe:Stripe = stripeutil.getStripe()

const handler = async (req:NextApiRequest, res:NextApiResponse) => {
  console.log(`[retrieve] start. `)
  // X-Requested-With ヘッダチェック
  if (!vtecxnext.checkXRequestedWith(req, res)) {
    return
  }
  // TODO サービス管理者チェック

  const input_id:string = testutil.getParam(req, 'id')
  const option:string = testutil.getParam(req, 'option')
  const list:string = testutil.getParam(req, 'list')
  const limitStr:string = testutil.getParam(req, 'limit')
  console.log(`[retrieve] input_id=${input_id} option=${option} list=${list}`)
  const params:any = {}
  if (limitStr) {
    params.limit = testutil.toNumber(limitStr)
  }

  if (req.method === 'GET') {
    if (list) {
      // リスト取得
      if (list === 'subscription') {
        try {
          const stripeList = await stripe.subscriptions.list(params)
          console.log(`[retrieve] stripe.subscriptions.list = ${JSON.stringify(stripeList)}`)
          res.status(200).json(stripeList)
        } catch (e) {
          stripeapiutil.errorHandling(e, res)
          if (e instanceof Error) {
            console.log(`[retrieve] Error occured. ${e.name}: ${e.message}}`)
          } else {
            console.log(`[retrieve] Unexpected error. ${e}}`)
          }
        }
      } else if (list === 'invoice') {
        try {
          const stripeList = await stripe.invoices.list(params)
          console.log(`[retrieve] stripe.invoices.list = ${JSON.stringify(stripeList)}`)
          res.status(200).json(stripeList)
        } catch (e) {
          stripeapiutil.errorHandling(e, res)
          if (e instanceof Error) {
            console.log(`[retrieve] Error occured. ${e.name}: ${e.message}}`)
          } else {
            console.log(`[retrieve] Unexpected error. ${e}}`)
          }
        }
      } else if (list === 'checkout_session') {
        try {
          const stripeList = await stripe.checkout.sessions.list(params)
          console.log(`[retrieve] stripe.checkout.sessions.list = ${JSON.stringify(stripeList)}`)
          res.status(200).json(stripeList)
        } catch (e) {
          stripeapiutil.errorHandling(e, res)
          if (e instanceof Error) {
            console.log(`[retrieve] Error occured. ${e.name}: ${e.message}}`)
          } else {
            console.log(`[retrieve] Unexpected error. ${e}}`)
          }
        }
      } else if (list === 'customer') {
        try {
          const stripeList = await stripe.customers.list(params)
          console.log(`[retrieve] stripe.customers.list = ${JSON.stringify(stripeList)}`)
          res.status(200).json(stripeList)
        } catch (e) {
          stripeapiutil.errorHandling(e, res)
          if (e instanceof Error) {
            console.log(`[retrieve] Error occured. ${e.name}: ${e.message}}`)
          } else {
            console.log(`[retrieve] Unexpected error. ${e}}`)
          }
        }
      } else if (list === 'charges') {
        try {
          const stripeList = await stripe.charges.list(params)
          console.log(`[retrieve] stripe.charges.list = ${JSON.stringify(stripeList)}`)
          res.status(200).json(stripeList)
        } catch (e) {
          stripeapiutil.errorHandling(e, res)
          if (e instanceof Error) {
            console.log(`[retrieve] Error occured. ${e.name}: ${e.message}}`)
          } else {
            console.log(`[retrieve] Unexpected error. ${e}}`)
          }
        }
      } else if (list === 'payment_intent') {
        try {
          const stripeList = await stripe.paymentIntents.list(params)
          console.log(`[retrieve] stripe.paymentIntents.list = ${JSON.stringify(stripeList)}`)
          res.status(200).json(stripeList)
        } catch (e) {
          stripeapiutil.errorHandling(e, res)
          if (e instanceof Error) {
            console.log(`[retrieve] Error occured. ${e.name}: ${e.message}}`)
          } else {
            console.log(`[retrieve] Unexpected error. ${e}}`)
          }
        }
      } else if (list === 'payment_link') {
        try {
          const stripeList = await stripe.paymentLinks.list(params)
          console.log(`[retrieve] stripe.paymentLinks.list = ${JSON.stringify(stripeList)}`)
          res.status(200).json(stripeList)
        } catch (e) {
          stripeapiutil.errorHandling(e, res)
          if (e instanceof Error) {
            console.log(`[retrieve] Error occured. ${e.name}: ${e.message}}`)
          } else {
            console.log(`[retrieve] Unexpected error. ${e}}`)
          }
        }
      } else if (list === 'payment_method') {
        try {
          const stripeList = await stripe.paymentMethods.list(params)
          console.log(`[retrieve] stripe.paymentMethods.list = ${JSON.stringify(stripeList)}`)
          res.status(200).json(stripeList)
        } catch (e) {
          stripeapiutil.errorHandling(e, res)
          if (e instanceof Error) {
            console.log(`[retrieve] Error occured. ${e.name}: ${e.message}}`)
          } else {
            console.log(`[retrieve] Unexpected error. ${e}}`)
          }
        }
      } else if (list === 'price') {
        try {
          const stripeList = await stripe.prices.list(params)
          console.log(`[retrieve] stripe.prices.list = ${JSON.stringify(stripeList)}`)
          res.status(200).json(stripeList)
        } catch (e) {
          stripeapiutil.errorHandling(e, res)
          if (e instanceof Error) {
            console.log(`[retrieve] Error occured. ${e.name}: ${e.message}}`)
          } else {
            console.log(`[retrieve] Unexpected error. ${e}}`)
          }
        }
      } else if (list === 'product') {
        try {
          const stripeList = await stripe.products.list(params)
          console.log(`[retrieve] stripe.products.list = ${JSON.stringify(stripeList)}`)
          res.status(200).json(stripeList)
        } catch (e) {
          stripeapiutil.errorHandling(e, res)
          if (e instanceof Error) {
            console.log(`[retrieve] Error occured. ${e.name}: ${e.message}}`)
          } else {
            console.log(`[retrieve] Unexpected error. ${e}}`)
          }
        }
      } else if (list === 'refunds') {
        try {
          const stripeList = await stripe.refunds.list(params)
          console.log(`[retrieve] stripe.refunds.list = ${JSON.stringify(stripeList)}`)
          res.status(200).json(stripeList)
        } catch (e) {
          stripeapiutil.errorHandling(e, res)
          if (e instanceof Error) {
            console.log(`[retrieve] Error occured. ${e.name}: ${e.message}}`)
          } else {
            console.log(`[retrieve] Unexpected error. ${e}}`)
          }
        }
      } else if (list === 'setup_intent') {
        try {
          const stripeList = await stripe.setupIntents.list(params)
          console.log(`[retrieve] stripe.setupIntents.list = ${JSON.stringify(stripeList)}`)
          res.status(200).json(stripeList)
        } catch (e) {
          stripeapiutil.errorHandling(e, res)
          if (e instanceof Error) {
            console.log(`[retrieve] Error occured. ${e.name}: ${e.message}}`)
          } else {
            console.log(`[retrieve] Unexpected error. ${e}}`)
          }
        }
      } else if (list === 'subscription_item') {
        try {
          params.subscription = input_id
          const stripeList = await stripe.subscriptionItems.list(params)
          console.log(`[retrieve] stripe.subscriptionItems.list = ${JSON.stringify(stripeList)}`)
          res.status(200).json(stripeList)
        } catch (e) {
          stripeapiutil.errorHandling(e, res)
          if (e instanceof Error) {
            console.log(`[retrieve] Error occured. ${e.name}: ${e.message}}`)
          } else {
            console.log(`[retrieve] Unexpected error. ${e}}`)
          }
        }
      } else if (list === 'subscription_schedules') {
        try {
          const stripeList = await stripe.subscriptionSchedules.list(params)
          console.log(`[retrieve] stripe.subscriptionSchedules.list = ${JSON.stringify(stripeList)}`)
          res.status(200).json(stripeList)
        } catch (e) {
          stripeapiutil.errorHandling(e, res)
          if (e instanceof Error) {
            console.log(`[retrieve] Error occured. ${e.name}: ${e.message}}`)
          } else {
            console.log(`[retrieve] Unexpected error. ${e}}`)
          }
        }
      } else {
        res.status(400).json({feed: {title: 'Invalid parameter.'}})
      }

    } else if (option && input_id) {
      // id検索
      if (option === 'subscription') {
        try {
          const stripeList = await stripe.subscriptions.retrieve(input_id)
          console.log(`[retrieve] stripe.subscriptions.retrieve = ${JSON.stringify(stripeList)}`)
          res.status(200).json(stripeList)
        } catch (e) {
          stripeapiutil.errorHandling(e, res)
          if (e instanceof Error) {
            console.log(`[retrieve] Error occured. ${e.name}: ${e.message}}`)
          } else {
            console.log(`[retrieve] Unexpected error. ${e}}`)
          }
        }
      } else if (option === 'invoice') {
        try {
          const stripeList = await stripe.invoices.retrieve(input_id)
          console.log(`[retrieve] stripe.invoices.retrieve = ${JSON.stringify(stripeList)}`)
          res.status(200).json(stripeList)
        } catch (e) {
          stripeapiutil.errorHandling(e, res)
          if (e instanceof Error) {
            console.log(`[retrieve] Error occured. ${e.name}: ${e.message}}`)
          } else {
            console.log(`[retrieve] Unexpected error. ${e}}`)
          }
        }
      } else if (option === 'checkout_session') {
        try {
          const stripeList = await stripe.checkout.sessions.retrieve(input_id)
          console.log(`[retrieve] stripe.checkout.sessions.retrieve = ${JSON.stringify(stripeList)}`)
          res.status(200).json(stripeList)
        } catch (e) {
          stripeapiutil.errorHandling(e, res)
          if (e instanceof Error) {
            console.log(`[retrieve] Error occured. ${e.name}: ${e.message}}`)
          } else {
            console.log(`[retrieve] Unexpected error. ${e}}`)
          }
        }
      } else if (option === 'customer') {
        try {
          const stripeList = await stripe.customers.retrieve(input_id)
          console.log(`[retrieve] stripe.customers.retrieve = ${JSON.stringify(stripeList)}`)
          res.status(200).json(stripeList)
        } catch (e) {
          stripeapiutil.errorHandling(e, res)
          if (e instanceof Error) {
            console.log(`[retrieve] Error occured. ${e.name}: ${e.message}}`)
          } else {
            console.log(`[retrieve] Unexpected error. ${e}}`)
          }
        }
      } else if (option === 'charges') {
        try {
          const stripeList = await stripe.charges.retrieve(input_id)
          console.log(`[retrieve] stripe.charges.retrieve = ${JSON.stringify(stripeList)}`)
          res.status(200).json(stripeList)
        } catch (e) {
          stripeapiutil.errorHandling(e, res)
          if (e instanceof Error) {
            console.log(`[retrieve] Error occured. ${e.name}: ${e.message}}`)
          } else {
            console.log(`[retrieve] Unexpected error. ${e}}`)
          }
        }
      } else if (option === 'payment_intent') {
        try {
          const stripeList = await stripe.paymentIntents.retrieve(input_id)
          console.log(`[retrieve] stripe.paymentIntents.retrieve = ${JSON.stringify(stripeList)}`)
          res.status(200).json(stripeList)
        } catch (e) {
          stripeapiutil.errorHandling(e, res)
          if (e instanceof Error) {
            console.log(`[retrieve] Error occured. ${e.name}: ${e.message}}`)
          } else {
            console.log(`[retrieve] Unexpected error. ${e}}`)
          }
        }
      } else if (option === 'payment_link') {
        try {
          const stripeList = await stripe.paymentLinks.retrieve(input_id)
          console.log(`[retrieve] stripe.paymentLinks.retrieve = ${JSON.stringify(stripeList)}`)
          res.status(200).json(stripeList)
        } catch (e) {
          stripeapiutil.errorHandling(e, res)
          if (e instanceof Error) {
            console.log(`[retrieve] Error occured. ${e.name}: ${e.message}}`)
          } else {
            console.log(`[retrieve] Unexpected error. ${e}}`)
          }
        }
      } else if (option === 'payment_method') {
        try {
          const stripeList = await stripe.paymentMethods.retrieve(input_id)
          console.log(`[retrieve] stripe.paymentMethods.retrieve = ${JSON.stringify(stripeList)}`)
          res.status(200).json(stripeList)
        } catch (e) {
          stripeapiutil.errorHandling(e, res)
          if (e instanceof Error) {
            console.log(`[retrieve] Error occured. ${e.name}: ${e.message}}`)
          } else {
            console.log(`[retrieve] Unexpected error. ${e}}`)
          }
        }
      } else if (option === 'price') {
        try {
          const stripeList = await stripe.prices.retrieve(input_id)
          console.log(`[retrieve] stripe.prices.retrieve = ${JSON.stringify(stripeList)}`)
          res.status(200).json(stripeList)
        } catch (e) {
          stripeapiutil.errorHandling(e, res)
          if (e instanceof Error) {
            console.log(`[retrieve] Error occured. ${e.name}: ${e.message}}`)
          } else {
            console.log(`[retrieve] Unexpected error. ${e}}`)
          }
        }
      } else if (option === 'product') {
        try {
          const stripeList = await stripe.products.retrieve(input_id)
          console.log(`[retrieve] stripe.products.retrieve = ${JSON.stringify(stripeList)}`)
          res.status(200).json(stripeList)
        } catch (e) {
          stripeapiutil.errorHandling(e, res)
          if (e instanceof Error) {
            console.log(`[retrieve] Error occured. ${e.name}: ${e.message}}`)
          } else {
            console.log(`[retrieve] Unexpected error. ${e}}`)
          }
        }
      } else if (option === 'refunds') {
        try {
          const stripeList = await stripe.refunds.retrieve(input_id)
          console.log(`[retrieve] stripe.refunds.list = ${JSON.stringify(stripeList)}`)
          res.status(200).json(stripeList)
        } catch (e) {
          stripeapiutil.errorHandling(e, res)
        }
      } else if (option === 'setup_intent') {
        try {
          const stripeList = await stripe.setupIntents.retrieve(input_id)
          console.log(`[retrieve] stripe.setupIntents.retrieve = ${JSON.stringify(stripeList)}`)
          res.status(200).json(stripeList)
        } catch (e) {
          stripeapiutil.errorHandling(e, res)
          if (e instanceof Error) {
            console.log(`[retrieve] Error occured. ${e.name}: ${e.message}}`)
          } else {
            console.log(`[retrieve] Unexpected error. ${e}}`)
          }
        }
      } else if (option === 'subscription_item') {
        try {
          const stripeList = await stripe.subscriptionItems.retrieve(input_id)
          console.log(`[retrieve] stripe.subscriptionItems.retrieve = ${JSON.stringify(stripeList)}`)
          res.status(200).json(stripeList)
        } catch (e) {
          stripeapiutil.errorHandling(e, res)
          if (e instanceof Error) {
            console.log(`[retrieve] Error occured. ${e.name}: ${e.message}}`)
          } else {
            console.log(`[retrieve] Unexpected error. ${e}}`)
          }
        }
      } else if (option === 'subscription_schedules') {
        try {
          const stripeList = await stripe.subscriptionSchedules.retrieve(input_id)
          console.log(`[retrieve] stripe..subscriptionSchedules.retrieve = ${JSON.stringify(stripeList)}`)
          res.status(200).json(stripeList)
        } catch (e) {
          stripeapiutil.errorHandling(e, res)
          if (e instanceof Error) {
            console.log(`[retrieve] Error occured. ${e.name}: ${e.message}}`)
          } else {
            console.log(`[retrieve] Unexpected error. ${e}}`)
          }
        }

      } else {
        res.status(400).json({feed: {title: 'Invalid parameter.'}})
      }

    } else {
      res.status(400).json({feed: {title: 'Invalid parameter.'}})
    }

  } else {
    console.log(`[product_price] invalid method: ${req.method}`)
    res.status(405)
  }
}

export default handler
