import { useState, useEffect } from 'react';

export default function Home() {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('');

  useEffect(() => {
    fetchCryptoData();
    // Update every 5 minutes
    const interval = setInterval(fetchCryptoData, 300000);
    return () => clearInterval(interval);
  }, []);

  const fetchCryptoData = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=6&page=1&sparkline=false&price_change_percentage=24h'
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

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{
          fontSize: '3.5rem',
          color: 'white',
          marginBottom: '10px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          🧭 CryptoCompass
        </h1>
        <p style={{
          fontSize: '1.3rem',
          color: '#e2e8f0',
          marginBottom: '10px'
        }}>
          Navigate the altcoin market with AI-powered insights
        </p>
        {lastUpdate && (
          <p style={{ color: '#cbd5e0', fontSize: '0.9rem' }}>
            Last updated: {lastUpdate} • Updates every 5 minutes
          </p>
        )}
      </div>

      {/* Live Data Section */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px'
        }}>
          <h2 style={{
            fontSize: '2rem',
            color: 'white',
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            📈 Live Crypto Market Data
          </h2>

          {loading ? (
            <div style={{ textAlign: 'center', color: 'white', fontSize: '1.2rem' }}>
              🔄 Loading live crypto data...
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '20px'
            }}>
              {cryptoData.map((coin) => (
                <div key={coin.id} style={{
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '15px',
                  padding: '20px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '15px'
                  }}>
                    <img 
                      src={coin.image} 
                      alt={coin.name}
                      style={{
                        width: '40px',
                        height: '40px',
                        marginRight: '15px',
                        borderRadius: '50%'
                      }}
                    />
                    <div>
                      <h3 style={{
                        color: 'white',
                        margin: '0',
                        fontSize: '1.2rem'
                      }}>
                        {coin.name} ({coin.symbol.toUpperCase()})
                      </h3>
                      <p style={{
                        color: '#cbd5e0',
                        margin: '0',
                        fontSize: '0.9rem'
                      }}>
                        Rank #{coin.market_cap_rank}
                      </p>
                    </div>
                  </div>

                  <div style={{ color: 'white' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '8px'
                    }}>
                      <span>Price:</span>
                      <span style={{ fontWeight: 'bold' }}>
                        {formatPrice(coin.current_price)}
                      </span>
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '8px'
                    }}>
                      <span>24h Change:</span>
                      <span style={{
                        color: coin.price_change_percentage_24h >= 0 ? '#48bb78' : '#f56565',
                        fontWeight: 'bold'
                      }}>
                        {coin.price_change_percentage_24h >= 0 ? '↗️' : '↘️'} 
                        {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                      </span>
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '8px'
                    }}>
                      <span>Market Cap:</span>
                      <span>{formatMarketCap(coin.market_cap)}</span>
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}>
                      <span>Volume 24h:</span>
                      <span>{formatMarketCap(coin.total_volume)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Features Section */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '30px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: 'white', marginBottom: '20px' }}>
            🚀 Coming Soon: Advanced Features
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            <div style={{ color: 'white' }}>
              <h3>🤖 AI Analysis</h3>
              <p>Smart algorithms detect opportunities</p>
            </div>
            <div style={{ color: 'white' }}>
              <h3>⚡ Smart Alerts</h3>
              <p>Real-time trading notifications</p>
            </div>
            <div style={{ color: 'white' }}>
              <h3>🎯 Risk Assessment</h3>
              <p>Built-in risk management tools</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
