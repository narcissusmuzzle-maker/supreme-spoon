/**
 * Раскладка экрана (чистые функции — без обращений к API часов, проверяются тестами в Node).
 * Экран 432 x 514, чёрный. Верхняя половина — две полоски статистики (по три сегмента: месяц / неделя / день),
 * нижняя половина — три кнопки в ряд.
 * Горизонтальная полоса, в которой стоят все элементы, — та же, что у главного экрана приложения «Таймер»
 * (x от 8 до 388: кнопки 120 + зазор 10), чтобы вид совпадал с тем, что уже настроено.
 */
export const SCREEN_W = 432
export const SCREEN_H = 514

export const AREA_X = 8          // левый край полосы
export const AREA_W = 380        // ширина полосы (3 кнопки по 120 и два зазора по 10)

export const STRIP_H = 90        // высота одной полоски
export const STRIP_GAP = 18      // расстояние между полосками
export const SEG_COUNT = 3       // сегментов в полоске: месяц / неделя / день
export const SEG_GAP = 3         // чёрный зазор между сегментами (0 — сплошная полоска, как на телефоне)

export const BTN = 120           // размер кнопки (картинки 120 x 120)
export const BTN_GAP = 10        // зазор между кнопками

export const STRIPS_DY = 0       // сдвиг блока полосок по вертикали (минус — выше, плюс — ниже)
export const BTN_DY = 0          // сдвиг ряда кнопок по вертикали

/** Граница между верхней и нижней половинами. */
export function halfY(h) { return Math.floor(h / 2) }

/** Сегменты одной полоски: n штук с зазором gap по ширине w, начиная с x0. Границы округляются так, что пустот нет. */
export function segments(x0, w, n, gap) {
  const usable = w - gap * (n - 1)
  const edge = (i) => Math.round((usable * i) / n)
  const out = []
  for (let i = 0; i < n; i++) {
    out.push({ x: x0 + edge(i) + gap * i, w: edge(i + 1) - edge(i) })
  }
  return out
}

/** Две полоски: блок из них стоит по центру верхней половины по высоте. */
export function strips(h) {
  const half = halfY(h)
  const block = STRIP_H * 2 + STRIP_GAP
  const top = Math.max(0, Math.round((half - block) / 2)) + STRIPS_DY
  const segs = segments(AREA_X, AREA_W, SEG_COUNT, SEG_GAP)
  return [0, 1].map((k) => ({ y: top + k * (STRIP_H + STRIP_GAP), h: STRIP_H, segs }))
}

/** Три кнопки: ряд стоит по центру нижней половины по высоте, по горизонтали — как столбцы кнопок в приложении. */
export function buttons(h) {
  const half = halfY(h)
  const y = half + Math.round((h - half - BTN) / 2) + BTN_DY
  return [0, 1, 2].map((k) => ({ x: AREA_X + k * (BTN + BTN_GAP), y: y, w: BTN, h: BTN }))
}
