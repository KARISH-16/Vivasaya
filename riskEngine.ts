import type { FarmerProfile, LanguageCode, RiskCategory } from '@/types';

export function riskCategoryFromScore(score: number): RiskCategory {
  if (score >= 70) return 'high';
  if (score >= 40) return 'moderate';
  return 'low';
}

export function riskScoreFromRain(rainProb: number): number {
  return Math.round(rainProb);
}

export interface RiskInput {
  rainProbability: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  crop: string;
  cropStage: string;
  soilType: string;
  irrigationType: string;
}

export interface RiskResult {
  score: number;
  category: RiskCategory;
  reasons: { en: string; ta: string; hi: string }[];
  recommendation: { en: string; ta: string; hi: string };
  confidence: number;
}

export function analyzeRisk(input: RiskInput): RiskResult {
  const reasons: { en: string; ta: string; hi: string }[] = [];
  let score = 0;

  if (input.rainProbability >= 70) {
    score += 30;
    reasons.push({
      en: `Rain probability is high (${input.rainProbability}%)`,
      ta: `மழை நிகழ்தகவு அதிகம் (${input.rainProbability}%)`,
      hi: `बारिश संभावना अधिक है (${input.rainProbability}%)`,
    });
  } else if (input.rainProbability >= 40) {
    score += 15;
    reasons.push({
      en: `Moderate rain probability (${input.rainProbability}%)`,
      ta: `மிதமான மழை நிகழ்தகவு (${input.rainProbability}%)`,
      hi: `मध्यम बारिश संभावना (${input.rainProbability}%)`,
    });
  }

  if (input.humidity >= 80) {
    score += 15;
    reasons.push({
      en: `High humidity (${input.humidity}%) increases fungal risk`,
      ta: `அதிக ஈரப்பதம் (${input.humidity}%) பூஞ்சண ஆபத்தை அதிகப்படுத்துகிறது`,
      hi: `उच्च नमी (${input.humidity}%) कवक जोखिम बढ़ाती है`,
    });
  }

  const floweringStages = ['flowering', 'grainFilling'];
  if (floweringStages.includes(input.cropStage)) {
    score += 20;
    reasons.push({
      en: `Crop is at ${input.cropStage} stage, which is sensitive to weather`,
      ta: `பயிர் ${input.cropStage} நிலையில் உள்ளது, இது வானிலைக்கு உணர்திறன் கொண்டது`,
      hi: `फसल ${input.cropStage} चरण में है, जो मौसम के प्रति संवेदनशील है`,
    });
  }

  if (input.windSpeed >= 25) {
    score += 10;
    reasons.push({
      en: `Strong wind (${input.windSpeed} km/h) may cause lodging`,
      ta: `வலுவான காற்று (${input.windSpeed} km/h) பயிர் சாய காரணமாகலாம்`,
      hi: `तेज़ हवा (${input.windSpeed} km/h) से फसल गिर सकती है`,
    });
  }

  if (input.temperature >= 38) {
    score += 15;
    reasons.push({
      en: `High temperature (${input.temperature}°C) causes heat stress`,
      ta: `அதிக வெப்பநிலை (${input.temperature}°C) வெப்ப அழுத்தத்தை ஏற்படுத்துகிறது`,
      hi: `उच्च तापमान (${input.temperature}°C) गर्मी तनाव देता है`,
    });
  }

  if (input.soilType === 'clay' && input.rainProbability >= 60) {
    score += 10;
    reasons.push({
      en: 'Clay soil retains water, increasing waterlogging risk',
      ta: 'களிமண் நீரை தக்க வைக்கிறது, நீர்த்தேக்கு ஆபத்தை அதிகப்படுத்துகிறது',
      hi: 'चिकनी मिट्टी पानी रोकती है, जलभराव जोखिम बढ़ाती है',
    });
  }

  score = Math.min(score, 100);
  const category = riskCategoryFromScore(score);
  const confidence = Math.min(0.55 + (reasons.length * 0.08), 0.95);

  let recommendation: { en: string; ta: string; hi: string };
  if (category === 'high') {
    recommendation = {
      en: 'Delay field operations for 48 hours. Monitor weather updates and protect crops from heavy rain.',
      ta: '48 மணிநேரம் வயல்வேலைகளை ஒத்திவைக்கவும். வானிலை புதுப்பிப்புகளை கண்காணித்து பயிர்களை கனமழையிலிருந்து பாதுகாக்கவும்.',
      hi: '48 घंटे तक खेत के काम टालें। मौसम अपडेट की निगरानी करें और फसलों को भारी बारिश से बचाएं।',
    };
  } else if (category === 'moderate') {
    recommendation = {
      en: 'Proceed with caution. Check weather forecast before applying inputs.',
      ta: 'எச்சரிக்கையுடன் தொடரவும். உள்ளீடுகளை பயன்படுத்துவதற்கு முன் வானிலை கணிப்பை சரிபார்க்கவும்.',
      hi: 'सावधानी से आगे बढ़ें। इनपुट लागू करने से पहले मौसम पूर्वानुमान जांचें।',
    };
  } else {
    recommendation = {
      en: 'Conditions are favorable. Proceed with planned field operations.',
      ta: 'நிபந்தரைகள் சாதகமாக உள்ளன. திட்டமிட்ட வயல்வேலைகளை தொடரவும்.',
      hi: 'परिस्थितियां अनुकूल हैं। योजित खेत कार्य जारी रखें।',
    };
  }

  return { score, category, reasons, recommendation, confidence };
}

export function getLocalizedReasons(reasons: { en: string; ta: string; hi: string }[], lang: LanguageCode): string[] {
  return reasons.map((r) => r[lang] || r.en);
}

export function getLocalizedRecommendation(rec: { en: string; ta: string; hi: string }, lang: LanguageCode): string {
  return rec[lang] || rec.en;
}

export function getProfileRisk(profile: FarmerProfile, weather: { rainProbability: number; temperature: number; humidity: number; windSpeed: number }): RiskResult {
  return analyzeRisk({
    rainProbability: weather.rainProbability,
    temperature: weather.temperature,
    humidity: weather.humidity,
    windSpeed: weather.windSpeed,
    crop: profile.crop,
    cropStage: profile.crop_stage,
    soilType: profile.soil_type,
    irrigationType: profile.irrigation_type,
  });
}
