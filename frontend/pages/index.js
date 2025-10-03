import { useState, useEffect } from 'react';

export default function Home() {
  const [cryptoData, setCryptoData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('');

  useEffect(() => {
    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 300000);
    return () => clearInterval(interval);
  }, []);

  const fetchCryptoData = async () => {
    try {
      // Fetch current market data
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=6&page=1&sparkline=true&price_change_percentage=1h,24h,7d'
      );
      const data = await response.json();
      setCryptoData(data);
      
      // Fetch 7-day chart data for each coin
      const chartPromises = data.slice(0, 3).map(async (coin) => {
        const chartResponse = await fetch(
          `https://api.coingecko.com/api/v3/coins/\${coin.id}/market_chart?vs_currency=usd&days=7&interval=daily`
        );
        const chartData = await chartResponse.json();
        return { id: coin.id, data: chartData.prices };
      });
      
      const charts = await Promise.all(chartPromises);
      const chartsMap = {};
      charts.forEach(chart => {
        chartsMap[chart.id] = chart.data;
      });
      setChartData(chartsMap);
      
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

  const getTrendingIcon = (change1h, change24h, change7d) => {
    if (change24h > 5) return '🔥'; // Hot
    if (change24h > 2) return '📈'; // Rising
    if (change24h < -5) return '💥'; // Crashed
    if (change24h < -2) return '📉'; // Falling
    return '➡️'; // Stable
  };

  const createMiniChart = (prices, isPositive) => {
    if (!prices || prices.length < 2) return null;
    
    const maxPrice = Math.max(...prices.map(p => p[1]));
    const minPrice = Math.min(...prices.map(p => p[1]));
    const range = maxPrice - minPrice;
    
    const points = prices.map((price, index) => {
      const x = (index / (prices.length - 1)) * 100;
      const y = 30 - ((price[1] - minPrice) / range) * 30;
      return `\${x},\${y}`;
    }).join(' ');

    return (
      <svg width="100" height="30" style={{ marginTop: '10px' }}>
        <polyline
          fill="none"
          stroke={isPositive ? "#48bb78" : "#f56565"}
          strokeWidth="2"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 50%, #4a5568 100%)',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{
          fontSize: '4rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '10px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          🧭 CryptoCompass
        </h1>
        <p style={{
          fontSize: '1.4rem',
          color: '#e2e8f0',
          marginBottom: '10px'
        }}>
          Navigate the crypto market with live charts & AI insights
        </p>
        {lastUpdate && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'rgba(102, 126, 234, 0.2)',
            padding: '8px 16px',
            borderRadius: '20px',
            color: '#cbd5e0',
            fontSize: '0.9rem'
          }}>
            🔄 Last updated: {lastUpdate} • Auto-refresh: 5min
          </div>
        )}
      </div>

      {/* Live Data Section */}
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Market Overview Cards */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <h2 style={{
            fontSize: '2.2rem',
            color: 'white',
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            📈 Live Market Dashboard
          </h2>

          {loading ? (
            <div style={{
              textAlign: 'center',
              color: 'white',
              fontSize: '1.2rem',
              padding: '60px'
            }}>
              <div style={{
                display: 'inline-block',
                width: '40px',
                height: '40px',
                border: '4px solid rgba(255,255,255,0.3)',
                borderRadius: '50%',
                borderTopColor: '#667eea',
                animation: 'spin 1s ease-in-out infinite'
              }}></div>
              <p style={{ marginTop: '20px' }}>Loading live crypto data & charts...</p>
            </div>
          ) : (
            <>
              {/* Top 3 Coins with Charts */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '25px',
                marginBottom: '30px'
              }}>
                {cryptoData.slice(0, 3).map((coin) => (
                  <div key={coin.id} style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                    borderRadius: '18px',
                    padding: '25px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Trending Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '15px',
                      right: '15px',
                      fontSize: '1.5rem'
                    }}>
                      {getTrendingIcon(
                        coin.price_change_percentage_1h_in_currency?.usd || 0,
                        coin.price_change_percentage_24h || 0,
                        coin.price_change_percentage_7d_in_currency?.usd || 0
                      )}
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '20px'
                    }}>
                      <img 
                        src={coin.image} 
                        alt={coin.name}
                        style={{
                          width: '50px',
                          height: '50px',
                          marginRight: '15px',
                          borderRadius: '50%',
                          border: '2px solid rgba(255,255,255,0.2)'
                        }}
                      />
                      <div>
                        <h3 style={{
                          color: 'white',
                          margin: '0',
                          fontSize: '1.4rem',
                          fontWeight: 'bold'
                        }}>
                          {coin.name}
                        </h3>
                        <p style={{
                          color: '#cbd5e0',
                          margin: '0',
                          fontSize: '1rem'
                        }}>
                          {coin.symbol.toUpperCase()} • Rank #{coin.market_cap_rank}
                        </p>
                      </div>
                    </div>

                    {/* Price and Change */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '20px'
                    }}>
                      <div>
                        <div style={{
                          fontSize: '1.8rem',
                          fontWeight: 'bold',
                          color: 'white'
                        }}>
                          {formatPrice(coin.current_price)}
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginTop: '5px'
                        }}>
                          <span style={{
                            color: coin.price_change_percentage_24h >= 0 ? '#48bb78' : '#f56565',
                            fontWeight: 'bold',
                            fontSize: '1.1rem'
                          }}>
                            {coin.price_change_percentage_24h >= 0 ? '↗️' : '↘️'} 
                            {Math.abs(coin.price_change_percentage_24h || 0).toFixed(2)}%
                          </span>
                          <span style={{ color: '#a0aec0', marginLeft: '10px' }}>24h</span>
                        </div>
                      </div>
                      
                      {/* Mini Chart */}
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#cbd5e0', fontSize: '0.8rem', marginBottom: '5px' }}>
                          7-day trend
                        </div>
                        {createMiniChart(
                          chartData[coin.id],
                          (coin.price_change_percentage_7d_in_currency?.usd || 0) >= 0
                        )}
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '15px',
                      fontSize: '0.9rem'
                    }}>
                      <div>
                        <div style={{ color: '#a0aec0' }}>Market Cap</div>
                        <div style={{ color: 'white', fontWeight: 'bold' }}>
                          {formatMarketCap(coin.market_cap)}
                        </div>
                      </div>
                      <div>
                        <div style={{ color: '#a0aec0' }}>Volume 24h</div>
                        <div style={{ color: 'white', fontWeight: 'bold' }}>
                          {formatMarketCap(coin.total_volume)}
                        </div>
                      </div>
                      <div>
                        <div style={{ color: '#a0aec0' }}>1h Change</div>
                        <div style={{
                          color: (coin.price_change_percentage_1h_in_currency?.usd || 0) >= 0 ? '#48bb78' : '#f56565',
                          fontWeight: 'bold'
                        }}>
                          {(coin.price_change_percentage_1h_in_currency?.usd || 0) >= 0 ? '+' : ''}
                          {(coin.price_change_percentage_1h_in_currency?.usd || 0).toFixed(2)}%
                        </div>
                      </div>
                      <div>
                        <div style={{ color: '#a0aec0' }}>7d Change</div>
                        <div style={{
                          color: (coin.price_change_percentage_7d_in_currency?.usd || 0) >= 0 ? '#48bb78' : '#f56565',
                          fontWeight: 'bold'
                        }}>
                          {(coin.price_change_percentage_7d_in_currency?.usd || 0) >= 0 ? '+' : ''}
                          {(coin.price_change_percentage_7d_in_currency?.usd || 0).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Remaining Coins - Compact View */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '15px'
              }}>
                {cryptoData.slice(3).map((coin) => (
                  <div key={coin.id} style={{
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    padding: '15px',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <img src={coin.image} alt={coin.name} style={{ width: '30px', height: '30px', marginRight: '10px', borderRadius: '50%' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ color: 'white', fontWeight: 'bold' }}>{coin.symbol.
