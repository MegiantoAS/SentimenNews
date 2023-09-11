import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Grid,
  Container,
  CardMedia,
} from '@mui/material';

function NewsList({ onSelectNews, isLoading, news }) {
  return (
    <Container maxWidth="lg" sx={{ marginTop: 4, marginBottom: 4 }}>
      <Grid container spacing={3}>
        {news.map((article, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={article.urlToImage}
                alt={article.title}
              />
              <CardContent>
                <Typography variant="h6">{article.title}</Typography>
                <Typography variant="body2">{article.description}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  onClick={() => onSelectNews(article)}
                  variant="contained"
                  color="success"
                  disabled={isLoading}
                >
                  Deteksi Sentimen Berita Ini
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default NewsList;
