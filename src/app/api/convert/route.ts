import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';
import puppeteer from 'puppeteer';
import htmlToDocx from 'html-to-docx';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), 'public', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    const mdContent = await file.text();
    const processedContent = await remark().use(html).process(mdContent);
    const htmlContent = processedContent.toString();

    const fileName = path.basename(file.name || 'document', '.md');
    
    // Convert to DOCX
    const docxBuffer = await htmlToDocx(htmlContent, undefined, {
        table: { row: { cantSplit: true } },
        footer: true,
        pageNumber: true,
    });
    const docxPath = path.join(uploadDir, `${fileName}.docx`);
    fs.writeFileSync(docxPath, Buffer.from(docxBuffer as ArrayBuffer));
    const docxUrl = `/uploads/${fileName}.docx`;

    // Convert to PDF
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
            top: '1in',
            right: '1.25in',
            bottom: '1in',
            left: '1.25in',
        },
    });
    await browser.close();

    const pdfPath = path.join(uploadDir, `${fileName}.pdf`);
    fs.writeFileSync(pdfPath, pdfBuffer);
    const pdfUrl = `/uploads/${fileName}.pdf`;
    
    return NextResponse.json({ docx: docxUrl, pdf: pdfUrl });
  } catch (error) {
    const err = error as Error;
    console.error('Conversion failed:', err);
    return NextResponse.json({ error: 'Failed to convert file.', details: err.message }, { status: 500 });
  }
} 