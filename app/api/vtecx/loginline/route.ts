import { NextRequest } from 'next/server'
import { VtecxNext, VtecxNextError } from '@vtecx/vtecxnext'

export const GET = async (req:NextRequest):Promise<Response> => {
  console.log(`[api loginline] start.`)

  const vtecxnext = new VtecxNext(req)

  let resStatus:number|undefined = undefined
  let resJson:any|undefined = undefined
  try {
    // このリクエストが成功したら、リダイレクトレスポンス情報がvtecxnextに保持される。
    await vtecxnext.oauthLine()
  } catch (error) {
    let resMessage:string
    if (error instanceof VtecxNextError) {
      console.log(`[api loginline] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resMessage = error.message
    } else {
      console.log(`[api loginline] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resMessage = 'Error occured.'
    }
    const resJson = {'feed' : {'title' : resMessage}}
  }

  // 成功時はリダイレクト、エラー時はエラーステータスとメッセージを返却。
  console.log('[api loginline] end.')
  return vtecxnext.response(resStatus, resJson)
}
