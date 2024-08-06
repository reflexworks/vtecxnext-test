import { VtecxNext, AdduserInfo as AdduserInfo_V, CreateGroupadminInfo } from 'utils/vtecxnext'

export type AdduserInfo = AdduserInfo_V
export type ChangepassInfo = {
  newpswd:string, 
  oldpswd?:string, 
  passresetToken?:string,
}

/**
 * 値をstring型で返す.
 * @param tmpVal 値
 * @return stringの値
 */
 export const toString = (tmpVal:any): string => {
  return !isBlank(tmpVal) ? String(tmpVal) : ''
}

/**
 * URLパラメータを取得し、number型で返す.
 * @param vtecxnext vtecxnext 内部にRequestを保持
 * @param name パラメータ名
 * @return パラメータ値
 */
 export const getParamNumber = (vtecxnext:VtecxNext, name:string): number|undefined => {
  const tmpVal = vtecxnext.getParameter(name)
  if (isBlank(tmpVal)) {
    return undefined
  }
  return toNumber(tmpVal)
}

/**
 * URLパラメータを取得し、number型で返す. 値の指定がない場合エラーを返す.
 * @param vtecxnext vtecxnext 内部にRequestを保持
 * @param name パラメータ名
 * @return パラメータ値
 */
 export const getParamNumberRequired = (vtecxnext:VtecxNext, name:string): number => {
  const tmpVal = vtecxnext.getParameter(name)
  return toNumber(tmpVal)
}

/**
 * 値をnumber型で返す。空の場合、defaultValが指定されていなければエラー。
 * @param tmpVal 値
 * @param defaultVal 値が指定されていない場合の返却値。この値が指定されていればエラーとしない。undefined指定は無効。エラーとなる。
 * @return numberの値
 */
 export const toNumber = (tmpVal:any, defaultVal?:number): number => {
  let errMsg = `Not numeric. ${tmpVal}`
  if (!isBlank(tmpVal)) {
    try {
      return Number(tmpVal)
    } catch (e) {
      if (e instanceof Error) {
        errMsg = e.message
      }
    }
  } else if (defaultVal !== undefined) {
    return defaultVal
  }
  throw new ApiRouteTestError(400, errMsg)
}

/**
 * 値をboolean型で返す.空はエラー.
 * @param tmpVal 値
 * @return booleanの値
 */
 export const toBoolean = (tmpVal:string): boolean => {
  let errMsg = `Not boolean. ${tmpVal}`
  if (!isBlank(tmpVal)) {
    try {
      return tmpVal.toLowerCase() === 'true'
    } catch (e) {
      if (e instanceof Error) {
        errMsg = e.message
      }
    }
  }
  throw new ApiRouteTestError(400, errMsg)
}

/**
 * BigQueryでテーブル名指定の場合の型変換を行う.
 * @param tablenamesStr 値
 * @return テーブル名リスト
 */
 export const getBqTablenames = (tablenamesStr:string): any => {
  if (!tablenamesStr) {
    return null
  }
  const tablenames:any = {}
  const tmp = tablenamesStr.split(',')
  for (const tablenameInfo of tmp) {
    const idx = tablenameInfo.indexOf(':')
    if (idx < 1) {
      throw new ApiRouteTestError(400, `Invalid tablenames of BigQuery. ${tablenamesStr}`)
    }
    const entityName:string = tablenameInfo.substring(0, idx)
    tablenames[entityName] = tablenameInfo.substring(idx + 1)
  }
  console.log(`[getBqTablenames] tablenames = ${JSON.stringify(tablenames)}`)
  return tablenames
}

/**
 * Feedの先頭のEntryを取得.
 * @param data デフォルトでは配列、strictモードの場合連想配列のfeed.entry。
 * @returns Feedの先頭のEntry
 */
export const getFirstEntry = (data:any):any => {
  const entries = getEntries(data)
  if (entries && entries.length > 0) {
    return entries[0]
  } else {
    return null
  }
}

/**
 * Feedの先頭のEntryを取得.
 * @param data デフォルトでは配列、strictモードの場合連想配列のfeed.entry。
 * @returns Feedの先頭のEntry
 */
