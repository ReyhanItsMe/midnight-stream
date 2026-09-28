import { k } from "../core/kaplayCtx";
import { CONFIG } from "../core/constants";
import { createVirtualJoystick } from "../ui/virtualJoystick";
import { showDialogue } from "../ui/dialogueBox";
import { prologueDialogues } from "../data/storyTree";

export function prologueGateScene() {
  k.scene("sanatorium_gate", () => {
    const MAP_MIN = -600;
    const MAP_MAX = 1200;
    for (let x = MAP_MIN; x < MAP_MAX; x += CONFIG.TILE_SIZE) {
      for (let y = MAP_MIN; y < MAP_MAX; y += CONFIG.TILE_SIZE) {
        const isAlt = ((x / CONFIG.TILE_SIZE) + (y / CONFIG.TILE_SIZE)) % 2 === 0;
        k.add([
          k.rect(CONFIG.TILE_SIZE - 2, CONFIG.TILE_SIZE - 2),
          k.pos(x, y),
          k.color(isAlt ? k.rgb(20, 22, 30) : k.rgb(14, 15, 22)),
          k.z(CONFIG.Z.BG)
        ]);
      }
    }

    const player = k.add([
      k.sprite("rian"),
      k.pos(k.center().x, 170),
      k.anchor("center"),
      k.scale(2),
      k.area(),
      k.body(),
      k.z(CONFIG.Z.WORLD),
      "player"
    ]);

    k.camPos(player.pos);

    k.add([
      k.text("SANATORIUM DAHLIA - 23:42 WIB", { font: CONFIG.FONT_TITLE, size: 13 }),
      k.pos(20, 16),
      k.color(220, 50, 50),
      k.fixed(),
      k.z(CONFIG.Z.UI_BASE)
    ]);

    const joystick = createVirtualJoystick();

    player.onUpdate(() => {
      const vec = joystick.getVector();
      if (vec.len() > 0) {
        player.move(vec.unit().scale(CONFIG.PLAYER_SPEED));
      }
      k.camPos(player.pos);
    });

    showDialogue(prologueDialogues[0], () => {
      joystick.activate();
    });
  });
}
