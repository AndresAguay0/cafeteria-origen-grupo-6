import Database from "better-sqlite3";

const dbPath = process.env.NODE_ENV === "test" ? ":memory:" : "database.sqlite";

const db = new Database(dbPath);

export default db;