export const getEntries = (data:any):Array<any>|null => {
  //data.feed.entry[0].title
  if (data) {
    if (Array.isArray(data)) {
      if (data.length > 0) {
        return data
      }
    } else {
      if ('feed' in data && 'entry' in data.feed && data.feed.entry.length > 0) {
        return data.feed.entry
      }
    }
  }
  return null
}

/**
 * null、undefined、空文字の判定
 * @param val チェック値
 * @returns null、undefined、空文字の場合true
 */
export const isBlank = (val:any): boolean => {
  if (val === null || val === undefined || val === '') {
    return true
  }

  return false
}

/**
 * リクエストURLから指定されたパラメータを取り除いたクエリパラメータを返却.
 * @param requestUrl リクエストURL
 * @param names 除去対象パラメータ
 * @returns 編集したクエリパラメータ
 */
export const removeParam = (requestUrl:string, names:string[]): string => {
  const idx0 = requestUrl.indexOf('?')
  if (idx0 < 0) {
    return ''
  }
  let tmpQueryparam:string = requestUrl.substring(idx0 + 1)
  //console.log(`[testutil removeParam] tmpQueryparam=${tmpQueryparam}`)

  for (const name of names) {
    if (tmpQueryparam.startsWith(`${name}=`)) {
      // 指定パラメータが先頭の場合
      const idx3 = tmpQueryparam.indexOf('&')
      if (idx3 < 0) {
        tmpQueryparam = ''
      } else {
        tmpQueryparam = tmpQueryparam.substring(idx3 + 1)
      }
    } else {
      const idx = tmpQueryparam.indexOf(`&${name}=`)
      if (idx > -1) {
        let param = tmpQueryparam.substring(0, idx)
        const startIdx = idx + name.length + 2
        const idx2 = tmpQueryparam.indexOf('&', startIdx)
        if (idx2 >= startIdx) {
          if (param) {
            param += '&'
          }
          param += tmpQueryparam.substring(idx2 + 1)
        }
        tmpQueryparam = param
      }
    }
  }
  if (tmpQueryparam) {
    tmpQueryparam = '?' + tmpQueryparam
  }
  //console.log(`[testutil removeParam] end. tmpQueryparam=${tmpQueryparam}`)
  return tmpQueryparam
}

/**
 * string形かどうか判定
 * @param a 判定項目
 * @returns string形の場合true
 */
export const isString = (a: unknown): a is string => {
  return typeof a === 'string'
}

/**
 * Entryからキーを取得
 *   link.___rel = 'self' の link.___href の値を返す。
 * @param entry Entry
 * @returns キー
 */
export const getUri = (entry:any):string|undefined => {
  if (entry && entry.link) {
    for (const link of entry.link) {
      if (link.___rel === 'self') {
        return link.___href
      }
    }
  }
  return undefined
}

/**
 * entryにキーを設定.
 *   link.___rel='self'の'___href'にキーを設定する。
 * @param entry Entry
 * @param uri キー
 * @returns キーを設定したEntry
 */
export const setLinkUri = (entry:any, uri:string):any => {
  if (!uri) {
    return entry
  }
  let retEntry:any
  if (entry) {
    retEntry = entry
  } else {
    retEntry = {}
  }
  let idx:number|undefined
  if (!retEntry.link) {
    retEntry.link = []
  } else {
    const len = retEntry.link.length
    for (let i = 0; i < len; i++) {
      const tmpLink = retEntry.link[i]
      if (tmpLink.___rel === 'self') {
        idx = i
      }
    }
  }
  if (idx === undefined) {
    retEntry.link.push({'___rel' : 'self', '___href' : uri})
  } else {
    retEntry.link[idx].___href = uri
  }
  //console.log(`[setLinkUri] retEntry=${JSON.stringify(retEntry)}`)
  return retEntry
}


// --------------------------------------
/**
 * Error returned from api route test
 */
export class ApiRouteTestError extends Error {
  status:number
  constructor(status:number, message:string) {
    super(message)
    this.name = 'ApiRouteTestError'
    this.status = status
  }
}
