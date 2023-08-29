import { pickCell } from "../controls";
import { cells, crates, fields, towns, ui, workers } from "../data";
import { project } from "../render-canvas";

const container = document.querySelector("#overlay") as HTMLDivElement;

let type: NonNullable<typeof ui.selected>["type"] | undefined = undefined;
let current: { update: () => void; el: HTMLElement } | undefined;

export const render = () => {
  if (type !== ui.selected?.type) {
    if (current?.el) current.el.parentElement?.removeChild(current.el);

    type = ui.selected?.type;
    current =
      (type === "town" && createTownUi()) ||
      (type === "worker" && createWorkerUi()) ||
      undefined;

    if (current?.el) container.appendChild(current.el);
  }

  current?.update?.();
};

const createWorkerUi = () => {
  const template = document.querySelector("#worker-ui") as HTMLTemplateElement;

  const el = (template.content.cloneNode(true) as HTMLElement)
    .children[0] as HTMLElement;

  const label = el.querySelector(".label") as HTMLSpanElement;

  const update = () => {
    //
    // render
    //

    const selected = ui.selected as Extract<
      typeof ui.selected,
      { type: "worker" }
    >;

    label.innerText = `${selected.ids.length} worker selected`;

    //
    // re-position
    //

    let miny = Infinity;
    let minx = Infinity;
    let maxx = -Infinity;

    for (const i of selected.ids) {
      const { x, y } = workers[i];
      miny = Math.min(miny, y);
      minx = Math.min(minx, x);
      maxx = Math.max(maxx, x);
    }

    const { width, height } = el.getBoundingClientRect();

    const s = project((minx + maxx) / 2, miny - 1);

    el.style.transform = `translate3d(${s.x - width / 2}px,${
      s.y - height
    }px,0)`;
  };

  return { update, el };
};

const createTownUi = () => {
  const template = document.querySelector("#town-ui") as HTMLTemplateElement;

  const el = (template.content.cloneNode(true) as HTMLElement)
    .children[0] as HTMLElement;

  const label = el.querySelector(".label") as HTMLSpanElement;
  const button = el.querySelector(".add_worker") as HTMLButtonElement;

  button.addEventListener("click", () => {
    const selected = ui.selected as Extract<
      typeof ui.selected,
      { type: "town" }
    >;

    towns[selected.id].unit_queue.push({ unit: "worker", growth: 0 });
  });

  const update = () => {
    //
    // render
    //

    const selected = ui.selected as Extract<
      typeof ui.selected,
      { type: "town" }
    >;

    let n_fields = 0;
    let n_peon = 0;
    let n_crates = 0;
    for (const { town } of fields) if (town === selected.id) n_fields++;
    for (const c of crates) {
      const cell = pickCell(c.x, c.y);
      for (const f of fields)
        if (f.town === selected.id && cell === f.cell) n_crates++;
    }
    for (const w of workers)
      if (w.job === "work-field" && fields[w.field].town === selected.id)
        n_peon++;

    const label_text = `${n_fields} fields / ${n_peon} peons / ${n_crates} crates`;
    if (label.innerText !== label_text) label.innerText = label_text;

    //
    // re-position
    //

    const { width, height } = el.getBoundingClientRect();

    const { x, y } = cells[towns[selected.id].cell];
    const s = project(x, y - 1);

    el.style.transform = `translate3d(${s.x - width / 2}px,${
      s.y - height
    }px,0)`;
  };

  return { el, update };
};
