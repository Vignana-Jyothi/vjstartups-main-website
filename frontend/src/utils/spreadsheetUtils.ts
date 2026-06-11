const DEFAULT_SPREADSHEET_ID = "1tybveSRWbe3swoZ1dUB8bd20Hb63rx65_xAsQJCveC0";

export function extractSpreadsheetId(
  value: string = import.meta.env.VITE_GOOGLE_SPREADSHEET_ID || DEFAULT_SPREADSHEET_ID
): string {
  const trimmed = value.trim();

  const urlMatch = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (urlMatch?.[1]) {
    return urlMatch[1];
  }

  return trimmed;
}

export function formatWingName(rawName: string): string {
  return rawName
    .replace(/\.html$/i, "")
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export function buildWorksheetCsvUrl(
  spreadsheetId: string,
  sheetName: string
): string {
  const params = new URLSearchParams({
    tqx: "out:csv",
    sheet: sheetName,
  });

  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?${params.toString()}`;
}

export function buildSpreadsheetZipUrl(spreadsheetId: string): string {
  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=zip`;
}

export function buildSheetsApiMetadataUrl(spreadsheetId: string, apiKey: string): string {
  const params = new URLSearchParams({
    fields: "sheets.properties(title,sheetId,index)",
    key: apiKey,
  });

  return `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?${params.toString()}`;
}
