import type { FarmerProfile, LanguageCode, AIResponse, RiskCategory } from '@/types';
import { analyzeRisk, getLocalizedReasons, getLocalizedRecommendation } from './riskEngine';
import type { WeatherData } from './weather';

interface AIContext {
  profile: FarmerProfile;
  weather: WeatherData;
  language: LanguageCode;
}

const keywords = {
  rain: ['rain', 'மழை', 'बारिश', 'rainy', 'precipitation', 'monsoon', 'பருவமழை', 'मानसून'],
  fertilizer: ['fertilizer', 'உரம்', 'खाद', 'urea', 'npk', 'compost', 'organic', 'இயற்கை உரம்', 'जैविक खाद'],
  irrigation: ['irrigate', 'water', 'நீர்ப்பாசனம்', 'सिंचाई', 'தண்ணீர்', 'पानी', 'நீர்', 'watering'],
  pest: ['pest', 'insect', 'disease', 'பூச்சி', 'कीट', 'நோய்', 'बीमारी', 'fungus', 'பூஞ்சணம்', 'कवक'],
  crop: ['crop', 'பயிர்', 'फसल', 'plant', 'செடி', 'पौधा', 'grow', 'வளர்', 'उगाना'],
  scheme: ['scheme', 'திட்டம்', 'योजना', 'government', 'அரசு', 'सरकार', 'subsidy', 'மானியம்', 'सब्सिडी', 'benefit', 'பலன்', 'लाभ'],
  harvest: ['harvest', 'அறுவடை', 'कटाई', 'அறு', 'काटना', 'yield', 'விளைச்சல்', 'उपज'],
  risk: ['risk', 'ஆபத்து', 'जोखिम', 'danger', 'அபாயம்', 'खतरा', 'problem', 'பிரச்சினை', 'समस्या'],
  sow: ['sow', 'seed', 'விதை', 'बोना', 'விதைத்தல்', 'बुवाई', 'planting', 'நடவு', 'रोपण'],
};

function matchKeywords(query: string, keys: string[]): boolean {
  const lower = query.toLowerCase();
  return keys.some((k) => lower.includes(k.toLowerCase()));
}

function detectIntent(query: string): string {
  if (matchKeywords(query, keywords.rain)) return 'rain';
  if (matchKeywords(query, keywords.fertilizer)) return 'fertilizer';
  if (matchKeywords(query, keywords.irrigation)) return 'irrigation';
  if (matchKeywords(query, keywords.pest)) return 'pest';
  if (matchKeywords(query, keywords.scheme)) return 'scheme';
  if (matchKeywords(query, keywords.harvest)) return 'harvest';
  if (matchKeywords(query, keywords.risk)) return 'risk';
  if (matchKeywords(query, keywords.sow)) return 'sow';
  if (matchKeywords(query, keywords.crop)) return 'crop';
  return 'general';
}

function riskLabel(category: RiskCategory, lang: LanguageCode): string {
  const labels = {
    low: { en: 'Low', ta: 'குறைந்த', hi: 'कम' },
    moderate: { en: 'Moderate', ta: 'மிதமான', hi: 'मध्यम' },
    high: { en: 'High', ta: 'அதிக', hi: 'उच्च' },
  };
  return labels[category][lang];
}

