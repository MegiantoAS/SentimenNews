import React, { useEffect } from 'react';
import { Card, CardContent, CardMedia, Typography} from '@mui/material';

function TopNews({ topNews, sliderIndex, handleSliderPrev, handleSliderChange, handleSliderNext }) {
  useEffect(() => {
    const intervalId = setInterval(autoSlide, 9000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const autoSlide = () => {
    handleSliderNext();
  };

  return (
    <div style={{ marginBottom: '1rem', position: 'relative' }}>
      {topNews.length > 0 && (
        <Card
          component="a"
          href={topNews[sliderIndex]?.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            cursor: 'pointer',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <CardMedia
            component="img"
            height="300"
            image={
              topNews[sliderIndex]?.urlToImage ||
              '/placeholder-image.jpg'
            }
            alt={topNews[sliderIndex]?.title}
            style={{
              objectFit: 'cover',
            }}
          />
          <CardContent
            style={{
              position: 'absolute',
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
            }}
          >
            <Typography variant="h4">
              {topNews[sliderIndex]?.title}
            </Typography>
            <Typography variant="body2">
              {topNews[sliderIndex]?.description}
            </Typography>
            {topNews[sliderIndex]?.sentiment && (
              <Typography variant="body2">
                Konten ini termasuk berita yang {topNews[sliderIndex]?.sentiment} pastikan bijak dalam membaca informasi.
              </Typography>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default TopNews;
