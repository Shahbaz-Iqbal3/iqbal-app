import satori from 'satori';
import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join } from 'path';
import { NextResponse } from 'next/server';
import ArabicPersianReshaperPkg from 'arabic-persian-reshaper';

const { ArabicShaper } = ArabicPersianReshaperPkg;

// Pre-shape Urdu/Arabic-script text into joined presentation-form glyphs.
// Satori (via opentype.js) can't run the complex GSUB contextual substitution
// that real Nastaliq/Naskh fonts use for letter-joining, so we resolve the
// joining ourselves before satori ever sees the string.
function reshapeUrdu(text) {
    const str = String(text || '');
    if (!str) return '';
    try {
        return ArabicShaper.convertArabic(str);
    } catch (err) {
        console.error('Urdu reshape failed, falling back to raw text:', err.message);
        return str;
    }
}

const cinzelRegular = readFileSync(join(process.cwd(), 'public/fonts/Cinzel-Regular.ttf'));
const cinzelBold = readFileSync(join(process.cwd(), 'public/fonts/Cinzel-Bold.ttf'));
const montserrat = readFileSync(join(process.cwd(), 'public/fonts/Montserrat-SemiBold.ttf'));
const notoArabic = readFileSync(join(process.cwd(), 'public/fonts/NotoNaskhArabic.ttf'));

const palettes = [
    { bg: '#16120e', border: '#c9a054', text: '#f5e6c4', accent: '#a48953', englishText: '#d1c4a5' },
    { bg: '#0f1410', border: '#5a8f6b', text: '#e8f0e3', accent: '#7fb892', englishText: '#c2d4c6' },
    { bg: '#150e16', border: '#9c5fb8', text: '#f0e3f5', accent: '#b385c9', englishText: '#d4c2da' },
    { bg: '#161210', border: '#c97a4a', text: '#f5e8dc', accent: '#d99668', englishText: '#dac4b3' },
    { bg: '#0e1216', border: '#5a87c9', text: '#e3ecf5', accent: '#7fa3d9', englishText: '#c2cfda' },
];

const layouts = ['centered', 'leftAccent', 'framed'];

const FONTS = [
    { name: 'Cinzel', data: cinzelRegular, weight: 400, style: 'normal' },
    { name: 'Cinzel', data: cinzelBold, weight: 700, style: 'normal' },
    { name: 'Montserrat', data: montserrat, weight: 600, style: 'normal' },
    { name: 'NotoArabic', data: notoArabic, weight: 400, style: 'normal' },
    { name: 'NotoArabic', data: notoArabic, weight: 700, style: 'normal' },
];

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

function getLayoutProps(layout, palette) {
    const isLeftAccent = layout === 'leftAccent';
    const borderWidth = layout === 'framed' ? 32 : 24;
    return { isLeftAccent, borderWidth };
}

function accentBar(palette) {
    return {
        type: 'div',
        props: {
            style: {
                position: 'absolute',
                left: '0px',
                top: '0px',
                width: '14px',
                height: '1080px',
                backgroundColor: palette.border,
            }
        }
    };
}

function brandingFooter(palette, stanzaLabel) {
    return {
        type: 'div',
        props: {
            style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: '45px',
            },
            children: [
                ...(stanzaLabel ? [{
                    type: 'div',
                    props: {
                        style: {
                            fontFamily: 'Cinzel',
                            fontSize: '15px',
                            fontWeight: 700,
                            color: palette.border,
                            letterSpacing: '3px',
                            marginBottom: '24px',
                        },
                        children: stanzaLabel
                    }
                }] : []),
                {
                    type: 'div',
                    props: {
                        style: {
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: '10px',
                        },
                        children: [
                            {
                                type: 'img',
                                props: {
                                    src: 'https://drallamaiqbal.vercel.app/_next/image?url=%2Ffavicon_io1%2Fandroid-chrome-512x512.png&w=64&q=75',
                                    width: 40,
                                    height: 40,
                                    style: { objectFit: 'contain' }
                                }
                            },
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        fontFamily: 'Montserrat',
                                        fontSize: '24px',
                                        fontWeight: 600,
                                        color: palette.accent,
                                        letterSpacing: '1.5px',
                                    },
                                    children: 'drallamaiqbal.com'
                                }
                            }
                        ]
                    }
                }
            ]
        }
    };
}

