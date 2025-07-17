export const ymdhmsFormatter = (yyyy, mm, dd, hh, mi, sc) => `${yyyy}-${mm}-${dd} ${hh}:${mi}:${sc}`;
export const ymdhmsFileFormatter = (yyyy, mm, dd, hh, mi, sc) => `${yyyy}.${mm}.${dd}_${hh}.${mi}.${sc}`;
export const dmyFormatter = (yyyy, mm, dd) => `${dd}.${mm}.${yyyy}`;
export const wdmyFormatter = (yyyy, mm, dd, hh, mi, sc, wd) => `${wd}, ${dd}.${mm}.${yyyy}`;
export const dmyhmFormatter = (yyyy, mm, dd, hh, mi) => `${dd}.${mm}.${yyyy} ${hh}:${mi}`;
export const ymdFormatter = (yyyy, mm, dd) => `${yyyy}.${mm}.${dd}`;
export const hmFormatter = (yyyy, mm, dd, hh, mi) => `${hh}:${mi}`;
export const hmsFormatter = (yyyy, mm, dd, hh, mi, sc) => `${hh}:${mi}:${sc}`;

const WD = ["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."];

export function dateFormat(d = new Date(), formatter = ymdhmsFormatter) {
    const yyyy = d.getFullYear().toString();
    const mm = (d.getMonth() + 1).toString().padStart(2, "0");
    const dd = d.getDate().toString().padStart(2, "0");
    const hh = d.getHours().toString().padStart(2, "0");
    const mi = d.getMinutes().toString().padStart(2, "0");
    const sc = d.getSeconds().toString().padStart(2, "0");
    const wd = d.getDay();
    return formatter(yyyy, mm, dd, hh, mi, sc, WD[wd]);
};
