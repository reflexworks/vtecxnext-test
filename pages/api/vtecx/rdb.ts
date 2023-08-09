import { NextApiRequest, NextApiResponse } from 'next'
import * as vtecxnext from '@vtecx/vtecxnext'
import { VtecxNextError } from '@vtecx/vtecxnext'
import * as testutil from 'utils/testutil'
import { ApiRouteTestError } from 'utils/testutil'

const handler = async (req:NextApiRequest, res:NextApiResponse) => {
  console.log(`[rdb] start. x-requested-with=${req.headers['x-requested-with']}`)
  // X-Requested-With ヘッダチェック
  if (!vtecxnext.checkXRequestedWith(req, res)) {
    return
  }
  // methodを取得
  const method = req.method
  const type:string = testutil.getParam(req, 'type')
  console.log(`[rdb] method=${method} type=${type}`)
  // BigQuery操作
  let resStatus:number = 200
  let resJson:any
  try {
    if (method === 'PUT') {
      if (type === 'query') {
        // クエリ検索
        const data = testutil.getRequestJson(req)
        let sql:string = ''
        let values:any[] = []
        let parent:string = ''
        if (Array.isArray(data)) {
          sql = data[0].title
          values = getQueryValues(data[0])
          parent = data[0].subtitle
        }
        const csv = testutil.hasParam(req, 'csv')
        console.log(`[rdb] csv=${csv}`)
        if (!csv) {
          // 戻り値: JSON
          const resData = await vtecxnext.queryRDB(req, res, sql, values, parent)
          if (resData) {
            console.log(`[rdb] resData=${JSON.stringify(resData)}`)
            res.statusCode = 200
            res.json(resData)
          } else {
            res.statusCode = 204
            res.end()
          }
        } else {
          // 戻り値: CSV
          console.log('[rdb] queryRDBCsv csv start.')
          const csvname = testutil.getParam(req, 'csv')
          console.log(`[rdb] queryRDBCsv csvname=${csvname}`)
          const resData = await vtecxnext.queryRDBCsv(req, res, sql, values, csvname, parent)
          //res.statusCode = resData ? 200 : 204
          console.log('[rdb] queryRDBCsv csv end.')
        }
      } else if (type === 'exec') {
        // 更新系SQL実行
        const async:boolean = testutil.hasParam(req, 'async')
        const isbulk:boolean = testutil.hasParam(req, 'bulk')
        const data = testutil.getRequestJson(req)
        if (Array.isArray(data)) {
          let sqls:string[] = getExecSqls(data)
          let values:any[][] = getExecSqlValues(data)
          // 戻り値: JSON
          const resData = await vtecxnext.execRDB(req, res, sqls, values, async, isbulk)
          if (resData) {
            res.statusCode = 200
            res.json(resData)
          } else {
            res.statusCode = 204
            res.end()
          }
        } else {
          throw new ApiRouteTestError(400, `[rdb] feed is required. method=${method} type=${type}`)
        }

      } else {
        console.log(`[rdb] invalid type. method=${method} type=${type}`)
        throw new ApiRouteTestError(400, `[rdb] invalid type. method=${method} type=${type}`)
      }

    } else {
      throw new ApiRouteTestError(400, `[rdb] invalid method. ${method}`)
    }

  } catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError || error instanceof ApiRouteTestError) {
      console.log(`[rdb] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[rdb] Error occured. (not VtecxNextError) ${error}`)
      if (error instanceof Error) {
        console.log(`[rdb] ${error.stack}`)
      }
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {feed : {'title' : resErrMsg}}
  }

  console.log(`[rdb] end. res.closed=${res.closed} resJson=${resJson}`)
  if (!res.closed) {
    res.status(resStatus)
    resJson ? res.json(resJson) : 
    res.end()
  }
}

export default handler

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
