// This address is deterministic, so we just store it here
const {Address} = require("ethereumjs-util")
const RECEIVER = Address.fromString("0x0dcd1bf9a1b36ce34237eeafef220932846bcd82");

async function main() {
  const [a] = await network.provider.send("eth_accounts");

  const stateManager = network.provider._wrapped._wrapped._wrapped._wrappedProvider._node._stateManager;

  // send 1 unrelated tx
  await network.provider.send("eth_sendTransaction", [{ from: a, to: a }]);

  const stateRootAfterTxs = await stateManager.getStateRoot();

  // send 1wei to receiver, change the state root to itself, get receivers balance
  await network.provider.send("eth_sendTransaction", [{
    from: a,
    to: RECEIVER.toString(),
    value: "0x1"
  }])

  console.log((await stateManager.getAccount(RECEIVER)).balance.toString());
  const root1 = await stateManager.getStateRoot();
  await stateManager.setStateRoot(root1);
  console.log((await stateManager.getAccount(RECEIVER)).balance.toString());

  await stateManager.setStateRoot(stateRootAfterTxs)

  // send 1wei to receiver, change the state root to itself, get receivers balance
  await network.provider.send("eth_sendTransaction", [{
    from: a,
    to: RECEIVER.toString(),
    value: "0x1"
  }])
  
  console.log((await stateManager.getAccount(RECEIVER)).balance.toString());
  
  const root2 = await stateManager.getStateRoot();
  global.__trace = true;
  // This state root breaks
  await stateManager.setStateRoot(root2);

  console.log((await stateManager.getAccount(RECEIVER)).balance.toString());
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });