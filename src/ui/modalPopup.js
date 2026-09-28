import { k } from "../core/kaplayCtx";
import { CONFIG } from "../core/constants";
import { AudioManager } from "../core/audioManager";

// Flag status modal global
export let isModalActive = false;

export function showModalPopup({ title = "SYSTEM NOTICE", message = "", onConfirm = null }) {
  isModalActive = true;

  // 1. Lapisan Backdrop Gelap
  const backdrop = k.add([
    k.rect(k.width(), k.height()),
    k.pos(0, 0),
    k.color(0, 0, 0),
    k.opacity(0),
    k.area(),
    k.fixed(),
    k.z(200)
  ]);

  // 2. Kontainer Box Dialog
  const modalBox = k.add([
    k.pos(k.center().x, k.center().y - 12),
    k.anchor("center"),
    k.scale(0.85),
    k.opacity(0),
    k.fixed(),
    k.z(201)
  ]);

  // Frame Box Utama
  modalBox.add([
    k.rect(320, 140, { radius: 3 }),
    k.anchor("center"),
    k.color(14, 16, 22),
    k.outline(1.5, k.rgb(250, 204, 21))
  ]);

  // Header Title Bar
  modalBox.add([
    k.rect(320, 26, { radius: 2 }),
    k.pos(0, -57),
    k.anchor("center"),
    k.color(24, 28, 38)
  ]);

  modalBox.add([
    k.text(title, { font: CONFIG.FONT_DIALOGUE, size: 16 }),
    k.pos(0, -57),
    k.anchor("center"),
    k.color(250, 204, 21)
  ]);

  // Pesan Teks
  modalBox.add([
    k.text(message, {
      font: CONFIG.FONT_DIALOGUE,
      size: 16,
      width: 280,
      align: "center"
    }),
    k.pos(0, -8),
    k.anchor("center"),
    k.color(220, 225, 235)
  ]);

  // Tombol [OK]
  const okBtn = modalBox.add([
    k.rect(100, 26, { radius: 2 }),
    k.pos(0, 42),
    k.anchor("center"),
    k.color(24, 28, 38),
    k.outline(1, k.rgb(250, 204, 21)),
    k.area(),
    k.scale(1)
  ]);

  okBtn.add([
    k.text("OK", { font: CONFIG.FONT_DIALOGUE, size: 16 }),
    k.anchor("center"),
    k.color(250, 204, 21)
  ]);

  // 3. Tombol Bulat [X] di Bawah Kotak
  const closeBtn = k.add([
    k.circle(14),
    k.pos(k.center().x, k.center().y + 82),
    k.anchor("center"),
    k.color(20, 22, 30),
    k.outline(1.5, k.rgb(180, 50, 50)),
    k.area(),
    k.fixed(),
    k.scale(0.85),
    k.opacity(0),
    k.z(202)
  ]);

  closeBtn.add([
    k.text("X", { font: CONFIG.FONT_DIALOGUE, size: 16 }),
    k.anchor("center"),
    k.color(230, 80, 80)
  ]);

  // Animasi Muncul
  k.tween(0, 0.65, 0.18, (v) => (backdrop.opacity = v), k.easings.easeOutQuad);
  k.tween(0.85, 1, 0.18, (v) => {
    modalBox.scale = k.vec2(v, v);
    closeBtn.scale = k.vec2(v, v);
  }, k.easings.easeOutBack);
  k.tween(0, 1, 0.18, (v) => {
    modalBox.opacity = v;
    closeBtn.opacity = v;
  }, k.easings.easeOutQuad);

  // Tutup Modal
  function closeModal() {
    AudioManager.playSFX("sfxClick", 1.3);
    k.tween(1, 0, 0.12, (v) => {
      backdrop.opacity = v * 0.65;
      modalBox.opacity = v;
      closeBtn.opacity = v;
      modalBox.scale = k.vec2(0.85 + v * 0.15, 0.85 + v * 0.15);
    }).onEnd(() => {
      k.destroy(backdrop);
      k.destroy(modalBox);
      k.destroy(closeBtn);
      // Buka kembali interaksi tombol layar belakang
      isModalActive = false;
    });
  }

  okBtn.onClick(() => {
    closeModal();
    if (onConfirm) onConfirm();
  });

  closeBtn.onClick(() => {
    closeModal();
  });
}
