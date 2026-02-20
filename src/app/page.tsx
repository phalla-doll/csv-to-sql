"use client";

import {
  ArrowLeft,
  ArrowRight,
  Database,
  FileSpreadsheet,
  RotateCcw,
  Settings2,
} from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { ColumnEditor } from "@/components/column-editor";
import { CSVUploader } from "@/components/csv-uploader";
import { DataPreview } from "@/components/data-preview";
import { SQLOutput } from "@/components/sql-output";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useCSVConverter } from "@/hooks/use-csv-converter";

export default function Page() {
  const {
    state,
    isLoading,
    handleFileUpload,
    updateTableName,
    updateColumnSchema,
    generateSQLFromData,
    goToStep,
    reset,
  } = useCSVConverter();

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">CSV to SQL Converter</h1>
        </header>
        <div className="flex flex-1 flex-col p-4 md:p-6" id="main-content">
          <div className="mx-auto w-full max-w-5xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Convert CSV to PostgreSQL
                </h2>
                <p className="text-muted-foreground">
                  Upload your CSV file and generate SQL schemas for
                  PostgreSQL/Supabase
                </p>
              </div>
              {state.step !== "upload" && (
                <Button variant="outline" size="sm" onClick={reset}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Start Over
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant={state.step === "upload" ? "default" : "secondary"}
                className="gap-1"
              >
                <FileSpreadsheet className="h-3 w-3" />
                1. Upload
              </Badge>
              <div className="h-px flex-1 bg-border" />
              <Badge
                variant={state.step === "configure" ? "default" : "secondary"}
                className="gap-1"
              >
                <Settings2 className="h-3 w-3" />
                2. Configure
              </Badge>
              <div className="h-px flex-1 bg-border" />
              <Badge
                variant={state.step === "generate" ? "default" : "secondary"}
                className="gap-1"
              >
                <Database className="h-3 w-3" />
                3. Generate
              </Badge>
            </div>

            {state.error && (
              <Card className="border-destructive">
                <CardContent className="pt-4">
                  <p className="text-destructive">{state.error}</p>
                </CardContent>
              </Card>
            )}

            {state.step === "upload" && (
              <Card>
                <CardHeader>
                  <CardTitle>Upload CSV File</CardTitle>
                  <CardDescription>
                    Drag and drop or click to upload your CSV file
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CSVUploader
                    onFileUpload={handleFileUpload}
                    isLoading={isLoading}
                  />
                </CardContent>
              </Card>
            )}

            {state.step === "configure" && state.parsedData && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Data Preview</CardTitle>
                    <CardDescription>
                      Preview of your CSV data ({state.parsedData.rowCount}{" "}
                      rows, {state.parsedData.columnSchemas.length} columns)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DataPreview parsedData={state.parsedData} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Configure Schema</CardTitle>
                    <CardDescription>
                      Customize table name, column names, and data types
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ColumnEditor
                      columns={state.parsedData.columnSchemas}
                      tableName={state.tableName}
                      onTableNameChange={updateTableName}
                      onColumnChange={updateColumnSchema}
                    />
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => goToStep("upload")}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button onClick={generateSQLFromData}>
                    Generate SQL
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {state.step === "generate" &&
              state.generatedSQL &&
              state.parsedData && (
                <div className="space-y-6">
                  <SQLOutput
                    generatedSQL={state.generatedSQL}
                    tableName={state.tableName}
                  />

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => goToStep("configure")}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Configure
                    </Button>
                    <Button onClick={reset}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Convert Another File
                    </Button>
                  </div>
                </div>
              )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
