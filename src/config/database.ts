import Database from "better-sqlite3";

const dbPath = process.env.NODE_ENV === "test" ? ":memory:" : "database.sqlite";
const db = new Database(dbPath);

db.exec(`
    CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    precio_base REAL NOT NULL,
    tipo TEXT NOT NULL,
    tipo_preparacion TEXT,
    tamano TEXT,
    gramos_cafe REAL,
    variedad TEXT
    precio_por_gramo REAL
    )
`);

export default db;