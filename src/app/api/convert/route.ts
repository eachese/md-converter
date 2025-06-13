import { NextRequest, NextResponse } from 'next/server';
import { remark } from 'remark';
import html from 'remark-html';
import puppeteer from 'puppeteer';
import chromium from '@sparticuz/chromium';
import htmlToDocx from 'html-to-docx';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

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
    
    // Convert to DOCX
    const docxBuffer = await htmlToDocx(htmlContent, undefined, {
        table: { row: { cantSplit: true } },
        footer: true,
        pageNumber: true,
    });
    const docxBlob = new Blob([docxBuffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

    // Convert to PDF
    const browser = await puppeteer.launch(
        process.env.NODE_ENV === 'production'
        ? {
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        }
        : { headless: true }
    );
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
    const pdfBlob = new Blob([pdfBuffer], { type: 'application/pdf' });
    
    const responseFormData = new FormData();
    responseFormData.append('docx', docxBlob, `${path.basename(file.name, '.md')}.docx`);
    responseFormData.append('pdf', pdfBlob, `${path.basename(file.name, '.md')}.pdf`);

    return new NextResponse(responseFormData);
  } catch (error) {
    const err = error as Error;
    console.error('Conversion failed:', err);
    return NextResponse.json({ error: 'Failed to convert file.', details: err.message }, { status: 500 });
  }
} 