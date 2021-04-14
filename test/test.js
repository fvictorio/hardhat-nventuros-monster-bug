const { expect } = require("chai");

describe("describe", () => {
  let test;
  sharedBeforeEach("run 13 txs", async () => {
    const [s] = await ethers.getSigners();

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
  });

  describe("inner describe 1", () => {
    sharedBeforeEach("create test", async () => {
      test = await deploy("Test");
    });
    it("reverts", async () => {
      await expect(test.fail()).to.be.revertedWith("");
    });
  });

  describe("inner describe 2", () => {
    sharedBeforeEach("create test", async () => {
      test = await deploy("Test");
      await test.get();
    });
    it("reverts", async () => {
      await expect(test.fail()).to.be.revertedWith("");
    });
  });
});

const SNAPSHOTS = [];

function sharedBeforeEach(nameOrFn, maybeFn) {
  const name = typeof nameOrFn === "string" ? nameOrFn : undefined;
  const fn = typeof nameOrFn === "function" ? nameOrFn : maybeFn;

  let initialized = false;

  beforeEach(wrapWithTitle(name, "Running shared before each or reverting"), async function () {
    const provider = await getProvider();
    if (!initialized) {
      const prevSnapshot = SNAPSHOTS.pop();
      if (prevSnapshot !== undefined) {
        await revert(provider, prevSnapshot);
        SNAPSHOTS.push(await takeSnapshot(provider));
      }

      await fn.call(this);

      SNAPSHOTS.push(await takeSnapshot(provider));
      initialized = true;
    } else {
      const snapshotId = SNAPSHOTS.pop();
      if (snapshotId === undefined) throw Error("Missing snapshot ID");
      await revert(provider, snapshotId);
      SNAPSHOTS.push(await takeSnapshot(provider));
    }
  });

  after(async function () {
    if (initialized) {
      SNAPSHOTS.pop();
    }
  });
}

function wrapWithTitle(title, str) {
  return title === undefined ? str : `${title} at step "${str}"`;
}

async function deploy(contract, { from, args } = {}) {
  if (!args) args = [];
  if (!from) from = (await ethers.getSigners())[0];
  const factory = (await getFactory(contract)).connect(from);
  const instance = await factory.deploy(...args);
  return instance.deployed();
}

async function takeSnapshot(provider) {
  const result = await provider.request({
    method: "evm_snapshot"
  });

  return result;
}

async function revert(provider, snapshotId) {
  const result = await provider.request({
    method: "evm_revert",
    params: [snapshotId]
  });

  if (!result) {
    console.trace();
    process.exit(1);
  }
}

async function getProvider() {
  const hre = require("hardhat");
  return hre.network.provider;
}

const factories = {};

async function getFactory(contractName) {
  let factory = factories[contractName];

  if (factory == undefined) {
    factory = await ethers.getContractFactory(contractName);
    factories[contractName] = factory;
  }

  return factory;
}
