// Görseller indikçe yumuşak açılır. Kutu koyu zeminde durur, dosya gelince
// opacity 0'dan 1'e geçer. Gizli kalma riski yok: hata durumunda da işaretlenir,
// ayrıca CSS kuralı yalnız html.motion altında geçerli (JS yoksa görsel normal görünür).
import { medyaDegisince } from './media';

const isaretle = (img: HTMLImageElement) => img.classList.add('is-yuklendi');

const izle = (img: HTMLImageElement) => {
  if (img.complete && img.naturalWidth > 0) {
    isaretle(img);
    return;
  }
  img.addEventListener('load', () => isaretle(img), { once: true });
  img.addEventListener('error', () => isaretle(img), { once: true });
};

const tara = (kok: ParentNode = document) => {
  kok.querySelectorAll<HTMLImageElement>('img').forEach(izle);
};

tara();

// Sonradan DOM'a giren görseller de izlenir. Pano kartları <template> içinde duruyor
// ve pano açılınca klonlanıyor: ilk taramada olmadıkları için is-yuklendi alamıyor,
// saydam kalıp kutu simsiyah görünüyordu.
const gozcu = new MutationObserver((kayitlar) => {
  kayitlar.forEach((kayit) => {
    kayit.addedNodes.forEach((node) => {
      if (!(node instanceof Element)) return;
      if (node instanceof HTMLImageElement) izle(node);
      else tara(node);
    });
  });
});
gozcu.observe(document.body, { childList: true, subtree: true });

// Yönetim panelinden yeni adres gelirse görsel yeniden yüklenir, geçiş tekrar oynar.
medyaDegisince(() => {
  document.querySelectorAll<HTMLImageElement>('img[data-media-id]').forEach((img) => {
    if (img.complete && img.naturalWidth > 0) return;
    img.classList.remove('is-yuklendi');
    izle(img);
  });
});
