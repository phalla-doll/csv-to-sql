import { useCallback, useState } from "react";
import { parseCSV } from "@/lib/csv-parser";
import { generateSQL } from "@/lib/sql-generator";
import type { ColumnSchema, ConversionState } from "@/types";

const initialState: ConversionState = {
  step: "upload",
  fileName: null,
  tableName: "converted_table",
  parsedData: null,
  generatedSQL: null,
  error: null,
};

export function useCSVConverter() {
  const [state, setState] = useState<ConversionState>(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    setState((prev) => ({ ...prev, error: null }));

    try {
      const parsedData = await parseCSV(file);
      const tableName = file.name
        .replace(/\.csv$/i, "")
        .replace(/[^a-z0-9_]/gi, "_")
        .toLowerCase();

      setState({
        step: "configure",
        fileName: file.name,
        tableName,
        parsedData,
        generatedSQL: null,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error ? error.message : "Failed to parse CSV file",
      }));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTableName = useCallback((name: string) => {
    setState((prev) => ({ ...prev, tableName: name }));
  }, []);

  const updateColumnSchema = useCallback(
    (index: number, updates: Partial<ColumnSchema>) => {
      setState((prev) => {
        if (!prev.parsedData) return prev;

        const newColumnSchemas = [...prev.parsedData.columnSchemas];
        newColumnSchemas[index] = { ...newColumnSchemas[index], ...updates };

        return {
          ...prev,
          parsedData: {
            ...prev.parsedData,
            columnSchemas: newColumnSchemas,
          },
        };
      });
    },
    [],
  );

  const generateSQLFromData = useCallback(() => {
    setState((prev) => {
      if (!prev.parsedData) return prev;

      const generatedSQL = generateSQL(prev.tableName, prev.parsedData);

      return {
        ...prev,
        step: "generate",
        generatedSQL,
      };
    });
  }, []);

  const goToStep = useCallback((step: ConversionState["step"]) => {
    setState((prev) => ({ ...prev, step }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    state,
    isLoading,
    handleFileUpload,
    updateTableName,
    updateColumnSchema,
    generateSQLFromData,
    goToStep,
    reset,
  };
}
