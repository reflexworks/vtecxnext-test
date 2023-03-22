import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from "react"
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { getPublicKey } from 'utils/stripeutil'
import * as testutil from 'utils/testutil'
import SubscriptionForm from 'components/stripe/subscriptionform'

const stripePromise = loadStripe(getPublicKey())

const HomePage = () => {
  const router = useRouter()
  const [options, setOptions] = useState<StripeElementsOptions|undefined>(undefined)
  const [subscriptionId, setSubscriptionId] = useState<string>('')
  const [amount, setAmount] = useState<string>('')

  useEffect(() => {
    if (router.isReady) {
      const item = testutil.toString(router.query.item)
      console.log(`[subscription][useEffect] item=${item}`);

      (async () => {
        let res:Response
        try {
          res = await fetch('/api/stripe/create-subscription', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest' 
            },
            body: JSON.stringify({ item: item })
          })
        } catch (e) {
          let errMsg:string
          if (e instanceof Error) {
            errMsg = `FetchError: ${e.message}`
          } else {
            errMsg = `Unexpected error.`
          }
          console.log(`[subscription] errMsg = ${errMsg}`)
          throw `create-subscriptionでFetchエラー : ${errMsg}`
        }
      
        if (!res.ok) {
          throw `create-subscriptionでエラー : ${res.status}`
        }
        const data = await res.json()
        console.log(`[subscription][useEffect] data = ${JSON.stringify(data)}`)
        setOptions({clientSecret : data.clientSecret})
        setSubscriptionId(testutil.toString(data.subscriptionId))
        setAmount(testutil.toString(data.amount))
      })()
    } else {
      console.log(`[subscription][useEffect] router is not ready.`)
    }
  }, [router])

  console.log(`[subscription] subscriptionId=${subscriptionId} option判定=${options ? 'true' : 'false'} options=${JSON.stringify(options)}`);

  return (
    <main>
      <div>
        <Head>
          <title>Stripe サブスクリプションテスト</title>
        </Head>
        <div>Stripe サブスクリプションテスト</div>
        {options && (
          <Elements stripe={stripePromise} options={options}>
            <SubscriptionForm subscriptionId={subscriptionId} amount={amount} />
          </Elements>
        )}
      </div>
    </main>
  )
}

export default HomePage
