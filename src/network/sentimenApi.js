import axios from 'axios';

const API_KEY = process.env.REACT_APP_KEY_GOOGLE;

const sentimentApi = axios.create({
  baseURL: 'https://language.googleapis.com/v1', 
});

export const analyzeSentiment = async (text) => {
  try {
    const response = await sentimentApi.post(
      `/documents:analyzeSentiment?key=${API_KEY}`, 
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
