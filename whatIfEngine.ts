import type { WhatIfOption, LanguageCode } from '@/types';
import type { WeatherData } from './weather';
import type { FarmerProfile } from '@/types';
import { analyzeRisk } from './riskEngine';

export interface WhatIfInput {
  scenario: string;
  optionALabel: string;
  optionBLabel: string;
  weather: WeatherData;
  profile: FarmerProfile;
  language: LanguageCode;
}

export interface WhatIfResult {
  option_a: WhatIfOption;
  option_b: WhatIfOption;
  recommendation: string;
}

function buildOption(
  label: string,
  delayDays: number,
  weather: WeatherData,
  profile: FarmerProfile,
  language: LanguageCode,
  actionType: string
): WhatIfOption {
  const futureRain = weather.forecast[delayDays]?.rain_probability ?? weather.rain_probability;
  const futureTemp = weather.forecast[delayDays]?.temp_max ?? weather.temperature_c;

  const risk = analyzeRisk({
    rainProbability: delayDays === 0 ? weather.rain_probability : futureRain,
    temperature: delayDays === 0 ? weather.temperature_c : futureTemp,
    humidity: weather.humidity,
    windSpeed: weather.wind_speed,
    crop: profile.crop,
    cropStage: profile.crop_stage,
    soilType: profile.soil_type,
    irrigationType: profile.irrigation_type,
  });

  let weatherImpact = '';
  let costImpact = '';
  let potentialBenefit = '';
  let recommendation = '';

  if (actionType === 'fertilizer') {
    if (delayDays === 0 && weather.rain_probability >= 60) {
      weatherImpact = language === 'ta'
        ? `மழை வாய்ப்பு ${weather.rain_probability}% - உரம் அரிக்கப்படும்`
        : language === 'hi'
          ? `बारिश संभावना ${weather.rain_probability}% - खाद बह जाएगी`
          : `Rain chance ${weather.rain_probability}% - fertilizer will wash away`;
      costImpact = language === 'ta' ? 'அதிக (உரம் வீண்)' : language === 'hi' ? 'उच्च (खाद बर्बाद)' : 'High (wasted fertilizer)';
      potentialBenefit = language === 'ta' ? 'குறைவு' : language === 'hi' ? 'कम' : 'Low';
      recommendation = language === 'ta' ? 'தவிர்க்கவும்' : language === 'hi' ? 'टालें' : 'Avoid';
    } else if (delayDays > 0 && futureRain < 40) {
      weatherImpact = language === 'ta'
        ? `${delayDays} நாட்கள் பிறகு மழை வாய்ப்பு ${futureRain}% - சாதகம்`
        : language === 'hi'
          ? `${delayDays} दिन बाद बारिश संभावना ${futureRain}% - अनुकूल`
          : `${delayDays} days later rain chance ${futureRain}% - favorable`;
      costImpact = language === 'ta' ? 'மிதமான' : language === 'hi' ? 'मध्यम' : 'Medium';
      potentialBenefit = language === 'ta' ? 'அதிகம்' : language === 'hi' ? 'अधिक' : 'High';
      recommendation = language === 'ta' ? 'சிறந்த விருப்பம்' : language === 'hi' ? 'बेहतर विकल्प' : 'Better option';
    } else {
      weatherImpact = language === 'ta'
        ? `மழை வாய்ப்பு ${delayDays === 0 ? weather.rain_probability : futureRain}%`
        : language === 'hi'
          ? `बारिश संभावना ${delayDays === 0 ? weather.rain_probability : futureRain}%`
          : `Rain chance ${delayDays === 0 ? weather.rain_probability : futureRain}%`;
      costImpact = language === 'ta' ? 'மிதமான' : language === 'hi' ? 'मध्यम' : 'Medium';
      potentialBenefit = language === 'ta' ? 'மிதமான' : language === 'hi' ? 'मध्यम' : 'Medium';
      recommendation = language === 'ta' ? 'கவனமாக செய்யவும்' : language === 'hi' ? 'सावधानी से करें' : 'Proceed with caution';
    }
  } else if (actionType === 'irrigate') {
    if (delayDays === 0 && weather.rain_probability >= 70) {
      weatherImpact = language === 'ta'
        ? `மழை வர வாய்ப்பு ${weather.rain_probability}% - நீர்ப்பாசனம் தேவையில்லை`
        : language === 'hi'
          ? `बारिश संभावना ${weather.rain_probability}% - सिंचाई अनावश्यक`
          : `Rain chance ${weather.rain_probability}% - irrigation unnecessary`;
      costImpact = language === 'ta' ? 'வீண் செலவு' : language === 'hi' ? 'बर्बादी' : 'Wasted cost';
      potentialBenefit = language === 'ta' ? 'இல்லை' : language === 'hi' ? 'नहीं' : 'None';
      recommendation = language === 'ta' ? 'தவிர்க்கவும்' : language === 'hi' ? 'टालें' : 'Avoid';
    } else if (delayDays > 0) {
      weatherImpact = language === 'ta'
        ? `${delayDays} நாட்கள் காத்திருந்து மழை பெறலாம்`
        : language === 'hi'
          ? `${delayDays} दिन प्रतीक्षा कर बारिश पाएं`
          : `Wait ${delayDays} days for rain`;
      costImpact = language === 'ta' ? 'குறைவு' : language === 'hi' ? 'कम' : 'Low';
      potentialBenefit = language === 'ta' ? 'நீர் சேமிப்பு' : language === 'hi' ? 'जल बचत' : 'Water saving';
      recommendation = language === 'ta' ? 'சிறந்த விருப்பம்' : language === 'hi' ? 'बेहतर विकल्प' : 'Better option';
    } else {
      weatherImpact = language === 'ta'
        ? `மழை வாய்ப்பு ${weather.rain_probability}%`
        : language === 'hi'
          ? `बारिश संभावना ${weather.rain_probability}%`
          : `Rain chance ${weather.rain_probability}%`;
      costImpact = language === 'ta' ? 'மிதமான' : language === 'hi' ? 'मध्यम' : 'Medium';
      potentialBenefit = language === 'ta' ? 'பயிர் பாதுகாப்பு' : language === 'hi' ? 'फसल सुरक्षा' : 'Crop protection';
      recommendation = language === 'ta' ? 'தேவையானால் செய்யவும்' : language === 'hi' ? 'जरूरत हो तो करें' : 'Proceed if needed';
    }
  } else if (actionType === 'harvest') {
    if (delayDays === 0 && weather.rain_probability < 30) {
      weatherImpact = language === 'ta'
        ? `மழை இல்லை - அறுவடைக்கு சாதகம்`
        : language === 'hi'
          ? `बारिश नहीं - कटाई के अनुकूल`
          : `No rain - favorable for harvest`;
      costImpact = language === 'ta' ? 'குறைவு' : language === 'hi' ? 'कम' : 'Low';
      potentialBenefit = language === 'ta' ? 'உடனடி வருவாய்' : language === 'hi' ? 'तत्काल आय' : 'Immediate income';
      recommendation = language === 'ta' ? 'சிறந்த விருப்பம்' : language === 'hi' ? 'बेहतर विकल्प' : 'Better option';
    } else if (delayDays > 0) {
      weatherImpact = language === 'ta'
        ? `${delayDays} நாட்கள் பிறகு மழை வாய்ப்பு ${futureRain}%`
        : language === 'hi'
          ? `${delayDays} दिन बाद बारिश संभावना ${futureRain}%`
          : `${delayDays} days later rain chance ${futureRain}%`;
      costImpact = language === 'ta' ? 'மிதமான' : language === 'hi' ? 'मध्यम' : 'Medium';
      potentialBenefit = language === 'ta' ? 'விளைச்சல் அதிகரிப்பு' : language === 'hi' ? 'उपज वृद्धि' : 'Yield increase';
      recommendation = futureRain < 30
        ? (language === 'ta' ? 'காத்திருக்கலாம்' : language === 'hi' ? 'प्रतीक्षा करें' : 'Can wait')
        : (language === 'ta' ? 'தவிர்க்கவும்' : language === 'hi' ? 'टालें' : 'Avoid');
    } else {
      weatherImpact = language === 'ta'
        ? `மழை வாய்ப்பு ${weather.rain_probability}%`
        : language === 'hi'
          ? `बारिश संभावना ${weather.rain_probability}%`
          : `Rain chance ${weather.rain_probability}%`;
      costImpact = language === 'ta' ? 'மிதமான' : language === 'hi' ? 'मध्यम' : 'Medium';
      potentialBenefit = language === 'ta' ? 'மிதமான' : language === 'hi' ? 'मध्यम' : 'Medium';
      recommendation = language === 'ta' ? 'கவனமாக செய்யவும்' : language === 'hi' ? 'सावधानी से करें' : 'Proceed with caution';
    }
  } else {
    weatherImpact = language === 'ta'
      ? `மழை வாய்ப்பு ${delayDays === 0 ? weather.rain_probability : futureRain}%`
      : language === 'hi'
        ? `बारिश संभावना ${delayDays === 0 ? weather.rain_probability : futureRain}%`
        : `Rain chance ${delayDays === 0 ? weather.rain_probability : futureRain}%`;
    costImpact = language === 'ta' ? 'மிதமான' : language === 'hi' ? 'मध्यम' : 'Medium';
    potentialBenefit = language === 'ta' ? 'மிதமான' : language === 'hi' ? 'मध्यम' : 'Medium';
    recommendation = risk.score < 50
      ? (language === 'ta' ? 'செய்யலாம்' : language === 'hi' ? 'कर सकते हैं' : 'Proceed')
      : (language === 'ta' ? 'தவிர்க்கவும்' : language === 'hi' ? 'टालें' : 'Avoid');
  }

  return {
    label,
    risk_score: risk.score,
    weather_impact: weatherImpact,
    cost_impact: costImpact,
    potential_benefit: potentialBenefit,
    recommendation,
  };
}

