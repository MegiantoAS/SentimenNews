import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  CircularProgress,
  Chip,
} from '@mui/material';
import { fetchTopHeadlines, fetchEverything } from '../network/newsApi';
import TopNews from './TopNews';
import NewsCard from './NewsCards';
import { analyzeSentimentForNews } from './NewsFunctions';

function LandingPage() {
  const [searchQuery, setSearchQuery] = useState('Bandung');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [topCategory, setTopCategory] = useState('');
  const [topNews, setTopNews] = useState([]);
  const [sliderIndex, setSliderIndex] = useState(0);

  useEffect(() => {
    document.title = 'Cari Berita Terbaru';
    handleSearch('Bandung');
  }, []);

  useEffect(() => {
    if (topCategory) {
      fetchTopCategoryNews(topCategory);
    }
  }, [topCategory]);

  useEffect(() => {
    fetchTopNews();
    const intervalId = setInterval(autoSlide, 9000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const fetchTopNews = async () => {
    try {
      const topNews = await fetchTopHeadlines('us', 'business');
      const filteredNews = topNews.filter(
        (article) => article.source?.name !== "[Removed]"
      );

      const newsWithSentiment = await analyzeSentimentForNews(filteredNews);
      setTopNews(newsWithSentiment);
    } catch (error) {
      console.error('Error fetching top news:', error);
    }
  };

  const fetchTopCategoryNews = async (category) => {
    try {
      const response = await fetchTopHeadlines('us', category);
      setSearchResults(response);

      const newsWithSentiment = await analyzeSentimentForNews(response);
      setSearchResults(newsWithSentiment);
    } catch (error) {
      console.error('Error fetching top category news:', error);
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);

    try {
      const response = await fetchEverything(searchQuery);

      const newsWithSentiment = await analyzeSentimentForNews(response);
      setSearchResults(newsWithSentiment);
    } catch (error) {
      console.error('Error searching news:', error);
    }

    setIsLoading(false);
  };

  const autoSlide = () => {
    setSliderIndex((prevIndex) =>
      prevIndex === topNews.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleCategoryClick = (category) => {
    setTopCategory(category);
    fetchTopCategoryNews(category);
  };

  const handleSliderChange = (event, newValue) => {
    setSliderIndex(newValue);
  };

  const handleSliderNext = () => {
    setSliderIndex((prevIndex) =>
      prevIndex === topNews.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleSliderPrev = () => {
    setSliderIndex((prevIndex) =>
      prevIndex === 0 ? topNews.length - 1 : prevIndex - 1
    );
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <TopNews
        topNews={topNews}
        sliderIndex={sliderIndex}
        handleSliderPrev={handleSliderPrev}
        handleSliderChange={handleSliderChange}
        handleSliderNext={handleSliderNext}
      />

      <Typography variant="h4" gutterBottom style={{ color: '#4285f4' }}>
        Cari Berita Terbaru
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berita disini..."
            sx={{
              borderRadius: '24px',
              height: '48px',
              fontSize: '16px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '24px',
                backgroundColor: 'white',
                boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
                '& fieldset': {
                  borderColor: '#dadce0',
                },
                '&:hover fieldset': {
                  borderColor: '#dadce0',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4285f4',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#5f6368',
              },
              '& .MuiInputBase-input': {
                padding: '12px 14px',
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSearch}
            disabled={isLoading || !searchQuery}
            sx={{
              borderRadius: '24px',
              height: '48px',
            }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Cari'}
          </Button>
        </Grid>
      </Grid>

      <Typography variant="h5" style={{ marginTop: '2rem', marginBottom: '1rem' }}>
        Kategori Berita Populer
      </Typography>

      {/* Kategori berita */}
      <Grid container spacing={2}>
        {['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'].map((category, index) => (
          <Grid item key={index} xs={6} md={2}>
            <Chip
              label={category}
              clickable
              onClick={() => handleCategoryClick(category)}
              color={category === topCategory ? 'primary' : 'default'}
              style={{
                cursor: 'pointer',
                fontSize: category === topCategory ? '1.2rem' : '1rem',
                fontWeight: category === topCategory ? 'bold' : 'normal',
              }}
            />
          </Grid>
        ))}
      </Grid>

      {isLoading && <CircularProgress style={{ marginTop: '2rem' }} />}

      {/* Tampilan hasil pencarian berita */}
      <Grid container spacing={3} style={{ marginTop: '2rem' }}>
        {searchResults.map((article, index) => (
          <NewsCard article={article} key={article.url} />
        ))}
      </Grid>

      {/* Pesan jika tidak ada hasil pencarian */}
      {searchResults.length === 0 && !isLoading && searchQuery && (
        <Paper style={{ padding: '1rem', marginTop: '2rem' }}>
          <Typography variant="body1">
            Tidak ditemukan hasil untuk pencarian "{searchQuery}".
          </Typography>
        </Paper>
      )}
    </Container>
  );
}

export default LandingPage;