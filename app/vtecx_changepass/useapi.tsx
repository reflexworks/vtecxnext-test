'use client'

import { useSearchParams } from "next/navigation"

// propsの型を定義する
export type Props = {
  passreset_token: string,
  rxid: string,
}

/**
 * 画面表示時に実行される関数.
 * 呼び出し元は vtecx_changepass
 *   * 注1) 関数名は「use + 英大文字」で始まるものでないとエラーになった。
 *   * 注2) useEffect内のasync処理は、丸括弧()で囲まないとうまく動かなかった。
 * @returns ログイン状態
 */
export const useApi = ():Props => {
  console.log(`[useApi] start.`)
  const searchParams = useSearchParams()
  const passreset_token:string = searchParams.get('_passreset_token') ?? ''
  const rxid:string = searchParams.get('_RXID') ?? ''
  console.log(`[useApi] passreset_token=${passreset_token} rxid=${rxid}`)
  return { passreset_token, rxid }
}
