import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Link from 'next/link'
import * as vtecxnext from '@vtecx/vtecxnext'  // getServerSideProps で使用

const Header = ({title} : {title:string}) => {
  return <h1>{title ? title : 'Default title'}</h1>
}

const HomePage = (props:Props) => {
  return (
    <div>
      <Header title="vtecxnext テスト メニュー" />
      <label>【getServerSideProps】 is logged in: {props.isLoggedin}</label>
      <br/>
      <br/>
      <Link href='/vtecx_login'>vtecxnext ログイン</Link> (vtecx_login)
      <br/>
      <Link href='/vtecx_test'>vtecxnext テスト</Link> (vtecx_test)
      <br/>
      <Link href='/vtecx_signup'>ユーザ登録</Link> (vtecx_signup)
      <br/>
      <Link href='/vtecx_passresetp'>パスワード変更</Link> (vtecx_passreset)
      <br/>
      <Link href='/vtecx_staticprops'>StaticProps テスト</Link> (vtecx_staticprops)
      <br/>
      <Link href='/vtecx_viewpdf'>PDF表示テスト</Link> (vtecx_viewpdf)

      <br/>
      <br/>
      <Link href='/stripe/payment'>カード決済 テスト （決済とカード登録を同時に行う）</Link> (stripe/payment)
      <br/>
      <Link href='/stripe/checkout'>カード決済 テスト （カード登録を行った後、決済を行う）</Link> (stripe/checkout)
      <br/>
      <Link href='/stripe/subscription'>サブスクリプション テスト （決済とカード登録を同時に行う）</Link> (stripe/subscription)
      <br/>
      <Link href='/stripe/payment'>カード決済 テスト （決済とカード登録を同時に行う）</Link> (stripe/payment)

      <br/>
      <br/>
      <Link href='/vtecx_menu'>vtecxnext メニュー 【useEffect】</Link> (vtecx_menu)
      <br/>

    </div>
  )
}

// propsの型を定義する
type Props = {
  isLoggedin?: string
}

// サーバサイドで実行する処理(getServerSideProps)を定義する
export const getServerSideProps:GetServerSideProps = async (context:GetServerSidePropsContext) => {
  // vtecxnext 呼び出し
  const isLoggedin = await vtecxnext.isLoggedin(context.req, context.res)

  const props: Props = {
    isLoggedin: String(isLoggedin)
  }
  console.log(`[vtecx_menu getServerSideProps] props.isLoggedin=${props.isLoggedin}`)

  return {
    props: props,
  }
}

export default HomePage
