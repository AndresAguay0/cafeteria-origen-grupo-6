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
    variedad TEXT,
    precio_por_gramo REAL
    )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    estado TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS pedido_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pedido_id INTEGER NOT NULL,
    producto_id INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
  );
`);

export default db;