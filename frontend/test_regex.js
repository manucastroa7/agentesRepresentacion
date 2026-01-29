const urls = [
    "https://youtu.be/j8dqYdlMbfQ?si=b6CXVWAyWx_WxtEn",
    "https://youtu.be/LTgcD0d4Kts?si=lja1gKD5DKty3bTF",
    "https://youtu.be/PIaCTSjKhfc?si=rBerE_tfSp50ABbG",
    "https://youtu.be/oVkmQpVoCtk?si=FGJJSPOIl6vHYXj8",
    "https://youtu.be/ZzAJ_3pF2IU?si=qc7XMcMSI5ZLy9lz",
    "https://youtu.be/d4SvcMJpHKo?si=lpWJDTHUE02cYgDW",
    "https://youtu.be/zppPRTUZz1A?si=lcjbxG-LZlbrcARp",
    "",
    "   https://youtu.be/j8dqYdlMbfQ   "
];

const getYoutubeId = (url) => {
    if (!url) return null;
    try {
        const cleanUrl = url.trim();
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = cleanUrl.match(regExp);
        if (match && match[2].length >= 10) {
            return match[2];
        }
        return null;
    } catch (error) {
        return null;
    }
};

urls.forEach(u => console.log(`'${u}' -> ${getYoutubeId(u)}`));
