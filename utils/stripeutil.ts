import Stripe from 'stripe'
import { StripePaymentElementOptions, PaymentMethodCreateParams } from "@stripe/stripe-js";

const STRIPE_API_VERSION = '2022-11-15'

export const getStripe = ():Stripe => {
  //console.log(`[getStripe] apiVersion=${STRIPE_API_VERSION} secretKey=${getSecretKey()}`)
  return new Stripe(getSecretKey(), {
    apiVersion: STRIPE_API_VERSION,
    typescript: true,
  })
}

export const getPublicKey = ():string => {
    return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''
  }
  
export const getSecretKey = ():string => {
  return process.env.STRIPE_SECRET_KEY ?? ''
}

export const getWebhookSecret = ():string => {
  return process.env.STRIPE_WEBHOOK_SECRET ?? ''
}

export const getRedirectUrl = (pathInfo:string):string => {
  return `${process.env.NEXT_PUBLIC_VTECXNEXT_URL ?? ''}${pathInfo ?? ''}`
}

export const PAYMENT_ELEMENT_OPTIONS:StripePaymentElementOptions = {
  business: {name : 'nextjs-test'},
  fields: {
    billingDetails : {
      address : {
        country : 'never'
      }
    }
  },
}

export const BILLING_DETAILS:PaymentMethodCreateParams.BillingDetails = {
  address: {
    country: "JP"
  }
}

export const getTimestamp = (inputDate:string):number => {
  const date = new Date(inputDate)
  return date.getTime() / 1000
}
