const cells = Array.from({ length: 100 }, (_, i) => ({
  x: (0 | (i / 10)) * 10,
  y: (i % 10) * 10,
}));

const towns = [{ cell: 34, gold: 0 }];

const fields = [
  { cell: 34, town: 0, growth: 0 },
  { cell: 35, town: 0, growth: 0 },
  { cell: 44, town: 0, growth: 0 },
  { cell: 43, town: 0, growth: 0 },
];

const workers = [
  {
    x: 12,
    y: 10,
    field: 0,
    target: null as number | null,
    carrying: 0 as number | null,
    job: "go-to-field" as "go-to-field" | "work-field" | "go-to-idle",
  },
];

const crates = [
  { x: 0, y: 0, owner: 0, carrier: 0 as number | null },
  { x: 1.4, y: 2.23, owner: 0, carrier: null },
  { x: 1.5, y: 3.43, owner: 0, carrier: null },
];

const MAX_GROWTH = 200;

const ui = {
  selected: null as null | number[],

  selectionRect: null as
    | null
    | [{ x: number; y: number }, { x: number; y: number }],
};

const createRenderer = () => {
  const canvas: HTMLCanvasElement = document.getElementsByTagName("canvas")[0];

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const ctx = canvas.getContext("2d")!;

  const r = Math.min(canvas.width / 100, canvas.height / 100);

  ctx.save();
  ctx.scale(r, r);
  ctx.translate(5, 5);

  return () => {
    ctx.clearRect(-100, -100, 300, 300);

    for (const { x, y } of cells) {
      ctx.strokeStyle = "orange";
      ctx.lineWidth = 0.2;
      ctx.beginPath();
      ctx.moveTo(x - 0.5, y);
      ctx.lineTo(x + 0.5, y);
      ctx.moveTo(x, y - 0.5);
      ctx.lineTo(x, y + 0.5);
      ctx.stroke();
    }

    for (const { cell, gold } of towns) {
      const { x, y } = cells[cell];
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 0.2;
      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, Math.PI * 2);
      ctx.stroke();
    }

    for (const { cell, town, growth } of fields) {
      const { x, y } = cells[cell];
      const { x: tx, y: ty } = cells[towns[town].cell];

      ctx.strokeStyle = "blue";
      ctx.fillStyle = "blue";
      ctx.lineWidth = 0.2;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(tx, ty);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.fillStyle = "grey";
      ctx.fillRect(x - 2, y - 1, 4, 0.5);
      ctx.fillStyle = "black";
      ctx.fillRect(x - 2, y - 1, (4 * growth) / MAX_GROWTH, 0.5);
    }

    for (const { x, y, carrying } of workers) {
      ctx.fillStyle = "blue";
      ctx.beginPath();
      ctx.arc(x, y, 0.5, 0, Math.PI * 2);
      ctx.fill();

      if (carrying !== null) {
        ctx.fillStyle = "pink";
        ctx.beginPath();
        ctx.rect(x - 0.4, y - 0.3 - 0.5, 0.8, 0.6);
        ctx.fill();
      }
    }

    for (const { x, y, carrier } of crates) {
      if (carrier !== null) continue;

      ctx.fillStyle = "pink";
      ctx.beginPath();
      ctx.rect(x - 0.4, y - 0.3, 0.8, 0.6);
      ctx.fill();
    }

    if (ui.selectionRect) {
      ctx.lineWidth = 0.1;
      ctx.fillStyle = `rgba(23,124,200,0.2)`;
      ctx.strokeStyle = `rgba(23,124,200,0.5)`;
      ctx.beginPath();
      ctx.rect(
        ui.selectionRect[0].x,
        ui.selectionRect[0].y,
        ui.selectionRect[1].x - ui.selectionRect[0].x,
        ui.selectionRect[1].y - ui.selectionRect[0].y
      );
      ctx.fill();
      ctx.stroke();
    }
  };

  ctx.restore();
};

const update = () => {
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
  // for each worker
  // assign a field

  for (let i = workers.length; i--; ) {
    const w = workers[i];
    if (w.job === "go-to-field") 0;
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

const render = createRenderer();

const loop = () => {
  update();
  render();

  requestAnimationFrame(loop);
};

loop();

{
  const canvas: HTMLCanvasElement = document.getElementsByTagName("canvas")[0];

  const getCoord = ({ pageX, pageY }: { pageX: number; pageY: number }) => {
    const r = Math.min(canvas.width, canvas.height);

    const x = (pageX / r) * 100 - 5;
    const y = (pageY / r) * 100 - 5;

    return { x, y };
  };

  canvas.addEventListener("mousedown", (e) => {
    ui.selectionRect = [getCoord(e), getCoord(e)];
  });
  canvas.addEventListener("mousemove", (e) => {
    if (ui.selectionRect) {
      ui.selectionRect[1] = getCoord(e);
    }
  });
  canvas.addEventListener("mouseup", () => {
    if (ui.selectionRect) {
      const selected = [];
      const minx = Math.min(ui.selectionRect[0].x, ui.selectionRect[1].x);
      const maxx = Math.max(ui.selectionRect[0].x, ui.selectionRect[1].x);
      const miny = Math.min(ui.selectionRect[0].y, ui.selectionRect[1].y);
      const maxy = Math.max(ui.selectionRect[0].y, ui.selectionRect[1].y);
      for (let i = workers.length; i--; ) {
        const { x, y } = workers[i];

        if (minx <= x && x <= maxx && miny <= y && y <= maxy) selected.push(i);
      }
      ui.selectionRect = null;
      ui.selected = selected;
    }
  });
}
