'use client'

import Link from 'next/link'
import { Props, useApi as isSignup } from './useapi'

const Header = ({title} : {title:string}) => {
  return <h1>{title ? title : 'Default title'}</h1>
}

/**
 * ページ関数
 * @returns HTML
 */
 const HomePage = () => {
  const props:Props = isSignup()

  return (
    <div>
      <Header title="ユーザ登録　結果画面" />
      <label>【useEffect】 result: {props.message}</label>
      <br/>
      <br/>
      <Link href="/vtecx_test">汎用APIテスト</Link>
    </div>
  );
}

export default HomePage
