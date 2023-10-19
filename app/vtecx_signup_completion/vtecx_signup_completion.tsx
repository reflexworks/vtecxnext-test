'use client'

import Link from 'next/link'
import { Props, useApi as isSignup } from './useapi'
import { Header } from 'components/header'

/**
 * ページ関数
 * @returns HTML
 */
 const HomePage = () => {
  const props:Props = isSignup()

  return (
    <div>
      <Header title="ユーザ登録　結果画面" />
      <p>【useEffect】 result: {props.message}</p>
      <br/>
      <Link href="/vtecx_test">汎用APIテスト</Link>
    </div>
  );
}

export default HomePage
