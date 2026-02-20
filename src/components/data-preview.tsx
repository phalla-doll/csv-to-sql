"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ParsedCSV } from "@/types";

interface DataPreviewProps {
  parsedData: ParsedCSV;
  maxRows?: number;
}

export function DataPreview({ parsedData, maxRows = 100 }: DataPreviewProps) {
  const [page, setPage] = useState(0);
  const rowsPerPage = 20;
  const totalPages = Math.ceil(
    Math.min(parsedData.rowCount, maxRows) / rowsPerPage,
  );

  const displayRows = parsedData.rows.slice(
    page * rowsPerPage,
    Math.min((page + 1) * rowsPerPage, maxRows),
  );

  if (parsedData.rowCount === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No data to preview
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {page * rowsPerPage + 1}-
          {Math.min((page + 1) * rowsPerPage, parsedData.rowCount)} of{" "}
          {parsedData.rowCount} rows
          {parsedData.rowCount > maxRows && ` (limited to ${maxRows})`}
        </p>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
            <span className="text-sm" aria-live="polite">
              Page {page + 1} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        )}
      </div>
      <div className="rounded-md border overflow-auto max-h-[400px]">
        <Table>
          <TableHeader className="sticky top-0 bg-background">
            <TableRow>
              <TableHead className="w-12 bg-muted/50">#</TableHead>
              {parsedData.columnSchemas.map((col) => (
                <TableHead key={col.mappedName} className="bg-muted/50">
                  <div className="flex flex-col">
                    <span className="font-medium">{col.mappedName}</span>
                    <span className="text-xs text-muted-foreground font-normal">
                      {col.selectedType.toUpperCase()}
                    </span>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayRows.map((row, rowIndex) => {
              const rowKey = `row-${page * rowsPerPage + rowIndex}`;
              return (
                <TableRow key={rowKey}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {page * rowsPerPage + rowIndex + 1}
                  </TableCell>
                  {parsedData.columnSchemas.map((col, colIndex) => (
                    <TableCell
                      key={`${rowKey}-${col.mappedName}`}
                      className="max-w-[200px] truncate"
                    >
                      {row[colIndex] || (
                        <span className="text-muted-foreground italic">
                          NULL
                        </span>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
