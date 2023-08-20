const cells = Array.from({ length: 100 }, (_, i) => ({
  x: (0 | (i / 10)) * 10,
  y: (i % 10) * 10,
}));

const towns = [{ cell: 34, gold: 0 }];

const fields = [
  { cell: 34, town: 0 },
  { cell: 35, town: 0 },
  { cell: 44, town: 0 },
  { cell: 43, town: 0 },
];

const workers = [{ x: 12, y: 10, town: 0 }];

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

    for (const { cell, town } of fields) {
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
    }

    for (const { x, y } of workers) {
      ctx.fillStyle = "blue";
      ctx.beginPath();
      ctx.arc(x, y, 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  ctx.restore();
};

const render = createRenderer();
render();
