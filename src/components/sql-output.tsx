"use client";

import { Check, Copy, Download } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { GeneratedSQL } from "@/types";

interface SQLOutputProps {
  generatedSQL: GeneratedSQL;
  tableName: string;
}

export function SQLOutput({ generatedSQL, tableName }: SQLOutputProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("full");

  const copyToClipboard = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadSQL = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderSQLBlock = (sql: string, key: string) => (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="absolute right-2 top-2 z-10"
        onClick={() => copyToClipboard(sql, key)}
      >
        {copied === key ? (
          <>
            <Check className="h-4 w-4 mr-1 text-green-600" />
            Copied
          </>
        ) : (
          <>
            <Copy className="h-4 w-4 mr-1" />
            Copy
          </>
        )}
      </Button>
      <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[500px] text-sm font-mono">
        <code>{sql}</code>
      </pre>
    </div>
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Generated SQL</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            downloadSQL(generatedSQL.fullScript, `${tableName}.sql`)
          }
        >
          <Download className="h-4 w-4 mr-2" />
          Download .sql
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="full">Full Script</TabsTrigger>
            <TabsTrigger value="create">CREATE TABLE</TabsTrigger>
            <TabsTrigger value="insert">INSERT</TabsTrigger>
          </TabsList>
          <TabsContent value="full">
            {renderSQLBlock(generatedSQL.fullScript, "full")}
          </TabsContent>
          <TabsContent value="create">
            {renderSQLBlock(generatedSQL.createTable, "create")}
          </TabsContent>
          <TabsContent value="insert">
            {renderSQLBlock(generatedSQL.insertStatements, "insert")}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
