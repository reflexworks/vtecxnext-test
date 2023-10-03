'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import * as browserutil from 'utils/browserutil'

const Header = ({title} : {title:string}) => {
  return <h1>{title ? title : 'Default title'}</h1>
}

/**
 * ページ関数
 * @returns HTML
 */
const HomePage = () => {

  const [result, setResult] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const code:string = searchParams.get('code') ?? ''
  const state:string = searchParams.get('state') ?? ''

  const callback = async (code:string, state:string, reCaptchaToken?:string) => {
    console.log('[callback] start.')
    const method = 'GET'
    const apiAction = 'loginline_callback'
    const param = `state=${state}&code=${code}` + (reCaptchaToken ? `&g-recaptcha-token=${reCaptchaToken}` : '')
    const data = await browserutil.requestApi(method, apiAction, param)
    let retStr = ''
    if ('feed' in data) {
      retStr = data.feed.title
    } else {
      return 'no feed'
    }
    if (retStr === 'Logged in.') {
      // ソーシャルログイン成功。リダイレクト
      router.replace('/vtecx_menu')
    } else {
      setResult(retStr)
    }
  }

  useEffect(() => {
    console.log(`[useEffect] state=${state} code=${code}`)
    callback(browserutil.toString(code), browserutil.toString(state))
  }, [])

  return (
    <div>
      <Header title="ソーシャルログイン リダイレクト画面" />
      <p>{result}</p>
    </div>
  )
}

export default HomePage
