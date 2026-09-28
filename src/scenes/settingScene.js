import { k } from "../core/kaplayCtx";
import { CONFIG } from "../core/constants";
import { createMenuButton } from "../ui/menuButton";
import { transitionTo } from "../ui/transition";
import { AudioManager } from "../core/audioManager";

export function settingScene() {
  k.scene("setting_screen", () => {
    k.camPos(k.center());

    // 1. Background Setting
    k.add([
      k.sprite("bgSetting"),
      k.pos(0, 0),
      k.z(-10)
    ]);

    k.add([
      k.rect(k.width(), k.height()),
      k.pos(0, 0),
      k.color(8, 10, 15),
      k.opacity(0.55),
      k.z(-5)
    ]);

    // 2. Header Judul Setting
    k.add([
      k.text("STREAM & AUDIO SETTINGS", {
        font: CONFIG.FONT_DIALOGUE,
        size: 16
      }),
      k.pos(k.center().x, 42),
      k.anchor("center"),
      k.color(250, 204, 21),
      k.z(10)
    ]);

    // ==========================================
    // HELPER: WIDGET VOLUME STEPPER [-] VALUE [+]
    // ==========================================
    function createVolumeControl(y, labelTitle, getVol, setVol, onTestSound) {
      const containerY = y;

      // Label Nama Setting
      k.add([
        k.text(labelTitle, {
          font: CONFIG.FONT_DIALOGUE,
          size: 16
        }),
        k.pos(k.center().x - 130, containerY),
        k.anchor("left"),
        k.color(210, 215, 225),
        k.z(10)
      ]);

      // Teks Angka Volume
      const valueText = k.add([
        k.text(`${getVol() * 10}%`, {
          font: CONFIG.FONT_DIALOGUE,
          size: 16
        }),
        k.pos(k.center().x + 55, containerY),
        k.anchor("center"),
        k.color(250, 204, 21),
        k.z(10)
      ]);

      // Tombol Minus [-]
      createMenuButton(
        k.center().x + 10,
        containerY,
        32,
        26,
        "-",
        () => {
          const current = getVol();
          if (current > 0) {
            setVol(current - 1);
            valueText.text = `${(current - 1) * 10}%`;
            if (onTestSound) onTestSound();
          }
        }
      );

      // Tombol Plus [+]
      createMenuButton(
        k.center().x + 100,
        containerY,
        32,
        26,
        "+",
        () => {
          const current = getVol();
          if (current < 10) {
            setVol(current + 1);
            valueText.text = `${(current + 1) * 10}%`;
            if (onTestSound) onTestSound();
          }
        }
      );
    }

    // 3. Pasang Kontrol BGM & SFX
    createVolumeControl(
      125,
      "BGM VOLUME",
      () => AudioManager.getBGMVolume(),
      (val) => AudioManager.setBGMVolume(val)
    );

    createVolumeControl(
      175,
      "SFX VOLUME",
      () => AudioManager.getSFXVolume(),
      (val) => AudioManager.setSFXVolume(val),
      () => {
        // Contoh uji coba suara tombol SFX saat volume dinaik/turunkan (opsional)
        // AudioManager.playSFX("click");
      }
    );

    // 4. Tombol BACK
    createMenuButton(
      k.center().x,
      245,
      240,
      28,
      "< BACK TO STUDIO",
      () => {
        transitionTo("title_screen", 0.25);
      }
    );
  });
}
