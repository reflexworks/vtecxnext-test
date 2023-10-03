'use client'

import * as browserutil from 'utils/browserutil'
import {useState, useEffect} from 'react'

// propsの型を定義する
export type Props = {
  uid: string,
  error: string|null,
  loading: boolean
}

const getUid = async (): Promise<string> => {
  console.log(`[getUid] start.`)
  const data = await browserutil.requestApi('GET', 'uid', '')
  let result = 'undefined'
  if (!data) {
    console.log(`[getUid] data is null.`)
    result = `no data.`
  } else if ('feed' in data) {
    const feedStr = JSON.stringify(data)
    console.log(`[getUid] data=${feedStr}`)
    result = data.feed.title
  }
  console.log(`[getUid] end. result = ${result}`)
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
  const [uid, setUid] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  //console.log(`[useclient useApi] start.`)
  
  useEffect(() => {
    (async () => {
      console.log(`[useclient useApi useEffect async] start.`)
      try {
        const tmpUid:string = await getUid()
        setUid(tmpUid)
      } catch (e) {
        if (e instanceof Error) {
          setError(`${e.name}: ${e.message}`)
        }
        setUid('-- no login --')
      } finally {
        setLoading(false)
      }
      console.log(`[useclient useApi useEffect async] end. uid=${uid}`)
    })()
  }, [])
 
  //console.log(`[useclient useApi] end. uid=${uid}`)

  return { uid, error, loading }
}