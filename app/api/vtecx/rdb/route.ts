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
  console.log(`[api rdb] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }

  const type:string = vtecxnext.getParameter('type') ?? ''
  console.log(`[api rdb] type=${type}`)

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

  // BigQuery操作
  let resStatus:number = 200
  let resJson:any
  try {
    if (type === 'query') {
      // クエリ検索
      let sql:string = ''
      let values:any[] = []
      let parent:string = ''
      if (Array.isArray(data)) {
        sql = data[0].title
        values = getQueryValues(data[0])
        parent = data[0].subtitle
      }
      const csv:boolean = vtecxnext.hasParameter('csv')
      console.log(`[api rdb] csv=${csv}`)
      if (!csv) {
        // 戻り値: JSON
        const resData = await vtecxnext.queryRDB(sql, values, parent)
        if (resData) {
          console.log(`[api rdb] resData=${JSON.stringify(resData)}`)
          resJson = resData
        } else {
          resStatus = 204
        }
      } else {
        // 戻り値: CSV
        console.log('[api rdb] queryRDBCsv csv start.')
        const csvname:string = vtecxnext.getParameter('csv') ?? ''
        console.log(`[api rdb] queryRDBCsv csvname=${csvname}`)
        // 取得されたCSVデータはvtecxnextに一時保存される。
        const resData = await vtecxnext.queryRDBCsv(sql, values, csvname, parent)
        console.log('[api rdb] queryRDBCsv csv end.')
      }
    } else if (type === 'exec') {
      // 更新系SQL実行
      const async:boolean = vtecxnext.hasParameter('async')
      const isbulk:boolean = vtecxnext.hasParameter('bulk')
      if (Array.isArray(data)) {
        let sqls:string[] = getExecSqls(data)
        let values:any[][] = getExecSqlValues(data)
        // 戻り値: JSON
        const resData = await vtecxnext.execRDB(sqls, values, async, isbulk)
        if (resData) {
          resJson = resData
        } else {
          resStatus = 204
        }
      } else {
        throw new ApiRouteTestError(400, `[api rdb] feed is required. type=${type}`)
      }

    } else {
      console.log(`[api rdb] invalid type. type=${type}`)
      throw new ApiRouteTestError(400, `[api rdb] invalid type. type=${type}`)
    }

  } catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError || error instanceof ApiRouteTestError) {
      console.log(`[api rdb] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[api rdb] Error occured. (not VtecxNextError) ${error}`)
      if (error instanceof Error) {
        console.log(`[api rdb] ${error.stack}`)
      }
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {'feed' : {'title' : resErrMsg}}
  }

  //console.log(`[api rdb] end. resJson=${resJson}`)
  console.log(`[api rdb] end.`)
  return vtecxnext.response(resStatus, resJson)
}

const getQueryValues = (entry:any):any[] => {
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
          console.log(`[rdb][getValues] inputVal=${tmpVal} result=${val}`)
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

const getExecSqls = (data:any):string[] => {
  const sqls:string[] = []
  for (let idx = 0; idx < data.length; idx++) {
    sqls[idx] = data[idx].title
  }
  return sqls
}

const getExecSqlValues = (data:any):any[][] => {
  const values:any[][] = []
  if (data && Array.isArray(data)) {
    let idx = 0
    for (const entry of data) {
      values[idx] = getQueryValues(entry)
      idx++
    }
  }
  return values
}
