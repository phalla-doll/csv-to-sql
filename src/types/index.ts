export type DataType =
  | "text"
  | "integer"
  | "bigint"
  | "float"
  | "boolean"
  | "date"
  | "timestamp"
  | "uuid"
  | "serial";

export interface ColumnSchema {
  originalName: string;
  mappedName: string;
  inferredType: DataType;
  selectedType: DataType;
  sampleValues: string[];
  isNullable: boolean;
  isPrimaryKey: boolean;
}

export interface ParsedCSV {
  headers: string[];
  rows: string[][];
  rowCount: number;
  columnSchemas: ColumnSchema[];
}

export interface GeneratedSQL {
  createTable: string;
  insertStatements: string;
  fullScript: string;
}

export interface ConversionState {
  step: "upload" | "configure" | "generate";
  fileName: string | null;
  tableName: string;
  parsedData: ParsedCSV | null;
  generatedSQL: GeneratedSQL | null;
  error: string | null;
}

export const POSTGRES_TYPE_MAP: Record<DataType, string> = {
  text: "TEXT",
  integer: "INTEGER",
  bigint: "BIGINT",
  float: "DOUBLE PRECISION",
  boolean: "BOOLEAN",
  date: "DATE",
  timestamp: "TIMESTAMP",
  uuid: "UUID",
  serial: "SERIAL",
};

export const DATA_TYPE_OPTIONS: { value: DataType; label: string }[] = [
  { value: "text", label: "TEXT" },
  { value: "integer", label: "INTEGER" },
  { value: "bigint", label: "BIGINT" },
  { value: "float", label: "FLOAT" },
  { value: "boolean", label: "BOOLEAN" },
  { value: "date", label: "DATE" },
  { value: "timestamp", label: "TIMESTAMP" },
  { value: "uuid", label: "UUID" },
  { value: "serial", label: "SERIAL" },
];
