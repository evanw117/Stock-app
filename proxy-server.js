const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Replace with your actual API key
const FINNHUB_API_KEY = 'd091qopr01qnv4s1otq0d091qopr01qnv4s1otqg';

app.use(cors());

// Test route
app.get('/', (req, res) => {
  res.send('✅ Proxy server is running');
});

// Candle (historical prices) proxy endpoint
app.get('/stock/:symbol', async (req, res) => {
  const { symbol } = req.params;

  const now = Math.floor(Date.now() / 1000);
  const sevenDaysAgo = now - 7 * 24 * 60 * 60;

  const url = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${sevenDaysAgo}&to=${now}&token=${FINNHUB_API_KEY}`;

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0' // helps avoid 403 forbidden
      }
    });

    res.json(response.data);
  } catch (err) {
    console.error('❌ Proxy error:', err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || 'Something went wrong' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running at http://localhost:${PORT}`);
});
