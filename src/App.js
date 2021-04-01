import './App.css';

import TransactionLog from './components/TransactionLog';

function App() {

  const now = Date.now();
  const day = 24*60*60*1000;

  const trxList = [
    {
      id: now - 2*day + 14000,
      timestamp: new Date(now - 2*day + 14000),
      side:'BUY',
      symbol:'BTC',
      price: 59120,
      amount: 0.002,
      total: 5.912
    },  // btc -> usd
    {
      id: now - day - 100000,
      timestamp: new Date(now - day - 100000),
      side:'SELL',
      symbol:'BTC',
      price: 58100,
      amount: 0.0001,
      total: 5.81
    },
    {
      id: now - 50000,
      timestamp: new Date(now - 50000),
      side:'BUY',
      symbol:'BTC',
      price: 57220,
      amount: 0.0001,
      total: 5.722
    } 
  ]

  const initialBalance = {
    BTC: 0,
    USD: 1000
  }

  return (
    <div className="App">
      <TransactionLog trxList={trxList} initialBalance={initialBalance}/>
    </div>
  );
}

export default App;
