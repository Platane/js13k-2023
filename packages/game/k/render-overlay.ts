import { MAX_GROWTH } from "./const";
import { cells, crates, fields, towns, ui, workers } from "./data";
import { project } from "./render-canvas";

const container = document.getElementById("overlay-command")!;

export const render = () => {
  if (ui.selected?.type === "worker") {
    container.innerText = `${ui.selected.ids.length} worker selected`;

    //

    let miny = Infinity;
    let minx = Infinity;
    let maxx = -Infinity;

    for (const i of ui.selected.ids) {
      const { x, y } = workers[i];
      miny = Math.min(miny, y);
      minx = Math.min(minx, x);
      maxx = Math.max(maxx, x);
    }

    const { width, height } = container.getBoundingClientRect();

    const s = project((minx + maxx) / 2, miny - 1);

    container.style.transform = `translate3d(${s.x - width / 2}px,${
      s.y - height
    }px,0)`;
    container.style.display = "block";
  } else if (ui.selected?.type === "town") {
    container.innerText = `town selected`;

    //

    const { width, height } = container.getBoundingClientRect();

    const { x, y } = cells[towns[ui.selected.id].cell];
    const s = project(x, y - 1);

    container.style.transform = `translate3d(${s.x - width / 2}px,${
      s.y - height
    }px,0)`;
    container.style.display = "block";
  } else {
    container.style.display = "none";
    container.style.transform = `translate3d(-99px,-99px,0)`;
  }
};
