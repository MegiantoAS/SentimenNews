import axios from 'axios';

const API_KEY =  process.env.REACT_APP_API_KEY;

const api = axios.create({
  baseURL: 'https://newsapi.org/v2',
});

export const fetchTopHeadlines = async (country, category) => {
  try {
    const response = await api.get(`/top-headlines?country=${country}&category=${category}&apiKey=${API_KEY}`);
    return response.data.articles;
  } catch (error) {
    console.error('Error fetching top headlines:', error);
    return [];
  }
};

export const fetchEverything = async (query) => {
  try {
    const response = await api.get(`/everything?q=${query}&apiKey=${API_KEY}`);
    return response.data.articles;
  } catch (error) {
    console.error('Error fetching everything:', error);
    return [];
  }
};
