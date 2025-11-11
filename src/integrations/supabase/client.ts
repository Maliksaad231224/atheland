// Lightweight local mock of the Supabase client for UI development.
// This replaces the network-backed supabase client with a localStorage-backed mock
// so the app UI can be developed without any database.

type Row = Record<string, any> & { id?: string };

const DB_KEY = "athle_mock_db_v1";

const defaultDB = {
  workout_templates: [] as Row[],
  template_blocks: [] as Row[],
  template_exercises: [] as Row[],
  programs: [] as Row[],
  classes: [] as Row[],
  class_enrollments: [] as Row[],
  coaches: [] as Row[],
};

const genId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

function readDB() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) return JSON.parse(JSON.stringify(defaultDB));
    return JSON.parse(raw);
  } catch (e) {
    return JSON.parse(JSON.stringify(defaultDB));
  }
}

function writeDB(db: any) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function applyFilters(rows: Row[], filters: { col: string; op: string; val: any }[]) {
  return rows.filter((r) => {
    return filters.every((f) => {
      if (f.op === "=") return r[f.col] === f.val;
      return true;
    });
  });
}

function makeBuilder(table: string) {
  const builder: any = {
    _table: table,
    _filters: [] as any[],
    _order: null as null | { col: string; asc?: boolean },
    _op: null as null | "select" | "insert" | "update" | "delete",
    _payload: null as any,
    _selectCols: null as any,
    _single: false,
  };

  builder.eq = function (col: string, val: any) {
    this._filters.push({ col, op: "=", val });
    return this;
  };

  builder.order = function (col: string, opts?: { ascending?: boolean }) {
    this._order = { col, asc: opts?.ascending ?? true };
    return this;
  };

  builder.select = function (cols?: any) {
    this._op = "select";
    this._selectCols = cols;
    const self = this;
    const run = async () => {
      const db = readDB();
      let rows = db[table] || [];
      rows = applyFilters(rows, self._filters);
      if (self._order) {
        rows = rows.slice().sort((a: any, b: any) => {
          const c = self._order!.col;
          if (a[c] == null) return 1;
          if (b[c] == null) return -1;
          if (a[c] < b[c]) return self._order!.asc ? -1 : 1;
          if (a[c] > b[c]) return self._order!.asc ? 1 : -1;
          return 0;
        });
      }
      return { data: rows, error: null };
    };

    const thenable: any = {
      then: (resolve: any, reject: any) => {
        run().then(resolve).catch(reject);
      },
      single: async () => {
        const res = await run();
        return { data: (res.data && res.data.length ? res.data[0] : null), error: null };
      },
      order: (col: string, opts?: any) => {
        this.order(col, opts);
        return thenable;
      },
    };

    return thenable;
  };

  builder.insert = function (payload: Row | Row[]) {
    this._op = "insert";
    const db = readDB();
    const rowsToInsert = Array.isArray(payload) ? payload : [payload];
    const inserted: Row[] = rowsToInsert.map((r) => {
      const copy = { ...r };
      if (!copy.id) copy.id = genId();
      if (!copy.created_at) copy.created_at = new Date().toISOString();
      db[table] = db[table] || [];
      db[table].push(copy);
      return copy;
    });
    writeDB(db);

    const thenable: any = {
      select: (_cols?: any) => ({
        single: async () => ({ data: inserted.length === 1 ? inserted[0] : inserted, error: null }),
      }),
      then: (resolve: any) => resolve({ data: inserted, error: null }),
    };

    return thenable;
  };

  builder.update = function (payload: Row) {
    this._op = "update";
    this._payload = payload;
    const self = this;
    const run = async () => {
      const db = readDB();
      let rows = db[table] || [];
      const toUpdate = applyFilters(rows, self._filters);
      const updated: Row[] = [];
      for (const r of toUpdate) {
        const idx = rows.findIndex((x: any) => x.id === r.id);
        if (idx >= 0) {
          rows[idx] = { ...rows[idx], ...payload };
          updated.push(rows[idx]);
        }
      }
      db[table] = rows;
      writeDB(db);
      return { data: updated, error: null };
    };

    const thenable: any = {
      then: (resolve: any, reject: any) => {
        run().then(resolve).catch(reject);
      },
    };

    return thenable;
  };

  builder.delete = function () {
    this._op = "delete";
    const self = this;
    const run = async () => {
      const db = readDB();
      let rows = db[table] || [];
      const toDelete = applyFilters(rows, self._filters);
      const deleted: Row[] = [];
      if (toDelete.length) {
        db[table] = rows.filter((r: any) => !toDelete.some((d: any) => d.id === r.id));
        deleted.push(...toDelete);
        writeDB(db);
      }
      return { data: deleted, error: null };
    };

    const thenable: any = {
      eq: function (col: string, val: any) {
        self.eq(col, val);
        return thenable;
      },
      then: (resolve: any, reject: any) => {
        run().then(resolve).catch(reject);
      },
    };

    return thenable;
  };

  return builder;
}

// Minimal functions namespace used in the app (e.g. functions.invoke for admin-login)
const functions = {
  invoke: async (name: string, opts?: any) => {
    // Provide simple local mocks — extend here as needed for UI development
    if (name === "admin-login") {
      return { data: { ok: true, token: "mock-token" }, error: null };
    }
    return { data: null, error: null };
  },
};

export const supabase = {
  from: (table: string) => makeBuilder(table),
  functions,
};

export default supabase;