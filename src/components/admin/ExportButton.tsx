"use client";

import React from "react";
import * as XLSX from "xlsx";
import { Download } from "lucide-react";

type ExportButtonProps = {
  data: any[];
  filename: string;
  sheetName?: string;
  disabled?: boolean;
};

export default function ExportButton({ data, filename, sheetName = "Data", disabled = false }: ExportButtonProps) {
  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled}
      className="mac-btn mac-btn-ghost flex items-center gap-1.5"
    >
      <Download size={15} /> Export Excel
    </button>
  );
}
