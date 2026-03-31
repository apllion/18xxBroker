import { g1822 } from './g1822.js'
import { g1822mx } from './g1822mx.js'
import { g1830 } from './g1830.js'
import { g1846 } from './g1846.js'
import { g1847ae } from './g1847ae.js'
import { g1849 } from './g1849.js'
import { g1858 } from './g1858.js'
import { g1860 } from './g1860.js'
import { g1862 } from './g1862.js'
import { g1861 } from './g1861.js'
import { g1867 } from './g1867.js'
import { g1871 } from './g1871.js'
import { g1880 } from './g1880.js'
import { g1889 } from './g1889.js'
import { g18chesapeake } from './g18chesapeake.js'
import { g18daihan } from './g18daihan.js'
import { g18india } from './g18india.js'
import { g18ms } from './g18ms.js'
import { g18rhl } from './g18rhl.js'
import { g18royalgorge } from './g18royalgorge.js'
import { g18sj } from './g18sj.js'
import { g18usa } from './g18usa.js'
import { g18do_trg } from './g18do_trg.js'
import { g18do_hsb } from './g18do_hsb.js'
import { g21moon } from './g21moon.js'
import { g22mars } from './g22mars.js'
import { gptg } from './gptg.js'

export const titles = {
  g1822,
  g1822mx,
  g1830,
  g1846,
  g1847ae,
  g1849,
  g1858,
  g1860,
  g1862,
  g1861,
  g1867,
  g1871,
  g1880,
  g1889,
  g18chesapeake,
  g18daihan,
  g18india,
  g18ms,
  g18rhl,
  g18royalgorge,
  g18sj,
  g18usa,
  g18do_trg,
  g18do_hsb,
  g21moon,
  g22mars,
  gptg,
}

export function getTitle(titleId) {
  const title = titles[titleId]
  if (!title) throw new Error(`Unknown title: ${titleId}`)
  return title
}

export function allTitles() {
  return Object.values(titles)
}
