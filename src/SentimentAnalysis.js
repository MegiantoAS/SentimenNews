import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ThemeProvider,
  createTheme,
  Modal,
  Box,
  Paper,
  Typography,
  Grid,
  CircularProgress,
  CssBaseline,
  Container,
  TextField,
  Button,
  LinearProgress,
  MenuItem,
} from '@mui/material';
import NewsList from './NewsList';

const theme = createTheme();

const countryNames = {
  ae: 'United Arab Emirates', ar: 'Argentina', at: 'Austria', au: 'Australia', be: 'Belgium', br: 'Brazil',
  ca: 'Canada', ch: 'Switzerland', cn: 'China', co: 'Colombia', cu: 'Cuba', cz: 'Czech Republic', de: 'Germany',
  eg: 'Egypt', fr: 'France', gb: 'United Kingdom', gr: 'Greece', hk: 'Hong Kong', hu: 'Hungary', id: 'Indonesia',
  ie: 'Ireland', il: 'Israel', in: 'India', it: 'Italy', jp: 'Japan', kr: 'South Korea', lt: 'Lithuania', lv: 'Latvia',
  ma: 'Morocco', mx: 'Mexico', my: 'Malaysia', ng: 'Nigeria', nl: 'Netherlands', no: 'Norway', nz: 'New Zealand', ph: 'Philippines',
  pl: 'Poland', pt: 'Portugal', ro: 'Romania', rs: 'Serbia', ru: 'Russia', sa: 'Saudi Arabia', se: 'Sweden', sg: 'Singapore', sk: 'Slovakia',
  th: 'Thailand', tr: 'Turkey', tw: 'Taiwan', ua: 'Ukraine', us: 'United States', ve: 'Venezuela', za: 'South Africa',
};

