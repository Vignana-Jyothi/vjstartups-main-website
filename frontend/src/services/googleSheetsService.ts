import JSZip from "jszip";
import Papa from "papaparse";
import { SheetTeamMember, WorksheetInfo } from "@/types/sheetTeamMember";
import {
  buildSheetsApiMetadataUrl,
  buildSpreadsheetZipUrl,
  buildWorksheetCsvUrl,
  extractSpreadsheetId,
  formatWingName,
} from "@/utils/spreadsheetUtils";
import { compareWings } from "@/utils/teamMemberTransforms";

/**
 * Google Sheet column → UI field mapping (per worksheet row)
 * ---------------------------------------------------------
 * Display Name              → name
 * Role                      → role
 * Department                → branch
 * Year                      → year
 * email-id                  → email
 * Linkedin (ifany)          → linkedinUrl
 * Phone Number (...)        → phone
 * Photo (Drive link)        → imageUrl
 * Worksheet/tab name        → wing
 * Row index within tab      → displayOrder
 */

const COLUMN_MATCHERS = {
  name: ["display name", "name"],
  role: ["role"],
  branch: ["department", "branch"],
  year: ["year"],
  email: ["email-id", "email"],
  linkedinUrl: ["linkedin"],
  phone: ["phone number", "phone"],
  imageUrl: ["photo", "drive link", "image"],
} as const;

function normalizeHeader(header: string): string {
  return header.toLowerCase().replace(/\s+/g, " ").trim();
}

function getColumnValue(
  row: Record<string, string>,
  matchers: readonly string[]
): string {
  const entries = Object.entries(row);

  for (const matcher of matchers) {
    const direct = entries.find(
      ([key]) => normalizeHeader(key) === normalizeHeader(matcher)
    );
    if (direct?.[1]?.trim()) {
      return direct[1].trim();
    }
  }

  for (const [key, value] of entries) {
    const normalizedKey = normalizeHeader(key);
    if (
      matchers.some((matcher) => normalizedKey.includes(normalizeHeader(matcher))) &&
      value?.trim()
    ) {
      return value.trim();
    }
  }

  return "";
}

function convertDriveLinkToImageUrl(url: string): string {
  const value = url.trim();
  if (!value) return "";

  const fileIdMatch = value.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (fileIdMatch?.[1]) {
    return `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
  }

  const idParamMatch = value.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch?.[1]) {
    return `https://drive.google.com/uc?export=view&id=${idParamMatch[1]}`;
  }

  return value;
}

export function mapRowToTeamMember(
  row: Record<string, string>,
  wing: string,
  displayOrder: number
): SheetTeamMember | null {
  const name = getColumnValue(row, COLUMN_MATCHERS.name);

  if (!name) {
    return null;
  }

  const imageRaw = getColumnValue(row, COLUMN_MATCHERS.imageUrl);

  return {
    name,
    wing,
    role: getColumnValue(row, COLUMN_MATCHERS.role),
    branch: getColumnValue(row, COLUMN_MATCHERS.branch),
    year: getColumnValue(row, COLUMN_MATCHERS.year),
    email: getColumnValue(row, COLUMN_MATCHERS.email),
    phone: getColumnValue(row, COLUMN_MATCHERS.phone),
    linkedinUrl: getColumnValue(row, COLUMN_MATCHERS.linkedinUrl),
    imageUrl: convertDriveLinkToImageUrl(imageRaw),
    displayOrder,
  };
}

export function parseWorksheetCsv(
  csvText: string,
  wing: string
): SheetTeamMember[] {
  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });

  if (parsed.errors.length > 0) {
    console.error(`[googleSheetsService] CSV parse errors for "${wing}":`, parsed.errors);
  }

  return parsed.data
    .map((row, index) => mapRowToTeamMember(row, wing, index + 1))
    .filter((member): member is SheetTeamMember => member !== null);
}

