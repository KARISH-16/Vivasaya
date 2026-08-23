import type { WeatherSnapshot, WeatherDay, LanguageCode } from '@/types';

export interface WeatherData {
  temperature_c: number;
  rain_probability: number;
  humidity: number;
  wind_speed: number;
  condition: string;
  forecast: WeatherDay[];
  is_demo: boolean;
  location: string;
}

const conditionMap: Record<string, { en: string; ta: string; hi: string }> = {
  sunny: { en: 'Sunny', ta: 'மின்னும்', hi: 'धूप' },
  cloudy: { en: 'Cloudy', ta: 'மேகமூட்டம்', hi: 'बादल' },
  rainy: { en: 'Rainy', ta: 'மழை', hi: 'बारिश' },
  partlyCloudy: { en: 'Partly Cloudy', ta: 'பகுதி மேகமூட்டம்', hi: 'आंशिक बादल' },
  thunderstorm: { en: 'Thunderstorm', ta: 'இடியுடன் கூடிய மழை', hi: 'गरज के साथ बारिश' },
  clear: { en: 'Clear', ta: 'தெளிவான', hi: 'साफ़' },
};

export function getLocalizedCondition(condition: string, lang: LanguageCode): string {
  return conditionMap[condition]?.[lang] || condition;
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function generateDemoWeather(location: string): WeatherData {
  const seed = hashString(location || 'default');
  const rand = seededRandom(seed);

  const conditions = ['sunny', 'partlyCloudy', 'cloudy', 'rainy', 'clear'];
  const condition = conditions[Math.floor(rand() * conditions.length)];

  const temperature = Math.round(25 + rand() * 15);
  const rainProbability = Math.round(rand() * 100);
  const humidity = Math.round(40 + rand() * 50);
  const windSpeed = Math.round(5 + rand() * 25);

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const forecast: WeatherDay[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dayName = dayNames[date.getDay()];
    const dayRand = seededRandom(seed + i)();
    forecast.push({
      day: dayName,
      temp_max: Math.round(28 + dayRand * 12),
      temp_min: Math.round(18 + dayRand * 8),
      rain_probability: Math.round(dayRand * 100),
      condition: conditions[Math.floor(dayRand * conditions.length)],
    });
  }

  return {
    temperature_c: temperature,
    rain_probability: rainProbability,
    humidity,
    wind_speed: windSpeed,
    condition,
    forecast,
    is_demo: true,
    location: location || 'Unknown',
  };
}

export function weatherFromSnapshot(snap: WeatherSnapshot): WeatherData {
  return {
    temperature_c: Number(snap.temperature_c),
    rain_probability: Number(snap.rain_probability),
    humidity: Number(snap.humidity),
    wind_speed: Number(snap.wind_speed),
    condition: snap.condition,
    forecast: snap.forecast || [],
    is_demo: snap.is_demo,
    location: snap.location,
  };
}

export function weatherRiskScore(weather: WeatherData): number {
  let score = 0;
  if (weather.rain_probability >= 70) score += 40;
  else if (weather.rain_probability >= 40) score += 20;

  if (weather.condition === 'thunderstorm') score += 30;
  else if (weather.condition === 'rainy') score += 20;

  if (weather.wind_speed >= 25) score += 20;
  if (weather.temperature_c >= 38) score += 15;
  if (weather.humidity >= 85) score += 10;

  return Math.min(score, 100);
}
