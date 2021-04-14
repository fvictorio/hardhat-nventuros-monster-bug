// This address is deterministic, so we just store it here
const {Address} = require("ethereumjs-util")
const CONTRACT_ADDRESS = "0x0dcd1bf9a1b36ce34237eeafef220932846bcd82";
const contractAddress = Address.fromString(CONTRACT_ADDRESS)


async function main() {
  const [a] = await network.provider.send("eth_accounts");

  const stateManager = network.provider._wrapped._wrapped._wrapped._wrappedProvider._node._stateManager;

  // send 13 txs
  await network.provider.send("eth_sendTransaction", [{ from: a, to: a }]);
  await network.provider.send("eth_sendTransaction", [{ from: a, to: a }]);
  await network.provider.send("eth_sendTransaction", [{ from: a, to: a }]);
  await network.provider.send("eth_sendTransaction", [{ from: a, to: a }]);
  await network.provider.send("eth_sendTransaction", [{ from: a, to: a }]);
  await network.provider.send("eth_sendTransaction", [{ from: a, to: a }]);
  await network.provider.send("eth_sendTransaction", [{ from: a, to: a }]);
  await network.provider.send("eth_sendTransaction", [{ from: a, to: a }]);
  await network.provider.send("eth_sendTransaction", [{ from: a, to: a }]);
  await network.provider.send("eth_sendTransaction", [{ from: a, to: a }]);
  await network.provider.send("eth_sendTransaction", [{ from: a, to: a }]);
  await network.provider.send("eth_sendTransaction", [{ from: a, to: a }]);
  await network.provider.send("eth_sendTransaction", [{ from: a, to: a }]);

  const stateRootAfterTxs = await stateManager.getStateRoot();

  // deploy, get code length, change the set the state root to itself, get code length
  await network.provider.send("eth_sendTransaction", [{
    from: a,
    data: "0x6080604052348015600f57600080fd5b5060a68061001e6000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c80636d4ce63c146037578063a9cc4718146053575b600080fd5b603d605b565b6040518082815260200191505060405180910390f35b60596064565b005b60006001905090565b6000606e57600080fd5b56fea2646970667358221220ff6e2bc6180eb6a818ad5b2c15cbcb059bb0f50b368e185b84602d6e96e43b7f64736f6c63430007030033",
  }])

  console.log((await stateManager.getContractCode(contractAddress)).length);
  const root1 = await stateManager.getStateRoot();
  await stateManager.setStateRoot(root1);
  console.log((await stateManager.getContractCode(contractAddress)).length);

  await stateManager.setStateRoot(stateRootAfterTxs)

  // deploy, get code length, change the set the state root to itself, get code length
  await network.provider.send("eth_sendTransaction", [{
    from: a,
    data: "0x6080604052348015600f57600080fd5b5060a68061001e6000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c80636d4ce63c146037578063a9cc4718146053575b600080fd5b603d605b565b6040518082815260200191505060405180910390f35b60596064565b005b60006001905090565b6000606e57600080fd5b56fea2646970667358221220ff6e2bc6180eb6a818ad5b2c15cbcb059bb0f50b368e185b84602d6e96e43b7f64736f6c63430007030033",
  }])
  
  console.log((await stateManager.getContractCode(contractAddress)).length);
  
  const root2 = await stateManager.getStateRoot();
  global.__trace = true;
  // This state root breaks
  await stateManager.setStateRoot(root2);

  console.log((await stateManager.getContractCode(contractAddress)).length);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });