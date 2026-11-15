import assert from 'node:assert/strict'
import * as lay from '../shared/layout.js'

const H = lay.SCREEN_H
const half = lay.halfY(H)
assert.equal(half, 257)

// сегменты: три штуки, без наложений, зазоры ровно SEG_GAP, крайние совпадают с границами полосы
const seg = lay.segments(lay.AREA_X, lay.AREA_W, lay.SEG_COUNT, lay.SEG_GAP)
assert.equal(seg.length, 3)
assert.equal(seg[0].x, lay.AREA_X)
assert.equal(seg[2].x + seg[2].w, lay.AREA_X + lay.AREA_W)
for (let i = 0; i < 2; i++) assert.equal(seg[i + 1].x - (seg[i].x + seg[i].w), lay.SEG_GAP)
const ws = seg.map((s) => s.w)
assert.ok(Math.max(...ws) - Math.min(...ws) <= 1, 'сегменты почти равной ширины')
// без зазора — сплошная полоска
const solid = lay.segments(8, 380, 3, 0)
assert.equal(solid[0].x + solid[0].w, solid[1].x)
assert.equal(solid[1].x + solid[1].w, solid[2].x)
assert.equal(solid[2].x + solid[2].w, 388)

// полоски: целиком в верхней половине, не пересекаются
const st = lay.strips(H)
assert.equal(st.length, 2)
assert.ok(st[0].y >= 0)
assert.ok(st[1].y + st[1].h <= half)
assert.ok(st[0].y + st[0].h <= st[1].y)
assert.equal(st[0].y + st[0].h + lay.STRIP_GAP, st[1].y)

// кнопки: три, в нижней половине, в той же сетке, что в приложении (x = 8, 138, 268)
const bt = lay.buttons(H)
assert.deepEqual(bt.map((b) => b.x), [8, 138, 268])
for (const b of bt) {
  assert.ok(b.y >= half)
  assert.ok(b.y + b.h <= H)
  assert.ok(b.x + b.w <= lay.SCREEN_W)
}
assert.equal(new Set(bt.map((b) => b.y)).size, 1)
// ряд кнопок по центру нижней половины (с точностью до пикселя)
const top = bt[0].y - half
const bottom = H - (bt[0].y + bt[0].h)
assert.ok(Math.abs(top - bottom) <= 1)
console.log('layout: ok')