export function generateAIResponse(query: string, context: AIContext): AIResponse {
  const { profile, weather, language } = context;
  const intent = detectIntent(query);
  const risk = analyzeRisk({
    rainProbability: weather.rain_probability,
    temperature: weather.temperature_c,
    humidity: weather.humidity,
    windSpeed: weather.wind_speed,
    crop: profile.crop,
    cropStage: profile.crop_stage,
    soilType: profile.soil_type,
    irrigationType: profile.irrigation_type,
  });

  const reasons = getLocalizedReasons(risk.reasons, language);
  const recommendation = getLocalizedRecommendation(risk.recommendation, language);
  const riskLabelStr = riskLabel(risk.category, language);
  const cropName = profile.crop || (language === 'ta' ? 'பயிர்' : language === 'hi' ? 'फसल' : 'crop');
  const stageName = profile.crop_stage || '';

  let answer = '';
  let why = '';
  let action = '';
  let warning = '';

  switch (intent) {
    case 'rain':
      if (weather.rain_probability >= 60) {
        answer = language === 'ta'
          ? `ஆம், ${weather.rain_probability}% மழை வர வாய்ப்பு உள்ளது. உங்கள் பகுதியில் மழை எதிர்பார்க்கப்படுகிறது.`
          : language === 'hi'
            ? `हां, ${weather.rain_probability}% बारिश की संभावना है। आपके क्षेत्र में बारिश अपेक्षित है।`
            : `Yes, there is a ${weather.rain_probability}% chance of rain. Rain is expected in your area.`;
        why = language === 'ta'
          ? `வானிலை தரவு ${weather.rain_probability}% மழை நிகழ்தகவை காட்டுகிறது.`
          : language === 'hi'
            ? `मौसम डेटा ${weather.rain_probability}% बारिश संभावना दिखाता है।`
            : `Weather data shows ${weather.rain_probability}% rain probability.`;
        action = language === 'ta'
          ? 'மழைக்கு தயாராகுங்கள். வடிகால்களை சரிபார்க்கவும். உரம் போடுவதை ஒத்திவைக்கவும்.'
          : language === 'hi'
            ? 'बारिश के लिए तैयार रहें। नाली जांचें। खाद डालना टालें।'
            : 'Prepare for rain. Check drainage channels. Delay fertilizer application.';
        warning = language === 'ta'
          ? 'கனமழை எதிர்பார்க்கப்பட்டால் வெளியில் வேலை செய்ய வேண்டாம்.'
          : language === 'hi'
            ? 'भारी बारिश होने पर बाहर काम न करें।'
            : 'Avoid outdoor work if heavy rain is expected.';
      } else {
        answer = language === 'ta'
          ? `இல்லை, மழை வர வாய்ப்பு குறைவு (${weather.rain_probability}%). வறண்ட வானிலை எதிர்பார்க்கப்படுகிறது.`
          : language === 'hi'
            ? `नहीं, बारिश की संभावना कम है (${weather.rain_probability}%)। सूखा मौसम अपेक्षित है।`
            : `No, rain probability is low (${weather.rain_probability}%). Dry weather is expected.`;
        why = language === 'ta'
          ? `வானிலை தரவு குறைந்த மழை நிகழ்தகவை காட்டுகிறது.`
          : language === 'hi'
            ? `मौसम डेटा कम बारिश संभावना दिखाता है।`
            : `Weather data shows low rain probability.`;
        action = language === 'ta'
          ? 'நீர்ப்பாசனம் செய்ய திட்டமிடலாம். வயல்களை கண்காணிக்கவும்.'
          : language === 'hi'
            ? 'सिंचाई की योजना बनाएं। खेतों की निगरानी करें।'
            : 'You can plan irrigation. Monitor your fields.';
        warning = '';
      }
      break;

    case 'fertilizer':
      if (weather.rain_probability >= 60) {
        answer = language === 'ta'
          ? `இப்போது உரம் போட வேண்டாம். ${weather.rain_probability}% மழை வர வாய்ப்பு உள்ளது. உரம் அரித்து விடும்.`
          : language === 'hi'
            ? `अभी खाद न डालें। ${weather.rain_probability}% बारिश की संभावना है। खाद बह जाएगी।`
            : `Do not apply fertilizer now. ${weather.rain_probability}% rain chance means fertilizer will wash away.`;
        why = language === 'ta'
          ? `மழை உரத்தை அரித்து விடும். பணம் வீணாகும்.`
          : language === 'hi'
            ? `बारिश खाद को बहा देगी। पैसा बर्बाद होगा।`
            : `Rain will wash away fertilizer. Money will be wasted.`;
        action = language === 'ta'
          ? '48 மணிநேரம் காத்திருந்து மழை குறைந்ததும் உரம் போடவும்.'
          : language === 'hi'
            ? '48 घंटे प्रतीक्षा करें, बारिश कम होने पर खाद डालें।'
            : 'Wait 48 hours and apply fertilizer after rain subsides.';
        warning = language === 'ta'
          ? 'உரம் போட்ட பிறகு உடனடியாக மழை வந்தால் உரம் வீணாகும்.'
          : language === 'hi'
            ? 'खाद डालने के बाद तुरंत बारिश होने पर खाद बर्बाद होगी।'
            : 'Fertilizer will be wasted if rain comes immediately after application.';
      } else {
        answer = language === 'ta'
          ? `ஆம், இன்று உரம் போடலாம். மழை வாய்ப்பு குறைவு (${weather.rain_probability}%).`
          : language === 'hi'
            ? `हां, आज खाद डाल सकते हैं। बारिश संभावना कम है (${weather.rain_probability}%)।`
            : `Yes, you can apply fertilizer today. Rain probability is low (${weather.rain_probability}%).`;
        why = language === 'ta'
          ? `மழை இல்லாததால் உரம் மண்ணில் சேரும்.`
          : language === 'hi'
            ? `बारिश न होने से खाद मिट्टी में जमेगी।`
            : `No rain means fertilizer will stay in the soil.`;
        action = language === 'ta'
          ? 'மாலை வேளையில் உரம் போடவும். பிறகு மெல்ல நீர்ப்பாசனம் செய்யவும்.'
          : language === 'hi'
            ? 'शाम को खाद डालें। फिर हल्की सिंचाई करें।'
            : 'Apply fertilizer in the evening. Then irrigate lightly.';
        warning = language === 'ta'
          ? 'மண் ஈரப்பதம் சரிபார்க்கவும். அதிக உரம் பயிரை எரிக்கும்.'
          : language === 'hi'
            ? 'मिट्टी नमी जांचें। अधिक खाद फसल जला देगी।'
            : 'Check soil moisture. Excess fertilizer will burn the crop.';
      }
      break;

    case 'irrigation':
      if (weather.rain_probability >= 70) {
        answer = language === 'ta'
          ? `இப்போது நீர்ப்பாசனம் தேவையில்லை. ${weather.rain_probability}% மழை வர வாய்ப்பு உள்ளது.`
          : language === 'hi'
            ? `अभी सिंचाई की जरूरत नहीं। ${weather.rain_probability}% बारिश की संभावना है।`
            : `No irrigation needed now. ${weather.rain_probability}% rain is expected.`;
        why = language === 'ta'
          ? `மழை தண்ணீர் போதுமானதாக இருக்கும்.`
          : language === 'hi'
            ? `बारिश का पानी पर्याप्त होगा।`
            : `Rainwater will be sufficient.`;
        action = language === 'ta'
          ? 'மழைக்கு பிறகு மண் ஈரப்பதத்தை சரிபார்க்கவும்.'
          : language === 'hi'
            ? 'बारिश के बाद मिट्टी नमी जांचें।'
            : 'Check soil moisture after the rain.';
        warning = '';
      } else if (weather.humidity < 50) {
        answer = language === 'ta'
          ? `ஆம், நீர்ப்பாசனம் செய்ய வேண்டும். ஈரப்பதம் குறைவாக (${weather.humidity}%) உள்ளது.`
          : language === 'hi'
            ? `हां, सिंचाई करनी चाहिए। नमी कम (${weather.humidity}%) है।`
            : `Yes, you should irrigate. Humidity is low (${weather.humidity}%).`;
        why = language === 'ta'
          ? `குறைந்த ஈரப்பதம் பயிருக்கு தண்ணீர் தேவை என காட்டுகிறது.`
          : language === 'hi'
            ? `कम नमी फसल को पानी चाहिए दिखाती है।`
            : `Low humidity indicates the crop needs water.`;
        action = language === 'ta'
          ? 'காலை அல்லது மாலையில் நீர்ப்பாசனம் செய்யவும். நீர் வீணாகாமல் பார்த்துக்கொள்ளவும்.'
          : language === 'hi'
            ? 'सुबह या शाम को सिंचाई करें। पानी बर्बाद न हो इसका ध्यान रखें।'
            : 'Irrigate in the morning or evening. Avoid water wastage.';
        warning = language === 'ta'
          ? 'மதிய வெயிலில் நீர்ப்பாசனம் செய்ய வேண்டாம்.'
          : language === 'hi'
            ? 'दोपहर की धूप में सिंचाई न करें।'
            : 'Do not irrigate during midday heat.';
      } else {
        answer = language === 'ta'
          ? `மண் ஈரப்பதத்தை சரிபார்க்கவும். தற்போதைய ஈரப்பதம் ${weather.humidity}%.`
          : language === 'hi'
            ? `मिट्टी नमी जांचें। वर्तमान नमी ${weather.humidity}%।`
            : `Check soil moisture. Current humidity is ${weather.humidity}%.`;
        why = language === 'ta'
          ? `ஈரப்பதம் மிதமான நிலையில் உள்ளது. மண் பரிசோதனை தேவை.`
          : language === 'hi'
            ? `नमी मध्यम स्तर पर है। मिट्टी परीक्षण जरूरी।`
            : `Humidity is moderate. Soil check needed.`;
        action = language === 'ta'
          ? 'மண்ணை தோண்டி ஈரப்பதம் சரிபார்க்கவும். தேவையானால் மெல்ல நீர்ப்பாசனம் செய்யவும்.'
          : language === 'hi'
            ? 'मिट्टी खोदकर नमी जांचें। जरूरत हो तो हल्की सिंचाई करें।'
            : 'Dig the soil to check moisture. Irrigate lightly if needed.';
        warning = '';
      }
      break;

    case 'pest':
      if (weather.humidity >= 80) {
        answer = language === 'ta'
          ? `அதிக ஈரப்பதம் (${weather.humidity}%) பூஞ்சண நோய் மற்றும் பூச்சி தாக்குதல் ஆபத்தை அதிகப்படுத்துகிறது.`
          : language === 'hi'
            ? `उच्च नमी (${weather.humidity}%) कवक रोग और कीट जोखिम बढ़ाती है।`
            : `High humidity (${weather.humidity}%) increases fungal disease and pest attack risk.`;
        why = language === 'ta'
          ? `ஈரப்பதம் பூஞ்சண வளர்ச்சிக்கு சாதகம்.`
          : language === 'hi'
            ? `नमी कवक वृद्धि के अनुकूल है।`
            : `Humidity favors fungal growth.`;
        action = language === 'ta'
          ? 'பயிரை கண்காணிக்கவும். இலைகளை சரிபார்க்கவும். தேவையானால் பூஞ்சண எதிர்ப்பு மருந்து பயன்படுத்தவும்.'
          : language === 'hi'
            ? 'फसल की निगरानी करें। पत्तियां जांचें। जरूरत हो तो कवकनाशी उपयोग करें।'
            : 'Monitor the crop. Check leaves. Apply fungicide if needed.';
        warning = language === 'ta'
          ? 'பூச்சி எதி�்ப்பு மருந்து பயன்படுத்தும்போது பாதுகாப்பு உபகரணங்கள் அணியவும்.'
          : language === 'hi'
            ? 'कीटनाशक लगाते समय सुरक्षा उपकरण पहनें।'
            : 'Wear protective equipment when applying pesticides.';
      } else {
        answer = language === 'ta'
          ? `தற்போது பூச்சி தாக்குதல் ஆபத்து குறைவு. ஈரப்பதம் ${weather.humidity}%.`
          : language === 'hi'
            ? `अभी कीट जोखिम कम है। नमी ${weather.humidity}%।`
            : `Pest attack risk is currently low. Humidity is ${weather.humidity}%.`;
        why = language === 'ta'
          ? `ஈரப்பதம் பூஞ்சண வளர்ச்சிக்கு சாதகமற்றது.`
          : language === 'hi'
            ? `नमी कवक वृद्धि के प्रतिकूल है।`
            : `Humidity is not favorable for fungal growth.`;
        action = language === 'ta'
          ? 'வாரம் ஒருமுறை பயிரை சோதனை செய்யவும்.'
          : language === 'hi'
            ? 'सप्ताह में एक बार फसल निरीक्षण करें।'
            : 'Inspect the crop once a week.';
        warning = '';
      }
      break;

    case 'scheme':
      answer = language === 'ta'
        ? `உங்களுக்கு PM-KISAN (ஆண்டு ₹6,000), பயிர் காப்பீடு (PMFBY), கிசான் கிரெடிட் கார்டு மற்றும் மண் ஆரோக்கிய அட்டை போன்ற திட்டங்கள் கிடைக்கலாம். திட்டங்கள் பக்கத்தில் மேலும் விவரம் பெறலாம்.`
        : language === 'hi'
          ? `आपको PM-KISAN (₹6,000/वर्ष), फसल बीमा (PMFBY), किसान क्रेडिट कार्ड और मिट्टी स्वास्थ्य कार्ड जैसी योजनाएं मिल सकती हैं। योजनाएं पृष्ठ पर अधिक जानकारी प्राप्त करें।`
          : `You may be eligible for PM-KISAN (₹6,000/year), crop insurance (PMFBY), Kisan Credit Card, and Soil Health Card. Visit the Schemes page for more details.`;
      why = language === 'ta'
        ? `சிறு/குறுகிய விவசாயிகளுக்கு இந்த திட்டங்கள் கிடைக்கின்றன.`
        : language === 'hi'
          ? `छोटे/सीमांत किसानों के लिए ये योजनाएं उपलब्ध हैं।`
          : `These schemes are available for small/marginal farmers.`;
      action = language === 'ta'
        ? 'திட்டங்கள் பக்கத்திற்கு சென்று உங்கள் விவரங்களை உள்ளிட்டு பொருந்தும் திட்டங்களை காண்பிக்கவும்.'
        : language === 'hi'
          ? 'योजनाएं पृष्ठ पर जाकर अपना विवरण दर्ज करें और मेल खाती योजनाएं देखें।'
          : 'Go to the Schemes page, enter your details, and see matching schemes.';
      warning = language === 'ta'
        ? 'அதிகாரப்பூர்வ போர்ட்டலில் தகுதியை சரிபார்க்கவும்.'
        : language === 'hi'
          ? 'आधिकारिक पोर्टल पर पात्रता सत्यापित करें।'
          : 'Verify eligibility on the official portal.';
      break;

    case 'harvest':
      if (profile.crop_stage === 'maturity' || profile.crop_stage === 'harvest') {
        answer = language === 'ta'
          ? `உங்கள் ${cropName} அறுவடைக்கு தயாராக உள்ளது. வானிலை சாதகமாக உள்ளது.`
          : language === 'hi'
            ? `आपकी ${cropName} कटाई के लिए तैयार है। मौसम अनुकूल है।`
            : `Your ${cropName} is ready for harvest. Weather is favorable.`;
        why = language === 'ta'
          ? `பயிர் ${stageName} நிலையில் உள்ளது.`
          : language === 'hi'
            ? `फसल ${stageName} चरण में है।`
            : `Crop is at ${stageName} stage.`;
        action = language === 'ta'
          ? 'மழை இல்லாத நாளில் அறுவடை செய்யவும்.'
          : language === 'hi'
            ? 'बारिश रहित दिन में कटाई करें।'
            : 'Harvest on a rain-free day.';
        warning = '';
      } else {
        answer = language === 'ta'
          ? `உங்கள் ${cropName} இன்னும் அறுவடைக்கு தயாராக இல்லை. தற்போதைய நிலை: ${stageName}.`
          : language === 'hi'
            ? `आपकी ${cropName} अभी कटाई के लिए तैयार नहीं है। वर्तमान चरण: ${stageName}।`
            : `Your ${cropName} is not ready for harvest yet. Current stage: ${stageName}.`;
        why = language === 'ta'
          ? `பயிர் முதிர்ச்சி அடைய இன்னும் நேரம் தேவை.`
          : language === 'hi'
            ? `फसल परिपक्व होने में समय चाहिए।`
            : `The crop needs more time to mature.`;
        action = language === 'ta'
          ? 'பயிர் முதிர்ச்சி அடையும் வரை காத்திருங்கள். தற்போது பராமரிப்பு தொடரவும்.'
          : language === 'hi'
            ? 'फसल परिपक्व होने तक प्रतीक्षा करें। देखभाल जारी रखें।'
            : 'Wait until the crop matures. Continue maintenance.';
        warning = '';
      }
      break;

    case 'risk':
      answer = language === 'ta'
        ? `உங்கள் பண்ணை ஆபத்து மதிப்பெண்: ${risk.score}/100 (${riskLabelStr}). ${reasons.join(' ')}`
        : language === 'hi'
          ? `आपका फार्म जोखिम स्कोर: ${risk.score}/100 (${riskLabelStr})। ${reasons.join(' ')}`
          : `Your farm risk score: ${risk.score}/100 (${riskLabelStr}). ${reasons.join(' ')}`;
      why = reasons.join(' ');
      action = recommendation;
      warning = risk.category === 'high'
        ? (language === 'ta' ? 'உடனடியாக நடவடிக்க வேண்டும்.' : language === 'hi' ? 'तुरंत कार्रवाई करें।' : 'Immediate action required.')
        : '';
      break;

    default:
      answer = language === 'ta'
        ? `உங்கள் ${cropName} பயிர் பற்றி ஆராய்ந்தேன். தற்போதைய வானிலை: ${weather.temperature_c}°C, மழை வாய்ப்பு ${weather.rain_probability}%. ஆபத்து நிலை: ${riskLabelStr}.`
        : language === 'hi'
          ? `आपकी ${cropName} फसल का विश्लेषण किया। वर्तमान मौसम: ${weather.temperature_c}°C, बारिश संभावना ${weather.rain_probability}%। जोखिम स्तर: ${riskLabelStr}।`
          : `I analyzed your ${cropName} crop. Current weather: ${weather.temperature_c}°C, rain chance ${weather.rain_probability}%. Risk level: ${riskLabelStr}.`;
      why = reasons.join(' ') || (language === 'ta' ? 'வானிலை மற்றும் பயிர் நிலை அடிப்படையில்.' : language === 'hi' ? 'मौसम और फसल चरण के आधार पर।' : 'Based on weather and crop stage.');
      action = recommendation;
      warning = '';
      break;
  }

  return {
    answer,
    risk_level: risk.category,
    why,
    action,
    warning,
    sources: [language === 'ta' ? 'வானிலை தரவு' : language === 'hi' ? 'मौसम डेटा' : 'Weather data', language === 'ta' ? 'பயிர் சுயவிவரம்' : language === 'hi' ? 'फसल प्रोफ़ाइल' : 'Crop profile', language === 'ta' ? 'ஆபத்து பகுப்பாய்வு இயந்திரம்' : language === 'hi' ? 'जोखिम विश्लेषण इंजन' : 'Risk analysis engine'],
    is_demo: weather.is_demo,
  };
}

export function getSuggestedQuestions(lang: LanguageCode): string[] {
  const questions = {
    en: ['Will it rain tomorrow?', 'Can I apply fertilizer today?', 'What is the risk to my crop?', 'What government scheme can I get?', 'When should I irrigate my field?', 'How to prevent pest attacks?'],
    ta: ['நாளைக்கு மழை வருமா?', 'இன்று உரம் போடலாமா?', 'என் பயிருக்கு என்ன ஆபத்து?', 'எனக்கு என்ன அரசு திட்டம் கிடைக்கும்?', 'எப்போது நீர்ப்பாசனம் செய்வது?', 'பூச்சி தாக்குதலை எப்படி தடுக்க?'],
    hi: ['कल बारिश होगी?', 'आज खाद डालना सही है?', 'मेरी फसल के लिए क्या जोखिम है?', 'मुझे कौन सी सरकारी योजना मिल सकती है?', 'मुझे सिंचाई कब करनी चाहिए?', 'कीट आक्रमण कैसे रोकें?'],
  };
  return questions[lang];
}
