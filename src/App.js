import './App.css';

import { Grommet, Main } from 'grommet';


import TransactionLog from './components/TransactionLog';

function App() {

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
