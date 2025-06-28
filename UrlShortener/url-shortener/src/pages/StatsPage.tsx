import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  Divider,
  Link as MuiLink,
} from '@mui/material';

type ClickData = {
  time: string;
  source: string;
  location: string;
};

type ShortenedResult = {
  originalUrl: string;
  shortCode: string;
  expiry: string;
  clicks: ClickData[];
};

export default function StatsPage() {
  const [data, setData] = useState<ShortenedResult[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('shortenedUrls');
    if (stored) setData(JSON.parse(stored));
  }, []);

  return (
    <Container maxWidth="md" sx={{ paddingTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        📊 URL Shortener Stats
      </Typography>

      {data.length === 0 ? (
        <Typography>No shortened URLs found.</Typography>
      ) : (
        data.map((item, index) => (
          <Card key={index} variant="outlined" sx={{ marginBottom: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🔗 Short URL:{' '}
                <MuiLink
                  href={`/${item.shortCode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {window.location.origin}/{item.shortCode}
                </MuiLink>
              </Typography>

              <Typography variant="body1">
                📍 Original URL: {item.originalUrl}
              </Typography>
              <Typography variant="body2">
                ⏳ Expires: {new Date(item.expiry).toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ marginBottom: 2 }}>
                🖱️ Total Clicks: {item.clicks?.length || 0}
              </Typography>

              {item.clicks?.length > 0 && (
                <>
                  <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                    🧾 Click History:
                  </Typography>
                  <List dense>
                    {item.clicks.map((click, i) => (
                      <div key={i}>
                        <ListItem>
                          🕒 {new Date(click.time).toLocaleString()} | 🌐{' '}
                          {click.source} | 📍 {click.location}
                        </ListItem>
                        {i !== item.clicks.length - 1 && <Divider />}
                      </div>
                    ))}
                  </List>
                </>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
}
