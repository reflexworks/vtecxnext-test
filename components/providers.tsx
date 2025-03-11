'use client'

import { ReCaptchaProvider } from 'next-recaptcha-v3'

export const Providers = ({children}:any) => {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_KEY ?? ''
  return (
    <ReCaptchaProvider reCaptchaKey={siteKey} useEnterprise>
      {children}
    </ReCaptchaProvider>
  )
}
