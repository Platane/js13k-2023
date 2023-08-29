import { render as renderCanvas } from "./render-canvas";
import { render as renderOverlay } from "./ui/render";
import { update } from "./update";
import "./controls";

const loop = () => {
  update();

  renderOverlay();
  renderCanvas();

  requestAnimationFrame(loop);
};

loop();
