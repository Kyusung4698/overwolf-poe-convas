export const trimText = (text: string, length: number, suffix = '...'): string => {
    text = text || '';
    if (text.length < length) {
        return text;
    }
    const charsToShow = length - suffix.length;
    return `${text.substring(0, charsToShow)}${suffix}`;
}