import Papa from "papaparse";
import type { ColumnSchema, DataType, ParsedCSV } from "@/types";
import { inferDataType } from "./type-inference";

export function parseCSV(file: File): Promise<ParsedCSV> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: (results) => {
        const data = results.data as string[][];

        if (data.length === 0) {
          reject(new Error("CSV file is empty"));
          return;
        }

        const headers = data[0];
        const rows = data
          .slice(1)
          .filter((row) => row.some((cell) => cell.trim() !== ""));
        const rowCount = rows.length;

        const columnSchemas: ColumnSchema[] = headers.map((header, index) => {
          const columnValues = rows
            .map((row) => row[index] || "")
            .filter((v) => v.trim() !== "");
          const sampleValues = columnValues.slice(0, 10);
          const inferredType = inferDataType(columnValues);

          return {
            originalName: header,
            mappedName: sanitizeColumnName(header),
            inferredType,
            selectedType: inferredType,
            sampleValues,
            isNullable: columnValues.length < rows.length,
            isPrimaryKey: false,
          };
        });

        resolve({
          headers,
          rows,
          rowCount,
          columnSchemas,
        });
      },
      error: (error) => {
        reject(error);
      },
      skipEmptyLines: true,
    });
  });
}

export function sanitizeColumnName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

export function escapeSQLValue(value: string, type: DataType): string {
  if (value.trim() === "" || value.toLowerCase() === "null") {
    return "NULL";
  }

  switch (type) {
    case "boolean":
      return ["true", "yes", "1"].includes(value.toLowerCase())
        ? "TRUE"
        : "FALSE";
    case "integer":
    case "bigint":
    case "float":
      return value.replace(/[^0-9.-]/g, "") || "NULL";
    case "date":
    case "timestamp":
    case "uuid":
    case "text":
    default:
      return `'${value.replace(/'/g, "''")}'`;
  }
}
