const BENGALI_MONTHS = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export const convertToBengaliDigits = (number) => {
    if (number === null || number === undefined) return '';
    return number.toString().split('').map(digit => BENGALI_DIGITS[parseInt(digit)] || digit).join('');
};

export const formatBengaliDate = (dateStr, includeTime = false) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return '';

    const day = convertToBengaliDigits(date.getDate());
    const month = BENGALI_MONTHS[date.getMonth()];
    const year = convertToBengaliDigits(date.getFullYear());

    let formattedDate = `${day} ${month}, ${year}`;

    if (includeTime) {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const formattedHours = convertToBengaliDigits(hours.toString().padStart(2, '0'));
        const formattedMinutes = convertToBengaliDigits(minutes.toString().padStart(2, '0'));
        formattedDate += ` | ${formattedHours}:${formattedMinutes}`;
    }

    return formattedDate;
};
