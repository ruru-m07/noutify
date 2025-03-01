import Dexie, { type EntityTable } from "dexie";

const db = new Dexie("noutify") as Dexie & {
  notifications: EntityTable<{ data: string; id: string }, "id">;
};

db.version(1).stores({
  notifications: "++id, updated_at",
});

db.open();

export { db };
