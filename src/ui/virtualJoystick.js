import { k } from "../core/kaplayCtx";
import { CONFIG } from "../core/constants";

export function createVirtualJoystick() {
  const JOY_BASE_POS = k.vec2(90, 270);
  const JOY_RADIUS = 45;
  let moveVector = k.vec2(0, 0);
  let active = false;

  const joyBase = k.add([
    k.circle(JOY_RADIUS),
    k.pos(JOY_BASE_POS),
    k.color(30, 30, 40),
    k.opacity(0),
    k.outline(2, k.rgb(120, 120, 140)),
    k.anchor("center"),
    k.fixed(),
    k.z(CONFIG.Z.UI_BASE)
  ]);

  const joyStick = k.add([
    k.circle(20),
    k.pos(JOY_BASE_POS),
    k.color(234, 179, 8),
    k.opacity(0),
    k.anchor("center"),
    k.fixed(),
    k.z(CONFIG.Z.UI_BASE + 1)
  ]);

  k.onTouchMove((pos) => {
    if (!active) return;
    const sPos = k.toScreen(pos);
    if (sPos.x < k.width() / 2 && sPos.y > 120) {
      const diff = sPos.sub(JOY_BASE_POS);
      if (diff.len() > JOY_RADIUS) {
        moveVector = diff.unit();
        joyStick.pos = JOY_BASE_POS.add(diff.unit().scale(JOY_RADIUS));
      } else {
        moveVector = diff.scale(1 / JOY_RADIUS);
        joyStick.pos = sPos;
      }
    }
  });

  k.onTouchEnd((pos) => {
    const sPos = k.toScreen(pos);
    if (sPos.x < k.width() / 2) {
      moveVector = k.vec2(0, 0);
      joyStick.pos = JOY_BASE_POS;
    }
  });

  return {
    activate() {
      active = true;
      joyBase.opacity = 0.4;
      joyStick.opacity = 0.8;
    },
    deactivate() {
      active = false;
      joyBase.opacity = 0;
      joyStick.opacity = 0;
      moveVector = k.vec2(0, 0);
      joyStick.pos = JOY_BASE_POS;
    },
    getVector() {
      return moveVector;
    }
  };
}
