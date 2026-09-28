import kaplay from "kaplay";

export const k = kaplay({
  width: 640,
  height: 360,
  letterbox: true,
  crisp: true,
  texFilter: "nearest",
  background: [8, 9, 14],
  touchToMouse: true,
  debug: true
});
