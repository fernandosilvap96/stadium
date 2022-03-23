import { ethers, Contract } from 'ethers';
import PaymentProcessor from './build/contracts/PaymentProcessor.json';
import Nft from './build/contracts/nftWithRoyalties.json';
import Erc20 from './build/contracts/erc20Stadium.json';

const Blockchain = () =>

    new Promise((resolve, reject) => {
        window.addEventListener('load', async () => {
            // MetaMask injects the global API into window.ethereum
            if (window.ethereum) {
                try {
                    // check if the chain to connect to is installed
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x61' }], // chainId must be in hexadecimal numbers
                    });

                    //=>await window.ethereum.enable();
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const signer = provider.getSigner();

                    //Os contracts eles são "Binance Smart Chain"
                    
                    const paymentProcessor = new Contract(
                        PaymentProcessor.networks[window.ethereum.networkVersion].address,
                        PaymentProcessor.abi,
                        signer
                    );
                    
                    
                    const erc20 = new Contract(
                        Erc20.networks[window.ethereum.networkVersion].address,
                        Erc20.abi,
                        signer
                    );
                    

                    const nft = new Contract(
                        Nft.networks[window.ethereum.networkVersion].address, 
                        Nft.abi, 
                        signer
                    );


                    resolve({ provider, nft, paymentProcessor, erc20 });

                } catch (error) {
                    // This error code indicates that the chain has not been added to MetaMask
                    // if it is not, then install it into the user MetaMask
                    if (error.code === 4902) {
                        try {
                            await window.ethereum.request({
                                method: 'wallet_addEthereumChain',
                                params: [
                                    {
                                        chainId: '0x61',
                                        rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
                                    },
                                ],
                            });
                        } catch (addError) {
                            console.error(addError);
                        }
                    }
                    console.error(error);
                }//FIM CATCH
            } else {
                // if no window.ethereum then MetaMask is not installed
                alert('MetaMask is not installed. Please consider installing it: https://metamask.io/download.html');
            }
            resolve({ provider: undefined, nft: undefined, paymentProcessor: undefined, erc20: undefined});
            ///.....
            ///.....

        });
    });

export default Blockchain;
