import type { NextApiRequest, NextApiResponse } from 'next'
import * as stripeutil from 'utils/stripeutil'
import * as stripeapiutil from 'utils/stripeapiutil'
import * as vtecxnext from '@vtecx/vtecxnext'
import * as testutil from 'utils/testutil'

const stripe = stripeutil.getStripe()

// テスト画面用
const handler = async (req:NextApiRequest, res:NextApiResponse) => {
  console.log(`[customer] start. `)
  // X-Requested-With ヘッダチェック
  if (!vtecxnext.checkXRequestedWith(req, res)) {
    return
  }
  // UID取得
  let uid:string
  try {
    uid = await vtecxnext.uid(req, res)
    if (!uid) {
      res.status(403).json({'feed': {'title': 'Permission denied.'}})
      res.end()
      return
    }
  } catch (e) {
    stripeapiutil.errorHandling(e, res)
    return 
  }
  console.log(`[customer] uid=${uid}`)

  if (req.method === 'GET') {
    // Stripe顧客情報の取得
    const customer_id:string = testutil.getParam(req, 'customer_id')
    try {
      const stripeCustomer = await stripe.customers.retrieve(customer_id)
      console.log(`[customer] stripe.customers.retrieve = ${JSON.stringify(stripeCustomer)}`)
      res.status(200).json(stripeCustomer)
    } catch (e) {
      stripeapiutil.errorHandling(e, res)
    }

  } else if (req.method === 'POST') {
    // Stripe顧客情報の登録
    try {
      // nameにuidをセットしているのはテスト用
      const stripeCustomer = await stripe.customers.create({'name' : uid})
      console.log(`[customer] stripe.customers.create = ${JSON.stringify(stripeCustomer)}`)
      res.status(200).json(stripeCustomer)
    } catch (e) {
      stripeapiutil.errorHandling(e, res)
    }

  } else {
    console.log(`[customer] invalid method: ${req.method}`)
    res.status(405)
  }
}

export default handler

/**
 * customer_idの取得.
 * vte.cxから参照。登録がない場合、createIfAbsent=trueであればStripeに生成。
 * @param req リクエスト
 * @param res レスポンス
 * @param createIfAbsent vte.cxに登録がない場合、Stripeに顧客登録を行い、その顧客をvte.cxに登録する。
 * @returns customer_id
 */
export const getCustomerId = async (req:NextApiRequest, res:NextApiResponse, createIfAbsent?:boolean):Promise<string> => {
  // TODO vte.cxに登録されたcustomer_idを取得。以下サンプル。
  const uid = await vtecxnext.uid(req, res)
  console.log(`[getCustomerId] start. uid=${uid} createIfAbsent=${String(createIfAbsent)}`)
  const stripeUri = `/_user/${uid}/stripe`
  const data = await vtecxnext.getEntry(req, res, stripeUri)
  let stripeEntry:any
  if (data) {
    if ('feed' in data) {
      // strictモード
      stripeEntry = data.feed.entry[0]
    } else {
      // Entry
      stripeEntry = data
    }
  }
  //console.log(`[getCustomerId] getEntry:${stripeUri} = ${JSON.stringify(stripeEntry)}`)
  let customerId:string = ''
  if (stripeEntry) {
    // vte.cxに登録済み
    customerId = stripeEntry.title
    console.log(`[getCustomerId] stripeEntry exists.`)
  } else if (createIfAbsent) {
    // Stripe顧客情報の登録
    console.log(`[getCustomerId] !stripeEntry`)
    // nameにuidをセットしているのはテスト用
    // Stripeへ顧客登録
    // TODO email は要登録。無いとカード登録画面で入力を求められる。
    const stripeCustomer = await stripe.customers.create({'name' : uid})
    //console.log(`[getCustomerId] stripe.customers.create = ${JSON.stringify(stripeCustomer)}`)
    console.log(`[getCustomerId] stripe.customers.create succeeded.`)
    if (stripeCustomer) {
      customerId = stripeCustomer.id
      // Stripeの顧客idをvte.cxに登録
      let tmpStripeEntry = {
        link: [{___rel: 'self', ___href: stripeUri}],
        title: customerId
      }
      try {
        await vtecxnext.post(req, res, tmpStripeEntry)
      } catch (e) {
        if (e instanceof vtecxnext.VtecxNextError && e.status === 409) {
          console.log(`[getCustomerId] vtecxnext.post(${stripeUri}) Error occured. ${e.status}: ${e.message}`)
          tmpStripeEntry = await vtecxnext.getEntry(req, res, stripeUri)
          if (tmpStripeEntry && tmpStripeEntry.title) {
            // Stripe顧客情報登録済み。顧客idを取得。
            customerId = tmpStripeEntry.title
          } else {
            // Stripeから取得した顧客idをvte.cxへ上書き。
            if (!tmpStripeEntry) {
              tmpStripeEntry = {
                link: [{___rel: 'self', ___href: stripeUri}],
                title: customerId
              }
            } else {
              tmpStripeEntry.title = customerId
            }
          }
          await vtecxnext.put(req, res, tmpStripeEntry)
        }
      }
    }

  } else {
    // Do nothing.
  }
  console.log(`[getCustomerId] end. customerId=${customerId}`)
  return customerId
}
