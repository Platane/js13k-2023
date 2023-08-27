import { createRenderer } from "./render";
import { update } from "./update";
import "./controls";

const render = createRenderer();

const loop = () => {
  update();
  render();

  requestAnimationFrame(loop);
};

loop();
