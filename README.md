# ethereumjs vm bug

How to reproduce it:

```sh
yarn
node --require hardhat/script scripts.js
```

When the bug is present, the last `console.log` prints 2, because the contract code isn't found.