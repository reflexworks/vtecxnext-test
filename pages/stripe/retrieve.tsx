import { useState } from 'react'

const Header = ({title} : {title:string}) => {
  return <h1>{title ? title : 'Default title'}</h1>
}

/**
 * ページ関数
 * @returns HTML
 */
 const HomePage = () => {
  const [input_id, setInput_id] = useState('')
  const [option, setOption] = useState('subscription')
  const [limit, setLimit] = useState('')
  const [result, setResult] = useState('')

  /**
   * Stripe情報取得リクエスト
   * API Routeにリクエストする
   * @param isList trueの場合リスト検索、falseの場合id検索
   * @returns API Routeからの戻り値
   */
  const retrieve = async (isList:boolean) => {
    console.log(`[retrieve] start. isList=${isList}`)

    let urlParam:string = ''
    if (isList) {
      // 一覧取得
      urlParam = `list=${option}${input_id ? '&id=' + input_id : ''}${limit ? '&limit=' + limit : ''}`
    } else {
      // id指定
      urlParam = `option=${option}&id=${input_id}`
    }

    let res:Response
    try {
      res = await fetch(`/api/stripe/retrieve?${urlParam}`, {
        method: 'GET',
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
      console.log(`[retrieve] errMsg = ${errMsg}`)
      throw `retrieveでFetchエラー : ${errMsg}`
    }
    const data = await res.json()
    console.log(`[retrieve] data = ${JSON.stringify(data)}`)
    if (!res.ok) {
      throw `retrieveでエラー : ${res.status} `
    }

    if (data) {
      return JSON.stringify(data)
    } else {
      return 'no data'
    }
  }

  const handleClickGet = async () => {
    console.log(`[handleClickGet start]`)
    // id検索
    const retStr = await retrieve(false)
    // 結果表示
    setResult(retStr)
    console.log(`[handleClickGet end]`)
  }

  const handleClickList = async () => {
    console.log(`[handleClickList start]`)
    // id検索
    const retStr = await retrieve(true)
    // 結果表示
    setResult(retStr)
    console.log(`[handleClickList end]`)
  }

  const handleChangeOption = (e:React.ChangeEvent<HTMLSelectElement>) => {
    setOption(e.target.value)
  }

  const handleClickClear = () => {
    setResult('')
  }

  return (
    <main>
      <Header title="Stripe 取引・サブスクリプション・支払い等情報検索" />
      <table>
        <tbody>
          <tr>
            <td><label>機能: </label></td>
            <td>
              <select onChange={(e) => handleChangeOption(e)} value={option}>
            		<option value="subscription">subscription</option>
            		<option value="invoice">invoice</option>
            		<option value="checkout_session">checkout_session</option>
            		<option value="customer">customer</option>
            		<option value="charges">charges</option>
            		<option value="payment_intent">payment_intent</option>
            		<option value="payment_method">payment_method</option>
            		<option value="price">price</option>
            		<option value="product">product</option>
            		<option value="refunds">refunds</option>
            		<option value="setup_intent">setup_intent</option>
            		<option value="subscription_item">subscription_item</option>
            		<option value="subscription_schedules">subscription_schedules</option>
   		        </select>
            </td>
            <td><label>各id: </label></td>
            <td><input type="text" id="input_id" value={input_id}
                       onChange={(event) => setInput_id(event.target.value)} /></td>
            <td>
              <button onClick={handleClickGet}>id検索 (機能、各idを入力)</button>
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <button onClick={handleClickList}>リスト検索 (機能を入力)</button>
            </td>
            <td><label>limit: </label></td>
            <td><input type="text" id="limit" value={limit}
                       onChange={(event) => setLimit(event.target.value)} /></td>
          </tr>
          <tr>
            <td colSpan={5}>
              <button onClick={handleClickClear}>結果クリア</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p>{result}</p>
    </main>
  );
}

export default HomePage
