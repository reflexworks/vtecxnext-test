'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { getAuthToken } from '@vtecx/vtecxauth'
import * as browserutil from 'utils/browserutil'
import { Props } from './servercomponent'
import { Header } from 'components/header'

/**
 * ページ関数
 * @returns HTML
 */
const HomePage = ({now}:Props) => {
  const [username, setUsername] = useState('')
  const [pswrd, setPswrd] = useState('')
  const [onetimePswrd, setOnetimePswrd] = useState('')
  const [isTrustedDevice, setTrustedDevice] = useState<boolean>(false)
  const [result, setResult] = useState('')
  // ホームページ関数内で定義
  const { executeRecaptcha } = useGoogleReCaptcha()

  /**
   * ログインリクエスト
   * API Routeにリクエストする
   * @param wsse WSSE
   * @param reCaptchaToken reCAPTCHAトークン
   * @returns API Routeからの戻り値
   */
  const login = async (wsse:string, reCaptchaToken:string) => {
    console.log('[login] start.')
    const method = 'GET'
    const apiAction = 'login'
    const param = reCaptchaToken ? `g-recaptcha-token=${reCaptchaToken}` : ''
    const headers = {'X-WSSE': wsse}
    const data = await browserutil.requestApi(method, apiAction, param, null, headers)
    if ('feed' in data) {
      return data.feed.title
    } else {
      return 'no feed'
    }
  }
  
  /**
   * ログインリクエスト
   * API Routeにリクエストする
   * @param wsse WSSE
   * @param reCaptchaToken reCAPTCHAトークン
   * @returns API Routeからの戻り値
   */
  const totp = async () => {
    console.log('[totp] start.')
    const method = 'GET'
    const apiAction = 'login'
    const param = `totp=${onetimePswrd}${isTrustedDevice ? '&trusteddevice' : ''}`
    const data = await browserutil.requestApi(method, apiAction, param)
    if ('feed' in data) {
      return data.feed.title
    } else {
      return 'no feed'
    }
  }
 
  const handleClickLogin = async () => {
    console.log(`[handleClickLogin start] username=${username}, pass=${pswrd}`)
    // 結果表示欄をクリア
    setResult('')
    // if the component is not mounted yet
    if (!executeRecaptcha) {
      return
    }
    // reCAPTCHAトークンを取得
    const reCaptchaToken = executeRecaptcha? await executeRecaptcha('contactPage') : ''
    // WSSEを生成
    const wsse = getAuthToken(username, pswrd)
    // ログイン
    const retStr = await login(wsse, reCaptchaToken)
    // 結果表示
    setResult(retStr)
    console.log(`[handleClickLogin end]`)
  }

  const handleClickTotp = async () => {
    console.log(`[handleClickTotp start] one-time pass=${onetimePswrd}`)
    // 結果表示欄をクリア
    setResult('')
    // ２段階認証
    const retStr = await totp()
    // 結果表示
    setResult(retStr)
    console.log(`[handleClickTotp end]`)
  }

  return (
    <div>
      <Header title="ログイン" />
      <table>
        <tbody>
          <tr>
            <td>ユーザ名: </td>
            <td><input type="text" id="username" name="username" value={username} 
                       onChange={(event) => setUsername(event.target.value)} /></td>
          </tr>
          <tr>
            <td>Password: </td>
            <td><input type="password" id="pswrd" name="pswrd" value={pswrd}
                       onChange={(event) => setPswrd(event.target.value)} /></td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td><span className="recaptcha">This site is protected by reCAPTCHA and the Google
                       <a href="https://policies.google.com/privacy">Privacy Policy</a> and
                       <a href="https://policies.google.com/terms">Terms of Service</a> apply.</span></td>
          </tr>
        </tbody>
      </table>
      <button onClick={handleClickLogin}>login</button>

      <br/>
      <br/>
      <span>One-time password: </span>
      <input type="password" id="onetimePswrd" name="onetimePswrd" value={onetimePswrd}
          onChange={(event) => setOnetimePswrd(event.target.value)} />
      <br/>
      <input type="checkbox" checked={isTrustedDevice} onChange={(event) => setTrustedDevice(event.target.checked)} /><span>この端末を信頼し、次回から２段階認証を行わない</span>
      <br/>
      <button onClick={handleClickTotp}>２段階認証</button>
      <p>{result}</p>
      <Link href="/vtecx_test">vtecxnext テスト</Link>
      <br/>
      <Link href="/vtecx_menu">メニュー</Link>
      <br/>
      <br/>
      <Link href="/vtecx_signup">新規ユーザ登録</Link>
      <br/>
      <Link href="/vtecx_passreset">パスワードを忘れた方はこちら</Link>
      <br/>
      <span>現在時刻: {now}</span>
    </div>
  )
}

export default HomePage
