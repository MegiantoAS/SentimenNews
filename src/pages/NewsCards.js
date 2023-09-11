import React from 'react';
import { Grid, Card, CardContent, CardMedia, Box, Typography, SvgIcon } from '@mui/material';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';


function NewsCard({ article }) {
  return (
    <Grid item xs={12} md={4} key={article.url}>
      <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
        <Card style={{ cursor: 'pointer', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
          <CardMedia
            component="img"
            height="200"
            image={article.urlToImage || '/placeholder-image.jpg'}
            alt={article.title}
            style={{ objectFit: 'cover' }}
          />
          <CardContent>
            <Typography variant="h6">{article.title}</Typography>
            <Typography variant="body2">
              {article.description}
            </Typography>
            {article.sentiment && (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                mt={2}
                style={{
                  backgroundColor:
                    article.sentiment === 'Positif'
                      ? 'green'
                      : article.sentiment === 'Negatif'
                      ? 'red'
                      : 'orange',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                }}
              >
                {article.sentiment === 'Positif' && (
                  <>
                    <SvgIcon component={SentimentSatisfiedIcon} style={{ marginRight: '8px' }} />
                    Konten ini memuat berita {article.sentiment}. Selamat membaca.
                  </>
                )}
                {article.sentiment === 'Negatif' && (
                  <>
                    <SvgIcon component={SentimentVeryDissatisfiedIcon} style={{ marginRight: '8px' }} />
                    Konten ini memuat berita {article.sentiment}. Mengandung unsur sara, budaya, agama yang sensitif. Pastikan bijak dalam membaca.
                  </>
                )}
                {article.sentiment === 'Netral' && (
                  <>
                    <SvgIcon component={SentimentDissatisfiedIcon} style={{ marginRight: '8px' }} />
                    Konten ini memuat berita {article.sentiment}. Harap bijak dalam membaca.
                  </>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      </a>
    </Grid>
  );
}

export default NewsCard;