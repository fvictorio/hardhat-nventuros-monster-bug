async function main() {
  const [s] = await ethers.getSigners();

  // send 13 txs
  await s.sendTransaction({ to: s.address });
  await s.sendTransaction({ to: s.address });
  await s.sendTransaction({ to: s.address });
  await s.sendTransaction({ to: s.address });
  await s.sendTransaction({ to: s.address });
  await s.sendTransaction({ to: s.address });
  await s.sendTransaction({ to: s.address });
  await s.sendTransaction({ to: s.address });
  await s.sendTransaction({ to: s.address });
  await s.sendTransaction({ to: s.address });
  await s.sendTransaction({ to: s.address });
  await s.sendTransaction({ to: s.address });
  await s.sendTransaction({ to: s.address });

  const snapshot = await takeSnapshot();

  // deploy, get code length, call view function, get code length
  let test = await deploy("Test");
  console.log(await codeLength(test.address));
  await test.get();
  console.log(await codeLength(test.address));

  await revert(snapshot);

  // deploy, get code length, call view function, get code length
  test = await deploy("Test");
  console.log(await codeLength(test.address));
  await test.get();
  console.log(await codeLength(test.address));
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

async function deploy(contract) {
  const factory = await ethers.getContractFactory(contract);
  const instance = await factory.deploy();
  return instance.deployed();
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
