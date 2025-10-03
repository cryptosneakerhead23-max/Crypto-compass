import Head from 'next/head';

export default function Home() {
  return (
    <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
      <Head>
        <title>CryptoCompass - Navigate the Altcoin Market</title>
        <meta name="description" content="AI-powered altcoin discovery platform" />
      </Head>

      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', textAlign: 'center'}}>
        <h1 style={{fontSize: '3rem', color: 'white', marginBottom: '20px'}}>
          🧭 CryptoCompass
        </h1>
        <p style={{fontSize: '1.5rem', color: '#e2e8f0', marginBottom: '40px'}}>
          Navigate the altcoin market with AI-powered insights
        </p>
        
        <div style={{background: 'rgba(255,255,255,0.1)', padding: '40px', borderRadius: '20px', color: 'white'}}>
          <h2 style={{fontSize: '2rem', marginBottom: '20px'}}>🚀 Coming Soon!</h2>
          <p style={{fontSize: '1.2rem', marginBottom: '30px'}}>
            Full platform launching with real-time altcoin analysis, AI insights, and smart trading alerts.
          </p>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '40px'}}>
            <div style={{background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '10px'}}>
              <h3>🤖 AI Analysis</h3>
              <p>Smart algorithms detect opportunities</p>
            </div>
            <div style={{background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '10px'}}>
              <h3>📊 Real-Time Data</h3>
              <p>Live market data and instant alerts</p>
            </div>
            <div style={{background: 'rgba(255,255
