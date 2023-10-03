'use client'

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3"

export const Providers = ({children}:any) => {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_KEY ?? ''
  return (
    <GoogleReCaptchaProvider reCaptchaKey={siteKey}>
      {children}
    </GoogleReCaptchaProvider>
  )
}
