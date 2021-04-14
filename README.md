# ethereumjs vm bug

How to reproduce it:

```sh
yarn
node --require hardhat/register script.js
```

When the bug is present, the last `console.log` prints 0, but the balance should still be 1.