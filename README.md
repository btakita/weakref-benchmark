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

## deno panic

```
deno run ./index.js
✅ Granted read access to "/home/brian/work/btakita/node_modules".
✅ Granted read access to "/home/brian/work/node_modules".
✅ Granted all read access.
fake_WeakRef__memo_ x 880,255 ops/sec ±4.38% (62 runs sampled)

<--- Last few GCs --->

[1065993:0x64f2d4ab4000]    15201 ms: Mark-Compact (reduce) 1398.7 (1424.2) -> 1398.5 (1424.7) MB, pooled: 0 MB, 159.15 / 0.00 ms  (+ 5.5 ms in 0 steps since start of marking, biggest step 0.0 ms, walltime since start of marking 179 ms) (average mu = 0.60[1065993:0x64f2d4ab4000]    15645 ms: Mark-Compact (reduce) 1399.6 (1424.7) -> 1399.3 (1425.5) MB, pooled: 0 MB, 389.50 / 0.00 ms  (+ 0.6 ms in 0 steps since start of marking, biggest step 0.0 ms, walltime since start of marking 393 ms) (average mu = 0.35

<--- JS stacktrace --->



#
# Fatal JavaScript out of memory: Reached heap limit
#
==== C stack trace ===============================

    deno(+0x29de688) [0x64f2cf829688]
    deno(+0x201448d) [0x64f2cee5f48d]
    deno(+0x201144d) [0x64f2cee5c44d]
    deno(+0x204a479) [0x64f2cee95479]
    deno(+0x216581c) [0x64f2cefb081c]
    deno(+0x21634e5) [0x64f2cefae4e5]
    deno(+0x2156f4c) [0x64f2cefa1f4c]
    deno(+0x2157868) [0x64f2cefa2868]
    deno(+0x213ad72) [0x64f2cef85d72]
    deno(+0x2b69031) [0x64f2cf9b4031]
    deno(+0x28a0c36) [0x64f2cf6ebc36]
[1]    1065993 trace trap (core dumped)  deno run ./index.js
```

## WeakValueMap.js

Each benchmark includes 1000 set ops.

```
bun ./WeakValueMap.js
WeakMap x 34,003 ops/sec ±0.79% (98 runs sampled)
FinalizationRegistry x 22,571 ops/sec ±1.19% (96 runs sampled)
WeakValueMap x 7,590 ops/sec ±1.87% (88 runs sampled)
Fastest is WeakMap
```

```
node ./WeakValueMap.js
WeakMap x 22,403 ops/sec ±0.59% (96 runs sampled)
FinalizationRegistry x 14,111 ops/sec ±2.73% (88 runs sampled)
WeakValueMap x 1,213 ops/sec ±9.51% (42 runs sampled)
Fastest is WeakMap
```

```
deno run ./WeakValueMap.js
✅ Granted all read access.
WeakMap x 20,616 ops/sec ±0.90% (68 runs sampled)
FinalizationRegistry x 13,447 ops/sec ±2.73% (62 runs sampled)
WeakValueMap x 1,125 ops/sec ±29.22% (9 runs sampled)
Fastest is WeakMap
```
