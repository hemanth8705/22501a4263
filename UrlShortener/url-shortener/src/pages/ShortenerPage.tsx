import { useState , useEffect } from 'react';
import { Link } from 'react-router-dom';
import { log } from "../../../../logging-middleware/src/logger";


type UrlInput = {
  id: number;
  longUrl: string;
  validityMinutes: string;
  customCode: string;
};

export default function ShortenerPage() {

    type ClickData = {
    time: string;
    source: string;
    location: string; // fake it
    };

type ShortenedResult = {
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  expiry: string;
  clicks: ClickData[];
};



    const [results, setResults] = useState<ShortenedResult[]>([]);
    const baseUrl = 'http://localhost:3000';

    useEffect(() => {
    const saved =localStorage.getItem('shortenedUrls');
    if (saved) setResults(JSON.parse(saved));
    }, []);



  const [urlInputs, setUrlInputs] = useState<UrlInput[]>([
    { id: Date.now(), longUrl: '', validityMinutes: '', customCode: '' },
  ]);


  const handleChange = (id: number, field: keyof UrlInput, value: string) => {
    setUrlInputs(prev =>
      prev.map(input =>
        input.id === id ? { ...input, [field]: value } : input
      )
    );
  };

  const addRow = () => {
    if (urlInputs.length >= 5) return;
    setUrlInputs(prev => [
      ...prev,
      { id: Date.now(), longUrl: '', validityMinutes: '', customCode: '' },
    ]);
  };

  const removeRow = (id: number) => {
    setUrlInputs(prev => prev.filter(input => input.id !== id));
  };

    const isValidUrl = (url: string) => {
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
    };

    const generateShortCode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
    };


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const usedCodes = new Set(results.map(r => r.shortCode));
  const newResults: ShortenedResult[] = [];

  for (const input of urlInputs) {
    // 1. Validate
    if (!isValidUrl(input.longUrl)) {
      await log({
        stack: "frontend",
        level: "error",
        package: "utils",
        message: `Invalid URL submitted: ${input.longUrl}`,
      });
      alert("Please enter a valid URL: " + input.longUrl);
      return;
    }

    // 2. Log valid submission
    await log({
      stack: "frontend",
      level: "info",
      package: "page",
      message: `User submitted URL: ${input.longUrl}`,
    });

    // 3. Generate shortcode
    let shortCode = input.customCode || generateShortCode();

    // Ensure shortcode is unique
    if (usedCodes.has(shortCode)) {
      alert(`Shortcode "${shortCode}" already exists.`);
      return;
    }

    usedCodes.add(shortCode);

    // 4. Calculate expiry
    const expiryMinutes = parseInt(input.validityMinutes) || 30;
    const expiry = new Date(Date.now() + expiryMinutes * 60000).toISOString();

    newResults.push({
      originalUrl: input.longUrl,
      shortCode,
      shortUrl: `${baseUrl}/${shortCode}`,
      expiry,
      clicks: [],
    });
  }

  const allResults = [...results, ...newResults];
  setResults(allResults);
  localStorage.setItem("shortenedUrls", JSON.stringify(allResults));
};


  return (
    <div style={{ padding: '2rem' }}>
      <h1>URL Shortener</h1>
      <Link to="/stats">
        <button style={{ marginTop: '1rem' }}>📊 View Stats</button>
        </Link>

      <form onSubmit={handleSubmit}>
        {urlInputs.map((input, index) => (
          <div
            key={input.id}
            style={{
              marginBottom: '1rem',
              padding: '1rem',
              border: '1px solid #ccc',
              borderRadius: '8px',
            }}
          >
            <h3>URL #{index + 1}</h3>

            <input
              type="text"
              placeholder="Enter Long URL"
              value={input.longUrl}
              onChange={e => handleChange(input.id, 'longUrl', e.target.value)}
              style={{ width: '100%', marginBottom: '0.5rem' }}
            />

            <input
              type="text"
              placeholder="Validity (minutes, optional)"
              value={input.validityMinutes}
              onChange={e =>
                handleChange(input.id, 'validityMinutes', e.target.value)
              }
              style={{ width: '100%', marginBottom: '0.5rem' }}
            />

            <input
              type="text"
              placeholder="Custom Shortcode (optional)"
              value={input.customCode}
              onChange={e =>
                handleChange(input.id, 'customCode', e.target.value)
              }
              style={{ width: '100%', marginBottom: '0.5rem' }}
            />

            {urlInputs.length > 1 && (
              <button
                type="button"
                onClick={() => removeRow(input.id)}
                style={{
                  backgroundColor: '#ff4d4f',
                  color: 'white',
                  padding: '0.3rem 1rem',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Remove
              </button>
            )}
          </div>
        ))}

        {urlInputs.length < 5 && (
          <button
            type="button"
            onClick={addRow}
            style={{
              marginBottom: '1rem',
              padding: '0.5rem 1rem',
              border: '1px solid #aaa',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            ➕ Add URL
          </button>
        )}

        <br />

        <button
          type="submit"
          style={{
            padding: '0.7rem 1.5rem',
            backgroundColor: '#1677ff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Shorten URLs
        </button>
      </form>

      {results.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
            <h2>Shortened URLs</h2>
            {results.map((res, index) => (
            <div
                key={index}
                style={{
                padding: '1rem',
                marginBottom: '1rem',
                border: '1px solid #ccc',
                borderRadius: '8px',
                }}
            >
                <p><strong>Original URL:</strong> {res.originalUrl}</p>
                <p><strong>Short URL:</strong> 
                <a href={res.shortUrl} target="_blank" rel="noreferrer">
                    {res.shortUrl}
                </a>
                </p>
                <p><strong>Expires at:</strong> {new Date(res.expiry).toLocaleString()}</p>
            </div>
            ))}
        </div>
        )}

    </div>
  );
}
