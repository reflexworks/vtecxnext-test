import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import * as stripeutil from 'utils/stripeutil'
import * as stripeapiutil from 'utils/stripeapiutil'
import * as vtecxnext from '@vtecx/vtecxnext'
import * as testutil from 'utils/testutil'

const stripe = stripeutil.getStripe()

const handler = async (req:NextApiRequest, res:NextApiResponse) => {
  console.log(`[product_price] start. `)
  // X-Requested-With ヘッダチェック
  if (!vtecxnext.checkXRequestedWith(req, res)) {
    return
  }
  // TODO サービス管理者チェック

  const product_id:string = testutil.getParam(req, 'product_id')
  const price_id:string = testutil.getParam(req, 'price_id')
  const product_name:string = testutil.getParam(req, 'product_name')
  const price:number|undefined = testutil.getParamNumber(req, 'price')
  const tmpInterval:string = testutil.getParam(req, 'interval') ?? 'week'
  const interval = tmpInterval as Stripe.PriceCreateParams.Recurring.Interval
  const list:string = testutil.getParam(req, 'list')
  console.log(`[product_price] product_id=${product_id} price_id=${price_id} product_name=${product_name} price=${price} interval=${interval} list=${list}`)

  if (req.method === 'GET') {
    if (price_id) {
      // Stripe価格情報の取得
      try {
        const stripePrice = await stripe.prices.retrieve(price_id)
        console.log(`[product_price] stripe.prices.retrieve = ${JSON.stringify(stripePrice)}`)
        res.status(200).json(stripePrice)
      } catch (e) {
        stripeapiutil.errorHandling(e, res)
      }
    } else if (product_id) {
      // Stripe商品情報の取得
      try {
        const stripeProduct = await stripe.products.retrieve(product_id)
        console.log(`[product_price] stripe.products.retrieve = ${JSON.stringify(stripeProduct)}`)
        res.status(200).json(stripeProduct)
      } catch (e) {
        stripeapiutil.errorHandling(e, res)
      }
    } else if (list === 'product') {
      // Stripe商品情報リスト
      try {
        const stripeProduct = await stripe.products.list()  // default limit = 10
        console.log(`[product_price] stripe.products.list = ${JSON.stringify(stripeProduct)}`)
        res.status(200).json(stripeProduct)
      } catch (e) {
        stripeapiutil.errorHandling(e, res)
      }
    } else if (list === 'price') {
      // Stripe価格リスト
      try {
        const stripeProduct = await stripe.prices.list()  // default limit = 10
        console.log(`[product_price] stripe.prices.list = ${JSON.stringify(stripeProduct)}`)
        res.status(200).json(stripeProduct)
      } catch (e) {
        stripeapiutil.errorHandling(e, res)
      }
    } else {
      res.status(400).json({feed: {title: 'Invalid parameter.'}})
    }

  } else if (req.method === 'POST') {
    // Stripe商品情報の登録
    try {
      let createProduct_id
      if (!product_id) {
        // まず商品を登録
        const stripeProduct = await stripe.products.create({'name' : product_name})
        console.log(`[product_price] stripe.products.create = ${JSON.stringify(stripeProduct)}`)
        createProduct_id = stripeProduct.id
      } else {
        createProduct_id = product_id
      }

      // 商品価格を登録
      const stripePrice = await stripe.prices.create({
        currency : 'jpy',
        product : createProduct_id,
        unit_amount : price,
        recurring : {interval: interval},
      })
      console.log(`[product_price] stripe.prices.create = ${JSON.stringify(stripePrice)}`)
      res.status(200).json(stripePrice)
    } catch (e) {
      stripeapiutil.errorHandling(e, res)
    }

  } else {
    console.log(`[product_price] invalid method: ${req.method}`)
    res.status(405)
  }
}

export default handler
