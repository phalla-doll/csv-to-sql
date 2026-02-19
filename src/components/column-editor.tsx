"use client";

import { Check, Edit2, X } from "lucide-react";
import { useCallback, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ColumnSchema } from "@/types";
import { DATA_TYPE_OPTIONS } from "@/types";

interface ColumnEditorProps {
  columns: ColumnSchema[];
  tableName: string;
  onTableNameChange: (name: string) => void;
  onColumnChange: (index: number, updates: Partial<ColumnSchema>) => void;
}

export function ColumnEditor({
  columns,
  tableName,
  onTableNameChange,
  onColumnChange,
}: ColumnEditorProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEditing = useCallback((index: number, currentValue: string) => {
    setEditingIndex(index);
    setEditValue(currentValue);
  }, []);

  const saveEdit = useCallback(() => {
    if (editingIndex !== null) {
      onColumnChange(editingIndex, { mappedName: editValue });
      setEditingIndex(null);
      setEditValue("");
    }
  }, [editingIndex, editValue, onColumnChange]);

  const cancelEdit = useCallback(() => {
    setEditingIndex(null);
    setEditValue("");
  }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="table-name">Table Name</Label>
        <Input
          id="table-name"
          value={tableName}
          onChange={(e) => onTableNameChange(e.target.value)}
          placeholder="Enter table name"
          className="max-w-sm"
        />
      </div>

      <div className="space-y-2">
        <Label>Columns ({columns.length})</Label>
        <div className="rounded-md border">
          <div className="grid grid-cols-12 gap-4 p-3 bg-muted/50 text-sm font-medium">
            <div className="col-span-3">Original Name</div>
            <div className="col-span-3">Mapped Name</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2">Nullable</div>
            <div className="col-span-2">Sample Values</div>
          </div>
          <div className="divide-y">
            {columns.map((col, index) => (
              <div
                key={col.originalName}
                className="grid grid-cols-12 gap-4 p-3 items-center"
              >
                <div className="col-span-3">
                  <span className="text-sm text-muted-foreground">
                    {col.originalName}
                  </span>
                </div>
                <div className="col-span-3 flex items-center gap-2">
                  {editingIndex === index ? (
                    <div className="flex items-center gap-1 flex-1">
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="h-8 text-sm"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit();
                          if (e.key === "Escape") cancelEdit();
                        }}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={saveEdit}
                      >
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={cancelEdit}
                      >
                        <X className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono">
                        {col.mappedName}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => startEditing(index, col.mappedName)}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="col-span-2">
                  <Select
                    value={col.selectedType}
                    onValueChange={(value) =>
                      onColumnChange(index, {
                        selectedType: value as ColumnSchema["selectedType"],
                      })
                    }
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DATA_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {col.selectedType !== col.inferredType && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      was {col.inferredType}
                    </Badge>
                  )}
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={col.isNullable}
                      onCheckedChange={(checked) =>
                        onColumnChange(index, {
                          isNullable: checked as boolean,
                        })
                      }
                    />
                    <span className="text-sm text-muted-foreground">
                      {col.isNullable ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="flex flex-wrap gap-1">
                    {col.sampleValues.slice(0, 2).map((val) => (
                      <Badge
                        key={val}
                        variant="secondary"
                        className="text-xs font-normal truncate max-w-[80px]"
                      >
                        {val}
                      </Badge>
                    ))}
                    {col.sampleValues.length > 2 && (
                      <Badge
                        variant="secondary"
                        className="text-xs font-normal"
                      >
                        +{col.sampleValues.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
