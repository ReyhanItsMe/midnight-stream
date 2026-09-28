import { k } from "../core/kaplayCtx";
import { CONFIG } from "../core/constants";

export function showDialogue(dialogueData, onClose) {
  const container = k.add([
    k.pos(0, 0),
    k.fixed(),
    k.z(CONFIG.Z.DIALOGUE)
  ]);

  const box = container.add([
    k.rect(600, 72, { radius: 3 }),
    k.pos(20, 268),
    k.color(15, 15, 20),
    k.outline(1.5, k.rgb(75, 75, 85)),
    k.area()
  ]);

  container.add([
    k.text(dialogueData.speaker, { font: CONFIG.FONT_TITLE, size: 11 }),
    k.pos(34, 276),
    k.color(k.rgb(...dialogueData.color))
  ]);

  container.add([
    k.text(dialogueData.text, {
      font: CONFIG.FONT_DIALOGUE,
      size: 16,
      width: 540,
      lineSpacing: 4
    }),
    k.pos(34, 294),
    k.color(230, 230, 235)
  ]);

  const notice = container.add([
    k.text("[KETUK UNTUK LANJUT]", { font: CONFIG.FONT_TITLE, size: 8 }),
    k.pos(590, 326),
    k.anchor("botright"),
    k.color(140, 140, 150)
  ]);

  const blinkLoop = k.loop(0.6, () => {
    notice.hidden = !notice.hidden;
  });

  function close() {
    blinkLoop.cancel();
    k.destroy(container);
    if (onClose) onClose();
  }

  box.onClick(close);
  box.onTouchStart(close);
}
