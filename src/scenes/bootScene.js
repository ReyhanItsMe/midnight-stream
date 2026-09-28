import { k } from "../core/kaplayCtx";
import { CONFIG } from "../core/constants";

export function bootScene() {
  k.scene("boot", () => {
    // 1. Scanlines Monitor CRT
    for (let y = 0; y < k.height(); y += 4) {
      k.add([
        k.rect(k.width(), 1.5),
        k.pos(0, y),
        k.color(0, 0, 0),
        k.opacity(0.35),
        k.z(50)
      ]);
    }

    // 2. Efek Partikel Noise / Grain Acak
    k.loop(0.05, () => {
      const grain = k.add([
        k.rect(k.rand(1, 3), k.rand(1, 3)),
        k.pos(k.rand(0, k.width()), k.rand(0, k.height())),
        k.color(200, 200, 220),
        k.opacity(k.rand(0.1, 0.4)),
        k.z(45)
      ]);
      k.wait(0.05, () => k.destroy(grain));
    });

    // 3. Status Tag Broadcast (Gunakan simbol titik • bukan kurung siku)
    const channelTag = k.add([
      k.text("* REC * LIVEVIBE CLIENT v1.0.4", {
        font: CONFIG.FONT_DIALOGUE,
        size: 16
      }),
      k.pos(24, 20),
      k.color(220, 40, 40)
    ]);

    // Kedip status REC
    k.loop(0.5, () => {
      channelTag.hidden = !channelTag.hidden;
    });

    // 4. Log Konsol Terminal
    const logSteps = [
      "INITIALIZING OBS AUDIO/VIDEO DRIVER...",
      "PINGING LIVEVIBE INGEST SERVER...",
      "BYPASSING DAHLIA FIREWALL PROTOCOLS...",
      "ESTABLISHING ENCRYPTED STREAM CONNECTION...",
      "FEED SECURED. READY TO BROADCAST."
    ];
    let logIndex = 0;

    const consoleLog = k.add([
      k.text(logSteps[0], {
        font: CONFIG.FONT_DIALOGUE,
        size: 16
      }),
      k.pos(k.center().x, 140),
      k.anchor("center"),
      k.color(180, 185, 200)
    ]);

    k.loop(0.4, () => {
      if (logIndex < logSteps.length - 1) {
        logIndex++;
        consoleLog.text = logSteps[logIndex];
      }
    });

    // 5. Progress Bar
    const barW = 280;
    const barH = 10;
    const barX = k.center().x - barW / 2;
    const barY = 175;

    k.add([
      k.rect(barW + 6, barH + 6),
      k.pos(barX - 3, barY - 3),
      k.color(12, 14, 20),
      k.outline(1.5, k.rgb(70, 75, 95))
    ]);

    const progressFill = k.add([
      k.rect(0, barH),
      k.pos(barX, barY),
      k.color(234, 179, 8)
    ]);

    // Persentase Angka
    const percentText = k.add([
      k.text("0%", {
        font: CONFIG.FONT_DIALOGUE,
        size: 16
      }),
      k.pos(k.center().x, 200),
      k.anchor("center"),
      k.color(234, 179, 8)
    ]);

    // 6. Peringatan Headphone
    k.add([
      k.text("PERINGATAN: GUNAKAN HEADPHONE UNTUK PENGALAMAN TERBAIK", {
        font: CONFIG.FONT_DIALOGUE,
        size: 16
      }),
      k.pos(k.center().x, k.height() - 25),
      k.anchor("center"),
      k.color(120, 125, 140)
    ]);

    // 7. Muat Aset
    k.loadFont(CONFIG.FONT_TITLE, "/fonts/pixel.ttf");
    k.loadFont(CONFIG.FONT_DIALOGUE, "/fonts/Pix32.ttf");
    k.loadSound("bgmFear", "/audio/bgm/bgm-fear.mp3");
    k.loadSound("sfxClick", "/audio/sfx/sfx-click-button.mp3");
    k.loadSprite("bgMenu", "/backgrounds/title/background-menu.png");
    k.loadSprite("bgSetting", "/backgrounds/setting/background-setting.png");
    k.loadSprite("bgLoadGame", "/backgrounds/load-game/background-load-game.png");
    k.loadSprite("gameTitle", "/ui/titles/title-games.png");
    k.loadSprite("rian", "/sprites/characters/rian.png");

    k.onLoading((progress) => {
      progressFill.width = barW * progress;
      percentText.text = `${Math.floor(progress * 100)}%`;
    });

    k.onLoad(() => {
      progressFill.width = barW;
      percentText.text = "100%";
      consoleLog.text = "STREAM READY. ENTERING STUDIO...";
      consoleLog.color = k.rgb(100, 240, 100);

      k.wait(0.5, () => {
        k.go("title_screen");
      });
    });
  });
}
