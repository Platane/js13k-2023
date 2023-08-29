import { MAX_GROWTH } from "./const";
import { pickCell } from "./controls";
import { cells, crates, fields, towns, ui, workers } from "./data";
import { project } from "./render-canvas";

const container = document.getElementById("overlay-command")!;

export const render = () => {
  if (ui.selected?.type === "worker") {
    container.innerText = `${ui.selected.ids.length} worker selected`;
    container.style.display = "block";

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
  } else if (ui.selected?.type === "town") {
    let n_fields = 0;
    let n_peon = 0;
    let n_crates = 0;
    for (const { town } of fields) if (town === ui.selected.id) n_fields++;
    for (const c of crates) {
      const cell = pickCell(c.x, c.y);
      for (const f of fields)
        if (f.town === ui.selected.id && cell === f.cell) n_crates++;
    }
    for (const w of workers)
      if (w.job === "work-field" && fields[w.field].town === ui.selected.id)
        n_peon++;

    container.innerText = [
      `town selected`,
      `${n_fields} fields / ${n_peon} peons / ${n_crates} crates`,
    ].join("\n");
    container.style.display = "block";

    //

    const { width, height } = container.getBoundingClientRect();

    const { x, y } = cells[towns[ui.selected.id].cell];
    const s = project(x, y - 1);

    container.style.transform = `translate3d(${s.x - width / 2}px,${
      s.y - height
    }px,0)`;
  } else {
    container.style.display = "none";
    container.style.transform = `translate3d(-99px,-99px,0)`;
  }
};
