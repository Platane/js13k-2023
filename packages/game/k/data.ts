export const cells = Array.from({ length: 100 }, (_, i) => ({
  x: (0 | (i / 10)) * 10,
  y: (i % 10) * 10,
}));

export const towns = [
  { cell: 34, gold: 0, unit_queue: [] as { unit: "worker"; growth: number }[] },
];

export const fields = [
  { cell: 34, town: 0, growth: 0 },
  { cell: 35, town: 0, growth: 0 },
  { cell: 44, town: 0, growth: 0 },
  { cell: 43, town: 0, growth: 0 },
];

type W = { x: number; y: number } & { carrying: null | number } & (
    | {
        job: "work-field";
        field: number;
      }
    | {
        job: "go-to";
        target_x: number;
        target_y: number;
      }
    | {
        job: "go-to-field";
        field: number;
      }
    | { job: "idle" }
  );
export const workers: W[] = [
  {
    x: 12,
    y: 10,
    carrying: 0,
    job: "idle",
  },
  {
    x: 15,
    y: 12,
    carrying: null,
    job: "idle",
  },
];

export const crates = [
  { x: 0, y: 0, owner: 0, carrier: 0 as number | null },
  { x: 1.4, y: 2.23, owner: 0, carrier: null },
  { x: 1.5, y: 3.43, owner: 0, carrier: null },
];

//
//

export const ui = {
  selected: null as
    | null
    | { type: "worker"; ids: number[] }
    | { type: "town"; id: number },

  selectionRectStartDate: 0,
  selectionRect: null as
    | null
    | [{ x: number; y: number }, { x: number; y: number }],
};
