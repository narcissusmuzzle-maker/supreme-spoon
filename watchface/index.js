/**
 * Циферблат U613. Часов на экране нет: чёрный экран, сверху две полоски статистики (по три сегмента: месяц / неделя / день,
 * без подписей), снизу три кнопки 🥗 🩸 🧩.
 *  - 🩸 открывает приложение «Таймер» (U613, appId 1061363) — то, что уже стоит на часах.
 *  - 🥗 и 🧩 пока ничего не делают (приложения для них будут позже).
 *  - Верхняя полоска — слова (цвета как в поле слов на телефоне). Данных с телефона пока нет, поэтому здесь ЗАГЛУШКА:
 *    цвета берутся из WORDS_STUB. Нижняя полоска — серая заглушка.
 * Положение всего задаётся в shared/layout.js, цвета — в shared/colors.js.
 */
import { createWidget, widget, prop, align } from '@zos/ui'
import * as router from '@zos/router'
import * as lay from '../shared/layout'
import * as col from '../shared/colors'

// Приложение, которое открывает 🩸 (должно совпадать с app.json приложения «Таймер»)
const TIMER_APP_ID = 1061363
const TIMER_APP_URL = 'page/index'

// ЗАГЛУШКА верхней полоски: доля нормы по словам (0 — ничего, 1 — норма выполнена) для месяца / недели / дня.
// Эти числа выдуманы, чтобы увидеть палитру. Когда появятся настоящие данные, заменяется только это.
// null вместо числа — серый сегмент.
const WORDS_STUB = [0.25, 0.6, 0.95]
// Нижняя полоска: серая заглушка
const SECOND_STUB = [null, null, null]

const BLACK = 0x000000
const RED = 0xff4517

let errText = null

function showError(msg) {
  try {
    if (errText) { errText.setProperty(prop.TEXT, String(msg).slice(0, 60)); return }
  } catch (e) { /* пересоздадим */ }
  try {
    errText = createWidget(widget.TEXT, {
      x: lay.AREA_X, y: lay.halfY(lay.SCREEN_H) - 16, w: lay.AREA_W, h: 32, color: RED, text_size: 20,
      align_h: align.CENTER_H, align_v: align.CENTER_V, text: String(msg).slice(0, 60)
    })
  } catch (e) { /* показать нечем */ }
}

/** Открыть приложение «Таймер». Если не получилось — короткая красная надпись между половинами экрана. */
function openTimer() {
  let why = ''
  try {
    if (router && typeof router.launchApp === 'function') {
      router.launchApp({ appId: TIMER_APP_ID, native: false, url: TIMER_APP_URL })
      return
    }
    why = 'нет launchApp'
  } catch (e) { why = 'launchApp: ' + e }
  try {
    if (typeof hmApp !== 'undefined' && hmApp && typeof hmApp.startApp === 'function') {
      hmApp.startApp({ appid: TIMER_APP_ID, url: TIMER_APP_URL, native: false })
      return
    }
  } catch (e) { why += ' startApp: ' + e }
  showError(why || 'не открылось')
}

function nothing() { /* кнопка пока не работает */ }

function drawStrip(y, h, segs, ratios) {
  for (let i = 0; i < segs.length; i++) {
    createWidget(widget.FILL_RECT, { x: segs[i].x, y: y, w: segs[i].w, h: h, color: col.forRatio(ratios[i]) })
  }
}

WatchFace({
  build() {
    // чёрный фон на весь экран
    createWidget(widget.FILL_RECT, { x: 0, y: 0, w: lay.SCREEN_W, h: lay.SCREEN_H, color: BLACK })

    // верх: две полоски
    const st = lay.strips(lay.SCREEN_H)
    drawStrip(st[0].y, st[0].h, st[0].segs, WORDS_STUB)
    drawStrip(st[1].y, st[1].h, st[1].segs, SECOND_STUB)

    // низ: три кнопки 🥗 🩸 🧩 (картинки b1/b2/b3, при нажатии — затемнённые b1p/b2p/b3p)
    const bt = lay.buttons(lay.SCREEN_H)
    const act = [nothing, openTimer, nothing]
    for (let k = 0; k < 3; k++) {
      createWidget(widget.BUTTON, {
        x: bt[k].x, y: bt[k].y, w: bt[k].w, h: bt[k].h, text: '',
        normal_src: 'b' + (k + 1) + '.png', press_src: 'b' + (k + 1) + 'p.png', click_func: act[k]
      })
    }
  },
  onInit() {},
  onDestroy() {}
})
