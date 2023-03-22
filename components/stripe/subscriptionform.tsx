import { useState, useEffect } from "react";
import { PaymentElement, useStripe, useElements} from "@stripe/react-stripe-js";
import * as testutil from 'utils/testutil'
import * as stripeutil from 'utils/stripeutil'

type SubscriptionFormProps = {
  subscriptionId: string | string[],
  amount: string | string[],
}

const REDIRECT_PATHINFO = '/stripe/complete'

const SubscriptionForm = (props: SubscriptionFormProps) => {
  console.log(`[SubscriptionForm] start.`)

  const stripe = useStripe()
  const elements = useElements()

  const [message, setMessage] = useState<string | undefined | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [displayStripeForm, setDisplayStripeForm] = useState(true)
  const [subscriptionId, setSubscriptionId] = useState('')
  const [amount, setAmount] = useState('')

  const displayForm = async () => {
    console.log(`[SubscriptionForm][displayForm] start.`)
    setDisplayStripeForm(false)
  }

  useEffect(() => {
    console.log(`[SubscriptionForm][useEffect] start.`)

    if (!stripe) {
      console.log(`[SubscriptionForm][useEffect] return by !stripe`)
      return
    }

    const tmpSubscriptionId = testutil.toString(props.subscriptionId)
    const tmpAmount = testutil.toString(props.amount)
    console.log(`[SubscriptionForm] tmpSubscriptionId=${tmpSubscriptionId} `)
    setSubscriptionId(tmpSubscriptionId)
    setAmount(tmpAmount)

  }, [stripe])

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    console.log(`[SubscriptionForm][handleSubmit] start.`)
    e.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      console.log(`[SubscriptionForm][handleSubmit] return by !stripe || !elements`)
      return
    }

    setIsLoading(true)

    // TODO ここでpayment_intentをユーザに紐付けてvte.cxに登録すると良さそう。
    console.log(`[SubscriptionForm][handleSubmit] stripe.confirmPayment start. subscriptionId=${subscriptionId}`)

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

  console.log(`[SubscriptionForm] before return. displayStripeForm=${displayStripeForm} stripe is null=${stripe == null || stripe == undefined}`)

  // PaymentElement の options に「国」表示をしないよう指定
  return (
    <>
      {displayStripeForm && 
        <div>表示準備中...</div>
      }
      {stripe &&
      <form onSubmit={handleSubmit}>
          <h1>決済内容</h1>
            <div>{amount}<small>円 / 週</small></div>
          <PaymentElement
            options={stripeutil.PAYMENT_ELEMENT_OPTIONS}
            onReady={() => {displayForm()}}
          />
          <button disabled={isLoading || !stripe || !elements}>
            <span>Subscription</span>
          </button>
          {/* Show any error or success messages */}
          {message && <div>{message}</div>}
      </form>
      }
    </>
  )
}

export default SubscriptionForm
