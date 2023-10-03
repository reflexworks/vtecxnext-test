'use client'

import * as browserutil from 'utils/browserutil'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

// propsの型を定義する
export type Props = {
  message: string,
  error: string|null,
  loading: boolean
}

/**
 * RXIDによるログイン
 * @param rxid RXID
 * @returns メッセージ
 */
const loginWithRxid = async (rxid:string): Promise<string> => {
  console.log(`[loginWithRxid] start.`)
  const data = await browserutil.requestApi('GET', 'loginwithrxid', `rxid=${rxid}`)
  let result = 'undefined'
  if (!data) {
    console.log(`[loginWithRxid] data is null.`)
    result = `no data.`
  } else if ('feed' in data) {
    const feedStr = JSON.stringify(data)
    console.log(`[loginWithRxid] data=${feedStr}`)
    result = data.feed.title
  }
  console.log(`[loginWithRxid] end. result = ${result}`)
  return result
}

/**
 * 画面表示時に実行される関数.
 * 呼び出し元は vtecx_signup_completion
 *   * 注1) 関数名は「use + 英大文字」で始まるものでないとエラーになった。
 *   * 注2) useEffect内のasync処理は、丸括弧()で囲まないとうまく動かなかった。
 * @returns ログイン状態
 */
export const useApi = ():Props => {
  const [message, setMessage] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  //console.log(`[useApi] start.`)
  const searchParams = useSearchParams()
  const rxid:string = searchParams.get('_RXID') ?? ''

  useEffect(() => {
    (async () => {
      console.log(`[useApi useEffect async] start.`)
      try {
        const tmpMessage:string = await loginWithRxid(rxid)
        setMessage(tmpMessage)
      } catch (e) {
        if (e instanceof Error) {
          setError(`${e.name}: ${e.message}`)
        }
        setMessage('signup failed.')
      } finally {
        setLoading(false)
      }
      console.log(`[useApi useEffect async] end. message=${message}`)
    })()
  }, [])
 
  //console.log(`[useApi] end. isLoggedin=${isLoggedin}`)

  return { message, error, loading }
}