async function discoverWorksheetsViaApi(
  spreadsheetId: string,
  apiKey: string
): Promise<WorksheetInfo[]> {
  const url = buildSheetsApiMetadataUrl(spreadsheetId, apiKey);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Google Sheets API metadata request failed (${response.status})`
    );
  }

  const data = await response.json();
  const sheets = data?.sheets ?? [];

  return sheets
    .map((sheet: { properties?: { title?: string; sheetId?: number } }) => ({
      title: sheet.properties?.title?.trim() ?? "",
      sheetId: sheet.properties?.sheetId,
    }))
    .filter((sheet: WorksheetInfo) => sheet.title.length > 0)
    .sort((a: WorksheetInfo, b: WorksheetInfo) =>
      compareWings(formatWingName(a.title), formatWingName(b.title))
    );
}

async function discoverWorksheetsViaZip(
  spreadsheetId: string
): Promise<WorksheetInfo[]> {
  const zipUrl = buildSpreadsheetZipUrl(spreadsheetId);
  const response = await fetch(zipUrl);

  if (!response.ok) {
    throw new Error(
      `Failed to download spreadsheet zip export (${response.status})`
    );
  }

  const zipBuffer = await response.arrayBuffer();
  const zip = await JSZip.loadAsync(zipBuffer);
  const worksheetNames = new Set<string>();

  Object.keys(zip.files).forEach((filePath) => {
    if (!filePath.endsWith(".html") || filePath.includes("/")) {
      return;
    }

    const wing = formatWingName(filePath);
    if (wing) {
      worksheetNames.add(wing);
    }
  });

  return Array.from(worksheetNames)
    .sort(compareWings)
    .map((title) => ({ title }));
}

export async function discoverWorksheets(
  spreadsheetId: string = extractSpreadsheetId()
): Promise<WorksheetInfo[]> {
  const apiKey = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;

  if (apiKey) {
    try {
      const worksheets = await discoverWorksheetsViaApi(spreadsheetId, apiKey);
      console.info(
        `[googleSheetsService] Discovered ${worksheets.length} worksheets via Google Sheets API:`,
        worksheets.map((sheet) => sheet.title)
      );
      return worksheets;
    } catch (error) {
      console.warn(
        "[googleSheetsService] Sheets API discovery failed, falling back to zip export:",
        error
      );
    }
  }

  const worksheets = await discoverWorksheetsViaZip(spreadsheetId);
  console.info(
    `[googleSheetsService] Discovered ${worksheets.length} worksheets via zip export:`,
    worksheets.map((sheet) => sheet.title)
  );
  return worksheets;
}

export async function fetchWorksheetMembers(
  spreadsheetId: string,
  worksheet: WorksheetInfo
): Promise<SheetTeamMember[]> {
  const wing = formatWingName(worksheet.title);
  const csvUrl = buildWorksheetCsvUrl(spreadsheetId, worksheet.title);
  const response = await fetch(csvUrl);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch worksheet "${worksheet.title}" (${response.status})`
    );
  }

  const csvText = await response.text();
  const members = parseWorksheetCsv(csvText, wing);

  console.info(
    `[googleSheetsService] Loaded ${members.length} members from "${worksheet.title}"`
  );

  return members;
}

export async function fetchTeamMembersFromGoogleSheet(
  spreadsheetId: string = extractSpreadsheetId()
): Promise<SheetTeamMember[]> {
  const worksheets = await discoverWorksheets(spreadsheetId);

  if (worksheets.length === 0) {
    console.warn("[googleSheetsService] No worksheets discovered in spreadsheet");
    return [];
  }

  const results = await Promise.all(
    worksheets.map(async (worksheet) => {
      try {
        return await fetchWorksheetMembers(spreadsheetId, worksheet);
      } catch (error) {
        console.error(
          `[googleSheetsService] Failed to load worksheet "${worksheet.title}":`,
          error
        );
        return [];
      }
    })
  );

  const allMembers = results
    .flat()
    .sort((a, b) => {
      const wingCompare = compareWings(a.wing, b.wing);
      if (wingCompare !== 0) {
        return wingCompare;
      }
      return a.displayOrder - b.displayOrder;
    });

  console.info(
    `[googleSheetsService] Combined ${allMembers.length} members across ${worksheets.length} worksheets`
  );

  return allMembers;
}
