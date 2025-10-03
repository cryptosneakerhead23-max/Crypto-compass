import { useState, useEffect } from 'react';

export default function Home() {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('');

  useEffect(() => {
    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 300000);
    return () => clearInterval(interval);
  }, []);

  const fetchCryptoData = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=8&page=1&sparkline=false&price_change_percentage=1h,24h,7d'
      );
      const data = await response.json();
      setCryptoData(data);
      setLoading(false);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatMarketCap = (marketCap) => {
    if (marketCap >= 1e12) return `\$\${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `\$\${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `\$\${(marketCap / 1e6).toFixed(2)}M`;
    return `\$\${marketCap.toFixed(0)}`;
  };

  const getTrendIcon = (change24h) => {
    if (change24h > 5) return '🔥';
    if (change24h > 0) return '📈';
    if (change24h < -5) return '💥';
    if (change24h < 0) return '📉';
    return '➡️';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
      padding: '20px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{
          fontSize: '3.5rem',
          color: 'white',
          marginBottom: '10px'
        }}>
          🧭 CryptoCompass
        </h1>
        <p style={{ fontSize: '1.3rem', color: '#e2e8f0' }}>
          Navigate the crypto market with live data & charts
        </p>
        {lastUpdate && (
          <p style={{ color: '#cbd5e0', fontSize: '0.9rem' }}>
            🔄 Updated: {lastUpdate}
          </p>
        )}
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '20px',
          padding: '30px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <h2 style={{ color: 'white', textAlign: 'center', marginBottom: '30px' }}>
            📈 Live Crypto Market
          </h2>

          {loading ? (
            <div style={{ textAlign: 'center', color: 'white', padding: '40px' }}>
              Loading crypto data...
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '20px'
            }}>
              {cryptoData.map((coin) => (
                <div key={coin.id} style={{
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '15px',
                  padding: '20px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <img 
                      src={coin.image} 
                      alt={coin.name}
                      style={{ width: '40px', height: '40px', marginRight: '15px', borderRadius: '50%' }}
                    />
                    <div style={{ flex: 1 }}>
                      <h3 style={{ color: 'white', margin: '0', fontSize: '1.2rem' }}>
                        {coin.name} ({coin.symbol.toUpperCase()})
                      </h3>
                      <p style={{ color: '#cbd5e0', margin: '0' }}>
                        Rank #{coin.market_cap_rank}
                      </p>
                    </div>
                    <div style={{ fontSize: '1.5rem' }}>
                      {getTrendIcon(coin.price_change_percentage_24h || 0)}
                    </div>
                  </div>

                  <div style={{ color: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span>Price:</span>
                      <span style={{ fontWeight: 'bold' }}>{formatPrice(coin.current_price)}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span>24h Change:</span>
                      <span style={{
                        color: (coin.price_change_percentage_24h || 0) >= 0 ? '#48bb78' : '#f56565',
                        fontWeight: 'bold'
                      }}>
                        {(coin.price_change_percentage_24h || 0) >= 0 ? '+' : ''}
                        {(coin.price_change_percentage_24h || 0).toFixed(2)}%
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span>Market Cap:</span>
                      <span>{formatMarketCap(coin.market_cap)}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Volume:</span>
                      <span>{formatMarketCap(coin.total_volume)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '20px',
          padding: '30px',
          marginTop: '30px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: 'white', marginBottom: '20px' }}>🚀 Advanced Features Coming Soon</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div style={{ color: 'white' }}>
              <h3>🤖 AI Analysis</h3>
              <p>Smart trading insights</p>
            </div>
            <div style={{ color: 'white' }}>
              <h3>⚡ Smart Alerts</h3>
              <p>Price notifications</p>
            </div>
            <div style={{ color: 'white' }}>
              <h3>📊 Advanced Charts</h3>
              <p>Interactive price graphs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```_
