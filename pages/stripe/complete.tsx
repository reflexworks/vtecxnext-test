import Head from 'next/head'
import CompleteForm from 'components/stripe/completeform'

const HomePage = () => {

  return (
    <main>
      <div>
        <Head>
          <title>Stripeテスト </title>
        </Head>
        <div>Stripeテスト 決済後ページ</div>
        <CompleteForm />
      </div>
    </main>
  )
}

export default HomePage
