// Maps the `component` key from registry.js to its React implementation.
// Tools are lazy-loaded per category so heavy libraries (pdf-lib, pdf.js,
// image compression) are only fetched when a tool is actually opened.
import { lazy } from 'react'

const utilities = () => import('./impl/utilities.jsx')
const image = () => import('./impl/image.jsx')
const pdf = () => import('./impl/pdf.jsx')

const from = (loader, name) => lazy(() => loader().then((m) => ({ default: m[name] })))

export const TOOL_COMPONENTS = {
  // Utilities
  WordCounter: from(utilities, 'WordCounter'),
  CharacterCounter: from(utilities, 'CharacterCounter'),
  CaseConverter: from(utilities, 'CaseConverter'),
  ColorPicker: from(utilities, 'ColorPicker'),
  QrCodeGenerator: from(utilities, 'QrCodeGenerator'),
  UrlEncoder: from(utilities, 'UrlEncoder'),
  Base64Tool: from(utilities, 'Base64Tool'),
  PasswordGenerator: from(utilities, 'PasswordGenerator'),
  JsonFormatter: from(utilities, 'JsonFormatter'),
  MarkdownToHtml: from(utilities, 'MarkdownToHtml'),
  // Image
  CompressImage: from(image, 'CompressImage'),
  ResizeImage: from(image, 'ResizeImage'),
  CropImage: from(image, 'CropImage'),
  ConvertImage: from(image, 'ConvertImage'),
  RemoveBackground: from(image, 'RemoveBackground'),
  WatermarkImage: from(image, 'WatermarkImage'),
  RotateFlipImage: from(image, 'RotateFlipImage'),
  ImageToBase64: from(image, 'ImageToBase64'),
  // PDF
  MergePdf: from(pdf, 'MergePdf'),
  SplitPdf: from(pdf, 'SplitPdf'),
  CompressPdf: from(pdf, 'CompressPdf'),
  RotatePdf: from(pdf, 'RotatePdf'),
  JpgToPdf: from(pdf, 'JpgToPdf'),
  WatermarkPdf: from(pdf, 'WatermarkPdf'),
  PageNumbersPdf: from(pdf, 'PageNumbersPdf'),
  PdfToJpg: from(pdf, 'PdfToJpg'),
  PdfToWord: from(pdf, 'PdfToWord'),
  WordToPdf: from(pdf, 'WordToPdf'),
  ProtectPdf: from(pdf, 'ProtectPdf'),
  UnlockPdf: from(pdf, 'UnlockPdf'),
}
