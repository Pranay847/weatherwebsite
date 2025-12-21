export async function fetchWeatherData(city, desiredUnits = 'metric', apiKey) {
  if (!city) throw new Error('No city provided');
  if (!apiKey) throw new Error('Missing OpenWeather API key');
  const base = 'https://api.openweathermap.org/data/2.5';
  const params = `?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${desiredUnits}`;

  const [curRes, foreRes] = await Promise.all([
    fetch(`${base}/weather${params}`),
    fetch(`${base}/forecast${params}`),
  ]);

  if (!curRes.ok) {
    const err = await curRes.json().catch(() => ({}));
    throw new Error(err.message || 'City not found');
  }

  const curData = await curRes.json();
  const foreData = foreRes.ok ? await foreRes.json() : null;

  return { curData, foreData };
}
