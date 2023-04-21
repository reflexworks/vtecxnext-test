import { GetStaticProps } from 'next'
import Image from 'next/image'
import * as vtecxnext from '@vtecx/vtecxnext'

const Header = ({title} : {title:string}) => {
  return <h1>{title ? title : 'Default title'}</h1>
}

const HomePage = (props:StaticProps) => {
  return (
    <div>
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
        src={props.contentUrl}
        alt="getStaticProps content test"
        width={800}
        height={500}
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

// now
// log
// getEntry
// getFeed
// count
// post
// put
// deleteEntry
// deleteFolder
// allocids
// addids
// getids
// setids
// rangeids
// getRangeids
// getcontenturl

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

    },
    revalidate: intervalSecond,
  }
}

export default HomePage
