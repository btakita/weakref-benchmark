import Benchmark from 'benchmark'
const KEYS = 1
const VALUES = 2
const KEYS_VALUES = 3
queueMicrotask(()=>suite__run())
function suite__run() {
	const suite = new Benchmark.Suite
	suite
		.add('WeakMap', ()=>{
			const wm = new WeakMap()
			for (let i = 0; i < 1000; i++) {
				const o = {}
				wm.set(o, i)
				wm.get(o)
			}
		})
		.add('FinalizationRegistry', ()=>{
			const m = new Map()
			const r = new FinalizationRegistry(key=>{
				m.delete(key)
			})
			for (let i = 0; i < 1000; i++) {
				const o = {}
				m.set(i, o)
				r.register(o, i)
				m.get(i)
			}
		})
		.add('WeakRef', ()=>{
			for (let i = 0; i < 1000; i++) {
				const o = {}
				const wr = new WeakRef(o)
				wr.deref()
			}
		})
		.add('WeakValueMap', ()=>{
			const wvm = new WeakValueMap()
			for (let i = 0; i < 1000; i++) {
				wvm.set(i, {})
				wvm.get(i)
			}
		})
		.on('cycle', event=>{
			console.log(String(event.target))
		})
		.on('error', err=>{
			console.error(err)
		})
		.on('complete', function() {
			console.log('Fastest is ' + this.filter('fastest').map('name'))
		})
		.run()
}
export default class WeakValueMap {
	#map = new Map()
	#group = new FinalizationRegistry(key=>{
		console.debug({ key })
		this.#map.delete(key)
	})
	constructor(iterable) {
		if (iterable !== undefined && iterable !== null) {
			for (const [key, value] of iterable) {
				this.set(key, value)
			}
		}
	}
	set(key, value) {
		const existingRef = this.#map.get(key)
		if (existingRef) this.#group.unregister(existingRef)
		const newRef = new WeakRef(value)
		this.#map.set(key, newRef)
		this.#group.register(value, key, newRef)
	}
	has(key) {
		const w = this.#map.get(key)
		if (w === undefined) {
			return false
		}
		if (w.deref() === undefined) {
			this.#map.delete(key)
			this.#group.unregister(w)
			return false
		}
		return true
	}
	get(key) {
		const w = this.#map.get(key)
		if (w === undefined) {
			return undefined
		}
		const v = w.deref()
		if (v === undefined) {
			this.#map.delete(key)
			this.#group.unregister(w)
			return undefined
		}
		return v
	}
	delete(key) {
		const w = this.#map.get(key)
		if (w) {
			this.#map.delete(key)
			this.#group.unregister(w)
			return w.deref() !== undefined
		}
		return false
	}
	clear() {
		for (const w of this.#map.values()) {
			this.#group.unregister(w)
		}
		this.#map.clear()
	}
	#iterator = function* iterator(type) {
		for (const [key, weak] of this.#map) {
			const v = weak.deref()
			if (v === undefined) {
				this.#map.delete(key)
				this.#group.unregister(weak)
			} else if (type === KEYS) {
				yield key
			} else if (type === VALUES) {
				yield v
			} else {
				yield [key, v]
			}
		}
	}
	keys() {
		return this.#iterator(KEYS)
	}
	values() {
		return this.#iterator(VALUES)
	}
	entries() {
		return this.#iterator(KEYS_VALUES)
	}
	forEach(callback, thisArg) {
		for (const [key, value] of this) {
			callback.call(thisArg, key, value, this)
		}
	}
}
Object.defineProperty(WeakValueMap.prototype, Symbol.iterator, {
	value: WeakValueMap.prototype.entries,
	writable: true,
	enumerable: false,
	configurable: true,
})
