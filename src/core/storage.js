const STORAGE_KEYS = {
  SETTINGS: "MIDNIGHT_STREAM_SETTINGS_V1",
  SLOTS_PREFIX: "MIDNIGHT_STREAM_SLOT_"
};

const DEFAULT_SETTINGS = {
  bgmVolume: 6,
  sfxVolume: 10
};

export const GameStorage = {
  getSettings() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  },

  saveSettings(newSettings) {
    try {
      const current = this.getSettings();
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({ ...current, ...newSettings }));
    } catch (e) {
      console.error(e);
    }
  },

  // Mengambil data save slot tertentu (1, 2, atau 3)
  getSlot(slotIndex) {
    try {
      const raw = localStorage.getItem(`${STORAGE_KEYS.SLOTS_PREFIX}${slotIndex}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  // Menyimpan ke slot tertentu
  saveSlot(slotIndex, data) {
    try {
      const payload = {
        ...data,
        savedAt: new Date().toLocaleString("id-ID", {
          dateStyle: "short",
          timeStyle: "short"
        })
      };
      localStorage.setItem(`${STORAGE_KEYS.SLOTS_PREFIX}${slotIndex}`, JSON.stringify(payload));
      return true;
    } catch {
      return false;
    }
  },

  // Menghapus save data slot tertentu
  deleteSlot(slotIndex) {
    localStorage.removeItem(`${STORAGE_KEYS.SLOTS_PREFIX}${slotIndex}`);
  }
};
