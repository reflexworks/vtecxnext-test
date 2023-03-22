import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from "react"
import Stripe from 'stripe'
import * as testutil from 'utils/testutil'
import * as stripeutil from 'utils/stripeutil'

const HomePage = () => {
  const router = useRouter()
  const [amount, setAmount] = useState<string>('')
  const [interval, setInterval] = useState<string>('')
  const [item, setItem] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<Stripe.PaymentMethod>()
  const [isLoading, setIsLoading] = useState(true)

  const requestRetrievePaymentMethod = async ():Promise<Stripe.PaymentMethod[]> => {
    console.log(`[checkout_subscription][requestRetrievePaymentMethod] start.`)
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
      console.log(`[checkout_subscription][requestRetrievePaymentMethod] errMsg = ${errMsg}`)
      throw `payment-methodでFetchエラー : ${errMsg}`
    }
    if (!res.ok) {
      throw `payment-methodでエラー : ${res.status}`
    }
    if (res.status === 200) {
      const data = await res.json()
      console.log(`[checkout_subscription][requestRetrievePaymentMethod] data = ${JSON.stringify(data)}`)
      return data
    } else {
      return []
    }
  }

  // 表示用にAmountのみ取得
  const requestAmount = async (item:string):Promise<any> => {
    let res:Response
    try {
      res = await fetch(`/api/stripe/create-subscription?item=${item}`, {
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
      console.log(`[checkout_subscription][requestAmount] errMsg = ${errMsg}`)
      throw `payment-intentでFetchエラー : ${errMsg}`
    }
    if (!res.ok) {
      throw `payment-intentでエラー : ${res.status}`
    }
    const data = await res.json()
    console.log(`[checkout_subscription][requestAmount] data = ${JSON.stringify(data)}`)
    return data
  }

  const requestCreateSubscription = async (item:string, paymentMethodId:string,
    startTimestamp:number):Promise<any> => {
    let res:Response
    try {
      // subscription作成から請求・支払いまで一気に行う。
      res = await fetch('/api/stripe/create-subscription', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest' 
        },
        body: JSON.stringify({ 
          item: item,
          paymentMethodId: paymentMethodId,
          startTimestamp: startTimestamp,
        })
      })
    } catch (e) {
      let errMsg:string
      if (e instanceof Error) {
        errMsg = `FetchError: ${e.message}`
      } else {
        errMsg = `Unexpected error.`
      }
      console.log(`[checkout_subscription][requestCreateSubscription] errMsg = ${errMsg}`)
      throw `subscriptionでFetchエラー : ${errMsg}`
    }
    if (!res.ok) {
      let failedMsg:string = ''
      try {
        const data = await res.json()
        failedMsg = data.feed.title
      } catch (e) {
        // Do nothing.
      }
      console.log(`[checkout_subscription][requestCreateSubscription] !res.ok status=${res.status} ${failedMsg}`)
      throw `subscriptionでエラー : ${res.status} ${failedMsg}`
    }
    const data = await res.json()
    console.log(`[checkout_subscription][requestCreateSubscription] data = ${JSON.stringify(data)}`)
    //setAmount(testutil.toString(data.amount))
    return data
  }

  useEffect(() => {
    if (router.isReady) {
      const item = testutil.toString(router.query.item)
      console.log(`[checkout_subscription][useEffect] item=${item}`);

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
        let intervalStr:string
        if (amountData.interval === 'week') {
          intervalStr = '週'
        } else if (amountData.interval === 'day') {
          intervalStr = '日'
        } else if (amountData.interval === 'month') {
          intervalStr = '月'
        } else if (amountData.interval === 'year') {
          intervalStr = '年'
        } else {
          intervalStr = ''
        }
        setInterval(intervalStr)
        setItem(item)
        setIsLoading(false)
  
      })()


    } else {
      console.log(`[checkout_subscription][useEffect] router is not ready.`)
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
          action: '/stripe/checkout_subscription',
        })
      })
    } catch (e) {
      let errMsg:string
      if (e instanceof Error) {
        errMsg = `FetchError: ${e.message}`
      } else {
        errMsg = `Unexpected error.`
      }
      console.log(`[checkout_subscription][handleClickCard] errMsg = ${errMsg}`)
      throw `checkout-sessionでFetchエラー : ${errMsg}`
    }
    if (!res.ok) {
      throw `checkout-sessionでエラー : ${res.status}`
    }
    const data = await res.json()
    console.log(`[checkout_subscription][handleClickCard] data = ${JSON.stringify(data)}`)
    router.push(data.checkout_url)
  }

  const handleClickPay = async () => {
    console.log(`[checkout_subscription][handleClickPay] start. startDate=${startDate}`)
    // UTCフォーマット
    const startTimestamp = stripeutil.getTimestamp(startDate)
    
    console.log(`[checkout_subscription][handleClickPay] startTimestamp=${startTimestamp}`)

    setIsLoading(true)
    // 前回のカードを使った支払い
    if (!paymentMethod) {
      console.log(`[checkout_subscription][handleClickPay] カード情報なし`)
      return
    }
    const data = await requestCreateSubscription(item, paymentMethod.id, startTimestamp)
    // リダイレクト
    router.replace(`/stripe/complete?payment_intent=${data.payment_intent}&payment_intent_client_secret=${data.clientSecret}&redirect_status=succeeded_use_last_card`)
  }

  console.log(`[checkout_subscription] isLoading=${isLoading}`);

  const AmountTag = () => {
    return (
      <>
        <h1>決済内容</h1>
        <div>{amount}<small>円 / {interval}</small></div>
        &nbsp;&nbsp;
        <label>請求開始日: </label>
        <input type="datetime-local" value={startDate} 
          onChange={(event) => setStartDate(event.target.value)}/>
        <label>（指定がなければ即時請求）</label>
        <br/>
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
          <title>Stripe サブスクリプションテスト</title>
        </Head>
        <div>Stripe サブスクリプションテスト</div>
        <AmountTag />
        <UsedCardTag />
        <button disabled={isLoading} onClick={handleClickPay}>
          <span>Subscription</span>
        </button>
      </div>
    </main>
  )
}

export default HomePage
