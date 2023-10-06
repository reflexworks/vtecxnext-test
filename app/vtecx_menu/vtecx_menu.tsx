'use client'

import Link from 'next/link'

const Header = ({title} : {title:string}) => {
  return <h1>{title ? title : 'Default title'}</h1>
}

const HomePage = () => {
  return (
    <div>
      <Header title="vtecxnext テスト メニュー (develop)" />
      <br/>
      <Link href='/vtecx_login'>vtecxnext ログイン</Link> (vtecx_login)
      <br/>
      <Link href='/vtecx_test'>vtecxnext テスト</Link> (vtecx_test)
      <br/>
      <Link href='/vtecx_signup'>ユーザ登録</Link> (vtecx_signup)
      <br/>
      <Link href='/vtecx_passreset'>パスワード変更</Link> (vtecx_passreset)
      <br/>
      <Link href='/vtecx_viewpdf'>PDF表示テスト</Link> (vtecx_viewpdf)
      <br/>
      <Link href='/vtecx_sociallogin_menu'>ソーシャルログイン メニュー</Link> (vtecx_sociallogin_menu)
      <br/>
      <Link href='/vtecx_fcm'>FCM テスト</Link> (vtecx_fcm)
      <br/>

    </div>
  )
}

export default HomePage
