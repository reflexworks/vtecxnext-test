import { useState } from 'react'

const Header = ({title} : {title:string}) => {
  return <h1>{title ? title : 'Default title'}</h1>
}

/**
 * ページ関数
 * @returns HTML
 */
 const HomePage = () => {
  const [customer_id, setCustomer_id] = useState('')
  const [result, setResult] = useState('')

  /**
   * Stripe顧客情報リクエスト
   * API Routeにリクエストする
   * @param method 'post':登録、'get':参照
   * @returns API Routeからの戻り値
   */
  const customer = async (method:string) => {
    console.log(`[customer] start.`)
    const urlParam = method === 'GET' ? `customer_id=${customer_id}` : ''

    let res:Response
    try {
      res = await fetch(`/api/stripe/customer?${urlParam}`, {
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
      console.log(`[customer] errMsg = ${errMsg}`)
      throw `customerでFetchエラー : ${errMsg}`
    }
    const data = await res.json()
    console.log(`[customer] data = ${JSON.stringify(data)}`)
    if (!res.ok) {
      throw `customerでエラー : ${res.status} `
    }

    if (data) {
      return JSON.stringify(data)
    } else {
      return 'no data'
    }
  }

  const handleClickPost = async () => {
    console.log(`[handleClickPost start]`)
    // 顧客登録処理
    const retStr = await customer('POST')
    // 結果表示
    setResult(retStr)
    console.log(`[handleClickPost end]`)
  }

  const handleClickGet = async () => {
    console.log(`[handleClickGet start]`)
    // 顧客参照処理
    const retStr = await customer('GET')
    // 結果表示
    setResult(retStr)
    console.log(`[handleClickGet end]`)
  }

  return (
    <div>
      <Header title="Stripe 顧客情報" />
      <button onClick={handleClickPost}>登録</button>
      <table>
        <tbody>
          <tr>
            <td><label>customer_id: </label></td>
            <td><input type="text" id="customer_id" name="customer_id" value={customer_id}
                       onChange={(event) => setCustomer_id(event.target.value)} /></td>
          </tr>
        </tbody>
      </table>
      <button onClick={handleClickGet}>参照</button>
      <p>{result}</p>
    </div>
  );
}

export default HomePage
