import translate from "translate";


// Function to translate text to a specified language
const t = (text: string, language: string): Promise<string> => {
    return translate(text, language).catch((error) => {
        console.error("Error translating text:", error);
        return text;
    });
}

// Function to translate text to a specified language
const text = async (text: string, language: string): Promise<string> => {
    return await t(text, language)
}


export default text;