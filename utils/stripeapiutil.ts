import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { VtecxNextError } from '@vtecx/vtecxnext'

export const errorHandling = (e:any, res:NextApiResponse) => {
  let status:number = 500
  let message:string = 'Unexpected error.'
  if (e instanceof Stripe.errors.StripeError) {
    switch (e.type) {
      case 'StripeCardError':
        status = 400
        message = `A payment error occurred: ${e.message}`
        break
      case 'StripeInvalidRequestError':
        status = 400
        message = `An invalid request occurred: ${e.message}`
        break
      default:
        status = 400
        message = `Another problem occurred, maybe unrelated to Stripe: ${e.message}`
        break
    }
  } else if (e instanceof VtecxNextError) {
    status = e.status
    message = e.message
  }
  res.status(status).json({
    feed: {title: message}
  })
}

