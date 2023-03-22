import Link from 'next/link'

const CompleteForm = () => {

  return (
    <>
      <div>
        <h1>決済完了</h1>
        <div>お買い上げありがとうございました</div>
        <br/>
        決済画面に戻る 
        <br/>
        &nbsp;&nbsp;&nbsp;&nbsp;<Link href='/stripe/payment'>カード決済 テスト （決済とカード登録を同時に行う）</Link>
        <br/>
        &nbsp;&nbsp;&nbsp;&nbsp;<Link href='/stripe/checkout'>カード決済 テスト （カード登録を行った後、決済を行う）</Link>
        <br/>
        &nbsp;&nbsp;&nbsp;&nbsp;<Link href='/stripe/subscription'>サブスクリプション テスト （決済とカード登録を同時に行う）</Link>
        <br/>
        &nbsp;&nbsp;&nbsp;&nbsp;<Link href='/stripe/checkout_subscription'>サブスクリプション テスト （カード登録を行った後、決済を行う）</Link>
      </div>
    </>
  )
}

export default CompleteForm
