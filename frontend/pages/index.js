import { useState, useEffect } from 'react'

export default function Home() {
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCoins()
  }, [])

  async function fetchCoins() {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=6&page=1')
      const data = await response.json()
      setCoins(data)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#1a202c', color: 'white', padding: '40px', textAlign: 'center' }}>
        <h1>🧭 CryptoCompass</h1>
        <p>Loading crypto data...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1a202c', color: 'white', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>🧭 CryptoCompass</h1>
        <p style={{ fontSize: '1.2rem', color: '#cbd5e0' }}>Live Crypto Market Data</p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {coins.map((coin) => (
            <div key={coin.id} style={{ background: '#2d3748', padding: '20px', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <img src={coin.image} alt={coin.name} style={{ width: '40px', height: '40px', marginRight: '15px' }} />
                <div>
                  <h3 style={{ margin: '0' }}>{coin.name}</h3>
                  <p style={{ margin: '0', color: '#cbd5e0' }}>{coin.symbol.toUpperCase()}</p>
                </div>
              </div>
              
              <div>
                <p>Price: \${coin.current_price.toFixed(2)}</p>
                <p style={{ color: coin.price_change_percentage_24h > 0 ? '#48bb78' : '#f56565' }}>
                  24h: {coin.price_change_percentage_24h > 0 ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
                </p>
                <p>Market Cap: \${(coin.market_cap / 1e9).toFixed(1)}B</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```_
