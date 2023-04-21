/**
 * 戻り値がJSONのリクエスト
 * @param method メソッド
 * @param apiAction サーバサイドJS名
 * @param urlparam URLパラメータ
 * @param body リクエストデータ
 * @param headers リクエストヘッダ
 * @param mode リクエストモード
 * @param specifyHost ホストを指定する場合true
 * @returns レスポンスJSON
 */
export const requestApi = async (method:string, apiAction:string, urlparam:string, body?:any, headers?:any, mode?:RequestMode, specifyHost?:boolean): Promise<any> => {
  console.log(`[requestApi] start. method=${method} apiAction=${apiAction} urlparam=${urlparam}`)
  const reqHeaders:any = headers ? headers : {}
  reqHeaders['X-Requested-With'] = 'XMLHttpRequest'
  const requestInit:RequestInit = {
    body: body,
    method: method,
    headers: reqHeaders
  }
  if (mode) {
    requestInit['mode'] = mode
  }

  const url = `${specifyHost ? process.env.NEXT_PUBLIC_VTECXNEXT_URL : ''}/api/vtecx/${apiAction}?${urlparam ? urlparam : ''}`
  console.log(`[requestApi] url=${url} requestInit=${JSON.stringify(requestInit)}`)
  let data
  try {
    const response = await fetch(url, requestInit)
    const status = response.status
    console.log(`[requestApi] response. status=${status}`)
    if (status === 204) {
      data = null
    } else {
      const contentType = response.headers.get('content-type')
      console.log(`[requestApi] content-type=${contentType}`)
      if (!contentType || contentType.startsWith('application/json')) {
        data = await response.json()
      } else {
        data = await response.blob()
      }
    }
    console.log(data)
  } catch (err) {
    console.error(err)
    let msg
    if (err instanceof Error){
      msg = `Fetch by browser error. ${err.name}: ${err.message}`
    } else if(typeof err === 'string'){
      msg = err
    }
    data = {'feed' : {'title' : msg}}
  }
  return data
}

/**
 * 値をstring型で返す.
 * @param tmpVal 値
 * @return stringの値
 */
export const toString = (tmpVal:any): string => {
  return tmpVal ? String(tmpVal) : ''
}
