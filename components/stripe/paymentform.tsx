import { useState, useEffect } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import * as testutil from 'utils/testutil'
import * as stripeutil from 'utils/stripeutil'

type PaymentFormProps = {
  payment_intent: string | string[],
  amount: string | string[],
  displayAmount: string | string[],
  //card_brand: string | string[],
  //card_last4: string | string[],
  //card_exp_month: string | string[],
  //card_exp_year: string | string[],
}

/*
type Card = {
  brand: string,
  last4: string,
  exp_month: string,
  exp_year: string,
}
*/

const REDIRECT_PATHINFO = '/stripe/complete'

const PaymentForm = (props: PaymentFormProps) => {
  console.log(`[PaymentForm] start.`)

  const stripe = useStripe()
  const elements = useElements()

  const [message, setMessage] = useState<string | undefined | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [displayStripeForm, setDisplayStripeForm] = useState(true)
  const [amount, setAmount] = useState('')
  const [displayAmount, setDisplayAmount] = useState(true)
  const [paymentIntentId, setPaymentIntentId] = useState('')
  //const [card, setCard] = useState<Card|null>(null)
  //const [isLastUsedCard, setLastUsedCard] = useState<boolean>(false)

  const displayForm = async () => {
    console.log(`[PaymentForm][displayForm] start.`)
    setDisplayStripeForm(false)
  }

  useEffect(() => {
    console.log(`[PaymentForm][useEffect] start.`)

    if (!stripe) {
      console.log(`[PaymentForm][useEffect] return by !stripe`)
      return
    }

    const tmpPaymentIntentId = testutil.toString(props.payment_intent)
    const tmpAmount = testutil.toString(props.amount)
    const tmpDisplayAmount = testutil.toBoolean(testutil.toString(props.displayAmount))
    //const tmpCardBrand = testutil.toString(props.card_brand)
    //const tmpCardLast4 = testutil.toString(props.card_last4)
    //const tmpCardExpMonth = testutil.toString(props.card_exp_month)
    //const tmpCardExpYear = testutil.toString(props.card_exp_year)
    //console.log(`[PaymentForm] tmpAmount=${tmpAmount} tmpPayment_intent=${tmpPayment_intent} tmpCard=${tmpCardBrand} **** ${tmpCardLast4} ${tmpCardExpMonth} / ${tmpCardExpYear}`)
    console.log(`[PaymentForm] tmpAmount=${tmpAmount} tmpPaymentIntentId=${tmpPaymentIntentId} tmpDisplayAmount=${tmpDisplayAmount}`)
    setPaymentIntentId(tmpPaymentIntentId)
    setAmount(tmpAmount)
    setDisplayAmount(tmpDisplayAmount)
    /*
    if (tmpCardLast4) {
      setCard({
        brand: tmpCardBrand,
        last4: tmpCardLast4,
        exp_month: tmpCardExpMonth,
        exp_year: tmpCardExpYear
      })
      setLastUsedCard(true)
    }
    */
  
  }, [stripe])

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    console.log(`[PaymentForm][handleSubmit] start.`)
    e.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      console.log(`[PaymentForm][handleSubmit] return by !stripe || !elements`)
      return
    }

    setIsLoading(true)

    // TODO ここでpayment_intentをユーザに紐付けてvte.cxに登録すると良さそう。
    console.log(`[PaymentForm][handleSubmit] stripe.confirmPayment start. paymentIntentId=${paymentIntentId}`)

    // PaymentElement で「国」表示をしない場合、ここで国情報を指定する必要あり。
    // (payment_method_data.billing_details)
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: stripeutil.getRedirectUrl(REDIRECT_PATHINFO),
        payment_method_data: {
          billing_details: stripeutil.BILLING_DETAILS
        }
      },
    })

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message)
    } else {
      setMessage('An unexpected error occured.')
    }

    setIsLoading(false)
  }

  //console.log(`[PaymentForm] before return. displayStripeForm=${displayStripeForm} stripe is null=${stripe == null || stripe == undefined} isLastUsedCard=${isLastUsedCard}`)
  console.log(`[PaymentForm] before return. displayStripeForm=${displayStripeForm} stripe is null=${stripe == null || stripe == undefined}`)

  /*
  const CardTag = () => {
    console.log(`[PaymentForm][CardTag] isLastUsedCard=${isLastUsedCard}`)
    if (isLastUsedCard) {
      return <div>{card?.brand} - **** {card?.last4} ({card?.exp_month}/{card?.exp_year})</div>
    } else {
      return <PaymentElement 
              options={stripeutil.PAYMENT_ELEMENT_OPTIONS}
              onReady={() => {displayForm()}}
            />
    }
  }
  */

  // PaymentElement の options に「国」表示をしないよう指定
  return (
    <>
      {displayStripeForm && 
        <div>表示準備中...</div>
      }
      {stripe &&
        <div>
          {displayAmount &&
          <div>
            <h1>決済内容</h1>
            <div>{amount}<small>円</small></div>
          </div>
          }
          <form onSubmit={handleSubmit}>
            <PaymentElement 
              options={stripeutil.PAYMENT_ELEMENT_OPTIONS}
              onReady={() => {displayForm()}}
            />
            <button disabled={isLoading || !stripe || !elements}>
              <span>
                {`${amount}円 支払う`}
              </span>
            </button>
            {/* Show any error or success messages */}
            {message && <div>{message}</div>}
          </form>
        </div>
      }
    </>
  )
}

export default PaymentForm
