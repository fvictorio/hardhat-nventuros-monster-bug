async function main() {
  const [a] = await network.provider.send("eth_accounts");

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

  const snapshot = await takeSnapshot();

  // deploy, get code length, call view function, get code length
  let tx = await network.provider.send("eth_sendTransaction", [{
    from: a,
    data: "0x6080604052348015600f57600080fd5b5060a68061001e6000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c80636d4ce63c146037578063a9cc4718146053575b600080fd5b603d605b565b6040518082815260200191505060405180910390f35b60596064565b005b60006001905090565b6000606e57600080fd5b56fea2646970667358221220ff6e2bc6180eb6a818ad5b2c15cbcb059bb0f50b368e185b84602d6e96e43b7f64736f6c63430007030033",
  }])
  let receipt = await network.provider.send("eth_getTransactionReceipt", [tx]) 

  console.log(await codeLength(receipt.contractAddress));
  await network.provider.send("eth_call", [{
    from: a,
    to: receipt.contractAddress,
    data: "0x6d4ce63c",
  }])
  console.log(await codeLength(receipt.contractAddress));

  // revert snapshot
  await revert(snapshot);

  // deploy, get code length, call view function, get code length
  tx = await network.provider.send("eth_sendTransaction", [{
    from: a,
    data: "0x6080604052348015600f57600080fd5b5060a68061001e6000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c80636d4ce63c146037578063a9cc4718146053575b600080fd5b603d605b565b6040518082815260200191505060405180910390f35b60596064565b005b60006001905090565b6000606e57600080fd5b56fea2646970667358221220ff6e2bc6180eb6a818ad5b2c15cbcb059bb0f50b368e185b84602d6e96e43b7f64736f6c63430007030033",
  }])
  receipt = await network.provider.send("eth_getTransactionReceipt", [tx])

  console.log(await codeLength(receipt.contractAddress));
  await network.provider.send("eth_call", [{
    from: a,
    to: receipt.contractAddress,
    data: "0x6d4ce63c",
  }])
  console.log(await codeLength(receipt.contractAddress));
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

async function codeLength(address) {
  const code = await network.provider.send("eth_getCode", [address]);
  return code.length
}

async function takeSnapshot() {
  const result = await network.provider.request({
    method: "evm_snapshot"
  });

  return result;
}

async function revert(snapshotId) {
  const result = await network.provider.request({
    method: "evm_revert",
    params: [snapshotId]
  });

  if (!result) {
    console.trace();
    process.exit(1);
  }
}
