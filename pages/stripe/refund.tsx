import { useState } from 'react'

const Header = ({title} : {title:string}) => {
  return <h1>{title ? title : 'Default title'}</h1>
}

/**
 * ページ関数
 * @returns HTML
 */
 const HomePage = () => {
  const [payment_intent, setPayment_intent] = useState('')
  const [amount, setAmount] = useState('')
  const [result, setResult] = useState('')

  /**
   * Stripe返金リクエスト
   * API Routeにリクエストする
   * @returns API Routeからの戻り値
   */
  const refund = async () => {
    console.log('[refund] start.')
    const method = 'POST'
    const urlParam = `payment_intent=${payment_intent}${amount ? '&amount=' + new String(amount) : ''}`

    let res:Response
    try {
      res = await fetch(`/api/stripe/create-refund?${urlParam}`, {
        method: 'POST',
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
      console.log(`[refund] errMsg = ${errMsg}`)
      throw `refundでFetchエラー : ${errMsg}`
    }
    const data = await res.json()
    console.log(`[refund] data = ${JSON.stringify(data)}`)
    if (!res.ok) {
      throw `refundでエラー : ${res.status} `
    }

    if ('feed' in data) {
      return data.feed.title
    } else {
      return 'no feed'
    }
  }

  const handleClick = async () => {
    console.log(`[handleClick start]`)
    // 返金処理
    const retStr = await refund()
    // 結果表示
    setResult(retStr)
    console.log(`[handleClick end]`)
  }

  return (
    <div>
      <Header title="Stripe 返金処理" />
      <table>
        <tbody>
          <tr>
            <td><label>payment_intent: </label></td>
            <td><input type="text" id="payment_intent" name="payment_intent" value={payment_intent}
                       onChange={(event) => setPayment_intent(event.target.value)} /></td>
          </tr>
          <tr>
            <td><label>amount: </label></td>
            <td><input type="text" id="amount" name="amount" value={amount}
                       onChange={(event) => setAmount(event.target.value)} /></td>
          </tr>
        </tbody>
      </table>
      <button onClick={handleClick}>返金</button>
      <p>{result}</p>
    </div>
  );
}

export default HomePage
