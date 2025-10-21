// utils/getImgUrl.js
export function getImgUrl(path = "") {
    const base = process.env.NEXT_PUBLIC_BASE_URL || "";
    // 슬래시 중복 방지
    if (!path.startsWith("/")) path = `/${path}`;
    return `${base}${path}`;
}
