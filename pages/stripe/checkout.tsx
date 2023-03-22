import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from "react"
import Stripe from 'stripe'
import * as testutil from 'utils/testutil'

const HomePage = () => {
  const router = useRouter()
  const [amount, setAmount] = useState<string>('')
  const [item, setItem] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<Stripe.PaymentMethod>()
  const [isLoading, setIsLoading] = useState(true)

  const requestRetrievePaymentMethod = async ():Promise<Stripe.PaymentMethod[]> => {
    console.log(`[checkout][requestRetrievePaymentMethod] start.`)
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
      console.log(`[checkout][requestRetrievePaymentMethod] errMsg = ${errMsg}`)
      throw `payment-methodでFetchエラー : ${errMsg}`
    }
    if (!res.ok) {
      throw `payment-methodでエラー : ${res.status}`
    }
    const data = await res.json()
    console.log(`[checkout][requestRetrievePaymentMethod] data = ${JSON.stringify(data)}`)
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
        }
      })
    } catch (e) {
      let errMsg:string
      if (e instanceof Error) {
        errMsg = `FetchError: ${e.message}`
      } else {
        errMsg = `Unexpected error.`
      }
      console.log(`[checkout][requestAmount] errMsg = ${errMsg}`)
      throw `payment-intentでFetchエラー : ${errMsg}`
    }
    if (!res.ok) {
      throw `payment-intentでエラー : ${res.status}`
    }
    const data = await res.json()
    console.log(`[checkout][requestAmount] data = ${JSON.stringify(data)}`)
    return data
  }

  const requestCreatePaymentIntent = async (item:string, paymentMethodId:string):Promise<any> => {
    let res:Response
    try {
      // payment_intent作成から請求・支払いまで一気に行う。
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
      console.log(`[checkout][requestCreatePaymentIntent] errMsg = ${errMsg}`)
      throw `payment-intentでFetchエラー : ${errMsg}`
    }
    if (!res.ok) {
      throw `payment-intentでエラー : ${res.status}`
    }
    const data = await res.json()
    console.log(`[checkout][requestCreatePaymentIntent] data = ${JSON.stringify(data)}`)
    setAmount(testutil.toString(data.amount))
    return data
  }

  useEffect(() => {
    if (router.isReady) {
      const item = testutil.toString(router.query.item)
      console.log(`[checkout][useEffect] item=${item}`);

      (async () => {
        // まずpayment_methodを取得
        const paymentMethodArray = await requestRetrievePaymentMethod()
        if (paymentMethodArray && paymentMethodArray.length > 0) {
          // 前回のカード情報あり
          const paymentMethod = paymentMethodArray[0]
          setPaymentMethod(paymentMethod)
        }

        // 表示用に価格を取得
        const amountData = await requestAmount(item)
        setAmount(testutil.toString(amountData.amount))
        
        setItem(item)
        setIsLoading(false)
  
      })()


    } else {
      console.log(`[checkout][useEffect] router is not ready.`)
    }
  }, [router])

  const handleClickCard = async () => {
    let res:Response
    try {
      // カード入力画面を表示
      res = await fetch('/api/stripe/checkout-session', {
        method: 'POST',
        headers: { 
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: '/stripe/checkout',
        })
      })
    } catch (e) {
      let errMsg:string
      if (e instanceof Error) {
        errMsg = `FetchError: ${e.message}`
      } else {
        errMsg = `Unexpected error.`
      }
      console.log(`[checkout][handleClickCard] errMsg = ${errMsg}`)
      throw `checkout-sessionでFetchエラー : ${errMsg}`
    }
    if (!res.ok) {
      throw `checkout-sessionでエラー : ${res.status}`
    }
    const data = await res.json()
    console.log(`[checkout][handleClickCard] data = ${JSON.stringify(data)}`)
    router.push(data.checkout_url)
  }

  const handleClickPay = async () => {
    console.log(`[checkout][handleClickPay] start.`)
    setIsLoading(true)
    // 前回のカードを使った支払い
    if (!paymentMethod) {
      console.log(`[checkout][handleClickPay] カード情報なし`)
      return
    }
    const data = await requestCreatePaymentIntent(item, paymentMethod.id)
    // リダイレクト
    router.replace(`/stripe/complete?payment_intent=${data.payment_intent}&payment_intent_client_secret=${data.clientSecret}&redirect_status=succeeded_use_last_card`)
  }

  console.log(`[checkout] isLoading=${isLoading}`);

  const AmountTag = () => {
    return (
      <>
        <h1>決済内容</h1>
        <div>{amount}<small>円</small></div><br/>
        <button disabled={isLoading} onClick={handleClickCard}>
          <span>カードを登録する</span>
        </button>
        <br/>
      </>
    )
  }

  const UsedCardTag = () => {
    if (paymentMethod && paymentMethod.card) {
      return (
        <>
          <div>{paymentMethod.card.brand} - **** {paymentMethod.card.last4} ({paymentMethod.card.exp_month}/{paymentMethod.card.exp_year})</div>
          <br/>
        </>
      )
    } else {
      return <div></div>
    }
  }

  return (
    <main>
      <div>
        <Head>
          <title>Stripeテスト</title>
        </Head>
        <div>Stripeテスト</div>
        <AmountTag />
        <UsedCardTag />
        <button disabled={isLoading} onClick={handleClickPay}>
          <span>{`${amount}円 支払う`}</span>
        </button>
      </div>
    </main>
  )
}

export default HomePage
