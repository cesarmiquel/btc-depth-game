import React, { useState } from "react";

import {
  Accordion,
  AccordionPanel,
  Box,
  Button,
  DataTable,
  FormField,
  TextInput,
  RangeInput,
} from 'grommet';

import BalanceView from './BalanceView';
import KeyboardEventHandler from 'react-keyboard-event-handler';

import Binance from 'node-binance-api';

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

  const minBalanceBTC = 0.000000001;
  const minBalanceUSD = 0.000000001;

  const sellColor = '#f01100';
  const buyColor  = '#10a000';

  const [balance, setBalance] = useState(initialBalance);
  const [trxList, setTrxList] = useState(initialList);
  const [buyPercentage, setBuyPercentage] = useState(0.1);
  const [sellPercentage, setSellPercentage] = useState(0.1);
  const [addingTrx, setAddingTrx] = useState(false);

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
    });
  });

  function addBuyTrx() {

    if (balance.USD < minBalanceUSD) {
      return;
    }

    // Lock UI
    setAddingTrx(true);

    const binance = new Binance();
    binance.prices('BTCTUSD', (error, ticker) => {

      if (error) return console.error(error);

      const amount = buyPercentage * balance.USD / ticker.BTCTUSD;

      const t = {
        timestamp: new Date(),
        side: 'BUY',
        symbol: 'BTC',
        price: ticker.BTCTUSD,
        amount: amount
      }

      let b = {
        BTC: balance.BTC + amount,
        USD: balance.USD - buyPercentage * balance.USD
      }

      setBalance(b);

      t.balanceUSD = b.USD;
      t.balanceBTC = b.BTC;

      setTrxList([...trxList, t]);

      setAddingTrx(false);
    });
  }

  function addSellTrx() {

    if (balance.BTC < minBalanceBTC) {
      return;
    }

    // Lock UI
    setAddingTrx(true);

    const binance = new Binance();
    binance.prices('BTCTUSD', (error, ticker) => {

      if (error) return console.error(error);

      const amount = sellPercentage * balance.BTC;

      const t = {
        timestamp: new Date(),
        side: 'SELL',
        symbol: 'BTC',
        price: ticker.BTCTUSD,
        amount: amount
      }

      let b = {
        BTC: balance.BTC - amount,
        USD: balance.USD + amount * ticker.BTCTUSD
      }

      setBalance(b);

      t.balanceUSD = b.USD;
      t.balanceBTC = b.BTC;

      setTrxList([...trxList, t]);

      setAddingTrx(false);
    });
  }

  function handleKey(key, event) {
    if (event.code == 'ShiftLeft') {
      addBuyTrx();
    } else if (event.code == 'ShiftRight') {
      addSellTrx();
    }
  }

  return <>
    <BalanceView balance={balance} />
    <DataTable
      columns={[
        {
          property: 'timestamp',
          header: 'Date',
          primary: false,
          render: datum => (datum.timestamp.toLocaleString('es-AR'))
        },
        {
          property: 'side',
          header: 'Op.',
          render: datum => (
            <span style={{fontWeight: 'bold', color: datum.side === 'SELL' ? sellColor : buyColor}}>
              {datum.side}</span>
          ),
        },
        {
          property: 'symbol',
          header: 'Symbol',
          primary: false,
        },
        {
          property: 'amount',
          header: 'Amount',
          primary: false,
          render: datum => datum.amount.toFixed(6)
        },
        {
          property: 'price',
          header: 'Price',
          primary: false,
          render: datum => usdFormatter.format(datum.price)
        },
      ]}
      data={trxList.slice(-6)}
    />
    <Box direction="row" justify="between" margin={{"bottom": "small"}}>
      <Button color={buyColor} margin="small" disabled={addingTrx} primary onClick={addBuyTrx} label="Buy" />
      <Button color={sellColor} margin="small" disabled={addingTrx} primary onClick={addSellTrx} label="Sell" />
    </Box>
    <Accordion>
      <AccordionPanel label="Configuration">
        <Box direction="row" pad="medium">
          <FormField label="% of USD Balance to use buying">
            <RangeInput
              name="sellPcnt"
              min={0}
              max={1}
              step={0.1}
              value={buyPercentage}
              onChange={ event => setBuyPercentage(event.target.value) }
            />{buyPercentage * 100}%
          </FormField>
          <FormField label="% of BTC Balance to use when selling">
            <RangeInput
              name="sellPcnt"
              min={0}
              max={1}
              step={0.1}
              value={sellPercentage}
              onChange={ event => setSellPercentage(event.target.value) }
            />{sellPercentage * 100}%
          </FormField>
        </Box>
      </AccordionPanel>
    </Accordion>
    <KeyboardEventHandler
      handleKeys={['shift']}
      onKeyEvent={(key,e) => handleKey(key, e)} />
  </>;
}

export default TransactionLog;
