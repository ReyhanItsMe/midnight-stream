import { k } from "../core/kaplayCtx";
import { CONFIG } from "../core/constants";
import { createMenuButton } from "../ui/menuButton";
import { transitionTo } from "../ui/transition";
import { AudioManager } from "../core/audioManager";
import { showModalPopup } from "../ui/modalPopup";

export function titleScene() {
  k.scene("title_screen", () => {
    k.camPos(k.center());

    // 1. Putar BGM Menu
    AudioManager.playMenuBGM();

    const unlockAudio = () => {
      AudioManager.playMenuBGM();
      window.removeEventListener("touchstart", unlockAudio);
    };
    window.addEventListener("touchstart", unlockAudio);

    // 2. Background Visual
    k.add([k.sprite("bgMenu"), k.pos(0, 0), k.z(-10)]);
    k.add([
      k.rect(k.width(), k.height()),
      k.pos(0, 0),
      k.color(10, 10, 15),
      k.opacity(0.45),
      k.z(-5)
    ]);

    // Subtitle & Judul
    k.add([
      k.text("LIVEVIBE PRESENTS // SANATORIUM DAHLIA", { font: CONFIG.FONT_DIALOGUE, size: 16 }),
      k.pos(k.center().x, 36),
      k.anchor("center"),
      k.color(220, 60, 60),
      k.z(10)
    ]);

    const titleSprite = k.add([
      k.sprite("gameTitle"),
      k.pos(k.center().x, 88),
      k.anchor("center"),
      k.scale(2),
      k.z(10)
    ]);

    k.loop(3.5, () => {
      titleSprite.opacity = 0.5;
      titleSprite.pos.x = k.center().x + k.rand(-2, 2);
      k.wait(0.08, () => {
        titleSprite.opacity = 1;
        titleSprite.pos.x = k.center().x;
      });
    });

    // 3. Tombol Menu dengan Modal Konfirmasi Exit
    const menuList = [
      { 
        label: "PLAY STREAM", 
        action: () => {
          AudioManager.stopBGM();
          transitionTo("sanatorium_gate", 0.4);
        }
      },
      { 
        label: "LOAD LOG", 
        action: () => transitionTo("load_game_screen", 0.25) 
      },
      { 
        label: "SETTINGS", 
        action: () => transitionTo("setting_screen", 0.25) 
      },
      { 
        label: "EXIT", 
        action: () => {
          showModalPopup({
            title: "TERMINATE STREAM",
            message: "Apakah kamu yakin ingin mengakhiri siaran dan keluar?",
            onConfirm: () => {
              AudioManager.stopBGM();
              // Cek jika berjalan di Capacitor native APK
              if (window.Capacitor?.Plugins?.App) {
                window.Capacitor.Plugins.App.exitApp();
              } else {
                // Tampilan saat di browser/Chrome
                window.close();
                // Jika browser memblokir window.close(), beri layar statis hitam penutup
                k.add([
                  k.rect(k.width(), k.height()),
                  k.pos(0, 0),
                  k.color(0, 0, 0),
                  k.fixed(),
                  k.z(9999)
                ]);
                k.add([
                  k.text("BROADCAST TERMINATED.\nTUTUP TAB / RECENT APPS UNTUK KELUAR.", {
                    font: CONFIG.FONT_DIALOGUE,
                    size: 16,
                    align: "center"
                  }),
                  k.pos(k.center().x, k.center().y),
                  k.anchor("center"),
                  k.color(200, 50, 50),
                  k.fixed(),
                  k.z(10000)
                ]);
              }
            }
          });
        }
      }
    ];

    const START_Y = 170;
    const GAP_Y = 34;

    menuList.forEach((item, index) => {
      createMenuButton(
        k.center().x,
        START_Y + (index * GAP_Y),
        240,
        28,
        item.label,
        item.action
      );
    });

    // 4. Credit
    k.add([
      k.text("DEV BUILD v0.1 // CREATED BY RAIHAN AZHAR", {
        font: CONFIG.FONT_DIALOGUE,
        size: 16
      }),
      k.pos(k.width() - 16, k.height() - 14),
      k.anchor("botright"),
      k.color(140, 145, 160),
      k.z(10)
    ]);
  });
}
