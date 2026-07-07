import { readFileSync } from 'fs';
import { join } from 'path';
import { NextResponse } from 'next/server';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

// Fonts are loaded as base64 and embedded directly into the HTML via @font-face,
// so Chromium (via Puppeteer) renders them exactly like a browser would —
// full native Arabic/Urdu shaping, no Satori GSUB limitations.
function fontBase64(filename) {
    const data = readFileSync(join(process.cwd(), 'public/fonts', filename));
    return data.toString('base64');
}

const FONT_DATA = {
    cinzelRegular: fontBase64('Cinzel-Regular.ttf'),
    cinzelBold: fontBase64('Cinzel-Bold.ttf'),
    montserrat: fontBase64('Montserrat-SemiBold.ttf'),
    notoNastaliqRegular: fontBase64('NotoNastaliqUrdu-Regular.ttf'),
    notoNastaliqBold: fontBase64('NotoNastaliqUrdu-Bold.ttf'),
};

const palettes = [
    { bg: '#16120e', border: '#c9a054', text: '#f5e6c4', accent: '#a48953', englishText: '#d1c4a5' },
    { bg: '#0f1410', border: '#5a8f6b', text: '#e8f0e3', accent: '#7fb892', englishText: '#c2d4c6' },
    { bg: '#150e16', border: '#9c5fb8', text: '#f0e3f5', accent: '#b385c9', englishText: '#d4c2da' },
    { bg: '#161210', border: '#c97a4a', text: '#f5e8dc', accent: '#d99668', englishText: '#dac4b3' },
    { bg: '#0e1216', border: '#5a87c9', text: '#e3ecf5', accent: '#7fa3d9', englishText: '#c2cfda' },
];

const layouts = ['centered', 'leftAccent', 'framed'];

function calcUrduFontSize(maxLen, lineCount) {
    let size = 66;
    if (maxLen > 18) size = 56;
    if (maxLen > 28) size = 46;
    if (maxLen > 40) size = 38;
    if (maxLen > 55) size = 30;
    if (lineCount > 4) size -= 6;
    if (lineCount > 6) size -= 6;
    return Math.max(size, 24);
}

function calcEnglishFontSize(maxLen, lineCount) {
    let size = 21;
    if (maxLen > 45) size = 19;
    if (maxLen > 65) size = 17;
    if (maxLen > 85) size = 15;
    if (lineCount > 5) size -= 2;
    if (lineCount > 8) size -= 2;
    return Math.max(size, 12);
}

function calcHookFontSize(text) {
    const len = (text || '').length;
    let size = 89;
    if (len > 25) size = 80;
    if (len > 40) size = 71;
    if (len > 60) size = 61;
    if (len > 80) size = 54;
    if (len > 100) size = 46;
    return Math.max(size, 35);
}

function getLayoutProps(layout) {
    const isLeftAccent = layout === 'leftAccent';
    const borderWidth = layout === 'framed' ? 32 : 24;
    return { isLeftAccent, borderWidth };
}

