import Link from 'next/link'

const Header = ({title} : {title:string}) => {
  return <h1>{title ? title : 'Default title'}</h1>
}
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
