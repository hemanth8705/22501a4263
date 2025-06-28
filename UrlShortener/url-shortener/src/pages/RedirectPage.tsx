import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

export default function RedirectPage() {
  const { shortcode } = useParams();

  useEffect(() => {
    const data = localStorage.getItem('shortenedUrls');
    const mappings = data ? JSON.parse(data) : [];

    const index = mappings.findIndex((item: any) => item.shortCode === shortcode);

    if (index !== -1) {
      const click = {
        time: new Date().toISOString(),
        source: document.referrer || 'Direct',
        location: '🌍 Unknown', // fake for now
      };

      mappings[index].clicks = [...(mappings[index].clicks || []), click];

      localStorage.setItem('shortenedUrls', JSON.stringify(mappings));

      // Redirect
      window.location.href = mappings[index].originalUrl;
    } else {
      document.body.innerHTML = '❌ Short URL not found or expired.';
    }
  }, [shortcode]);

  return <p>🔁 Redirecting...</p>;
}
