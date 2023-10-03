import Iframe from 'react-iframe'

/**
 * ページ関数
 * @returns HTML
 */
const HomePage = () => {

  const pdfUrl = `${process.env.NEXT_PUBLIC_VTECXNEXT_URL ?? ''}/api/vtecx/pdf2`
  console.log(`[viewpdf] pdfUrl=${pdfUrl}`)

  return (
    <div>
      <Iframe id = 'page1'
              url = {pdfUrl}
              position='absolute'
              width='100%'
              height='100%'/>
    </div>
  )

}

export default HomePage
