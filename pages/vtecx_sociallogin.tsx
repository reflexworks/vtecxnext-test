import { parseCookies } from 'nookies'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

/**
 * ページ関数
 * @returns HTML
 */
const HomePage = () => {

  const router = useRouter()

  useEffect(() => {
    if (router.isReady) {
      redirect()
    }
  }, [router])

  const redirect = async (reCaptchaToken?:string) => {
    console.log('[redirect] start.')
    const cookies = parseCookies()
    const sid = cookies.SID;

    if (sid) {
      // ログイン済み→メニュー画面
      router.replace('/vtecx_menu')
    } else {
      // 未ログイン→LINEログイン
      router.replace('/api/vtecx/loginline')
    }
  }

  return (
    <div>
      <label>リダイレクト画面</label>
    </div>
  )
}

export default HomePage

