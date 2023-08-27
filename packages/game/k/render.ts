import { MAX_GROWTH } from "./const";
import { cells, crates, fields, towns, ui, workers } from "./data";

export const createRenderer = () => {
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

    for (let i = workers.length; i--; ) {
      const { x, y, carrying } = workers[i];
      ctx.fillStyle = "blue";
      ctx.beginPath();
      ctx.arc(x, y, 0.5, 0, Math.PI * 2);
      ctx.fill();

      if (ui.selected?.includes(i)) {
        ctx.beginPath();
        ctx.arc(x, y - 0.4, 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

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
