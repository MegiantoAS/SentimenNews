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
  // State untuk mengelola data dan status aplikasi
  const [searchQuery, setSearchQuery] = useState('Bandung');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [topCategory, setTopCategory] = useState('');
  const [topNews, setTopNews] = useState([]);
  const [sliderIndex, setSliderIndex] = useState(0);

  // Efek pertama: Mengatur judul dokumen dan inisialisasi pencarian dengan kata kunci "Bandung"
  useEffect(() => {
    document.title = 'Cari Berita Terbaru';
    handleSearch('Bandung');
  }, []);

  // Efek kedua: Memanggil fetchTopCategoryNews ketika topCategory berubah
  useEffect(() => {
    if (topCategory) {
      fetchTopCategoryNews(topCategory);
    }
  }, [topCategory]);

  // Efek ketiga: Mengambil berita teratas dan mengatur interval slider otomatis
  useEffect(() => {
    fetchTopNews();
    const intervalId = setInterval(autoSlide, 9000);

    // Membersihkan interval saat komponen unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Mengambil berita teratas dan menerapkan analisis sentimen
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

  // Mengambil berita dari kategori tertentu dan menerapkan analisis sentimen
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

  // Menangani pencarian berita dan menerapkan analisis sentimen
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

  // Fungsi untuk menggeser slider berita teratas secara otomatis
  const autoSlide = () => {
    setSliderIndex((prevIndex) =>
      prevIndex === topNews.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Menangani klik pada kategori berita
  const handleCategoryClick = (category) => {
    setTopCategory(category);
    fetchTopCategoryNews(category);
  };

  // Menangani perubahan slider
  const handleSliderChange = (event, newValue) => {
    setSliderIndex(newValue);
  };

  // Menangani klik tombol slider berikutnya
  const handleSliderNext = () => {
    setSliderIndex((prevIndex) =>
      prevIndex === topNews.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Menangani klik tombol slider sebelumnya
  const handleSliderPrev = () => {
    setSliderIndex((prevIndex) =>
      prevIndex === 0 ? topNews.length - 1 : prevIndex - 1
    );
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      {/* Komponen untuk menampilkan berita teratas */}
      <TopNews
        topNews={topNews}
        sliderIndex={sliderIndex}
        handleSliderPrev={handleSliderPrev}
        handleSliderChange={handleSliderChange}
        handleSliderNext={handleSliderNext}
      />

      {/* Judul halaman */}
      <Typography variant="h4" gutterBottom style={{ color: '#4285f4' }}>
        Cari Berita Terbaru
      </Typography>

      {/* Kotak pencarian berita */}
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
          {/* Tombol untuk memulai pencarian */}
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

      {/* Judul untuk kategori berita populer */}
      <Typography variant="h5" style={{ marginTop: '2rem', marginBottom: '1rem' }}>
        Kategori Berita Populer
      </Typography>

      {/* Daftar kategori berita */}
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

      {/* Indikator loading saat pencarian */}
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