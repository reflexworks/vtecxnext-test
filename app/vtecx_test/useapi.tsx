'use client'

import * as browserutil from 'utils/browserutil'
import {useState, useEffect} from 'react'

// propsの型を定義する
export type Props = {
  isLoggedin: string,
  error: string|null,
  loading: boolean
}

const isLoggedIn = async (): Promise<string> => {
  console.log(`[isLoggedIn] start.`)
  const data = await browserutil.requestApi('GET', 'isloggedin', '')
  let result = 'undefined'
  if (!data) {
    console.log(`[isLoggedIn] data is null.`)
    result = `no data.`
  } else if ('feed' in data) {
    const feedStr = JSON.stringify(data)
    console.log(`[isLoggedIn] data=${feedStr}`)
    result = data.feed.title
  }
  console.log(`[isLoggedIn] end. result = ${result}`)
  return result
}

/**
 * 画面表示時に実行される関数.
 * 呼び出し元は vtecx_test
 *   * 注1) 関数名は「use + 英大文字」で始まるものでないとエラーになった。
 *   * 注2) useEffect内のasync処理は、丸括弧()で囲まないとうまく動かなかった。
 * @returns ログイン状態
 */
export const useApi = ():Props => {
  const [isLoggedin, setLoggedin] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  //console.log(`[useclient useApi] start.`)
  
  useEffect(() => {
    (async () => {
      console.log(`[useclient useApi useEffect async] start.`)
      try {
        const tmpLoggedin:string = await isLoggedIn()
        setLoggedin(tmpLoggedin)
      } catch (e) {
        if (e instanceof Error) {
          setError(`${e.name}: ${e.message}`)
        }
        setLoggedin('false')
      } finally {
        setLoading(false)
      }
      console.log(`[useclient useApi useEffect async] end. isLoggedin=${isLoggedin}`)
    })()
  }, [])
 
  //console.log(`[useclient useApi] end. isLoggedin=${isLoggedin}`)

  return { isLoggedin, error, loading }
}