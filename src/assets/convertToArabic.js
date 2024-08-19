// utils/convertToArabic.
const convertToArabic = (number) => {
    const englishToArabic = {
        '0': '٠',
        '1': '١',
        '2': '٢',
        '3': '٣',
        '4': '٤',
        '5': '٥',
        '6': '٦',
        '7': '٧',
        '8': '٨',
        '9': '٩'
    };

    return number.toString().split('').map((digit) => englishToArabic[digit] || digit).join('');
};

export default convertToArabic;
