// src/components/OnrampPage.jsx
import { useState, useEffect } from 'react';

export default function OnrampPage() {
  const [sendAmount, setSendAmount] = useState('0');
  const [receiveAmount, setReceiveAmount] = useState('0');
  const [sendCurrency, setSendCurrency] = useState('NGN');
  const [receiveCurrency, setReceiveCurrency] = useState('ETH');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [exchangeRate, setExchangeRate] = useState(1658.21);
  const [loading, setLoading] = useState(false);

  // TODO: Fetch real exchange rate from API
  // API endpoint: GET /api/v1/pricing/quote?from=NGN&to=ETH&amount=1000
  useEffect(() => {
    // Mock exchange rate - replace with real API call
    const fetchExchangeRate = async () => {
      // const response = await fetch(`https://api.aboki.xyz/api/v1/pricing/quote?from=${sendCurrency}&to=${receiveCurrency}`);
      // const data = await response.json();
      // setExchangeRate(data.rate);
    };

    fetchExchangeRate();
  }, [sendCurrency, receiveCurrency]);

  // Calculate receive amount when send amount changes
  useEffect(() => {
    if (sendAmount && sendAmount !== '0') {
      const calculated = parseFloat(sendAmount) / exchangeRate;
      setReceiveAmount(calculated.toFixed(8));
    } else {
      setReceiveAmount('0');
    }
  }, [sendAmount, exchangeRate]);

  const handleSendAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setSendAmount(value);
    }
  };

  const handleSwapCurrencies = () => {
    setSendCurrency(receiveCurrency);
    setReceiveCurrency(sendCurrency);
    setSendAmount(receiveAmount);
    setReceiveAmount(sendAmount);
  };

  const handleBuy = async () => {
    setLoading(true);
    
    // TODO: Implement buy functionality
    // API endpoint: POST /api/v1/business/onramp/create
    /*
    try {
      const token = localStorage.getItem('aboki_token');
      const response = await fetch('https://api.aboki.xyz/api/v1/business/onramp/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: parseFloat(sendAmount),
          currency: sendCurrency,
          targetCurrency: receiveCurrency,
          paymentMethod: paymentMethod
        })
      });

      const result = await response.json();
      if (result.success) {
        alert('Order created successfully!');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order');
    } finally {
      setLoading(false);
    }
    */

    // Mock implementation
    setTimeout(() => {
      alert(`Mock Order: Buy ${receiveAmount} ${receiveCurrency} for ₦${parseFloat(sendAmount).toLocaleString()}`);
      setLoading(false);
    }, 1000);
  };

  const currencies = {
    fiat: [
      { code: 'NGN', name: 'Nigerian Naira', flag: '🇳🇬' }
    ],
    crypto: [
      { code: 'ETH', name: 'Ethereum', icon: '⟠' },
      { code: 'BTC', name: 'Bitcoin', icon: '₿' },
      { code: 'USDC', name: 'USD Coin', icon: '💵' },
      { code: 'USDT', name: 'Tether', icon: '₮' }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Onramp</h1>
          <p className="text-gray-600">Buy crypto with Nigerian Naira</p>
        </div>

        {/* Exchange Card */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          {/* Send Section */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">Send</label>
            <div className="relative">
              <input
                type="text"
                value={sendAmount}
                onChange={handleSendAmountChange}
                placeholder="0"
                className="w-full text-4xl font-bold text-gray-900 bg-transparent outline-none"
              />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                <span className="text-2xl">{currencies.fiat[0].flag}</span>
                <span className="font-semibold text-gray-900">{sendCurrency}</span>
                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center -my-2 relative z-10">
            <button
              onClick={handleSwapCurrencies}
              className="w-10 h-10 bg-white border-4 border-gray-50 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-md"
            >
              <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          {/* Receive Section */}
          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-2">Receive</label>
            <div className="relative">
              <input
                type="text"
                value={receiveAmount}
                readOnly
                placeholder="0"
                className="w-full text-4xl font-bold text-gray-900 bg-transparent outline-none"
              />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                <span className="text-2xl">{currencies.crypto.find(c => c.code === receiveCurrency)?.icon}</span>
                <span className="font-semibold text-gray-900">{receiveCurrency}</span>
                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Exchange Rate */}
          <div className="mb-6 text-center">
            <p className="text-sm text-gray-600">
              {exchangeRate.toFixed(2)} {sendCurrency} = {(1 / exchangeRate).toFixed(8)} {receiveCurrency}
            </p>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-3">Pay via</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <svg className="w-6 h-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Card</span>
              </button>

              <button
                onClick={() => setPaymentMethod('bank')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === 'bank'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <svg className="w-6 h-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Bank</span>
              </button>

              <button
                onClick={() => setPaymentMethod('more')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === 'more'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <svg className="w-6 h-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">More</span>
              </button>
            </div>
          </div>

          {/* Buy Button */}
          <button
            onClick={handleBuy}
            disabled={loading || !sendAmount || sendAmount === '0'}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              `Buy ${receiveCurrency}`
            )}
          </button>
        </div>

        {/* Info Notice */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Transaction Details</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Transactions are processed instantly</li>
                <li>• Network fees may apply</li>
                <li>• Rate is locked for 60 seconds</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}