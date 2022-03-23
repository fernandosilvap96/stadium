//Deploy Payment Processor
const PaymentProcessor = artifacts.require("PaymentProcessor");

module.exports = async function (deployer, network, addresses) {
  const [admin, payer, _] = addresses;

  if (network === 'develop') {
    //do sth great
  } else {

    //const erc20 = await Erc20.deployed();
    const erc20 = '0x5Db5eA12aA2064c4b3Bb3a07Cf5E9C18988b9895';
    await deployer.deploy(PaymentProcessor, admin, erc20);
  }
};

// Eu vou Processar Pagamentos (pay) e enviar para o Admin