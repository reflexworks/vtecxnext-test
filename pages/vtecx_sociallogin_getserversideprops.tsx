import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { parseCookies } from 'nookies'

export const getServerSideProps:GetServerSideProps = async (context:GetServerSidePropsContext) => {
  const { req, res } = context
  const cookies = parseCookies({ req })
  const sid = cookies.SID;

  if (sid) {
    // ログイン済み→メニュー画面
    res.setHeader('location', '/vtecx_menu')
    res.statusCode = 302
    res.end()
  } else {
    // 未ログイン→LINEログイン
    res.setHeader('location', '/api/vtecx/loginline')
    res.statusCode = 302
    res.end()
  }
  return { props: {} }
}

/**
 * ページ関数
 * @returns HTML
 */
const HomePage = () => {

  return (
    <div>
      <label>リダイレクト画面</label>
    </div>
  )
}

export default HomePage

