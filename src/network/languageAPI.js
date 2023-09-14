    import axios from 'axios';

export async function detectAndTranslateText(text, targetLanguage) {
  try {
    const translationApiKey =  process.env.REACT_APP_KEY_GOOGLE;

    // Deteksi bahasa teks
    const detectionResponse = await axios.post(
      `https://translation.googleapis.com/language/translate/v2/detect?key=${translationApiKey}`,
      {
        q: text,
      }
    );

    const detectedLanguage = detectionResponse.data.data.detections[0][0].language;

    // Terjemahkan teks jika bahasa bukan bahasa Indonesia
    if (detectedLanguage !== targetLanguage) {
      const translationResponse = await axios.post(
        `https://translation.googleapis.com/language/translate/v2?key=${translationApiKey}`,
        {
          q: text,
          source: detectedLanguage,
          target: targetLanguage,
        }
      );

      const translatedText = translationResponse.data.data.translations[0].translatedText;
      return translatedText;
    } else {
      return text;
    }
  } catch (error) {
    console.error('Error detecting or translating text:', error);
    return text; // Kembalikan teks asli jika terjadi kesalahan
  }
}