// Basic HTML-escaping so poem text can't break the markup.
function esc(str) {
    return String(str ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;');
}

function fontFaceCss() {
    return `
        @font-face {
            font-family: 'Cinzel';
            src: url(data:font/ttf;base64,${FONT_DATA.cinzelRegular}) format('truetype');
            font-weight: 400;
            font-style: normal;
        }
        @font-face {
            font-family: 'Cinzel';
            src: url(data:font/ttf;base64,${FONT_DATA.cinzelBold}) format('truetype');
            font-weight: 700;
            font-style: normal;
        }
        @font-face {
            font-family: 'Montserrat';
            src: url(data:font/ttf;base64,${FONT_DATA.montserrat}) format('truetype');
            font-weight: 600;
            font-style: normal;
        }
        @font-face {
            font-family: 'NotoArabic';
            src: url(data:font/ttf;base64,${FONT_DATA.notoNastaliqRegular}) format('truetype');
            font-weight: 400;
            font-style: normal;
        }
        @font-face {
            font-family: 'NotoArabic';
            src: url(data:font/ttf;base64,${FONT_DATA.notoNastaliqBold}) format('truetype');
            font-weight: 700;
            font-style: normal;
        }
    `;
}

function brandingFooterHtml(palette, stanzaLabel) {
    return `
        <div class="footer">
            ${stanzaLabel ? `<div class="stanza-label" style="color:${palette.border}">${esc(stanzaLabel)}</div>` : ''}
            <div class="brand-row">
                <img src="https://drallamaiqbal.vercel.app/_next/image?url=%2Ffavicon_io1%2Fandroid-chrome-512x512.png&w=64&q=75" width="40" height="40" />
                <div class="brand-text" style="color:${palette.accent}">drallamaiqbal.com</div>
            </div>
        </div>
    `;
}

function baseStyles() {
    return `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { width: 1080px; height: 1080px; }
        .card {
            width: 1080px;
            height: 1080px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            position: relative;
        }
        .accent-bar {
            position: absolute;
            left: 0;
            top: 0;
            width: 14px;
            height: 1080px;
        }
        .footer {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 45px;
        }
        .stanza-label {
            font-family: 'Cinzel';
            font-size: 15px;
            font-weight: 700;
            letter-spacing: 3px;
            margin-bottom: 24px;
        }
        .brand-row {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 10px;
        }
        .brand-text {
            font-family: 'Montserrat';
            font-size: 24px;
            font-weight: 600;
            letter-spacing: 1.5px;
        }
    `;
}

function renderStanzaHtml(body) {
    const palette = palettes[body.palette_index ?? 0] || palettes[0];
    const layout = 'centered';
    const { isLeftAccent, borderWidth } = getLayoutProps(layout);

    const urduLines = Array.isArray(body.urdu_lines) ? body.urdu_lines : [];
    const englishLines = Array.isArray(body.english_lines) ? body.english_lines : [];

    const longestUrdu = Math.max(...urduLines.map(l => String(l).length), 1);
    const longestEnglish = Math.max(...englishLines.map(l => String(l).length), 1);
    const urduFontSize = calcUrduFontSize(longestUrdu, urduLines.length);
    const englishFontSize = calcEnglishFontSize(longestEnglish, englishLines.length);
    const urduLineHeight = urduLines.length > 5 ? 1.8 : 2.1;
    const englishLineHeight = englishLines.length > 5 ? 1.3 : 1.6;

    const urduLinesHtml = urduLines.map(line => `
        <div style="font-family:'NotoArabic'; font-size:${urduFontSize}px; line-height:${urduLineHeight}; font-weight:700; color:${palette.text}; direction:rtl; text-align:center;">
            ${esc(line)}
        </div>
    `).join('');

    const englishLinesHtml = englishLines.map(line => `
        <div style="font-family:'Cinzel'; font-size:${englishFontSize}px; line-height:${englishLineHeight}; color:${palette.englishText}; font-style:italic;">
            ${esc(line)}
        </div>
    `).join('');

    return `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="utf-8" />
    <style>
        ${fontFaceCss()}
        ${baseStyles()}
        .header {
            margin-top: 70px;
            display: flex;
            flex-direction: column;
            align-items: ${isLeftAccent ? 'flex-start' : 'center'};
            width: 900px;
            margin-left: ${isLeftAccent ? '90px' : '0px'};
        }
        .title-en {
            font-family: 'Cinzel', serif, 'NotoArabic', sans-serif;
            font-size: 21px;
            font-weight: 700;
            letter-spacing: 4px;
            text-transform: uppercase;
            color: ${palette.border};
        }
        .title-ur {
            font-family: 'NotoArabic';
            font-size: 35px;
            color: ${palette.accent};
            margin-top: 18px;
            direction: rtl;
            text-align: ${isLeftAccent ? 'left' : 'center'};
        }
        .content {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 940px;
            flex-grow: 1;
            justify-content: center;
            padding: 0 20px;
        }
        .urdu-block {
            display: flex;
            flex-direction: column;
            align-items: center;
            direction: rtl;
            text-align: center;
            width: 100%;
            margin-bottom: 35px;
        }
        .divider {
            width: 820px;
            height: 1px;
            background-color: ${palette.border};
            opacity: 0.25;
            margin-bottom: 25px;
        }
        .english-block {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            width: 820px;
        }
    </style>
    </head>
    <body>
        <div class="card" style="background-color:${palette.bg}; border:${borderWidth}px solid ${palette.border};">
            ${isLeftAccent ? `<div class="accent-bar" style="background-color:${palette.border}"></div>` : ''}

            <div class="header">
                <div class="title-en">${esc(body.poem_title_en)}</div>
                <div class="title-ur">${esc(body.poem_title_ur)}</div>
            </div>

            <div class="content">
                <div class="urdu-block">${urduLinesHtml}</div>
                <div class="divider"></div>
                <div class="english-block">${englishLinesHtml}</div>
            </div>

            ${brandingFooterHtml(palette, `STANZA ${body.stanza_no} OF ${body.total_stanzas}`)}
        </div>
    </body>
    </html>
    `;
}

function renderHookHtml(body) {
    const palette = palettes[body.palette_index ?? 0] || palettes[0];
    const layout = 'centered';
    const { isLeftAccent, borderWidth } = getLayoutProps(layout);
    const hookText = String(body.hook || '');
    const hookFontSize = calcHookFontSize(hookText);

    return `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="utf-8" />
    <style>
        ${fontFaceCss()}
        ${baseStyles()}
        .hook-wrap {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            flex-grow: 1;
            width: 880px;
            text-align: center;
            direction: rtl;
        }
        .hook-text {
            font-family: 'NotoArabic';
            font-size: ${hookFontSize}px;
            line-height: 2.0;
            font-weight: 700;
            color: ${palette.text};
            direction: rtl;
            text-align: center;
        }
    </style>
    </head>
    <body>
        <div class="card" style="background-color:${palette.bg}; border:${borderWidth}px solid ${palette.border};">
            ${isLeftAccent ? `<div class="accent-bar" style="background-color:${palette.border}"></div>` : ''}
            <div style="height:1px;"></div>
            <div class="hook-wrap">
                <div class="hook-text">${esc(hookText)}</div>
            </div>
            ${brandingFooterHtml(palette, null)}
        </div>
    </body>
    </html>
    `;
}

let browserPromise = null;
async function getBrowser() {
    if (!browserPromise) {
        browserPromise = puppeteer.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
            defaultViewport: { width: 1080, height: 1080 },
        });
    }
    return browserPromise;
}

async function renderCardToPng(html) {
    const browser = await getBrowser();
    const page = await browser.newPage();
    try {
        await page.setViewport({ width: 1080, height: 1080 });
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const png = await page.screenshot({ type: 'png' });
        return png;
    } finally {
        await page.close();
    }
}

export async function GET() {
    return NextResponse.json(
        { message: 'POST only. Send urdu_lines, english_lines, poem_title_en, poem_title_ur, stanza_no, total_stanzas, palette_index, layout_index, item_type.' },
        { status: 405 }
    );
}

export async function POST(request) {
    try {
        const body = await request.json();
        const itemType = body.item_type || 'stanza';

        const html = itemType === 'hook' ? renderHookHtml(body) : renderStanzaHtml(body);
        const png = await renderCardToPng(html);

        return new NextResponse(png, {
            status: 200,
            headers: {
                'Content-Type': 'image/png',
                'Content-Length': png.length.toString(),
            }
        });

    } catch (error) {
        console.error('Image generation error:', error.message, error.stack);
        return NextResponse.json(
            { error: error.message, stack: error.stack },
            { status: 500 }
        );
    }
}