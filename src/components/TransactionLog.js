import React, { useState, useEffect } from "react";
import KeyboardEventHandler from 'react-keyboard-event-handler';

function TransactionLog(props) {

  let initialBalance = {
    BTC: props.initialBalance.BTC,
    USD: props.initialBalance.USD
  };

  const usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  const initialList = [];

  props.trxList.forEach(t => {

    if (t.side === 'BUY') {
      initialBalance.BTC = initialBalance.BTC + t.amount;
      initialBalance.USD = initialBalance.USD - t.total;
    } else if (t.side === 'SELL') {
      initialBalance.BTC = initialBalance.BTC - t.amount;
      initialBalance.USD = initialBalance.USD + t.total;
    }

    initialList.push({
      id: t.id,
      timestamp: t.timestamp,
      side: t.side,
      symbol: t.symbol,
      price: t.price,
      amount: t.amount,
      total: t.total,
      balanceBTC: initialBalance.BTC,
      balanceUSD: initialBalance.USD
    });
  });

  const [balance, setBalance] = useState(initialBalance);
  const [trxList, setTrxList] = useState(initialList);

  function addTrx() {
    const now = Date.now();
    const t = {
      id: now,
      timestamp: new Date(now),
      side:'BUY',
      symbol:'BTC',
      price: 57220,
      amount: 0.0001,
      total: 5.722
    }

    let b = {
      BTC: balance.BTC,
      USD: balance.USD,
    }
    if (t.side === 'BUY') {
      b.BTC = b.BTC + t.amount;
      b.USD = b.USD - t.total;
    } else if (t.side === 'SELL') {
      b.BTC = b.BTC - t.amount;
      b.USD = b.USD + t.total;
    }

    setBalance(b);

    t.balanceUSD = b.USD;
    t.balanceBTC = b.BTC;

    setTrxList([...trxList, t]);
  }

  function handleKey(key, event) {
    console.log(event.code == 'ShiftRight');
    if (event.code == 'ShiftLeft') {
      addTrx();
    }
  }


  let trxListRows = trxList.map((trx) => 
    <tr key={trx.id}>
      <td>{trx.timestamp.toLocaleString('es-AR')}</td>
      <td><span style={
      {fontWeight: 'bold', color: trx.side === 'SELL' ? 'red' : 'green'}
        }>{trx.side}</span></td>
      <td>{trx.symbol}</td>
      <td>{usdFormatter.format(trx.price)}</td>
      <td>{trx.amount.toFixed(6)}</td>
      <td>{usdFormatter.format(trx.total)}</td>
      <td>{trx.balanceBTC.toFixed(6)}</td>
      <td>{usdFormatter.format(trx.balanceUSD)}</td>
    </tr>
  );
  trxListRows = trxListRows.slice(-10);

  return <>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Operation</th>
          <th>Currency</th>
          <th>Price</th>
          <th>Amount</th>
          <th>Total</th>
          <th>Balance (BTC)</th>
          <th>Balance (USD)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colSpan={6}></td>
          <td>{props.initialBalance.BTC}</td>
          <td>${props.initialBalance.USD}</td>
        </tr>
        {trxListRows}
      </tbody>
    </table>
    <button onClick={addTrx}>Buy</button>
    <KeyboardEventHandler
      handleKeys={['shift']}
      onKeyEvent={(key,e) => handleKey(key, e)} />
  </>;
}

export default TransactionLog;
