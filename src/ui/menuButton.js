import { k } from "../core/kaplayCtx";
import { CONFIG } from "../core/constants";
import { AudioManager } from "../core/audioManager";
import { isModalActive } from "./modalPopup";

export function createMenuButton(x, y, width, height, text, onClickAction) {
  // 1. Layer Bayangan Bawah (Shadow)
  const shadow = k.add([
    k.rect(width, height, { radius: 2 }),
    k.pos(x, y + 3),
    k.anchor("center"),
    k.color(6, 7, 10),
    k.z(49)
  ]);

  // 2. Badan Tombol Utama
  const btn = k.add([
    k.rect(width, height, { radius: 2 }),
    k.pos(x, y),
    k.anchor("center"),
    k.scale(1),
    k.color(20, 22, 32),
    k.outline(1.5, k.rgb(65, 70, 90)),
    k.z(50)
  ]);

  // 3. Teks Label
  const label = btn.add([
    k.text(text, {
      font: CONFIG.FONT_DIALOGUE,
      size: 16
    }),
    k.pos(0, 0),
    k.anchor("center"),
    k.color(210, 215, 225)
  ]);

  let isPressed = false;

  function isInside(point) {
    const halfW = width / 2;
    const halfH = height / 2;
    return (
      point.x >= x - halfW &&
      point.x <= x + halfW &&
      point.y >= y - halfH &&
      point.y <= y + halfH
    );
  }

  function pressDown() {
    if (isPressed) return;
    isPressed = true;

    btn.pos.y = y + 2;
    btn.scale = k.vec2(0.97, 0.95);
    btn.color = k.rgb(234, 179, 8);
    btn.outline.color = k.rgb(255, 220, 100);
    label.color = k.rgb(15, 15, 20);
  }

  function releaseUp() {
    if (!isPressed) return;
    isPressed = false;

    btn.pos.y = y;
    btn.scale = k.vec2(1, 1);
    btn.color = k.rgb(20, 22, 32);
    btn.outline.color = k.rgb(65, 70, 90);
    label.color = k.rgb(210, 215, 225);
  }

  // Cek apakah modal sedang aktif sebelum merespons sentuhan
  k.onTouchStart((touchPos) => {
    if (isModalActive) return;

    const sPos = k.toScreen(touchPos);
    if (isInside(sPos)) {
      pressDown();
    }
  });

  k.onTouchMove((touchPos) => {
    if (isModalActive) {
      if (isPressed) releaseUp();
      return;
    }

    const sPos = k.toScreen(touchPos);
    if (isPressed && !isInside(sPos)) {
      releaseUp();
    }
  });

  k.onTouchEnd((touchPos) => {
    if (isModalActive) {
      if (isPressed) releaseUp();
      return;
    }

    const sPos = k.toScreen(touchPos);
    if (isPressed) {
      releaseUp();
      if (isInside(sPos)) {
        AudioManager.playSFX("sfxClick", 1.3);
        onClickAction();
      }
    }
  });

  return { btn, shadow };
}
