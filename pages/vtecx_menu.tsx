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
      <br/>
      <Link href='/stripe/retrieve'>Stripe 各種検索</Link>

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
