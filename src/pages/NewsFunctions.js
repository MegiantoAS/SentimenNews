import { analyzeSentiment } from '../network/sentimenApi';

export async function analyzeSentimentForNews(newsData) {
  const newsWithSentiment = await Promise.all(
    newsData.map(async (article) => {
      const sentiment = await analyzeSentiment(
        `${article.title} ${article.description}`
      );
      return { ...article, sentiment };
    })
  );

  return newsWithSentiment;
}
