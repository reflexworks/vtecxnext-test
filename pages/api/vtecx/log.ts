import { NextApiRequest, NextApiResponse } from 'next'
import * as vtecxnext from '@vtecx/vtecxnext'
import { VtecxNextError } from '@vtecx/vtecxnext'

const handler = async (req:NextApiRequest, res:NextApiResponse) => {
  console.log(`[log] start. x-requested-with=${req.headers['x-requested-with']}`)
  // X-Requested-With ヘッダチェック
  if (!vtecxnext.checkXRequestedWith(req, res)) {
    return
  }
  // vte.cxへリクエスト
  console.log(`[log] body : ${req.body}`)

  const bodyJson = req.body ? JSON.parse(req.body) : null
  let message:string = ''
  let title:string | undefined
  let subtitle:string | undefined
  if (bodyJson && bodyJson.length > 0) {
    message = bodyJson[0].summary
    title = bodyJson[0].title
    subtitle =  bodyJson[0].subtitle
  }

  console.log(`[log] message=${message} title=${title} subtitle=${subtitle}`)

  let resStatus:number
  let resMessage:string
  try {
    await vtecxnext.log(req, res, message, title, subtitle)
    resStatus = 200
    resMessage = 'post log entry.'
  } catch (error) {
    if (error instanceof VtecxNextError) {
      console.log(`[log] Error occured. status=${error.status} ${error.message}`)
      resStatus = error.status
      resMessage = error.message
    } else {
      console.log(`[log] Error occured. (not VtecxNextError) ${error}`)
      resStatus = 503
      resMessage = 'Error occured.'
    }
  }
  const feed = {feed : {'title' : resMessage}}

  console.log('[log] end.')
  res.status(resStatus).json(feed)
  res.end()
}

export default handler