async function renderStanzaCard(body) {
    const palette = palettes[body.palette_index ?? 0] || palettes[0];
    const layout = body.layout || layouts[body.layout_index ?? 0] || 'centered';
    const { isLeftAccent, borderWidth } = getLayoutProps(layout, palette);

    const urduLines = Array.isArray(body.urdu_lines) ? body.urdu_lines : [];
    const englishLines = Array.isArray(body.english_lines) ? body.english_lines : [];

    const longestUrdu = Math.max(...urduLines.map(l => String(l).length), 1);
    const longestEnglish = Math.max(...englishLines.map(l => String(l).length), 1);
    const urduFontSize = calcUrduFontSize(longestUrdu, urduLines.length);
    const englishFontSize = calcEnglishFontSize(longestEnglish, englishLines.length);
    const urduLineHeight = urduLines.length > 5 ? 1.8 : 2.1;
    const englishLineHeight = englishLines.length > 5 ? 1.3 : 1.6;

    return await satori(
        {
            type: 'div',
            props: {
                style: {
                    width: '1080px',
                    height: '1080px',
                    backgroundColor: palette.bg,
                    border: `${borderWidth}px solid ${palette.border}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'relative',
                    boxSizing: 'border-box',
                },
                children: [
                    isLeftAccent ? accentBar(palette) : null,

                    // Header
                    {
                        type: 'div',
                        props: {
                            style: {
                                marginTop: '70px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: isLeftAccent ? 'flex-start' : 'center',
                                width: '900px',
                                marginLeft: isLeftAccent ? '90px' : '0px',
                            },
                            children: [
                                {
                                    type: 'div',
                                    props: {
                                        style: {
                                            fontFamily: 'Cinzel',
                                            fontSize: '16px',
                                            fontWeight: 700,
                                            color: palette.border,
                                            letterSpacing: '4px',
                                            textTransform: 'uppercase',
                                        },
                                        children: String(body.poem_title_en || '')
                                    }
                                },
                                {
                                    type: 'div',
                                    props: {
                                        style: {
                                            fontFamily: 'NotoArabic',
                                            fontSize: '35px',
                                            color: palette.accent,
                                            marginTop: '18px',
                                            direction: 'rtl',
                                            unicodeBidi: 'bidi-override',
                                            textAlign: isLeftAccent ? 'left' : 'center',
                                        },
                                        children: reshapeUrdu(body.poem_title_ur)
                                    }
                                }
                            ]
                        }
                    },

                    // Content
                    {
                        type: 'div',
                        props: {
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                width: '940px',
                                flexGrow: 1,
                                justifyContent: 'center',
                                padding: '0 20px',
                            },
                            children: [
                                // Urdu lines
                                {
                                    type: 'div',
                                    props: {
                                        style: {
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            direction: 'rtl',
                                            textAlign: 'center',
                                            width: '100%',
                                            marginBottom: '35px',
                                        },
                                        children: urduLines.map(line => ({
                                            type: 'div',
                                            props: {
                                                style: {
                                                    fontFamily: 'NotoArabic',
                                                    fontSize: `${urduFontSize}px`,
                                                    lineHeight: urduLineHeight,
                                                    fontWeight: 700,
                                                    color: palette.text,
                                                    direction: 'rtl',
                                                    unicodeBidi: 'bidi-override',
                                                    textAlign: 'center',
                                                },
                                                children: reshapeUrdu(line)
                                            }
                                        }))
                                    }
                                },

                                // Divider
                                {
                                    type: 'div',
                                    props: {
                                        style: {
                                            width: '820px',
                                            height: '1px',
                                            backgroundColor: palette.border,
                                            opacity: 0.25,
                                            marginBottom: '25px',
                                        }
                                    }
                                },

                                // English lines
                                {
                                    type: 'div',
                                    props: {
                                        style: {
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            textAlign: 'center',
                                            width: '820px',
                                        },
                                        children: englishLines.map(line => ({
                                            type: 'div',
                                            props: {
                                                style: {
                                                    fontFamily: 'Cinzel',
                                                    fontSize: `${englishFontSize}px`,
                                                    lineHeight: englishLineHeight,
                                                    color: palette.englishText,
                                                    fontStyle: 'italic',
                                                },
                                                children: String(line)
                                            }
                                        }))
                                    }
                                }
                            ]
                        }
                    },

                    brandingFooter(palette, `STANZA ${body.stanza_no} OF ${body.total_stanzas}`)

                ].filter(Boolean)
            }
        },
        { width: 1080, height: 1080, fonts: FONTS }
    );
}

async function renderHookCard(body) {
    const palette = palettes[body.palette_index ?? 0] || palettes[0];
    const layout = body.layout || layouts[body.layout_index ?? 0] || 'centered';
    const { isLeftAccent, borderWidth } = getLayoutProps(layout, palette);
    const hookText = String(body.hook || '');
    const hookFontSize = calcHookFontSize(hookText);
    const hookTextShaped = reshapeUrdu(hookText);

    return await satori(
        {
            type: 'div',
            props: {
                style: {
                    width: '1080px',
                    height: '1080px',
                    backgroundColor: palette.bg,
                    border: `${borderWidth}px solid ${palette.border}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'relative',
                    boxSizing: 'border-box',
                },
                children: [
                    isLeftAccent ? accentBar(palette) : null,

                    // Spacer top
                    { type: 'div', props: { style: { height: '1px' } } },

                    // Hook text centered
                    {
                        type: 'div',
                        props: {
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexGrow: 1,
                                width: '880px',
                                textAlign: 'center',
                                direction: 'rtl',
                            },
                            children: [{
                                type: 'div',
                                props: {
                                    style: {
                                        fontFamily: 'NotoArabic',
                                        fontSize: `${hookFontSize}px`,
                                        lineHeight: 2.0,
                                        fontWeight: 700,
                                        color: palette.text,
                                        direction: 'rtl',
                                        unicodeBidi: 'bidi-override',
                                        textAlign: 'center',
                                    },
                                    children: hookTextShaped
                                }
                            }]
                        }
                    },

                    brandingFooter(palette, null)

                ].filter(Boolean)
            }
        },
        { width: 1080, height: 1080, fonts: FONTS }
    );
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

        let svg;
        if (itemType === 'hook') {
            svg = await renderHookCard(body);
        } else {
            svg = await renderStanzaCard(body);
        }

        if (!svg || svg.length === 0) {
            throw new Error('Satori returned empty SVG');
        }

        const png = await sharp(Buffer.from(svg))
            .png()
            .toBuffer();

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