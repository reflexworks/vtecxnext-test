import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import * as browserutil from 'utils/browserutil'

const Header = ({title} : {title:string}) => {
  return <h1>{title ? title : 'Default title'}</h1>
}

const HomePage = () => {

  const router = useRouter()
  const [isLoggedIn, setLoggedIn] = useState('')

  useEffect(() => {
    if (router.isReady) {
      getLoggedIn()
    }
  }, [router])

  const getLoggedIn = async () => {
    console.log('[getLoggedIn] start.')

    const method = 'GET'
    const apiAction = 'isloggedin'
    const data = await browserutil.requestApi(method, apiAction, '')
    let result = 'false'
    if (data) {
      if ('feed' in data && 'title' in data.feed) {
        result = data.feed.title
        console.log(`[getLoggedIn] isLoggedIn=${result}`)
      }
    } else {
      console.log(`[getLoggedIn] data is null.`)
    }
    setLoggedIn(result)
  }

  return (
    <div>
      <Header title="vtecxnext テスト メニュー" />
      <label>【useEffect】 is logged in: {isLoggedIn}</label>
      <br/>
      <br/>
      <Link href='/vtecx_login'>vtecxnext ログイン</Link>
      <br/>
      <Link href='/vtecx_test'>vtecxnext テスト</Link>
      <br/>
      <Link href='/stripe/payment'>カード決済 テスト （決済とカード登録を同時に行う）</Link>
      <br/>
      <Link href='/stripe/checkout'>カード決済 テスト （カード登録を行った後、決済を行う）</Link>
      <br/>
      <Link href='/stripe/subscription'>サブスクリプション テスト （決済とカード登録を同時に行う）</Link>
      <br/>
      <Link href='/stripe/checkout_subscription'>サブスクリプション テスト （カード登録を行った後、決済を行う）</Link>

    </div>
  )
}

export default HomePage
