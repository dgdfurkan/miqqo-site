// Hero'daki köz parçacıkları. Görünmüyorsa veya sekme arka plandaysa durur.

type Ember = { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; seed: number };

function makeSprite(): HTMLCanvasElement {
  const sprite = document.createElement('canvas');
  const s = 64;
  sprite.width = sprite.height = s;
  const ctx = sprite.getContext('2d')!;
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, 'rgba(255, 214, 150, 1)');
  g.addColorStop(0.18, 'rgba(255, 150, 70, 0.9)');
  g.addColorStop(0.45, 'rgba(252, 72, 36, 0.28)');
  g.addColorStop(1, 'rgba(252, 72, 36, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  return sprite;
}

export function startEmbers(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  const sprite = makeSprite();
  const embers: Ember[] = [];
  let width = 0;
  let height = 0;
  let frame = 0;
  let last = 0;
  let visible = true;

  const resize = () => {
    // Parçacıklar yumuşak ışık lekesi; 1.5 üstü piksel yoğunluğu görünürde fark etmiyor, dolgu maliyeti artıyor.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const target = width < 768 ? 18 : 42;
    while (embers.length < target) embers.push(spawn({} as Ember, true));
    embers.length = target;
  };

  // Masaüstünde fotoğrafın durduğu sağ yarıdan, mobilde tüm genişlikten yükselir.
  function spawn(e: Ember, scatter = false): Ember {
    const fromX = width >= 1024 ? 0.5 : 0;
    e.x = width * (fromX + Math.random() * (1 - fromX));
    e.y = scatter ? height * (0.35 + Math.random() * 0.7) : height * (0.9 + Math.random() * 0.15);
    e.vx = (Math.random() - 0.5) * 12;
    e.vy = -(28 + Math.random() * 60);
    e.life = scatter ? Math.random() * 3 : 0;
    e.max = 3.5 + Math.random() * 4;
    e.size = 5 + Math.random() * 11;
    e.seed = Math.random() * 100;
    return e;
  }

  const tick = (now: number) => {
    frame = requestAnimationFrame(tick);
    const dt = Math.min((now - (last || now)) / 1000, 0.05);
    last = now;
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';
    for (const e of embers) {
      e.life += dt;
      e.x += (e.vx + Math.sin((e.life + e.seed) * 2.2) * 14) * dt;
      e.y += e.vy * dt;
      const k = e.life / e.max;
      if (k >= 1 || e.y < -20) {
        spawn(e);
        continue;
      }
      const alpha = Math.sin(Math.PI * k) * (0.55 + 0.45 * Math.sin((e.life + e.seed) * 9));
      const size = e.size * (1 - k * 0.6);
      ctx.globalAlpha = Math.max(alpha, 0);
      ctx.drawImage(sprite, e.x - size / 2, e.y - size / 2, size, size);
    }
    ctx.globalAlpha = 1;
  };

  const play = () => {
    if (frame || !visible || document.hidden) return;
    last = 0;
    frame = requestAnimationFrame(tick);
  };
  const pause = () => {
    cancelAnimationFrame(frame);
    frame = 0;
  };

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) play();
    else pause();
  });
  const onVisibility = () => (document.hidden ? pause() : play());
  const resizeObserver = new ResizeObserver(resize);

  resize();
  resizeObserver.observe(canvas);
  observer.observe(canvas);
  document.addEventListener('visibilitychange', onVisibility);
  play();

  return () => {
    pause();
    observer.disconnect();
    resizeObserver.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    ctx.clearRect(0, 0, width, height);
  };
}
