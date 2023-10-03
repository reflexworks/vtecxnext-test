'use client'

import { useState } from 'react'
import { getHashpass } from '@vtecx/vtecxauth'
import Link from 'next/link'
import * as browserutil from 'utils/browserutil'
import { Props, useApi as urlParam } from './useapi'

const Header = ({title} : {title:string}) => {
  return <h1>{title ? title : 'Default title'}</h1>
}

/**
 * ページ関数
 * @returns HTML
 */
const HomePage = () => {
  const [pswrd, setPswrd] = useState('')
  const [result, setResult] = useState('')

  const props:Props = urlParam()

  /**
   * パスワード変更リクエスト
   * API Routeにリクエストする
   * @param passhash パスワード(ハッシュ化済み)
   * @returns API Routeからの戻り値
   */
  const changepass = async (passhash:string) => {
    console.log('[changepass] start.')
    const method = 'POST'
    const apiAction = 'changepass'
    const reqJson:any = [{
      'contributor': [
        {
          'uri': `urn:vte.cx:auth:,${passhash}`
        },
        {
          'uri': `urn:vte.cx:passreset_token:${props.passreset_token}`
        },
      ]
    }]

    const reqData = JSON.stringify(reqJson)
    console.log(`[changepass] reqData = ${reqData}`)

    const data = await browserutil.requestApi(method, apiAction, '', reqData)
    if ('feed' in data) {
      return data.feed.title
    } else {
      return 'no feed'
    }
  }

  const handleClick = async () => {
    console.log(`[handleClick start] pass=${pswrd}`)
    // 結果表示欄をクリア
    setResult('')
    // パスワードをハッシュ化
    const passhash = getHashpass(pswrd)
    // パスワード更新
    const retStr = await changepass(passhash)
    // 結果表示
    setResult(retStr)
    console.log(`[handleClick end]`)
  }

  return (
    <div>
      <Header title="パスワード変更　入力画面" />
      <table>
        <tbody>
          <tr>
            <td><label>新パスワード: </label></td>
            <td><input type="password" id="pswrd" name="pswrd" value={pswrd}
                       onChange={(event) => setPswrd(event.target.value)} /></td>
          </tr>
        </tbody>
      </table>
      <button onClick={handleClick}>更新</button>
      <p>{result}</p>
      <Link href="/vtecx_test">汎用APIテスト</Link>
      <br/>
      <Link href="/vtecx_login">ログイン</Link>
    </div>
  );
}

export default HomePage
