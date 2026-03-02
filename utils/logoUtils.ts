export const getDomain = (url: string): string => {
    try {
        const hostname = new URL(url).hostname;
        return hostname.replace(/^www\./, '');
    } catch (e) {
        return url;
    }
};

export const getIconHorseUrl = (url: string): string => {
    const domain = getDomain(url);
    return `https://icon.horse/icon/${domain}`;
};

export const getAppFallbackIcon = (name: string): string => {
    const initial = name.charAt(0).toUpperCase();
    return `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 fill=%22none%22/><text x=%2250%%22 y=%2250%%22 dy=%22.31em%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-weight=%22900%22 font-size=%2260%22 fill=%22%236b7280%22>${initial}</text></svg>`;
};
