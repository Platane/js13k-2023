import { MAX_GROWTH, WORKER_SPEED } from "./const";
import { pickCell } from "./controls";
import { cells, crates, fields, workers } from "./data";

export const update = () => {
  // for each town
  // organize the workforce
  // a town can
  //  - fund a new field
  //  - create a new worker
  //  - create a new warrior
  //
  // at each tick
  // organize the workforce such as
  //   - every field have an optimum number of worker
  //   - if there is too many fields, queue to produce a worker
  //   - if there is too many worker, queue to produce a field
  //       - if a field cannot be produced, force warrior production ?
  //       - transfert fund to another adjacent town ?

  0;

  //
  //
  // for each fields
  // balance workers

  //
  //
  // for each worker

  for (let i = workers.length; i--; ) {
    const w = workers[i];

    //
    // resolve movement
    if (w.job === "go-to-field" || w.job === "go-to") {
      const tx =
        w.job === "go-to-field" ? cells[fields[w.field].cell].x : w.target_x;
      const ty =
        w.job === "go-to-field" ? cells[fields[w.field].cell].y : w.target_y;

      const dx = tx - w.x;
      const dy = ty - w.y;
      const l = Math.sqrt(dx * dx + dy * dy);

      if (l < WORKER_SPEED) {
        if (w.job === "go-to") w.job = "idle";
        if (w.job === "go-to-field") w.job = "work-field";
      } else {
        w.x += (dx * WORKER_SPEED) / l;
        w.y += (dy * WORKER_SPEED) / l;
      }
    }

    if (
      w.job === "go-to-field" &&
      fields[w.field].cell === pickCell(w.x, w.y)
    ) {
      w.job = "work-field";
    }

    //
    // papillone in the field
    if (w.job === "work-field") {
    }
  }

  //
  //
  // for each fields
  // update the growth

  for (let i = fields.length; i--; ) {
    const field = fields[i];
    const cell = cells[field.cell];

    let c = 0;
    for (const w of workers) if (w.job === "work-field" && w.field === i) c++;

    field.growth += c;

    while (field.growth >= MAX_GROWTH) {
      field.growth -= MAX_GROWTH;

      // produce a crate
      crates.push({
        x: cell.x + Math.random() * 6 - 3,
        y: cell.y + Math.random() * 6 - 3,
        owner: 0,
        carrier: null,
      });
    }
  }
};