export function simulateWhatIf(input: WhatIfInput): WhatIfResult {
  const scenarioLower = input.scenario.toLowerCase();
  let actionType = 'general';
  let delayA = 0;
  let delayB = 3;

  if (scenarioLower.includes('fertil') || scenarioLower.includes('உர') || scenarioLower.includes('खाद')) {
    actionType = 'fertilizer';
  } else if (scenarioLower.includes('irrigat') || scenarioLower.includes('நீர்') || scenarioLower.includes('सिंच')) {
    actionType = 'irrigate';
  } else if (scenarioLower.includes('harvest') || scenarioLower.includes('அறு') || scenarioLower.includes('कटाई')) {
    actionType = 'harvest';
  } else if (scenarioLower.includes('pest') || scenarioLower.includes('பூச்சி') || scenarioLower.includes('कीट')) {
    actionType = 'pesticide';
    delayB = 2;
  }

  const option_a = buildOption(input.optionALabel || 'Option A', delayA, input.weather, input.profile, input.language, actionType);
  const option_b = buildOption(input.optionBLabel || 'Option B', delayB, input.weather, input.profile, input.language, actionType);

  let recommendation = '';
  if (option_a.risk_score < option_b.risk_score) {
    recommendation = input.language === 'ta'
      ? `${input.optionALabel || 'A'} சிறந்த விருப்பம் (ஆபத்து ${option_a.risk_score} vs ${option_b.risk_score})`
      : input.language === 'hi'
        ? `${input.optionALabel || 'A'} बेहतर विकल्प (जोखिम ${option_a.risk_score} vs ${option_b.risk_score})`
        : `${input.optionALabel || 'A'} is the better option (risk ${option_a.risk_score} vs ${option_b.risk_score})`;
  } else {
    recommendation = input.language === 'ta'
      ? `${input.optionBLabel || 'B'} சிறந்த விருப்பம் (ஆபத்து ${option_b.risk_score} vs ${option_a.risk_score})`
      : input.language === 'hi'
        ? `${input.optionBLabel || 'B'} बेहतर विकल्प (जोखिम ${option_b.risk_score} vs ${option_a.risk_score})`
        : `${input.optionBLabel || 'B'} is the better option (risk ${option_b.risk_score} vs ${option_a.risk_score})`;
  }

  return { option_a, option_b, recommendation };
}
