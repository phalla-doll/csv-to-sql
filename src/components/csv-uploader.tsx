"use client";

import { FileSpreadsheet, Upload, X } from "lucide-react";
import { useCallback, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CSVUploaderProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
}

export function CSVUploader({ onFileUpload, isLoading }: CSVUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        if (file.name.endsWith(".csv")) {
          setSelectedFile(file);
          onFileUpload(file);
        }
      }
    },
    [onFileUpload],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        setSelectedFile(file);
        onFileUpload(file);
      }
    },
    [onFileUpload],
  );

  const clearFile = useCallback(() => {
    setSelectedFile(null);
  }, []);

  return (
    <Card
      className={cn(
        "border-2 border-dashed transition-colors cursor-pointer",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25",
        isLoading && "opacity-50 pointer-events-none",
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardContent className="flex flex-col items-center justify-center py-12 px-4">
        {selectedFile ? (
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="h-10 w-10 text-primary" />
            <div className="flex flex-col">
              <span className="font-medium">{selectedFile.name}</span>
              <span className="text-sm text-muted-foreground">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </span>
            </div>
            <button
              type="button"
              onClick={clearFile}
              className="ml-4 p-1 hover:bg-muted rounded-full"
              aria-label="Clear file"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <>
            <Upload
              className={cn(
                "h-12 w-12 mb-4",
                isDragging ? "text-primary" : "text-muted-foreground",
              )}
              aria-hidden="true"
            />
            <p className="text-lg font-medium mb-1">
              {isDragging
                ? "Drop your CSV file here"
                : "Drag & drop your CSV file"}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse
            </p>
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".csv"
                name="csv-file"
                className="hidden"
                onChange={handleFileSelect}
                disabled={isLoading}
                aria-label="Upload CSV file"
              />
              <span className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Browse Files
              </span>
            </label>
            <p className="text-xs text-muted-foreground mt-4">
              Supports CSV files up to 10&nbsp;MB
            </p>
          </>
        )}
        {isLoading && (
          <div className="mt-4 flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-sm text-muted-foreground">Processing...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
