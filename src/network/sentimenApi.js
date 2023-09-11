import axios from 'axios';

const API_KEY = 'AIzaSyBVbD1o9xk1IdSiXF14xxRRtmYgmNcdSAQ' // Ganti dengan API key sentimen Anda

const sentimentApi = axios.create({
  baseURL: 'https://language.googleapis.com/v1', // URL API sentiment harus dipisahkan dari path '/documents:analyzeSentiment'
});

export const analyzeSentiment = async (text) => {
  try {
    const response = await sentimentApi.post(
      `/documents:analyzeSentiment?key=${API_KEY}`, // Ubah URL dengan path '/documents:analyzeSentiment' dan tambahkan query parameter 'key' di sini
      {
        document: {
          content: text,
          type: 'PLAIN_TEXT',
        },
      }
    );

    const sentiment = response.data.documentSentiment;
    const sentimentLabel =
      sentiment.score > 0 ? 'Positif' : sentiment.score < 0 ? 'Negatif' : 'Netral';

    return sentimentLabel;
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return 'Netral';
  }
};
