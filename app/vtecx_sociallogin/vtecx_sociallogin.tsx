'use client'

import { parseCookies } from 'nookies'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

/**
 * ページ関数
 * @returns HTML
 */
const HomePage = () => {

  const router = useRouter()

  useEffect(() => {
    console.log('[useEffect] redirect start.')
    const cookies = parseCookies()
    const sid = cookies.SID

    if (sid) {
      // ログイン済み→メニュー画面
      router.replace('/vtecx_menu')
    } else {
      // 未ログイン→LINEログイン
      router.replace('/api/vtecx/loginline')
    }
  }, [router])

  return (
    <div>
      <span>リダイレクト画面</span>
    </div>
  )
}

export default HomePage

