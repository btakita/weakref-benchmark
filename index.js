import Benchmark from 'benchmark'
/**
 * @type {{ c?:memo_T, q:Set<memo_T> }}
 * $.c child memo calling the memo
 * $.q queue
 */
let $ = globalThis.__rmemo__ ??= { q: new Set }
suite__run()
function suite__run() {
	const suite = new Benchmark.Suite
	suite// uncomment 'WeakRef' benchmark to see following benchmarks degrade
		// .add('WeakRef', ()=>{
		// 	const o = {}
		// 	const wr = new WeakRef(o)
		// 	wr.deref()
		// })
		.add('fake_WeakRef__memo_', ()=>{
			const a$ = fake_WeakRef__memo_(()=>1)
			const b$ = fake_WeakRef__memo_(()=>a$() + 10)
			const c$ = fake_WeakRef__memo_(()=>b$() + 10)
			const d$ = fake_WeakRef__memo_(()=>c$() + 10)
			const e$ = fake_WeakRef__memo_(()=>d$() + 10)
			const f$ = fake_WeakRef__memo_(()=>e$() + 10)
			const g$ = fake_WeakRef__memo_(()=>f$() + 10)
			const h$ = fake_WeakRef__memo_(()=>g$() + 10)
			h$()
		})
		.add('eager_WeakRef__memo_', ()=>{
			const a$ = eager_WeakRef__memo_(()=>1)
			const b$ = eager_WeakRef__memo_(()=>a$() + 10)
			const c$ = eager_WeakRef__memo_(()=>b$() + 10)
			const d$ = eager_WeakRef__memo_(()=>c$() + 10)
			const e$ = eager_WeakRef__memo_(()=>d$() + 10)
			const f$ = eager_WeakRef__memo_(()=>e$() + 10)
			const g$ = eager_WeakRef__memo_(()=>f$() + 10)
			const h$ = eager_WeakRef__memo_(()=>g$() + 10)
			h$()
		})
		.add('lazy_WeakRef__memo_', ()=>{
			const a$ = lazy_WeakRef__memo_(()=>1)
			const b$ = lazy_WeakRef__memo_(()=>a$() + 10)
			const c$ = lazy_WeakRef__memo_(()=>b$() + 10)
			const d$ = lazy_WeakRef__memo_(()=>c$() + 10)
			const e$ = lazy_WeakRef__memo_(()=>d$() + 10)
			const f$ = lazy_WeakRef__memo_(()=>e$() + 10)
			const g$ = lazy_WeakRef__memo_(()=>f$() + 10)
			const h$ = lazy_WeakRef__memo_(()=>g$() + 10)
			h$()
		})
		.on('cycle', event=>{
			console.log(String(event.target))
		})
		.on('complete', function() {
			console.log('Fastest is ' + this.filter('fastest').map('name'))
		})
		.run()
}
/**
 * @param {memo_def_T}memo_def
 * @param {rmemo_add_def_T[]}add_def_a1
 * @returns {memo_T}
 * @private
 */
