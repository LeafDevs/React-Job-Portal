import translate from "translate";

const t = (text: string, language: string): Promise<string> => {
    return translate(text, language).catch((error) => {
        console.error("Error translating text:", error);
        return text;
    });
}

const text = async (text: string, language: string): Promise<string> => {
    return await t(text, language)
}


export default text;