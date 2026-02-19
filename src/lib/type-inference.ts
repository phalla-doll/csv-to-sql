import type { DataType } from "@/types";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIMESTAMP_REGEX = /^\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}/;

export function inferDataType(values: string[]): DataType {
  if (values.length === 0) return "text";

  const nonEmptyValues = values.filter((v) => v.trim() !== "");
  if (nonEmptyValues.length === 0) return "text";

  if (nonEmptyValues.every((v) => UUID_REGEX.test(v.trim()))) {
    return "uuid";
  }

  if (
    nonEmptyValues.every((v) =>
      ["true", "false", "yes", "no", "1", "0"].includes(v.toLowerCase().trim()),
    )
  ) {
    return "boolean";
  }

  if (nonEmptyValues.every((v) => /^-?\d+$/.test(v.trim()))) {
    const numValues = nonEmptyValues.map((v) => Number.parseInt(v.trim(), 10));
    const max = Math.max(...numValues);
    const min = Math.min(...numValues);

    if (max > 2147483647 || min < -2147483648) {
      return "bigint";
    }
    return "integer";
  }

  if (nonEmptyValues.every((v) => /^-?\d+\.?\d*$/.test(v.trim()))) {
    return "float";
  }

  if (nonEmptyValues.every((v) => TIMESTAMP_REGEX.test(v.trim()))) {
    return "timestamp";
  }

  if (nonEmptyValues.every((v) => DATE_REGEX.test(v.trim()))) {
    return "date";
  }

  return "text";
}

export function isValidType(value: string, type: DataType): boolean {
  if (value.trim() === "") return true;

  switch (type) {
    case "uuid":
      return UUID_REGEX.test(value.trim());
    case "boolean":
      return ["true", "false", "yes", "no", "1", "0"].includes(
        value.toLowerCase().trim(),
      );
    case "integer":
      return /^-?\d+$/.test(value.trim());
    case "bigint":
      return /^-?\d+$/.test(value.trim());
    case "float":
      return /^-?\d+\.?\d*$/.test(value.trim());
    case "date":
      return DATE_REGEX.test(value.trim());
    case "timestamp":
      return TIMESTAMP_REGEX.test(value.trim());
    default:
      return true;
  }
}
