import * as browserutil from 'utils/browserutil'

const intervalSecond = 20

export const now = async (): Promise<string> => {
  console.log(`[now] start.`)
  const data = await browserutil.requestApi('GET', 'info', 'type=now', undefined, undefined, undefined, undefined, intervalSecond)
  let result = 'undefined'
  if (!data) {
    console.log(`[now] data is null.`)
    result = `no data.`
  } else if (data.hasOwnProperty('feed')) {
    const feedStr = JSON.stringify(data)
    console.log(`[now] data=${feedStr}`)
    result = data.feed.title
  }
  console.log(`[now] end. result = ${result}`)
  return result
}

// propsの型を定義する
export type Props = {
  now?: string
}
