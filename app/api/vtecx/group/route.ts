import { NextRequest } from 'next/server'
import { VtecxNext, VtecxNextError } from '@vtecx/vtecxnext'
import { ApiRouteTestError } from 'utils/testutil'

/**
 * PUTメソッド
 * @param req リクエスト
 * @returns レスポンス
 */
export const PUT = async (req:NextRequest):Promise<Response> => {
  console.log(`[api group put] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }

  // パラメータを取得
  const group = vtecxnext.getParameter('group') ?? ''
  const selfid = vtecxnext.getParameter('selfid') ?? ''
  console.log(`[api group put] group=${group} selfid=${selfid}`)
  // グループ操作
  let resStatus:number = 200
  let resJson:any
  try {
    // グループ参加
    resJson = await vtecxnext.joinGroup(group, selfid)
    resStatus = resJson ? 200 : 204

  } catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError || error instanceof ApiRouteTestError) {
      console.log(`[api group put] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[api group put] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {'feed' : {'title' : resErrMsg}}
  }

  console.log(`[api group put] end. resJson=${resJson}`)
  return vtecxnext.response(resStatus, resJson)
}

/**
 * DELETEメソッド
 * @param req リクエスト
 * @returns レスポンス
 */
export const DELETE = async (req:NextRequest):Promise<Response> => {
  console.log(`[api group delete] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }

  // パラメータを取得
  const group = vtecxnext.getParameter('group') ?? ''
  const selfid = vtecxnext.getParameter('selfid') ?? ''
  console.log(`[api group delete] group=${group} selfid=${selfid}`)
  // グループ操作
  let resStatus:number = 200
  let resJson:any
  try {
      // グループ退会
      await vtecxnext.leaveGroup(group)
      const message = `left the group. ${group}`
      resJson = {'feed' : {'title' : message}}

  } catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError || error instanceof ApiRouteTestError) {
      console.log(`[api group delete] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[api group delete] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {'feed' : {'title' : resErrMsg}}
  }

  console.log(`[api group delete] end. resJson=${resJson}`)
  return vtecxnext.response(resStatus, resJson)
}

/**
 * GETメソッド
 * @param req リクエスト
 * @returns レスポンス
 */
export const GET = async (req:NextRequest):Promise<Response> => {
  console.log(`[api group get] start. x-requested-with=${req.headers.get('x-requested-with')}`)

  const vtecxnext = new VtecxNext(req)

  // X-Requested-With ヘッダチェック
  let result = vtecxnext.checkXRequestedWith()
  if (result) {
    return result
  }

  // パラメータを取得
  const group = vtecxnext.getParameter('group') ?? ''
  const selfid = vtecxnext.getParameter('selfid') ?? ''
  const type = vtecxnext.getParameter('type') ?? ''
  console.log(`[api group get] group=${group} selfid=${selfid} type=${type}`)
  // グループ操作
  let resStatus:number = 200
  let resJson:any
  try {
    if (type === 'nogroupmember') {
      // グループメンバーエントリーとして存在するが、自身の署名をしていないエントリーを取得.
      resJson = await vtecxnext.noGroupMember(group)
    } else if (type === 'groups') {
      // 参加中グループリスト
      resJson = await vtecxnext.getGroups()
    } else if (type === 'isgroupmember') {
      // 指定されたグループに参加しているかどうか
      const tmp:boolean = await vtecxnext.isGroupMember(group)
      resJson = {feed : {'title' : tmp ? 'true' : 'false'}}
    } else if (type === 'isadmin') {
      // サービス管理者グループに参加しているかどうか
      const tmp:boolean = await vtecxnext.isAdmin()
      resJson = {feed : {'title' : tmp ? 'true' : 'false'}}
    }
    resStatus = resJson ? 200 : 204

  } catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError || error instanceof ApiRouteTestError) {
      console.log(`[api group get] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[api group get] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {'feed' : {'title' : resErrMsg}}
  }

  console.log(`[api group get] end. resJson=${resJson}`)
  return vtecxnext.response(resStatus, resJson)
}