export function lazy_WeakRef__memo_(memo_def, add_def_a1) {
	/** @type {memo_T} */
	let memo = ()=>{
		'val' in memo || memo__run(memo)
		if ($.c) {
			if (!memo.r.includes($.c.s ??= new WeakRef($.c))) {
				memo.r.push($.c.s)
			}
			if ($.c.l < memo.l + 1) $.c.l = memo.l + 1
			// memo called by $.c's conditional execution...next change to memo will notify $.c
			$.c.u.push(memo)
			// prevent memo from GC while $.c still has a strong reference
			if (!$.c.t.includes(memo)) $.c.t.push(memo)
		}
		return memo.val
	}
	memo.set = val=>{
		if (memo.val !== val) {
			memo.r = memo.r.filter(r=>{
				r = r.deref()
				if (r?.u.includes(memo)) { // if added by $.c.u.push(memo), add to $.q
					$.q.add(r)
				}
				return r
			})
		}
		memo.val = val
		if (!memo.a) {
			memo.a = []
			add_def_a1.map(add_def=>{
				let v = add_def(memo)
				if (v instanceof Object) {
					memo.a.push(v)
					if (v.memo_) v()
				}
			})
		}
		cur_refresh_loop:for (let cur_memo of $.q) {
			$.q.delete(cur_memo)
			for (let queue_refresh of $.q) {
				if (cur_memo.l > queue_refresh.l) {
					$.q.add(cur_memo)
					continue cur_refresh_loop
				}
			}
			memo__run(cur_memo)
		}
	}
	memo.l = 0
	memo.d = memo_def
	memo.b = add_def_a1 ??= []
	memo.r = []
	memo.u = []
	memo.t = []
	return memo
}
export function eager_WeakRef__memo_(memo_def, add_def_a1) {
	/** @type {memo_T} */
	let memo = ()=>{
		'val' in memo || memo__run(memo)
		if ($.c) {
			if (!memo.r.includes($.c.s)) {
				memo.r.push($.c.s)
			}
			if ($.c.l < memo.l + 1) $.c.l = memo.l + 1
			// memo called by $.c's conditional execution...next change to memo will notify $.c
			$.c.u.push(memo)
			// prevent memo from GC while $.c still has a strong reference
			if (!$.c.t.includes(memo)) $.c.t.push(memo)
		}
		return memo.val
	}
	memo.set = val=>{
		if (memo.val !== val) {
			memo.r = memo.r.filter(r=>{
				r = r.deref()
				if (r?.u.includes(memo)) { // if added by $.c.u.push(memo), add to $.q
					$.q.add(r)
				}
				return r
			})
		}
		memo.val = val
		if (!memo.a) {
			memo.a = []
			add_def_a1.map(add_def=>{
				let v = add_def(memo)
				if (v instanceof Object) {
					memo.a.push(v)
					if (v.memo_) v()
				}
			})
		}
		cur_refresh_loop:for (let cur_memo of $.q) {
			$.q.delete(cur_memo)
			for (let queue_refresh of $.q) {
				if (cur_memo.l > queue_refresh.l) {
					$.q.add(cur_memo)
					continue cur_refresh_loop
				}
			}
			memo__run(cur_memo)
		}
	}
	memo.l = 0
	memo.s = new WeakRef(memo)
	memo.d = memo_def
	memo.b = add_def_a1 ??= []
	memo.r = []
	memo.u = []
	memo.t = []
	return memo
}
export function fake_WeakRef__memo_(memo_def, add_def_a1) {
	/** @type {memo_T} */
	let memo = ()=>{
		'val' in memo || memo__run(memo)
		if ($.c) {
			// if (!memo.r.includes($.c.s ??= new WeakRef($.c))) {
			let c = $.c
			if (!memo.r.includes($.c.s ??= { deref: ()=>c })) {
				memo.r.push($.c.s)
			}
			if ($.c.l < memo.l + 1) $.c.l = memo.l + 1
			// memo called by $.c's conditional execution...next change to memo will notify $.c
			$.c.u.push(memo)
			// prevent memo from GC while $.c still has a strong reference
			if (!$.c.t.includes(memo)) $.c.t.push(memo)
		}
		return memo.val
	}
	memo.set = val=>{
		if (memo.val !== val) {
			memo.r = memo.r.filter(r=>{
				r = r.deref()
				if (r?.u.includes(memo)) { // if added by $.c.u.push(memo), add to $.q
					$.q.add(r)
				}
				return r
			})
		}
		memo.val = val
		if (!memo.a) {
			memo.a = []
			add_def_a1.map(add_def=>{
				let v = add_def(memo)
				if (v instanceof Object) {
					memo.a.push(v)
					if (v.memo_) v()
				}
			})
		}
		cur_refresh_loop:for (let cur_memo of $.q) {
			$.q.delete(cur_memo)
			for (let queue_refresh of $.q) {
				if (cur_memo.l > queue_refresh.l) {
					$.q.add(cur_memo)
					continue cur_refresh_loop
				}
			}
			memo__run(cur_memo)
		}
	}
	memo.l = 0
	memo.d = memo_def
	memo.b = add_def_a1 ??= []
	memo.r = []
	memo.u = []
	memo.t = []
	return memo
}
function memo__run(memo) {
	let prev_memo = $.c
	$.c = memo
	memo.u = [] // reset references in memo_def conditional execution path...see $.c.u.push(memo)
	try {
		memo.set(memo.d(memo))
	} catch (err) {
		console.error(err)
	}
	$.c = prev_memo // catch does not throw
}27
