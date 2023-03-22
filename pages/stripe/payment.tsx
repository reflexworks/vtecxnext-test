import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from "react"
import Stripe from 'stripe'
//import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js"
import { loadStripe, StripeElementsOptionsClientSecret } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { getPublicKey } from 'utils/stripeutil'
import * as testutil from 'utils/testutil'
import PaymentForm from 'components/stripe/paymentform'

const stripePromise = loadStripe(getPublicKey())

const HomePage = () => {
  const router = useRouter()
  const [options, setOptions] = useState<StripeElementsOptionsClientSecret|undefined>(undefined)
  const [paymentIntentId, setPaymentIntentId] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [item, setItem] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<Stripe.PaymentMethod>()
  const [isLastUsedCard, setLastUsedCard] = useState<boolean>(false)
  const [createdPaymentIntent, setCreatedPaymentIntent] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(true)
  const [useNewCard, setUseNewCard] = useState<boolean>(false)

  const requestRetrievePaymentMethod = async ():Promise<Stripe.PaymentMethod[]> => {
    console.log(`[payment][requestRetrievePaymentMethod] start.`)
    let res:Response
    try {
      res = await fetch('/api/stripe/payment-method', {
        method: 'GET',
        headers: { 
          'X-Requested-With': 'XMLHttpRequest' 
        }
      })
    } catch (e) {
      let errMsg:string
      if (e instanceof Error) {
        errMsg = `FetchError: ${e.message}`
      } else {
        errMsg = `Unexpected error.`
      }
      console.log(`[payment][requestRetrievePaymentMethod] errMsg = ${errMsg}`)
      throw `payment-methodでFetchエラー : ${errMsg}`
    }
    if (!res.ok) {
      throw `payment-methodでエラー : ${res.status}`
    }
    const data = await res.json()
    console.log(`[payment][requestRetrievePaymentMethod] data = ${JSON.stringify(data)}`)
    return data
  }

  // 表示用にAmountのみ取得
  const requestAmount = async (item:string):Promise<any> => {
    let res:Response
    try {
      res = await fetch(`/api/stripe/create-payment-intent?item=${item}`, {
        method: 'GET',
        headers: { 
          'X-Requested-With': 'XMLHttpRequest' 
        },
      })
    } catch (e) {
      let errMsg:string
      if (e instanceof Error) {
        errMsg = `FetchError: ${e.message}`
      } else {
        errMsg = `Unexpected error.`
      }
      console.log(`[payment][requestAmount] errMsg = ${errMsg}`)
      throw `payment-intentでFetchエラー : ${errMsg}`
    }
    if (!res.ok) {
      throw `payment-intentでエラー : ${res.status}`
    }
    const data = await res.json()
    console.log(`[payment][requestAmount] data = ${JSON.stringify(data)}`)
    return data
  }

  const requestCreatePaymentIntent = async (item:string, paymentMethodId?:string):Promise<any> => {
    let res:Response
    try {
      res = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest' 
        },
        body: JSON.stringify({ 
          item: item,
          paymentMethodId: paymentMethodId,
        })
      })
    } catch (e) {
      let errMsg:string
      if (e instanceof Error) {
        errMsg = `FetchError: ${e.message}`
      } else {
        errMsg = `Unexpected error.`
      }
      console.log(`[payment][requestCreatePaymentIntent] errMsg = ${errMsg}`)
      throw `payment-intentでFetchエラー : ${errMsg}`
    }
    if (!res.ok) {
      throw `payment-intentでエラー : ${res.status}`
    }
    const data = await res.json()
    console.log(`[payment][requestCreatePaymentIntent] data = ${JSON.stringify(data)}`)
    setOptions({clientSecret : data.clientSecret})
    setPaymentIntentId(testutil.toString(data.payment_intent))
    setAmount(testutil.toString(data.amount))
    return data
  }

  useEffect(() => {
    if (router.isReady && !createdPaymentIntent) {
      const item = testutil.toString(router.query.item)
      console.log(`[payment][useEffect] item=${item}`);

      (async () => {
        // まずpayment_methodを取得
        const paymentMethodArray = await requestRetrievePaymentMethod()
        if (paymentMethodArray && paymentMethodArray.length > 0) {
          // 前回のカード情報あり
          const paymentMethod = paymentMethodArray[0]
          setPaymentMethod(paymentMethod)
          setLastUsedCard(true)
          // 表示用に価格を取得
          const amountData = await requestAmount(item)
          setAmount(testutil.toString(amountData.amount))

        } else {
          // ない場合、カード入力フォームの表示が必要。payment_intentを生成する。
          const data = await requestCreatePaymentIntent(item, undefined)
          console.log(`[payment][useEffect] data = ${JSON.stringify(data)}`)
          //setData(data)
        }

        setItem(item)
        setCreatedPaymentIntent(true)  // create-payment-intentを複数回実行しないようにする。
        setIsLoading(false)
  
      })()


    } else {
      console.log(`[payment][useEffect] router is not ready.`)
    }
  }, [router, createdPaymentIntent])


  const handleClickPay = async () => {
    console.log(`[handleClick start]`)
    setIsLoading(true)
    // 前回のカードを使った支払い
    const data = await requestCreatePaymentIntent(item, paymentMethod?.id)
    // リダイレクト
    router.replace(`/stripe/complete?payment_intent=${data.payment_intent}&payment_intent_client_secret=${data.clientSecret}&redirect_status=succeeded_use_last_card`)
  }

  const handleChangeOtherCard = async (event:any) => {
    console.log(`[payment][handleChangeOtherCard] start.`)
    setIsLoading(true)
    const checked = event.target.checked
    setUseNewCard(checked)
    if (checked) {
      // カード入力フォームを表示
      console.log('カード入力フォームを表示')
      if (!options) {
        // payment-intentを生成
        const data = await requestCreatePaymentIntent(item, undefined)
      }
    } else {
      // カード入力フォームを非表示
      console.log('カード入力フォームを非表示')
    }
    console.log(`[payment][handleChangeOtherCard] end.`)
    setIsLoading(false)
  }

  console.log(`[payment] option判定=${options ? 'true' : 'false'} options=${JSON.stringify(options)} isLoading=${isLoading}`);

  const UsedCardTag = () => {
    return (
      <>
        <h1>決済内容</h1>
        <div>{amount}<small>円</small></div><br/>
        <div>{paymentMethod?.card?.brand} - **** {paymentMethod?.card?.last4} ({paymentMethod?.card?.exp_month}/{paymentMethod?.card?.exp_year})</div>
        <input type="checkbox" disabled={isLoading} checked={useNewCard} onChange={handleChangeOtherCard} /><label>別のカードを使用する</label>
        <br/>
      </>
    )
  }

  const PaymentTag = () => {
    if (isLastUsedCard) {
      if (useNewCard && options) {
        return (
          <>
            <UsedCardTag />
            <Elements stripe={stripePromise} options={options}>
              <PaymentForm 
                amount={amount} 
                payment_intent={paymentIntentId} 
                displayAmount='false'
              />
            </Elements>
          </>
        )
      } else {
        return (
          <>
            <UsedCardTag />
            <button disabled={isLoading} onClick={handleClickPay}>
              <span>{`${amount}円 支払う`}</span>
            </button>
          </>
        )
      }

    } else if (options) {
      // 新規ユーザ
      return (
        <Elements stripe={stripePromise} options={options}>
          <PaymentForm 
            amount={amount} 
            payment_intent={paymentIntentId} 
            displayAmount='true'
          />
        </Elements>
      )

    } else {
      return <></>
    }
  }

  return (
    <main>
      <div>
        <Head>
          <title>Stripeテスト</title>
        </Head>
        <div>Stripeテスト</div>
        <PaymentTag />
      </div>
    </main>
  )
}

export default HomePage
