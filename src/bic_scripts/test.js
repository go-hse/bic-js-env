function isSummertime(year, month, day) {
    function lastSunday(month) {
        const lastDay = new Date(year, month + 1, 0); // letzter Tag des Monats
        const dayOfWeek = lastDay.getDay();
        return lastDay.getDate() - dayOfWeek;
    }

    const utcDate = new Date(Date.UTC(year, month, day));
    const lastMarchSunday = lastSunday(2); // März
    const lastOctoberSunday = lastSunday(9); // Oktober

    const summerStart = new Date(Date.UTC(year, 2, lastMarchSunday, 1));   // letzte Märzsonntag 2:00 MEZ = 1:00 UTC
    const summerEnd = new Date(Date.UTC(year, 9, lastOctoberSunday, 1)); // letzte Oktobersonntag 3:00 MESZ = 1:00 UTC

    return utcDate >= summerStart && utcDate < summerEnd;
}

function shiftTimezone(dateUtc, offset = 1) {
    const year = dateUtc.getUTCFullYear();
    const month = dateUtc.getUTCMonth();
    const day = dateUtc.getUTCDate();

    const offsetStunden = isSummertime(year, month, day) ? offset + 1 : offset;
    return new Date(dateUtc.getTime() + offsetStunden * 60 * 60 * 1000);
}

function getURL_Parameters(url) {
    let para = "", split = [], kv = {};
    if (url.includes("?")) {
        para = _case.url.split("?")[1];
        split = para.split("&");

        for (const part of split) {
            const [key, value] = part.split("=");
            kv[key] = value;
        }
    }
    return kv;
}

let family_name = "family", given_name = "given";
if (_case && _case.creator && _case.creator.name && _case.creator.name !== "WEB FORM") {
    const name = _case.creator.name;
    const name_split = name.split(", ");
    family_name = name_split[0];
    given_name = name_split[1];
} else {
    // assumption: from Web    
    const name_split = extern_name.split(", ");
    if (name_split && name_split.length > 1) {
        family_name = name_split[0];
        given_name = name_split[1];
    }
}

const now = new Date();
const nowToTimeZone = shiftTimezone(now);
const defaultTimeString = now.toString();

const dd = String(nowToTimeZone.getDate()).padStart(2, '0');
const mm = String(nowToTimeZone.getMonth() + 1).padStart(2, '0');
const hh = String(nowToTimeZone.getHours()).padStart(2, '0');
const mi = String(nowToTimeZone.getMinutes()).padStart(2, '0');
const sc = String(nowToTimeZone.getSeconds()).padStart(2, '0');
const yyyy = nowToTimeZone.getFullYear();


const msSinceBeginInt = nowToTimeZone.getTime();
const zeroNineInt = msSinceBeginInt % 10;
const zeroThreeInt = msSinceBeginInt % 3;

const randomBool = msSinceBeginInt % 2 === 0;

const dateFormattedString = `${dd}.${mm}.${yyyy}, ${hh}:${mi}:${sc}`;
const localTime = nowToTimeZone.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

const dynamicSelection = {
    "Fakultät Informationstechnik": "IT",
    "Fakultät Maschinenen und Systeme": "MS",
    "Fakultät Mobilität und Technik": "MT",
    "Fakultät Wirtschaft und Technik": "WT",
    "Fakultät Angew. Naturwissenschaften Energie- und Gebäudetechnik": "NG",
    "Fakultät Soziale Arbeit Bildung und Pflege": "SP",
}

let selection = "";
for (const [key, value] of Object.entries(dynamicSelection)) {
    selection += `${key};${value},`;
}

const output = {
    defaultTimeString,
    dateFormattedString,
    localTime,
    msSinceBeginInt,
    randomBool,
    family_name,
    given_name,
    file_to_upload: `file_${dd}`,
    zeroNineInt, zeroThreeInt,
    selection, aList: [1, 2, 3],
    kv: JSON.stringify(getURL_Parameters(_case.url))
};

output;


// https://hs-esslingen.processdesign.bitbw.bicplatform.de/process-execution/studio/processes/b65c4d45871f3c42ffc77aa97ac6a633b96c78c69c4db7d02b5a514dc622e562/instances/c1cd3e6a-891f-4542-8dcc-31f183e57ecf/flow
// https://hs-esslingen.processdesign.bitbw.bicplatform.de/process-execution/studio/guest/start-form/N4IgJglghg5gTlAtgSTCAXCAHAFiwBgFMiBmAWjADYBGLMnQyqMgTgCYrXKAjAdgDNeOfvnwBWLCAA0IAHYB7MIVQYQAgMaF1gtmV4D%2B9fi2bdKWQ1HPUxxnNwb5pIOIQAO8gM4QALvLgAniqYvOosYlBg%2BNxk1BzkOOpCZFjULIaU0YS8UCxgWFBiJM4%2BhLJQsj7B2Fjc-LYklGRQ6pn0hGK8ZNzcuc0kYgzmdSRg6iAAvkA?a=1&b=2&c=3