import * as XLSX from "xlsx";

export const parseCsv = async (file: File) => {
  const fileBuffer = await file.arrayBuffer();

  const workbook = XLSX.read(fileBuffer, {
    type: "array",
    raw: true,
  });

  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const parsedData = XLSX.utils.sheet_to_json(worksheet, {
    defval: "",
  }) as any[];

  return parsedData;
};

export const formatNumberWithSuffix = (value: number, locale = "en-US") => {
  if (typeof value !== "number" || isNaN(value)) {
    return "N/A";
  }

  const formatter = new Intl.NumberFormat(locale, {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  });

  return formatter.format(value);
};

export const formatCurrency = (
  amount?: number | null,
  decimal: number = 2,
): string => {
  if (amount === null || amount === undefined) {
    return "N/A";
  }

  return amount.toLocaleString("en-US", {
    currency: "USD",
    minimumFractionDigits: decimal,
    maximumFractionDigits: decimal,
  });
};

// Helper: Converts HSL to HEX
function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    Math.round(
      255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))),
    );

  return `#${[f(0), f(8), f(4)]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("")}`;
}

export const getRandomHexColors = (
  count: number,
  lightness: number = 0.5,
): string[] => {
  const colors: string[] = [];

  for (let i = 0; i < count; i++) {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 70 + Math.random() * 30; // 70% to 100% saturation for vibrancy

    // Convert HSL to RGB, then to hex
    const color = hslToHex(hue, saturation, lightness * 100);
    colors.push(color);
  }

  return colors;
};
