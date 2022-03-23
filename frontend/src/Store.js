import React from 'react';
import { useState } from 'react';
//const { setupLoader } = require('@openzeppelin/contract-loader');
//const Web3 = require('web3');



function Store({ paymentProcessor, nft, provider, erc20 }) {

    
    const [vipAmount, setVipAmount] = useState("0");
    const [premiumAmount, setPremiumAmount] = useState("0");
    const [category1Amount, setCategory1Amount] = useState("0");
    const [category2Amount, setCategory2Amount] = useState("0");
    

    const buy = async () => {

        if (window.ethereum) {
            await window.ethereum.enable();
            const signer = provider.getSigner();
            const address = await signer.getAddress();

            //const loader = setupLoader({ provider }).web3;

            //const erc20Address = '0x5Db5eA12aA2064c4b3Bb3a07Cf5E9C18988b9895';
            //const erc20 = loader.fromArtifact('ERC20', erc20Address);

            /*
            const name = await erc20.methods.name().call();
            const symbol = await erc20.methods.symbol().call();
            const decimals = await erc20.methods.decimals().call();
            const totalSupply = await erc20.methods.totalSupply().call();
            console.log(`${name} (${symbol}) - Decimals:${decimals} Total Supply:${totalSupply}`);
            */
            const totalAmountInt = 10;

            const totalAmountStr = totalAmountInt.toString();

            //const valor = 100000000000;
            //const totalAmountStr = valor.toString()

            const paymentId = (Math.random() * 10000).toFixed(0);

            //APPROVE TX ==> OK

            
            try {
                const tx1 = await erc20.approve('0x574cCaeFa830C2112B46479DFc09fdf1a5c35E3d', totalAmountStr);
                await tx1.wait();
            } catch (error) {
                console.log('That approvement did not go well.')
            }
            


            //PAY TX ==> OK
            
            let payed = false;

            try {
                const tx2 = await paymentProcessor.pay(totalAmountStr, paymentId);
                await tx2.wait();
                payed = true;

            } catch (error) {
                console.log('That payment did not go well.')
            }

            const arrURIs = [];

            // LOOP FOR VIP
            if (vipAmount > 0) {
                const vipSupply = await nft.vipSupply();
                console.log('vipSupply: ' + vipSupply);
                for (let i = vipSupply; i > (vipSupply - vipAmount); i--) {
                    arrURIs.push(i);
                }
            }

            // LOOP FOR PREMIUM
            if (premiumAmount > 0) {
                const premiumSupply = await nft.premiumSupply();
                console.log('premiumSupply: ' + premiumSupply);;
                for (let i = premiumSupply; i > (premiumSupply - premiumAmount); i--) {
                    arrURIs.push(i);
                    console.log('i = ' + i);
                }
            }

            // LOOP FOR CATEGORY 1
            if (category1Amount > 0) {
                const category1Supply = await nft.category1Supply();
                console.log('category1Supply: ' + category1Supply);;
                for (let i = category1Supply; i > (category1Supply - category1Amount); i--) {
                    arrURIs.push(i);
                }
            }

            // LOOP FOR CATEGORY 2
            if (category2Amount > 0) {
                const category2Supply = await nft.category2Supply();
                console.log('category2Supply: ' + category2Supply);;
                for (let i = category2Supply; i > (category2Supply - category2Amount); i--) {
                    arrURIs.push(i);
                }
            }

            const cantidad =
                parseInt(vipAmount) +
                parseInt(premiumAmount) +
                parseInt(category1Amount) +
                parseInt(category2Amount);

            console.log("cantidad: " + cantidad);
            console.log(arrURIs);

            //MINTAR SÓ SE PaymentProcessor Pay

            console.log("Payed : " + payed);

            if (payed) {
                try {
                    await nft.mint(
                        address, cantidad, arrURIs,
                        vipAmount, premiumAmount,
                        category1Amount, category2Amount
                    );
                    await new Promise(resolve => setTimeout(resolve, 5000));
                } catch (error) {
                    console.log('That minting did not go well.')
                }
            }
            

        }
    }

    return (
        <div className="Minter">

            <h1 id="title">Minter</h1>
            <p>
                informe a quantidade e categoria dos itens que deseja reservar:
            </p>

            <form>
                <h2>VIP</h2>
                <input
                    type="number"
                    min="0"
                onChange={(event) => setVipAmount(event.target.value)}
                />
                <h2>PREMIUM</h2>
                <input
                    type="number"
                    min="0"
                onChange={(event) => setPremiumAmount(event.target.value)}
                />
                <h2>CATEGORY 1</h2>
                <input
                    type="number"
                    min="0"
                onChange={(event) => setCategory1Amount(event.target.value)}
                />
                <h2>CATEGORY 2</h2>
                <input
                    type="number"
                    min="0"
                onChange={(event) => setCategory2Amount(event.target.value)}
                />
                <button
                    type='button'
                    onClick={() => buy()}
                >
                    RESERVE
                </button>
            </form>
            <hr />
        </div>

    );
}

export default Store;