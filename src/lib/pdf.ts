import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import type { PDFFont, PDFPage, RGB } from "pdf-lib";
import type { Food } from "../types";
import { productInformation } from "./flavor";

const pageWidth = 595;
const pageHeight = 842;

type TextOptions = {
  page: PDFPage;
  text: string;
  x: number;
  y: number;
  maxWidth: number;
  size: number;
  font: PDFFont;
  color: RGB;
  lineHeight?: number;
  maxLines?: number;
};

const wrapText = ({ page, text, x, y, maxWidth, size, font, color, lineHeight = size * 1.35, maxLines }: TextOptions) => {
  const words = text.replace(/\s+/g, " ").trim().split(" ");
  const lines: string[] = [];
  let line = "";

  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      line = candidate;
      return;
    }
    if (line) lines.push(line);
    line = word;
  });

  if (line) lines.push(line);
  const visibleLines = typeof maxLines === "number" ? lines.slice(0, maxLines) : lines;
  const clipped = typeof maxLines === "number" && lines.length > maxLines;

  visibleLines.forEach((visibleLine, index) => {
    const finalLine = clipped && index === visibleLines.length - 1 ? `${visibleLine.replace(/[,.]$/, "")}...` : visibleLine;
    page.drawText(finalLine, { x, y: y - index * lineHeight, size, font, color });
  });

  return y - visibleLines.length * lineHeight;
};

const drawPill = (page: PDFPage, text: string, x: number, y: number, width: number, font: PDFFont, bg: RGB, color: RGB) => {
  page.drawRectangle({ x, y, width, height: 24, color: bg, borderColor: color, borderWidth: 0.6 });
  page.drawText(text, { x: x + 10, y: y + 7, size: 9, font, color });
};

const drawInfoBlock = (
  page: PDFPage,
  title: string,
  text: string,
  x: number,
  y: number,
  width: number,
  fonts: { serif: PDFFont; sansBold: PDFFont },
  colors: { ink: RGB; gold: RGB; panel: RGB; line: RGB },
) => {
  page.drawRectangle({ x, y, width, height: 118, color: colors.panel, borderColor: colors.line, borderWidth: 0.8 });
  page.drawText(title.toUpperCase(), { x: x + 14, y: y + 92, size: 8, font: fonts.sansBold, color: colors.gold });
  wrapText({
    page,
    text,
    x: x + 14,
    y: y + 70,
    maxWidth: width - 28,
    size: 10.5,
    font: fonts.serif,
    color: colors.ink,
    lineHeight: 14,
    maxLines: 4,
  });
};

export const exportFoodPdf = async (food: Food) => {
  const info = productInformation(food.familia, food.origen.region);
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([pageWidth, pageHeight]);
  const serif = await pdf.embedFont(StandardFonts.TimesRoman);
  const serifBold = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const sans = await pdf.embedFont(StandardFonts.Helvetica);
  const sansBold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const ink = rgb(0.09, 0.09, 0.08);
  const gold = rgb(0.7, 0.53, 0.23);
  const paper = rgb(0.985, 0.975, 0.94);
  const panel = rgb(0.95, 0.92, 0.84);
  const line = rgb(0.78, 0.7, 0.55);

  page.drawRectangle({ x: 0, y: 0, width: pageWidth, height: pageHeight, color: paper });
  page.drawRectangle({ x: 36, y: 730, width: 523, height: 76, color: ink });
  page.drawText("DOP ESPAÑA", { x: 56, y: 776, size: 10, font: sansBold, color: gold });
  page.drawText("Ficha de denominacion de origen protegida", { x: 56, y: 756, size: 12, font: sans, color: paper });

  page.drawText(food.nombre, { x: 44, y: 694, size: 29, font: serifBold, color: ink, maxWidth: 500 });
  drawPill(page, food.familia, 44, 656, 170, sansBold, gold, ink);
  drawPill(page, `Intensidad ${food.intensidad_sabor}/10`, 226, 656, 128, sansBold, panel, ink);
  drawPill(page, food.origen.region, 366, 656, 176, sansBold, panel, ink);

  wrapText({
    page,
    text: food.descripcion,
    x: 44,
    y: 616,
    maxWidth: 500,
    size: 13,
    font: serif,
    color: ink,
    lineHeight: 17,
    maxLines: 5,
  });

  page.drawLine({ start: { x: 44, y: 596 }, end: { x: 552, y: 596 }, thickness: 1, color: gold });

  page.drawText("PERFIL SENSORIAL", { x: 44, y: 568, size: 10, font: sansBold, color: gold });
  Object.entries(food.perfil_sabor).forEach(([label, value], index) => {
    const y = 540 - index * 26;
    page.drawText(label.toUpperCase(), { x: 48, y, size: 8, font: sansBold, color: ink });
    page.drawRectangle({ x: 122, y: y - 1, width: 145, height: 8, color: rgb(0.84, 0.8, 0.7) });
    page.drawRectangle({ x: 122, y: y - 1, width: value * 14.5, height: 8, color: gold });
    page.drawText(`${value}/10`, { x: 276, y: y - 3, size: 9, font: sans, color: ink });
  });

  page.drawText("INFORMACION DE PRODUCTO", { x: 306, y: 568, size: 10, font: sansBold, color: gold });
  drawInfoBlock(page, "Servicio", info.service, 306, 428, 246, { serif, sansBold }, { ink, gold, panel: rgb(0.99, 0.98, 0.94), line });
  drawInfoBlock(page, "Tecnica", info.technique, 306, 296, 246, { serif, sansBold }, { ink, gold, panel: rgb(0.99, 0.98, 0.94), line });
  drawInfoBlock(page, "Territorio", info.territory, 306, 164, 246, { serif, sansBold }, { ink, gold, panel: rgb(0.99, 0.98, 0.94), line });

  page.drawRectangle({ x: 44, y: 164, width: 238, height: 188, color: rgb(0.99, 0.98, 0.94), borderColor: line, borderWidth: 1 });
  page.drawText("PROCEDENCIA", { x: 64, y: 320, size: 10, font: sansBold, color: gold });
  wrapText({
    page,
    text: food.procedencia,
    x: 64,
    y: 292,
    maxWidth: 196,
    size: 12,
    font: serif,
    color: ink,
    lineHeight: 17,
    maxLines: 7,
  });

  page.drawLine({ start: { x: 44, y: 112 }, end: { x: 552, y: 112 }, thickness: 0.8, color: line });
  page.drawText("Localizacion: ", { x: 44, y: 88, size: 9, font: sansBold, color: ink });
  page.drawText(`${food.origen.region}, ${food.origen.pais}`, { x: 108, y: 88, size: 9, font: sans, color: ink });
  page.drawText("Ficha generada desde el catalogo DOP España.", {
    x: 44,
    y: 70,
    size: 8,
    font: sans,
    color: rgb(0.36, 0.33, 0.27),
  });

  const bytes = await pdf.save();
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${food.nombre.toLowerCase().replace(/\s+/g, "-")}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
};
