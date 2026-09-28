import { k } from "../core/kaplayCtx";
import { CONFIG } from "../core/constants";
import { createMenuButton } from "../ui/menuButton";
import { transitionTo } from "../ui/transition";
import { GameStorage } from "../core/storage";
import { AudioManager } from "../core/audioManager";
import { showModalPopup } from "../ui/modalPopup";

export function loadGameScene() {
  k.scene("load_game_screen", () => {
    k.camPos(k.center());

    // 1. Background
    k.add([k.sprite("bgLoadGame"), k.pos(0, 0), k.z(-10)]);

    k.add([
      k.rect(k.width(), k.height()),
      k.pos(0, 0),
      k.color(6, 8, 12),
      k.opacity(0.35),
      k.z(-5)
    ]);

    const RIGHT_AREA_CENTER_X = 405;

    // 2. Header Judul
    k.add([
      k.text("BROADCAST ARCHIVES // RECOVERY LOG", {
        font: CONFIG.FONT_DIALOGUE,
        size: 16
      }),
      k.pos(RIGHT_AREA_CENTER_X, 32),
      k.anchor("center"),
      k.color(250, 204, 21),
      k.z(10)
    ]);

    // 3. Konfigurasi 20 Save Slots
    const TOTAL_SLOTS = 20;
    let selectedIndex = 0; // 0 sampai 19

    const slotCardNodes = [];

    // Track Scrollbar di Kanan (X = 582, Tinggi = 126px)
    const SCROLL_X = 582;
    const SCROLL_Y = 142;
    const SCROLL_H = 126;

    k.add([
      k.rect(4, SCROLL_H, { radius: 2 }),
      k.pos(SCROLL_X, SCROLL_Y),
      k.anchor("center"),
      k.color(24, 28, 38),
      k.outline(1, k.rgb(45, 50, 65)),
      k.z(15)
    ]);

    // Thumb Scrollbar yang bergeser
    const scrollThumb = k.add([
      k.rect(6, 18, { radius: 2 }),
      k.pos(SCROLL_X, SCROLL_Y - SCROLL_H / 2 + 9),
      k.anchor("center"),
      k.color(250, 204, 21),
      k.z(16)
    ]);

    function updateScrollbarThumb() {
      const step = (SCROLL_H - 18) / (TOTAL_SLOTS - 1);
      scrollThumb.pos.y = (SCROLL_Y - SCROLL_H / 2 + 9) + (selectedIndex * step);
    }

    // Indikator Posisi Slot (Contoh: "SLOT 01 / 20")
    const counterLabel = k.add([
      k.text("SLOT 01 / 20", { font: CONFIG.FONT_DIALOGUE, size: 16 }),
      k.pos(RIGHT_AREA_CENTER_X, 58),
      k.anchor("center"),
      k.color(160, 165, 180),
      k.z(10)
    ]);

    // Render Ulang 3 Slot (Atas, Tengah, Bawah)
    function refreshCarousel() {
      slotCardNodes.forEach((node) => k.destroy(node));
      slotCardNodes.length = 0;

      const CENTER_Y = 142;
      const OFFSET_Y = 56;

      counterLabel.text = `SLOT ${String(selectedIndex + 1).padStart(2, "0")} / ${TOTAL_SLOTS}`;
      updateScrollbarThumb();

      for (let i = 0; i < TOTAL_SLOTS; i++) {
        const diff = i - selectedIndex;

        // KUNCI: Hanya render index -1 (atas), 0 (tengah), dan 1 (bawah). 4+ tidak dirender.
        if (Math.abs(diff) > 1) continue;

        const isCenter = diff === 0;
        const targetY = CENTER_Y + (diff * OFFSET_Y);
        const cardScale = isCenter ? 1.0 : 0.84;
        const cardOpacity = isCenter ? 1.0 : 0.35;
        const cardZ = isCenter ? 30 : 20;

        const card = k.add([
          k.pos(RIGHT_AREA_CENTER_X - 12, targetY),
          k.anchor("center"),
          k.scale(cardScale),
          k.opacity(cardOpacity),
          k.z(cardZ)
        ]);

        const slotData = GameStorage.getSlot(i + 1);

        // Frame Kotak Kartu
        card.add([
          k.rect(320, 48, { radius: 2 }),
          k.anchor("center"),
          k.color(isCenter ? k.rgb(18, 22, 32) : k.rgb(10, 12, 18)),
          k.outline(isCenter ? 1.5 : 1, isCenter ? k.rgb(250, 204, 21) : k.rgb(55, 60, 75))
        ]);

        // Thumbnail Tag Nomor Slot
        card.add([
          k.rect(40, 34, { radius: 2 }),
          k.pos(-145, 0),
          k.anchor("left"),
          k.color(8, 10, 15),
          k.outline(1, isCenter ? k.rgb(250, 204, 21) : k.rgb(45, 50, 65))
        ]);

        card.add([
          k.text(`#${i + 1}`, { font: CONFIG.FONT_DIALOGUE, size: 16 }),
          k.pos(-125, 0),
          k.anchor("center"),
          k.color(isCenter ? k.rgb(250, 204, 21) : k.rgb(90, 95, 110))
        ]);

        // Detail Isi Data
        if (slotData) {
          card.add([
            k.text(slotData.chapterTitle || `RECOVERY LOG #${i + 1}`, {
              font: CONFIG.FONT_DIALOGUE,
              size: 16
            }),
            k.pos(-88, -9),
            k.anchor("left"),
            k.color(220, 225, 235)
          ]);

          card.add([
            k.text(`SAVED: ${slotData.savedAt || "UNKNOWN"} | BAT: ${slotData.player?.battery ?? 100}%`, {
              font: CONFIG.FONT_DIALOGUE,
              size: 16
            }),
            k.pos(-88, 9),
            k.anchor("left"),
            k.color(140, 145, 160)
          ]);
        } else {
          card.add([
            k.text(`EMPTY ARCHIVE SLOT`, {
              font: CONFIG.FONT_DIALOGUE,
              size: 16
            }),
            k.pos(-88, 0),
            k.anchor("left"),
            k.color(100, 105, 120)
          ]);
        }

        slotCardNodes.push(card);
      }
    }

    refreshCarousel();

    // 4. Tombol Scroll Navigasi (▲ / ▼)
    createMenuButton(
      SCROLL_X + 24,
      SCROLL_Y - 32,
      26,
      26,
      "▲",
      () => {
        if (selectedIndex > 0) {
          selectedIndex--;
          refreshCarousel();
        }
      }
    );

    createMenuButton(
      SCROLL_X + 24,
      SCROLL_Y + 32,
      26,
      26,
      "▼",
      () => {
        if (selectedIndex < TOTAL_SLOTS - 1) {
          selectedIndex++;
          refreshCarousel();
        }
      }
    );

    // 5. Tombol Aksi Diturunkan (Y = 275)
    const ACTIONS_Y = 275;

    // Tombol LOAD LOG
    createMenuButton(
      RIGHT_AREA_CENTER_X - 110,
      ACTIONS_Y,
      115,
      26,
      "LOAD LOG",
      () => {
        const slotData = GameStorage.getSlot(selectedIndex + 1);
        if (slotData) {
          showModalPopup({
            title: "CONFIRM RESUME",
            message: `Lanjutkan rekaman siaran Slot #${selectedIndex + 1}?`,
            onConfirm: () => {
              AudioManager.stopBGM();
              transitionTo(slotData.scene || "sanatorium_gate", 0.4);
            }
          });
        } else {
          showModalPopup({
            title: "EMPTY LOG",
            message: `Slot #${selectedIndex + 1} masih kosong. Tidak ada sinyal rekaman.`
          });
        }
      }
    );

    // Tombol DELETE LOG
    createMenuButton(
      RIGHT_AREA_CENTER_X + 15,
      ACTIONS_Y,
      105,
      26,
      "DELETE",
      () => {
        const slotData = GameStorage.getSlot(selectedIndex + 1);
        if (slotData) {
          showModalPopup({
            title: "DELETE ARCHIVE",
            message: `Hapus permanen file siaran Slot #${selectedIndex + 1}?`,
            onConfirm: () => {
              GameStorage.deleteSlot(selectedIndex + 1);
              refreshCarousel();
            }
          });
        } else {
          showModalPopup({
            title: "ACTION REJECTED",
            message: `Slot #${selectedIndex + 1} sudah kosong.`
          });
        }
      }
    );

    // Tombol BACK
    createMenuButton(
      RIGHT_AREA_CENTER_X + 120,
      ACTIONS_Y,
      80,
      26,
      "< BACK",
      () => {
        transitionTo("title_screen", 0.25);
      }
    );
  });
}
