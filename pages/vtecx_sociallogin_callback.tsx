import { useState } from 'react'
import { useRouter } from 'next/router'
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
  const query = router.query
  
  /*
  useEffect(() => {
    if (router.isReady) {
      console.log(`[HomePage] state=${query.state} code=${query.code}`)
    }
  },[query, router])
  */
  useEffect(() => {
    if (router.isReady) {
      console.log(`[useEffect] state=${query.state} code=${query.code}`)
      callback(browserutil.toString(query.code), browserutil.toString(query.state))
    }
  }, [query, router])

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
  return (
    <div>
      <Header title="ソーシャルログイン リダイレクト画面" />
      <p>{result}</p>
    </div>
  )
}

export default HomePage
