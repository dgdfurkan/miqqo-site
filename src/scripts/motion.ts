// Ortak hareket altyapısı. Her bileşen betiği GSAP ve Lenis'i buradan alır;
// Vite modülü tek sefer çalıştırır.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// iOS'ta adres çubuğu açılıp kapandıkça tetiklenen refresh, kaydırma sırasında takılmaya yol açıyor.
ScrollTrigger.config({ ignoreMobileResize: true });

const root = document.documentElement;

export const reducedMotionQuery = '(prefers-reduced-motion: reduce)';
export const allowMotionQuery = '(prefers-reduced-motion: no-preference)';
export const prefersReducedMotion = () => window.matchMedia(reducedMotionQuery).matches;

let lenis: Lenis | null = null;

// Bağlantı offset'i tek kaynaktan: html üzerindeki scroll-padding-top.
const anchorOffset = () => parseFloat(getComputedStyle(root).scrollPaddingTop) || 88;

// Yumuşak kaydırma yalnız fare/trackpad cihazlarda ve hareket azaltma kapalıyken.
if (!prefersReducedMotion() && window.matchMedia('(pointer: fine)').matches) {
  // anchors kapalı: kendi tek işleyicimiz var, ikisi birlikte çalışınca iniş noktası kayıyor.
  lenis = new Lenis({ autoRaf: false, lerp: 0.12 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

root.classList.add('motion-ready');

// Görsel denetim yardımcıları (yalnız geliştirme). Ekran görüntüsü alırken animasyonları
// requestAnimationFrame beklemeden sonuna alır: qa.settle(), qa.scrollTo(y).
if (import.meta.env.DEV) {
  const qa = {
    settle() {
      gsap.globalTimeline.getChildren(true, true, true).forEach((child) => {
        const trigger = (child as { scrollTrigger?: ScrollTrigger }).scrollTrigger;
        if (!trigger || !trigger.vars.scrub) child.progress(1, true);
      });
      ScrollTrigger.refresh();
    },
    scrollTo(y: number) {
      lenis?.scrollTo(y, { immediate: true });
      window.scrollTo(0, y);
      ScrollTrigger.update();
      qa.settle();
    },
  };
  Object.assign(window, { gsap, ScrollTrigger, qa });
}

export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  root.style.overflow = locked ? 'hidden' : '';
}

export function scrollToTarget(target: HTMLElement) {
  if (!lenis) {
    target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    return;
  }
  // Hedef mutlak piksel olarak verilir. Lenis'e eleman verildiğinde konumu offsetTop
  // zincirinden çözüyor; araya konumlanmış bir ata eleman girince iniş noktası kayıyordu.
  const top = target.getBoundingClientRect().top + window.scrollY - anchorOffset();
  lenis.scrollTo(Math.max(top, 0), { duration: 0.9, force: true });
}

// Aynı sayfadaki bütün çapa bağlantıları buradan geçer: header menüsü, menü sayfasının
// kategori çubuğu, ocak bağlantıları. Tek kaynak olmadığında iniş noktası tutarsızlaşıyor.
document.addEventListener('click', (event) => {
  const link = (event.target as HTMLElement | null)?.closest?.('a[href*="#"]') as HTMLAnchorElement | null;
  if (!link || event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  if (link.target === '_blank' || link.pathname !== window.location.pathname || !link.hash || link.hash === '#') return;

  const target = document.querySelector<HTMLElement>(link.hash);
  if (!target) return;

  event.preventDefault();
  scrollToTarget(target);
  window.history.pushState(null, '', link.hash);
});

export { gsap, ScrollTrigger, lenis };
