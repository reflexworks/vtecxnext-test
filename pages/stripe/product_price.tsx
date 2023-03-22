import { useState } from 'react'

const Header = ({title} : {title:string}) => {
  return <h1>{title ? title : 'Default title'}</h1>
}

/**
 * ページ関数
 * @returns HTML
 */
 const HomePage = () => {
  const [product_id, setProduct_id] = useState('')
  const [price_id, setPrice_id] = useState('')
  const [product_name, setProduct_name] = useState('')
  const [price, setPrice] = useState('')
  const [result, setResult] = useState('')

  /**
   * Stripe商品情報リクエスト
   * API Routeにリクエストする
   * @param method 'post':登録、'get':参照
   * @returns API Routeからの戻り値
   */
  const product_price = async (method:string) => {
    console.log(`[product_price] start.`)

    let urlParam:string = ''
    let and = ''
    if (product_id) {
      urlParam += `${and}product_id=${product_id}`
      and = '&'
    }
    if (price_id) {
      urlParam = `price_id=${price_id}`
      and = '&'
    }
    if (product_name) {
      urlParam += `${and}product_name=${product_name}`
      and = '&'
    }
    if (price) {
      urlParam += `${and}price=${price}`
      and = '&'
    }

    let res:Response
    try {
      res = await fetch(`/api/stripe/product_price?${urlParam}`, {
        method: method,
        headers: { 
          'X-Requested-With': 'XMLHttpRequest' 
        }
      })
    } catch (e) {
      let errMsg:string
      if (e instanceof Error) {
        errMsg = `FetchError: ${e.message}`
      } else {
        errMsg = `Unexpected error.`
      }
      console.log(`[product_price] errMsg = ${errMsg}`)
      throw `product_priceでFetchエラー : ${errMsg}`
    }
    const data = await res.json()
    console.log(`[product_price] data = ${JSON.stringify(data)}`)
    if (!res.ok) {
      throw `product_priceでエラー : ${res.status} `
    }

    if (data) {
      return JSON.stringify(data)
    } else {
      return 'no data'
    }
  }

  const handleClickPost = async () => {
    console.log(`[handleClickPost start]`)
    // 商品登録処理
    const retStr = await product_price('POST')
    // 結果表示
    setResult(retStr)
    console.log(`[handleClickPost end]`)
  }

  const handleClickGet = async () => {
    console.log(`[handleClickGet start]`)
    // 商品・価格参照処理
    const retStr = await product_price('GET')
    // 結果表示
    setResult(retStr)
    console.log(`[handleClickGet end]`)
  }

  return (
    <div>
      <Header title="Stripe 商品情報" />
      <table>
        <tbody>
          <tr>
            <td><label>商品名: </label></td>
            <td><input type="text" id="product_name" name="product_name" value={product_name}
                       onChange={(event) => setProduct_name(event.target.value)} /></td>
            <td><label>product_id: </label></td>
            <td><input type="text" id="product_id" name="product_id" value={product_id}
                       onChange={(event) => setProduct_id(event.target.value)} /></td>
          </tr>
          <tr>
            <td><label>価格: </label></td>
            <td><input type="text" id="price" name="price" value={price}
                       onChange={(event) => setPrice(event.target.value)} /></td>
          </tr>
          <tr>
            <td><label>定期購入: </label></td>
            <td><label>週ごと</label></td>
          </tr>
        </tbody>
      </table>
      <button onClick={handleClickPost}>登録 (商品名 か product_id、価格を入力)</button>
      <table>
        <tbody>
          <tr>
            <td><label>price_id: </label></td>
            <td><input type="text" id="price_id" name="price_id" value={price_id}
                       onChange={(event) => setPrice_id(event.target.value)} /></td>
          </tr>
        </tbody>
      </table>
      <button onClick={handleClickGet}>参照 (price_id か product_id を入力)</button>
      <p>{result}</p>
    </div>
  );
}

export default HomePage
