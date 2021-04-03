import './App.css';

import { Grommet, Main } from 'grommet';


import TransactionLog from './components/TransactionLog';

function App() {

  const now = Date.now();
  const day = 24*60*60*1000;

  const trxList = []

  const initialBalance = {
    BTC: 0,
    USD: 1000
  }

  return (
    <Grommet plain>
      <Main pad="medium">
        <TransactionLog trxList={trxList} initialBalance={initialBalance}/>
      </Main>
    </Grommet>
  );
}

export default App;
