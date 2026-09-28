import { k } from "./kaplayCtx";
import { GameStorage } from "./storage";

// Ambil setelan yang tersimpan di Chrome
const currentSettings = GameStorage.getSettings();

let currentBGM = null;
let currentBGMName = "";
let bgmStep = currentSettings.bgmVolume; // 0 - 10
let sfxStep = currentSettings.sfxVolume; // 0 - 10

export const AudioManager = {
  getBGMVolume() {
    return bgmStep;
  },

  getSFXVolume() {
    return sfxStep;
  },

  setBGMVolume(stepVal) {
    bgmStep = Math.max(0, Math.min(10, stepVal));
    if (currentBGM) {
      currentBGM.volume = bgmStep / 10;
    }
    // Simpan ke storage HP
    GameStorage.saveSettings({ bgmVolume: bgmStep });
  },

  setSFXVolume(stepVal) {
    sfxStep = Math.max(0, Math.min(10, stepVal));
    // Simpan ke storage HP
    GameStorage.saveSettings({ sfxVolume: sfxStep });
  },

  playMenuBGM() {
    if (currentBGMName === "bgmFear" && currentBGM) {
      currentBGM.volume = bgmStep / 10;
      return;
    }

    this.stopBGM();

    try {
      currentBGM = k.play("bgmFear", {
        loop: true,
        volume: bgmStep / 10
      });
      currentBGMName = "bgmFear";
    } catch (e) {
      console.warn("Autoplay ditahan sebelum interaksi:", e);
    }
  },

  stopBGM() {
    if (currentBGM) {
      currentBGM.stop();
      currentBGM = null;
      currentBGMName = "";
    }
  },

    playSFX(soundName, speed = 1.25) {
    if (sfxStep <= 0) return;
    try {
      k.play(soundName, { 
        volume: sfxStep / 10,
        speed: speed // Menaikkan kecepatan playback agar terdengar instan dan renyah
      });
    } catch (e) {
      console.warn("SFX error:", e);
    }
  }
};
