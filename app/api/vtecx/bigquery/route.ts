import { NextRequest } from 'next/server'
import { VtecxNext, VtecxNextError } from '@vtecx/vtecxnext'
import { ApiRouteTestError } from 'utils/testutil'
import * as testutil from 'utils/testutil'

/**
 * PUTメソッド
 * @param req リクエスト
 * @returns レスポンス
 */
export const PUT = async (req:NextRequest):Promise<Response> => {
  console.log(`[api bigquery put] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }

  // リクエストJSON取得
  const contentLength:number = testutil.toNumber(req.headers.get('content-length'), 0)
  let data:any
  if (contentLength > 0) {
    try {
      data = await req.json()
    } catch (error) {
      let resErrMsg:string
      if (error instanceof Error) {
        resErrMsg = `${error.name}: ${error.message}`
      } else {
        resErrMsg = 'Error occured by req.json()'
      }
      return vtecxnext.response(400, {'feed' : {'title' : resErrMsg}})
    }
  }

  let resStatus:number
  let resJson:any
  try {
    // クエリ検索
    let sql:string = ''
    let values:any[] = []
    let parent:string = ''
    if (Array.isArray(data)) {
      sql = data[0].title
      values = getValues(data[0])
      parent = data[0].subtitle
    }
    console.log(`[api bigquery put] sql=${sql}`)
    console.log(`[api bigquery put] sql values=${values}`)
    const csv = vtecxnext.hasParameter('csv')
    console.log(`[api bigquery put] csv=${csv}`)
    if (!csv) {
      // 戻り値: JSON
      const resData = await vtecxnext.execBQ(sql, values, parent)
      if (resData) {
        resStatus = 200
        resJson = resData
      } else {
        resStatus = 204
      }
    } else {
      // 戻り値: CSV
      console.log('[api bigquery put] queryBq csv start.')
      const csvname = vtecxnext.getParameter('csv') ?? 'default.csv'
      console.log(`[api bigquery put] queryBq csvname=${csvname}`)
      // 取得されたCSVデータはvtecxnextに一時保存される。
      await vtecxnext.getBQCsv(sql, values, csvname, parent)
      resStatus = 200
      console.log('[api bigquery put] queryBq csv end.')
    }
    console.log('[api bigquery put] queryBq end.')

  } catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError || error instanceof ApiRouteTestError) {
      console.log(`[api bigquery put] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[api bigquery put] Error occured. (not VtecxNextError) ${error}`)
      if (error instanceof Error) {
        console.log(`[api bigquery put] ${error.stack}`)
      }
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson ={'feed' : {'title' : resErrMsg}}
  }
  console.log('[api bigquery put] end.')
  return vtecxnext.response(resStatus, resJson)
}

/**
 * POSTメソッド
 * @param req リクエスト
 * @returns レスポンス
 */
export const POST = async (req:NextRequest):Promise<Response> => {
  console.log(`[api bigquery post] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }

  // リクエストJSON取得
  const contentLength:number = testutil.toNumber(req.headers.get('content-length'), 0)
  let data:any
  if (contentLength > 0) {
    try {
      data = await req.json()
    } catch (error) {
      let resErrMsg:string
      if (error instanceof Error) {
        resErrMsg = `${error.name}: ${error.message}`
      } else {
        resErrMsg = 'Error occured by req.json()'
      }
      return vtecxnext.response(400, {'feed' : {'title' : resErrMsg}})
    }
  }

  let resStatus:number
  let resJson:any
  try {
    // BigQuery登録
    const async:boolean = vtecxnext.hasParameter('async')
    const tablenamesStr:string = vtecxnext.getParameter('tablenames') ?? ''
    console.log(`[api bigquery post] postBq. async=${async} tablenamesStr=${tablenamesStr}`)
    const tablenames:any = testutil.getBqTablenames(tablenamesStr)
    const result = await vtecxnext.postBQ(data, async, tablenames)
    const message = `post bigquery. ${async ? '(async)' : ''} result=${result}`
    resJson = {'feed' : {'title' : message}}
    resStatus = async ? 202 : 200

  } catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError || error instanceof ApiRouteTestError) {
      console.log(`[api bigquery post] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[api bigquery post] Error occured. (not VtecxNextError) ${error}`)
      if (error instanceof Error) {
        console.log(`[api bigquery post] ${error.stack}`)
      }
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {'feed' : {'title' : resErrMsg}}
  }
  console.log('[api bigquery post] end.')
  return vtecxnext.response(resStatus, resJson)
}

/**
 * DELETEメソッド
 * @param req リクエスト
 * @returns レスポンス
 */
export const DELETE = async (req:NextRequest):Promise<Response> => {
  console.log(`[api bigquery delete] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }

  let resStatus:number
  let resJson:any
  try {
    // BigQuery削除
    const tmpKey:string = vtecxnext.getParameter('key') ?? ''
    const keys:string[] = tmpKey.split(',')
    const async:boolean = vtecxnext.hasParameter('async')
    const tablenamesStr:string = vtecxnext.getParameter('tablenames') ?? ''
    const tablenames:any = testutil.getBqTablenames(tablenamesStr)
    const result = await vtecxnext.deleteBQ(keys, async, tablenames)
    const message = `delete bigquery. ${async ? '(async)' : ''} result=${result}`
    resJson = {'feed' : {'title' : message}}
    resStatus = async ? 202 : 200

  } catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError || error instanceof ApiRouteTestError) {
      console.log(`[api bigquery post] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[api bigquery post] Error occured. (not VtecxNextError) ${error}`)
      if (error instanceof Error) {
        console.log(`[api bigquery post] ${error.stack}`)
      }
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {'feed' : {'title' : resErrMsg}}
  }
  console.log('[api bigquery post] end.')
  return vtecxnext.response(resStatus, resJson) 
}

const getValues = (entry:any) => {
  const values = []
  let idx = 0
  if ('category' in entry) {
    for (const category of entry.category) {
      const type = category.___term
      const tmpVal = category.___label
      let val
      if (type) {
        if (type === 'number') {
          val = Number(tmpVal)
        } else if (type === 'boolean') {
          val = tmpVal.toLowerCase() === 'true'
          console.log(`[bigquery][getValues] inputVal=${tmpVal} result=${val}`)
        } else {
          val = String(tmpVal)
        }
      } else {
        val = String(tmpVal)
      }
      values[idx] = val
      idx++
    }
  }
  return values
}
