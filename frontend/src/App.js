import React, { useEffect, useState } from "react";
import Store from './Store.js';
import Blockchain from './Blockchain.js';

function App() {
  const [nft, setNft] = useState(undefined);
  const [paymentProcessor, setPaymentProcessor] = useState(undefined);
  const [provider, setProvider] = useState(undefined);
  const [erc20, setErc20] = useState(undefined);
  


  useEffect(() => {
    const init = async () => {
      const { nft, paymentProcessor, provider, erc20 } = await Blockchain();
      setPaymentProcessor(paymentProcessor);
      setNft(nft);
      setProvider(provider);
      setErc20(erc20);
    }
    init();
  }, []);

  if (typeof window.ethereum === 'undefined') {
    return (
      <div className='container'>
        <h1>Blockchain App</h1>
        <p>You need to install the latest version of Metamask</p>
      </div>
    );
  }

  return (
    <div className='container'>
      <h1>Blockchain App</h1>
      <Store paymentProcessor={paymentProcessor} nft={nft} provider={provider} erc20={erc20}/>
    </div>
  )

}
export default App;