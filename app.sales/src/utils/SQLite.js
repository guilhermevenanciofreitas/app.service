import SQLiteManager from 'sql.js'
import { get, set } from 'idb-keyval'
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url'

export class SQLite {

  static STORAGE_KEY = 'sqlite'

  constructor() {
    this.db = null
    this.ready = this._init()
  }

  async _init() {

    const SQL = await SQLiteManager({
      locateFile: () => wasmUrl,
    })

    const savedDb = await get(SQLite.STORAGE_KEY)

    if (savedDb) {

      this.db = new SQL.Database(new Uint8Array(savedDb))

    } else {

      this.db = new SQL.Database()

      this.db.run(`

        CREATE TABLE IF NOT EXISTS vendedor (
            codven INTEGER NOT NULL,
            nome TEXT,
            senha TEXT
        );

        CREATE TABLE IF NOT EXISTS pedido1 (
            NUMERO INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            EMISSAO TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CODCLI INTEGER,
            CODVEN INTEGER,
            PAG TEXT,
            PRZ INT,
            SIT TEXT,
            TOTBRUTO REAL DEFAULT 0,
            TOTDESCV REAL DEFAULT 0,
            TOTBONIF REAL DEFAULT 0,
            TOTTROCA REAL DEFAULT 0,
            TOTOUTROS REAL DEFAULT 0,
            LATITUDE TEXT,
            LONGITUDE TEXT,
            OBS TEXT,
            FINALIZADO INTEGER DEFAULT 0,
            ENVIADO INTEGER DEFAULT 0,
            IMPORTADO INTEGER DEFAULT 0,
            PROTOCOLO INTEGER
        );

        CREATE TABLE IF NOT EXISTS pedido2 (
            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            NUMERO INTEGER NOT NULL,
            TIPO INTEGER,
            CODPROD INTEGER,
            QTDE REAL,
            PVENDA REAL,
            PRTAB REAL,
            NUMLOTE INTEGER,
            DTVALIDADE TIMESTAMP,
            PROTOCOLO INTEGER
        );

        CREATE TABLE IF NOT EXISTS cliente (
            codcli INTEGER NOT NULL,
            fantasia TEXT,
            bairro TEXT,
            cidade TEXT,
            uf TEXT,
            codtab INTEGER,
		    prz INTEGER
        );

        CREATE TABLE IF NOT EXISTS produto (
            CODPROD INTEGER NOT NULL,
            DESCRICAO TEXT,
            UN TEXT,
            EMB REAL,
            CUSTO REAL
        );

        CREATE TABLE IF NOT EXISTS prodpreco (
            transacao INTEGER NOT NULL PRIMARY KEY,
            NUMTAB INTEGER NOT NULL,
            CODPROD INTEGER,
            PRECO REAL
        );

      `)

      await this.save()

    }
  }

  async ensureReady() {
    if (!this.db) await this.ready
  }

  async run(sql, params = []) {
    await this.ensureReady()
    this.db.run(sql, params)
    await this.save()
  }

  async exec(sql, params = []) {
    await this.ensureReady()
    return this.toJSON(this.db.exec(sql, params))
  }

  async prepare(sql) {
    await this.ensureReady()
    return this.db.prepare(sql)
  }

  async save() {
    const data = this.db.export()
    await set(SQLite.STORAGE_KEY, data)
  }

  toJSON(result) {

    if (!result[0]) return []

    const { columns, values } = result[0]

    return values.map(row => {

      const obj = {}

      columns.forEach((col, i) => {
        obj[col] = row[i]
      })

      return obj

    })

  }

}