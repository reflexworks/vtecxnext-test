import { NextRequest } from 'next/server'
import { VtecxNext, VtecxNextError } from '@vtecx/vtecxnext'

export const GET = async (req:NextRequest):Promise<Response> => {
  console.log(`[api healthcheck] start.`)

  const vtecxnext = new VtecxNext(req)

  return vtecxnext.response(200)
}
