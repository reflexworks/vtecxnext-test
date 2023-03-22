import { NextApiRequest, NextApiResponse } from 'next'
import * as vtecxnext from '@vtecx/vtecxnext'
import { VtecxNextError } from '@vtecx/vtecxnext'
import * as testutil from 'utils/testutil'
import { ApiRouteTestError } from 'utils/testutil'

const handler = async (req:NextApiRequest, res:NextApiResponse) => {
  console.log(`[group] start. x-requested-with=${req.headers['x-requested-with']}`)
  // X-Requested-With ヘッダチェック
  if (!vtecxnext.checkXRequestedWith(req, res)) {
    return
  }
  // methodを取得
  const method = req.method
  // パラメータを取得
  const group:string = testutil.getParam(req, 'group')
  const selfid:string = testutil.getParam(req, 'selfid')
  const type:string = testutil.getParam(req, 'type')
  console.log(`[group] method=${method} group=${group} selfid=${selfid} type=${type}`)
  // グループ操作
  let resStatus:number = 200
  let resJson:any
  try {
    if (method === 'PUT') {
      // グループ参加
      resJson = await vtecxnext.joinGroup(req, res, group, selfid)
      resStatus = resJson ? 200 : 204

    } else if (method === 'DELETE') {
      // グループ退会
      const result = await vtecxnext.leaveGroup(req, res, group)
      const message = `left the group. ${group}`
      resJson = {feed : {'title' : message}}

    } else if (method === 'GET') {
      if (type === 'nogroupmember') {
        // グループメンバーエントリーとして存在するが、自身の署名をしていないエントリーを取得.
        resJson = await vtecxnext.noGroupMember(req, res, group)
      } else if (type === 'groups') {
        // 参加中グループリスト
        resJson = await vtecxnext.getGroups(req, res)
      } else if (type === 'isgroupmember') {
        // 指定されたグループに参加しているかどうか
        const tmp:boolean = await vtecxnext.isGroupMember(req, res, group)
        resJson = {feed : {'title' : tmp ? 'true' : 'false'}}
      } else if (type === 'isadmin') {
        // サービス管理者グループに参加しているかどうか
        const tmp:boolean = await vtecxnext.isAdmin(req, res)
        resJson = {feed : {'title' : tmp ? 'true' : 'false'}}
      }
      resStatus = resJson ? 200 : 204
    }

  } catch (error) {
    let resErrMsg:string
    if (error instanceof VtecxNextError || error instanceof ApiRouteTestError) {
      console.log(`[group] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resErrMsg = error.message
    } else {
      console.log(`[group] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resErrMsg = 'Error occured.'
    }
    resJson = {feed : {'title' : resErrMsg}}
  }

  console.log(`[group] end. resJson=${resJson}`)
  res.status(resStatus)
  resJson ? res.json(resJson) : 
  res.end()
}

export default handler
