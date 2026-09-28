import { k } from "./core/kaplayCtx";
import { bootScene } from "./scenes/bootScene";
import { titleScene } from "./scenes/titleScene";
import { settingScene } from "./scenes/settingScene";
import { loadGameScene } from "./scenes/loadGameScene";

import { prologueGateScene } from "./scenes/prologueGate";

// Registrasi semua scene
bootScene();
titleScene();
settingScene();
loadGameScene();
prologueGateScene();

// Memulai aplikasi
k.go("boot");
