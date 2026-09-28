import { k } from "../core/kaplayCtx";

export function transitionTo(sceneName, duration = 0.25) {
  // Tirai hitam di layer teratas layar (fixed tidak terpengaruh camPos)
  const curtain = k.add([
    k.rect(k.width(), k.height()),
    k.pos(0, 0),
    k.color(6, 7, 10),
    k.opacity(0),
    k.fixed(),
    k.z(999)
  ]);

  // 1. Layar menggelap (Fade out)
  k.tween(
    0,
    1,
    duration,
    (val) => { curtain.opacity = val; },
    k.easings.easeInOutQuad
  ).onEnd(() => {
    // Reset kamera ke titik tengah sebelum ganti scene agar tidak meleset
    k.camPos(k.center());

    // 2. Pindah scene
    k.go(sceneName);

    // 3. Pasang tirai di scene baru untuk efek Fade in (layar kembali terang)
    const newCurtain = k.add([
      k.rect(k.width(), k.height()),
      k.pos(0, 0),
      k.color(6, 7, 10),
      k.opacity(1),
      k.fixed(),
      k.z(999)
    ]);

    k.tween(
      1,
      0,
      duration,
      (val) => { newCurtain.opacity = val; },
      k.easings.easeInOutQuad
    ).onEnd(() => {
      k.destroy(newCurtain);
    });
  });
}
