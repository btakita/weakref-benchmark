# weakref-benchmark
Demonstrates WeakRef performance issues with nodejs

## Install

```sh
npm i
```

## run index.js
```
bun index.js
fake_WeakRef__memo_ x 759,429 ops/sec ±1.82% (88 runs sampled)
eager_WeakRef__memo_ x 681,268 ops/sec ±1.96% (90 runs sampled)
lazy_WeakRef__memo_ x 630,144 ops/sec ±1.42% (91 runs sampled)
Fastest is fake_WeakRef__memo_
```

```
node index.js
fake_WeakRef__memo_ x 430,406 ops/sec ±19.22% (46 runs sampled)
eager_WeakRef__memo_ x 69,115 ops/sec ±46.56% (38 runs sampled)
lazy_WeakRef__memo_ x 23,938 ops/sec ±98.68% (28 runs sampled)
Fastest is fake_WeakRef__memo_
```

## run prime_WeakRef.js
```
bun prime_WeakRef.js
WeakRef x 50,363,731 ops/sec ±5.99% (67 runs sampled)
fake_WeakRef__memo_ x 779,351 ops/sec ±1.97% (87 runs sampled)
eager_WeakRef__memo_ x 695,815 ops/sec ±1.10% (92 runs sampled)
lazy_WeakRef__memo_ x 624,601 ops/sec ±1.96% (92 runs sampled)
Fastest is WeakRef
```

```
node prime_WeakRef.js
WeakRef x 1,506,092 ops/sec ±16.04% (23 runs sampled)
fake_WeakRef__memo_ x 118,439 ops/sec ±21.99% (66 runs sampled)
eager_WeakRef__memo_ x 56,684 ops/sec ±40.38% (64 runs sampled)
lazy_WeakRef__memo_ x 22,026 ops/sec ±91.35% (29 runs sampled)
Fastest is WeakRef
```
