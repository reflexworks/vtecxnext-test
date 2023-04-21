import { GetStaticProps } from 'next'
import Image from 'next/image'
import * as vtecxnext from '@vtecx/vtecxnext'

const Header = ({title} : {title:string}) => {
  return <h1>{title ? title : 'Default title'}</h1>
}

const HomePage = (props:StaticProps) => {

  return (
    <div>
      <Image
        src="data:image/png;base64,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"
        alt="getStaticProps content test(0)"
        width={100}
        height={100}
      />


      <Header title="vtecxnext StaticProp テスト画面" />
      <br/>
      <label>【now】 {props.datetime}</label>
      <br/>
      <label>【log】{String(props.retLog)}</label>
      <br/>
      <label>【postEntry】 {JSON.stringify(props.retPostEntry)}</label>
      <br/>
      <label>【putEntry】 {JSON.stringify(props.retPutEntry)}</label>
      <br/>
      <label>【entry】 {JSON.stringify(props.entry)}</label>
      <br/>
      <label>【feed】 {JSON.stringify(props.feed)}</label>
      <br/>
      <label>【count】 {String(props.count)}</label>
      <br/>
      <label>【deleteEntry】 {String(props.retDeleteEntry)}</label>
      <br/>
      <label>【contentUrl】 {props.contentUrl}</label>
      <br/>
      <Image
        src={props.imgsrc}
        alt="getStaticProps content test"
        width={200}
        height={200}
      />
 
    </div>
  )
}

const intervalSecond = 30

interface StaticProps {
  datetime: string,
  retLog: boolean,
  retPostEntry: any, 
  retPutEntry: any,
  entry: any,
  feed: any,
  count: number|null,
  retDeleteEntry: boolean,
  contentUrl: string,
  imgsrc: string,
  
}

// ビルド時、または一定時間ごとに呼び出される
export const getStaticProps: GetStaticProps<StaticProps> = async () => {
  // posts を取得するために外部 API をコールします。
  // どんなデータ取得ライブラリでも使用できます。
  const datetime = await vtecxnext.now()
  const retLog = await vtecxnext.log(undefined, undefined, 'exec getStaticProps.', 'staticprops test')
  const folder = '/anyone'
  const testEntryPost = {
    'title': 'getStaticProps test'
  }
  const testEntryUri = `${folder}/test`
  const testEntry = {
    "link": [
      {
          "___href": testEntryUri,
          "___rel": "self"
      }
    ],
    'title': 'getStaticProps test (anyone data)'
  }
  const contentKey = `${folder}/image.png`
 
  const retPostEntry = await vtecxnext.post(undefined, undefined, testEntryPost, folder)
  console.log(`[getStaticProps] post end. retPostEntry=${JSON.stringify(retPostEntry)}`)
  const postUri = retPostEntry[0].id.substring(0, retPostEntry[0].id.indexOf(','))
  const retPutEntry = await vtecxnext.put(undefined, undefined, testEntry)
  console.log(`[getStaticProps] put end.`)
  const entry = await vtecxnext.getEntry(undefined, undefined, testEntryUri)
  console.log(`[getStaticProps] getEntry end.`)
  const feed = await vtecxnext.getFeed(undefined, undefined, folder)
  console.log(`[getStaticProps] getFeed end.`)
  const count = await vtecxnext.count(undefined, undefined, folder)
  console.log(`[getStaticProps] count end.`)
  const retDeleteEntry = await vtecxnext.deleteEntry(undefined, undefined, postUri)
  console.log(`[getStaticProps] deleteEntry end.`)
  const contentUrl = await vtecxnext.getcontenturl(contentKey)
  console.log(`[getStaticProps] getcontenturl end.`)
  const imgsrc = await getImageSrc(contentUrl)
  console.log(`[getStaticProps] imgsrc=${imgsrc}`)

  // { props: { posts } } を返すことで、Blog コンポーネントはビルド時に
  // `posts` を prop として受け取ります。
  return {
    props: {
      datetime,
      retLog,
      retPostEntry,
      retPutEntry,
      entry,
      feed,
      count,
      retDeleteEntry,
      contentUrl,
      imgsrc,

    },
    revalidate: intervalSecond,
  }
}

const getImageSrc = async (contentUrl:string):Promise<string> => {
  const headers:any = {}
  const VTECX_SERVICENAME = process.env.VTECX_SERVICENAME ?? ''
  if (VTECX_SERVICENAME) {
    headers['X-SERVICENAME'] = VTECX_SERVICENAME  // localhostテスト用
  }

  const requestInit:RequestInit = {
    method: 'GET',
    headers: headers
  }
  const res = await fetch(contentUrl, requestInit)
  const blob = await res.blob()
  const arrayBuffer = await blob.arrayBuffer()
  return `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`
}

export default HomePage
