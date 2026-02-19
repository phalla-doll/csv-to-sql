import type { ColumnSchema, DataType, GeneratedSQL, ParsedCSV } from "@/types";
import { POSTGRES_TYPE_MAP } from "@/types";
import { escapeSQLValue, sanitizeColumnName } from "./csv-parser";

const RESERVED_WORDS = new Set([
  "user",
  "order",
  "group",
  "select",
  "insert",
  "update",
  "delete",
  "from",
  "where",
  "having",
  "limit",
  "offset",
  "join",
  "inner",
  "outer",
  "left",
  "right",
  "on",
  "and",
  "or",
  "not",
  "null",
  "true",
  "false",
  "default",
  "primary",
  "key",
  "references",
  "unique",
  "check",
  "constraint",
  "index",
  "table",
  "column",
  "database",
  "schema",
  "cascade",
  "restrict",
]);

export function generateSQL(
  tableName: string,
  parsedData: ParsedCSV,
  batchSize = 1000,
): GeneratedSQL {
  const sanitizedTableName = sanitizeTableName(tableName);
  const columns = parsedData.columnSchemas;
  const rows = parsedData.rows;

  const createTable = generateCreateTable(sanitizedTableName, columns);
  const insertStatements = generateInsertStatements(
    sanitizedTableName,
    columns,
    rows,
    batchSize,
  );
  const fullScript = `${createTable}\n\n${insertStatements}`;

  return {
    createTable,
    insertStatements,
    fullScript,
  };
}

function sanitizeTableName(name: string): string {
  let sanitized = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");

  if (/^\d/.test(sanitized)) {
    sanitized = "table_" + sanitized;
  }

  return sanitized || "converted_table";
}

function quoteIdentifier(name: string): string {
  if (RESERVED_WORDS.has(name.toLowerCase())) {
    return `"${name}"`;
  }
  return name;
}

function generateCreateTable(
  tableName: string,
  columns: ColumnSchema[],
): string {
  const columnDefs: string[] = [];
  let hasPrimaryKey = false;

  for (const column of columns) {
    const columnName = quoteIdentifier(column.mappedName);
    const postgresType = POSTGRES_TYPE_MAP[column.selectedType];
    const constraints: string[] = [];

    if (column.isPrimaryKey && !hasPrimaryKey) {
      constraints.push("PRIMARY KEY");
      hasPrimaryKey = true;
    } else if (!column.isNullable) {
      constraints.push("NOT NULL");
    }

    columnDefs.push(
      `  ${columnName} ${postgresType}${constraints.length > 0 ? " " + constraints.join(" ") : ""}`,
    );
  }

  return `CREATE TABLE ${quoteIdentifier(tableName)} (\n${columnDefs.join(",\n")}\n);`;
}

function generateInsertStatements(
  tableName: string,
  columns: ColumnSchema[],
  rows: string[][],
  batchSize: number,
): string {
  if (rows.length === 0) {
    return "-- No data to insert";
  }

  const columnNames = columns
    .map((c) => quoteIdentifier(c.mappedName))
    .join(", ");
  const statements: string[] = [];

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const valuesList = batch
      .map((row) => {
        const values = columns.map((col, index) => {
          const value = row[index] || "";
          return escapeSQLValue(value, col.selectedType);
        });
        return `  (${values.join(", ")})`;
      })
      .join(",\n");

    statements.push(
      `INSERT INTO ${quoteIdentifier(tableName)} (${columnNames}) VALUES\n${valuesList};`,
    );
  }

  return statements.join("\n\n");
}

export function formatSQLForDisplay(sql: string): string {
  return sql
    .replace(/\bCREATE\b/gi, "CREATE")
    .replace(/\bTABLE\b/gi, "TABLE")
    .replace(/\bINSERT\b/gi, "INSERT")
    .replace(/\bINTO\b/gi, "INTO")
    .replace(/\bVALUES\b/gi, "VALUES")
    .replace(/\bPRIMARY\b/gi, "PRIMARY")
    .replace(/\bKEY\b/gi, "KEY")
    .replace(/\bNOT\b/gi, "NOT")
    .replace(/\bNULL\b/gi, "NULL")
    .replace(/\bSERIAL\b/gi, "SERIAL")
    .replace(/\bINTEGER\b/gi, "INTEGER")
    .replace(/\bTEXT\b/gi, "TEXT")
    .replace(/\bBOOLEAN\b/gi, "BOOLEAN")
    .replace(/\bTIMESTAMP\b/gi, "TIMESTAMP")
    .replace(/\bDATE\b/gi, "DATE");
}
