/**
 * CSV Parser for Vacancy Bulk Upload
 * Parses CSV files and validates vacancy data
 */

export interface VacancyCSVRow {
  title: string;
  department: string;
  location: string;
  description?: string;
  requirements?: string;
  salary?: string;
  status?: "draft" | "active" | "paused" | "closed" | "filled";
}

export interface ParseResult {
  success: boolean;
  data?: VacancyCSVRow[];
  errors?: string[];
  rowCount: number;
}

/**
 * Parse CSV file content
 */
export function parseCSV(content: string): ParseResult {
  const errors: string[] = [];
  const rows = content.trim().split("\n");

  if (rows.length < 2) {
    return {
      success: false,
      errors: ["CSV file must contain at least a header row and one data row"],
      rowCount: 0,
    };
  }

  // Parse header
  const headerRow = rows[0];
  const headers = headerRow.split(",").map((h) => h.trim().toLowerCase());

  // Validate required columns
  const requiredColumns = ["title", "department", "location"];
  const missingColumns = requiredColumns.filter((col) => !headers.includes(col));

  if (missingColumns.length > 0) {
    return {
      success: false,
      errors: [
        `Missing required columns: ${missingColumns.join(", ")}. Required: title, department, location`,
      ],
      rowCount: 0,
    };
  }

  // Parse data rows
  const data: VacancyCSVRow[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i].trim();
    if (!row) continue; // Skip empty rows

    const values = parseCSVLine(row);

    if (values.length !== headers.length) {
      errors.push(`Row ${i + 1}: Column count mismatch (expected ${headers.length}, got ${values.length})`);
      continue;
    }

    const vacancy: Record<string, string> = {};
    headers.forEach((header, index) => {
      vacancy[header] = values[index].trim();
    });

    // Validate required fields
    if (!vacancy.title || !vacancy.department || !vacancy.location) {
      errors.push(`Row ${i + 1}: Missing required fields (title, department, or location)`);
      continue;
    }

    // Validate status if provided
    if (
      vacancy.status &&
      !["draft", "active", "paused", "closed", "filled"].includes(vacancy.status.toLowerCase())
    ) {
      errors.push(
        `Row ${i + 1}: Invalid status "${vacancy.status}". Must be one of: draft, active, paused, closed, filled`
      );
      continue;
    }

    data.push({
      title: vacancy.title,
      department: vacancy.department,
      location: vacancy.location,
      description: vacancy.description || undefined,
      requirements: vacancy.requirements || undefined,
      salary: vacancy.salary || undefined,
      status: (vacancy.status?.toLowerCase() as any) || "draft",
    });
  }

  return {
    success: errors.length === 0 && data.length > 0,
    data,
    errors: errors.length > 0 ? errors : undefined,
    rowCount: data.length,
  };
}

/**
 * Parse a CSV line handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current);
  return values;
}

/**
 * Generate CSV template for download
 */
export function generateCSVTemplate(): string {
  return `title,department,location,description,requirements,salary,status
Senior Software Engineer,Engineering,New York,Build scalable backend systems,5+ years experience,120000-150000,active
Product Manager,Product,San Francisco,Drive product strategy,3+ years PM experience,130000-160000,active
UX Designer,Design,Remote,Design user interfaces,3+ years design experience,100000-130000,draft`;
}

/**
 * Validate individual vacancy row
 */
export function validateVacancyRow(row: VacancyCSVRow): string | null {
  if (!row.title || row.title.trim().length === 0) {
    return "Title is required";
  }
  if (!row.department || row.department.trim().length === 0) {
    return "Department is required";
  }
  if (!row.location || row.location.trim().length === 0) {
    return "Location is required";
  }
  if (row.status && !["draft", "active", "paused", "closed", "filled"].includes(row.status)) {
    return `Invalid status: ${row.status}`;
  }
  return null;
}
