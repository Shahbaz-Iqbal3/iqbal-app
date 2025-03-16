// Pre-defined book data as fallback if API doesn't return books
export const DEFAULT_BOOKS = [
    { id: '0817934f-efae-47e9-a0e9-ca6304b3005e', title_en: 'Bal-e-Jibril', title_ur: 'بال جبریل', book_lang: 'Urdu' },
    { id: '115ecb36-11c1-43dd-a510-6f72fe443a56', title_en: 'Armaghan-e-Hijaz(Urdu)', title_ur: 'ارمغان حجاز (اردو)', book_lang: 'Urdu' },
    { id: '29bcc911-6527-46ef-8c16-504dbdb1043a', title_en: 'Asrar-e-Khudi', title_ur: 'اسرارِ خودی', book_lang: 'Persian' },
    { id: '452b4bae-7afd-4514-a379-df42d74e6823', title_en: 'Pas-Cheh-Bayad-Kard', title_ur: 'پس چہ بائد کرد', book_lang: 'Persian' },
    { id: '762b6b06-39ab-4172-890c-5395e091115b', title_en: 'Rumuz-e-Bekhudi', title_ur: 'رموزِ بیخودی', book_lang: 'Persian' },
    { id: '782edc4a-c2bc-4423-847d-276faa83e73e', title_en: 'Zabur-e-Ajam', title_ur: 'زبورِعجم', book_lang: 'Persian' },
    { id: '90a9cefd-bcc8-4ad5-8157-e71f4c7d4253', title_en: 'Bang-e-Dra', title_ur: 'بانگ درا', book_lang: 'Urdu' },
    { id: '9b874f03-7f6d-498c-9521-76e21d6f69b0', title_en: 'Zarb-e-Kaleem', title_ur: 'ضرب کلیم', book_lang: 'Urdu' },
    { id: 'bb7301f9-6836-4745-8724-8f69639c8231', title_en: 'Payam-e-Mashriq', title_ur: 'پیامِ مشرق', book_lang: 'Persian' },
    { id: 'd9420830-33b4-4fb2-b2bd-bac77d39bd5b', title_en: 'Armaghan-e-Hijaz(Farsi)', title_ur: 'ارمغان حجاز (فارسی)', book_lang: 'Persian' },
    { id: 'edb3168c-8fcf-412b-946d-4ec81d9ac9ae', title_en: 'Javed-Nama', title_ur: 'جاوید نامہ', book_lang: 'Persian' }
];

// Text highlight utility
export const highlightText = (text, searchQuery) => {
    if (!searchQuery?.trim() || !text) return text;
    try {
        const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedQuery})`, "gi");
        return text.replace(
            regex,
            '<span class="bg-yellow-200 dark:bg-yellow-700 text-gray-900 dark:text-white font-semibold px-1 rounded">$1</span>'
        );
    } catch (e) {
        return text;
    }
};

// Helper to get the correct poem and book IDs for links
export const getItemLink = (item) => {
    // For stanzas with poem_details
    if (item.stanza_order && item.poem_details) {
        const poemId = item.poem_details.title_en.toLowerCase().replace(/ /g, "-") || "";
        const bookId = item.poem_details.book_id || "";
        const filteredBooks = DEFAULT_BOOKS.filter(book => book.id === bookId);
        const bookTitle = filteredBooks[0]?.title_en || "";
        return `/books/${bookTitle}/${poemId}#stanza-${item.stanza_order}?selected=true`;
    }
    // For poems with stanzas
    else if (item.content_order) {
        const poemId = item?.title_en.toLowerCase().replace(/ /g, "-") || "";
        const bookId = item?.book_id || "";
        const filteredBooks = DEFAULT_BOOKS.filter(book => book.id === bookId);
        const bookTitle = filteredBooks[0]?.title_en || "";
        return `/books/${bookTitle}/${poemId}?selected=true`;
    }
    
    // Fallback
    return "#";
}; 