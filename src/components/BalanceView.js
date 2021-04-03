import React, { useState, useEffect } from "react";
import {
  Box,
} from 'grommet';
import Binance from 'node-binance-api';

const refreshRate = 1000; // WARNING: Never < 1000
const binance = new Binance();

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

const BTCPriceQuote = (props) => {
  return <span>BTC/BUSD: <strong>{
    props.value > 0 ?
      usdFormatter.format(props.value) :
      '-'
  }</strong></span>;
};

function BalanceView(props) {

  const [currentPrice, setPrice] = useState(-1);

  useEffect(
    () => {
      const fetchPrice = () => {

        binance.prices('BTCBUSD', (error, ticker) => {
          if (error) return console.error(error);
          setPrice(ticker.BTCBUSD);
        });
      }

      const id = setInterval(fetchPrice, refreshRate);
      return () => clearInterval(id);
    },
    [currentPrice]
  );

  return <Box
    background="dark-1"
    gap="medium"
    direction="row"
    justify="between"
    pad="medium"
    margin={{"bottom": "small"}}
  >
      <BTCPriceQuote value={currentPrice}/>
      <span>BALANCE
        BTC: <strong>{props.balance.BTC.toFixed(6)}</strong> |
        USD: <strong>{usdFormatter.format(props.balance.USD)}</strong>
      </span>
    <span>Total: <strong>{currentPrice > 0 && `${usdFormatter.format(currentPrice * props.balance.BTC + props.balance.USD)}`}</strong></span>
    </Box>

}

export default BalanceView;
