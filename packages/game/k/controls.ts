import { cells, fields, towns, ui, workers } from "./data";

const canvas: HTMLCanvasElement = document.getElementsByTagName("canvas")[0];

const getCoord = ({ pageX, pageY }: { pageX: number; pageY: number }) => {
  const r = Math.min(canvas.width, canvas.height);

  const x = (pageX / r) * 100 - 5;
  const y = (pageY / r) * 100 - 5;

  return { x, y };
};

const pickCell = (x: number, y: number) => {
  const cx = Math.round(x);
  const cy = Math.round(y);

  const i = cells.findIndex((c) => c.x === cx && c.y === cy);
  return i === -1 ? null : i;
};

export const FAT_FINGER_MARGIN = 0.8;

canvas.addEventListener("mousedown", (e) => {
  if (e.button === 0) {
    ui.selectionRect = [getCoord(e), getCoord(e)];
    ui.selectionRectStartDate = e.timeStamp;
    return;
  }

  const selected = ui.selected;

  if (e.button === 2 && selected && (selected?.length ?? 0) > 0) {
    const { x, y } = getCoord(e);
    const cell_i = pickCell(x, y);

    if (cell_i !== null) {
      const field_i = fields.findIndex((f) => f.cell === cell_i);

      if (field_i !== null) {
        for (const i of selected) {
          workers[i].job = "go-to-field";
          workers[i].field = field_i;
        }

        return;
      }
    }

    for (const i of selected) {
      workers[i].job = "go-to";
      workers[i].target_x = x;
      workers[i].target_y = y;
    }

    return;
  }
});
canvas.addEventListener("mousemove", (e) => {
  if (ui.selectionRect) {
    ui.selectionRect[1] = getCoord(e);
  }
});
canvas.addEventListener("mouseup", (e) => {
  if (ui.selectionRect) {
    const duration = e.timeStamp - ui.selectionRectStartDate;

    const selected = [];
    let minx = Math.min(ui.selectionRect[0].x, ui.selectionRect[1].x);
    let maxx = Math.max(ui.selectionRect[0].x, ui.selectionRect[1].x);
    let miny = Math.min(ui.selectionRect[0].y, ui.selectionRect[1].y);
    let maxy = Math.max(ui.selectionRect[0].y, ui.selectionRect[1].y);

    if (duration < 200) {
      minx -= FAT_FINGER_MARGIN;
      miny -= FAT_FINGER_MARGIN;
      maxx += FAT_FINGER_MARGIN;
      maxy += FAT_FINGER_MARGIN;
    }

    ui.selectionRect = null;

    for (let i = workers.length; i--; ) {
      const { x, y } = workers[i];

      if (minx <= x && x <= maxx && miny <= y && y <= maxy) selected.push(i);
    }
    if (selected.length > 0) {
      ui.selected = selected;
      ui.selectedType = "worker";
      return;
    }

    for (let i = towns.length; i--; ) {
      const { x, y } = cells[towns[i].cell];

      if (minx <= x && x <= maxx && miny <= y && y <= maxy) selected.push(i);
    }
    if (selected.length > 0) {
      selected.length = 1;
      ui.selected = selected;
      ui.selectedType = "town";
      return;
    }
  }
});

canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});
