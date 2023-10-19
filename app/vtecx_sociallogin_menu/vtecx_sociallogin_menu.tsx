import Link from 'next/link'
import { Header } from 'components/header'

const LineLink = () => {
  const href = `${process.env.NEXT_PUBLIC_VTECXNEXT_URL}/api/vtecx/loginline`
  return <p><Link href={href}>LINEログイン</Link></p>
}

/**
 * ページ関数
 * @returns HTML
 */
 const HomePage = () => {

  return (
    <div>
      <Header title="ソーシャルログイン" />
      <LineLink />
    </div>
  )
}

export default HomePage