function SentimentAnalysis() {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [sentiment, setSentiment] = useState('');
  const [selectedNews, setSelectedNews] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNewsDescription, setSelectedNewsDescription] = useState('');
  const [isPopupLoading, setIsPopupLoading] = useState(false);
  const [sentimentCategory, setSentimentCategory] = useState('');
  const [indicatorPosition, setIndicatorPosition] = useState(50); // Persentase sentimen
  const [sentimentWords, setSentimentWords] = useState([]); // Daftar kata-kata dan skor sentimen
  const [selectedCategory, setSelectedCategory] = useState('business'); // Kategori berita default
  const [selectedCountry, setSelectedCountry] = useState('us'); // Negara berita default
  const [categories, setCategories] = useState([
    'business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology',
  ]);
  const [countries, setCountries] = useState([
    'ae', 'ar', 'at', 'au', 'be', 'br', 'ca', 'ch', 'cn', 'co', 'cu', 'cz', 'de', 'eg', 'fr', 'gb', 'gr', 'hk', 'hu', 'id', 'ie',
    'il', 'in', 'it', 'jp', 'kr', 'lt', 'lv', 'ma', 'mx', 'my', 'ng','nl', 'no', 'nz', 'ph', 'pl', 'pt', 'ro', 'rs', 'ru', 'sa',
    'se', 'sg', 'sk', 'th', 'tr', 'tw', 'ua', 'us', 've','za',
  ]);
  const [news, setNews] = useState([]); // State untuk menyimpan data berita

  useEffect(() => {
    // Fetch berita saat komponen pertama kali dimuat
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setIsLoading(true);
    setLoadingText('Mengambil konten berita...');

    try {
      // Ganti URL NewsAPI berdasarkan kategori dan negara yang dipilih
      const apiUrl = `https://newsapi.org/v2/top-headlines?country=${selectedCountry}&category=${selectedCategory}&apiKey=78d915850ff7426db179a6ae3b5207de`;
      const response = await axios.get(apiUrl);
      const articles = response.data.articles;
      setNews(articles); // Menyimpan data berita ke dalam state
    } catch (error) {
      console.error('Gagal mengambil konten berita:', error);
    }

    setIsLoading(false);
  };

  const handleSelectNews = (news) => {
    setSelectedNews(news);
    setText(news.description);
    setSelectedNewsDescription(news.description);
    openModal();
    analyzeSentiment();
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCategoryChange = (event) => {
    const newCategory = event.target.value;
    setSelectedCategory(newCategory);
    fetchNews();
  };

  const handleCountryChange = (event) => {
    const newCountry = event.target.value;
    setSelectedCountry(newCountry);
    fetchNews();
  };

  const analyzeSentiment = () => {
    setLoadingText('Menganalisis sentimen...');

    const API_KEY = 'AIzaSyBVbD1o9xk1IdSiXF14xxRRtmYgmNcdSAQ';
    const apiUrl = `https://language.googleapis.com/v1/documents:analyzeSentiment?key=${API_KEY}`;

    const data = {
      document: {
        type: 'PLAIN_TEXT',
        content: text,
      },
    };

    axios
      .post(apiUrl, data)
      .then((response) => {
        const sentimentScore = response.data.documentSentiment.score;
        let category;

        if (sentimentScore > 0.2) {
          category = 'Positif';
          setIndicatorPosition(70);
        } else if (sentimentScore < -0.2) {
          category = 'Negatif';
          setIndicatorPosition(30);
        } else {
          category = 'Netral';
          setIndicatorPosition(50);
        }

        setSentiment(category);
        setSentimentCategory(category);
        setIsPopupLoading(true);
        openModal();
        extractSentimentWords(response.data.tokens);
      })
      .catch((error) => {
        console.error(error);
        setIsPopupLoading(false);
      });
  };

  const extractSentimentWords = (tokens) => {
    const sentimentWords = [];

    tokens.forEach((token) => {
      if (token.sentiment && token.sentiment.magnitude !== 0) {
        sentimentWords.push({
          word: token.text.content,
          score: token.sentiment.score,
          magnitude: token.sentiment.magnitude,
        });
      }
    });

    setSentimentWords(sentimentWords);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        maxWidth="md"
        sx={{ marginTop: 4, marginLeft: 8, marginRight: 8 }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Pilih Kategori"
              variant="outlined"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
          <TextField
  select
  fullWidth
  label="Pilih Negara"
  variant="outlined"
  value={selectedCountry}
  onChange={handleCountryChange}
>
  {Object.keys(countryNames).map((countryCode) => (
    <MenuItem key={countryCode} value={countryCode}>
      {countryNames[countryCode]}
    </MenuItem>
  ))}
</TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={fetchNews}
              disabled={isLoading}
            >
              Cari Berita
            </Button>
          </Grid>
        </Grid>

        <NewsList
          onSelectNews={handleSelectNews}
          isLoading={isLoading}
          news={news} // Mengirimkan data berita ke komponen NewsList
        />

        {isLoading && (
          <Paper elevation={3} sx={{ marginTop: 3, padding: 2 }}>
            <CircularProgress />
            <Typography variant="body1" sx={{ marginTop: 1 }}>
              {loadingText}
            </Typography>
          </Paper>
        )}
      </Container>

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: 600,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 4,
            marginLeft: 8,
            marginRight: 8,
          }}
        >
          <Typography variant="h6">Deskripsi Berita:</Typography>
          <Typography variant="body1">{selectedNewsDescription}</Typography>
          {isPopupLoading ? (
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress />
              <Typography variant="body1" sx={{ marginTop: 1 }}>
                Sedang menghitung sentimen...
              </Typography>
            </Box>
          ) : (
            <>
              <Typography variant="h6" sx={{ marginTop: 2 }}>
                Sentimen:
              </Typography>
              <LinearProgress
                variant="determinate"
                value={indicatorPosition}
                sx={{
                  height: '10px',
                  borderRadius: '2px',
                  marginTop: '1px',
                  marginBottom: '1px',
                  backgroundColor: 'lightgray',
                }}
                color={
                  sentimentCategory === 'Positif'
                    ? 'success'
                    : sentimentCategory === 'Negatif'
                    ? 'error'
                    : 'warning'
                }
              />
              <Typography variant="body1">{sentimentCategory}</Typography>

              {sentimentWords.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ marginTop: 2 }}>
                    Kata-kata dan Skor Sentimen:
                  </Typography>
                  <ul>
                    {sentimentWords.map((wordData, index) => (
                      <li key={index}>
                        <strong>{wordData.word}:</strong> Skor:{' '}
                        {wordData.score.toFixed(2)}, Magnitude:{' '}
                        {wordData.magnitude.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </>
          )}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="outlined" color="warning" onClick={closeModal}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </ThemeProvider>
  );
}

export default SentimentAnalysis;
