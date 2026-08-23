import type { GovernmentScheme, FarmerType, LanguageCode } from '@/types';

export const GOVERNMENT_SCHEMES: GovernmentScheme[] = [
  {
    id: 'pmkisan',
    name: {
      en: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
      ta: 'பிஎம்-கிசான் (பிரதான மந்திரி கிசான் சம்மான் நிதி)',
      hi: 'पीएम-किसान (प्रधानमंत्री किसान सम्मान निधि)',
    },
    purpose: {
      en: 'Income support of ₹6,000 per year to small and marginal farmers in three installments.',
      ta: 'ஆண்டுக்கு ₹6,000 வருவாய் ஆதரவு சிறு மற்றும் குறுகிய விவசாயிகளுக்கு மூன்று தவணைகளில்.',
      hi: 'छोटे और सीमांत किसानों को तीन किस्तों में ₹6,000 प्रति वर्ष आय सहायता।',
    },
    eligibility: {
      en: 'Small and marginal farmers holding cultivable land. Institutional farmers, income taxpayers, and serving/retired government employees above Group D are excluded.',
      ta: 'சாகுபடி நிலம் கொண்ட சிறு மற்றும் குறுகிய விவசாயிகள். நிறுவன விவசாயிகள், வருமான வரி செலுத்துவோர், மற்றும் D குழுக்கு மேல் அரசு ஊழியர்கள் தவிர்க்கப்படுகிறார்கள்.',
      hi: 'कृषि योग्य भूमि रखने वाले छोटे और सीमांत किसान। संस्थागत किसान, आयकरदाता, और ग्रुप D से ऊपर के सरकारी कर्मचारी बाहर हैं।',
    },
    documents: {
      en: 'Aadhaar card, land records (patta/chitta), bank account details.',
      ta: 'ஆதார் அட்டை, நில பதிவேடுகள் (பட்டா/சிட்டா), வங்கி கணக்கு விவரங்கள்.',
      hi: 'आधार कार्ड, भूमि रिकॉर्ड (पट्टा/चिट्ठा), बैंक खाता विवरण।',
    },
    steps: {
      en: '1. Visit pmkisan.gov.in\n2. Click "New Farmer Registration"\n3. Enter Aadhaar and land details\n4. Verify with OTP\n5. Submit to your nearest Common Service Center',
      ta: '1. pmkisan.gov.in செல்லவும்\n2. "புதிய விவசாயி பதிவு" சொடுக்கு\n3. ஆதார் மற்றும் நில விவரங்களை உள்ளிடவும்\n4. OTP மூலம் சரிபார்க்கவும்\n5. அருகில் உள்ள பொது சேவை மையத்தில் சமர்ப்பிக்கவும்',
      hi: '1. pmkisan.gov.in पर जाएं\n2. "न्यू फार्मर रजिस्ट्रेशन" पर क्लिक करें\n3. आधार और भूमि विवरण दर्ज करें\n4. OTP से सत्यापित करें\n5. निकटतम कॉमन सर्विस सेंटर पर जमा करें',
    },
    link: 'https://pmkisan.gov.in',
    states: [],
    farmer_types: ['small', 'marginal'],
    categories: ['income'],
  },
  {
    id: 'pmfby',
    name: {
      en: 'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
      ta: 'பிஎம்எஃப்பைஒய் (பிரதான மந்திரி பசல் பீமா யோஜனா)',
      hi: 'पीएमएफबीवाई (प्रधानमंत्री फसल बीमा योजना)',
    },
    purpose: {
      en: 'Crop insurance against natural calamities, pests, and diseases at low premium rates.',
      ta: 'இயற்கை சீற்றங்கள், பூச்சிகள் மற்றும் நோய்களுக்கு எதிராக குறைந்த பிரீமியத்தில் பயிர் காப்பீடு.',
      hi: 'प्राकृतिक आपदाओं, कीटों और बीमारियों के खिलाफ कम प्रीमियम पर फसल बीमा।',
    },
    eligibility: {
      en: 'All farmers (loanee and non-loanee) growing notified crops in notified areas. Small and marginal farmers get additional subsidy.',
      ta: 'அறிவிக்கப்பட்ட பகுதிகளில் அறிவிக்கப்பட்ட பயிர்களை வளர்க்கும் அனைத்து விவசாயிகள். சிறு மற்றும் குறுகிய விவசாயிகளுக்கு கூடுதல் மானியம்.',
      hi: 'सूचित क्षेत्रों में सूचित फसलें उगाने वाले सभी किसान। छोटे और सीमांत किसानों को अतिरिक्त सब्सिडी।',
    },
    documents: {
      en: 'Aadhaar card, land documents, bank account details, sowing certificate.',
      ta: 'ஆதார் அட்டை, நில ஆவணங்கள், வங்கி கணக்கு விவரங்கள், விதைப்பு சான்றிதழ்.',
      hi: 'आधार कार्ड, भूमि दस्तावेज़, बैंक खाता विवरण, बुवाई प्रमाणपत्र।',
    },
    steps: {
      en: '1. Contact your bank or visit pmfby.gov.in\n2. Fill the application form\n3. Submit land and crop details\n4. Pay the premium (2% for kharif, 1.5% for rabi)\n5. Get policy document',
      ta: '1. உங்கள் வங்கியை தொடர்பு கொள்ளவும் அல்லது pmfby.gov.in செல்லவும்\n2. விண்ணப்ப படிவத்தை நிரப்பவும்\n3. நில மற்றும் பயிர் விவரங்களை சமர்ப்பிக்கவும்\n4. பிரீமியம் செலுத்தவும் (காரிஃப் 2%, ரபி 1.5%)\n5. கொள்கை ஆவணத்தை பெறவும்',
      hi: '1. अपने बैंक से संपर्क करें या pmfby.gov.in पर जाएं\n2. आवेदन फॉर्म भरें\n3. भूमि और फसल विवरण जमा करें\n4. प्रीमियम चुकाएं (खरीफ 2%, रबी 1.5%)\n5. पॉलिसी दस्तावेज़ प्राप्त करें',
    },
    link: 'https://pmfby.gov.in',
    states: [],
    farmer_types: ['small', 'marginal'],
    categories: ['insurance'],
  },
  {
    id: 'soil-health',
    name: {
      en: 'Soil Health Card Scheme',
      ta: 'மண் ஆரோக்கிய அட்டை திட்டம்',
      hi: 'मिट्टी स्वास्थ्य कार्ड योजना',
    },
    purpose: {
      en: 'Free soil testing and nutrient recommendations to help farmers apply the right fertilizers.',
      ta: 'சரியான உரங்களை பயன்படுத்த உதவ இலவச மண் பரிசோதனை மற்றும் ஊட்டச்சத்து பரிந்துரைகள்.',
      hi: 'सही उर्वरक लगाने में मदद के लिए मुफ़्त मिट्टी परीक्षण और पोषक सिफारिशें।',
    },
    eligibility: {
      en: 'All farmers with cultivable land. Free of cost, issued every 2 years.',
      ta: 'சாகுபடி நிலம் கொண்ட அனைத்து விவசாயிகள். இலவசம், ஒவ்வொரு 2 வருடமும் வழங்கப்படுகிறது.',
      hi: 'कृषि योग्य भूमि वाले सभी किसान। मुफ़्त, हर 2 साल में जारी।',
    },
    documents: {
      en: 'Aadhaar card, land records.',
      ta: 'ஆதார் அட்டை, நில பதிவேடுகள்.',
      hi: 'आधार कार्ड, भूमि रिकॉर्ड।',
    },
    steps: {
      en: '1. Visit your nearest soil testing lab\n2. Submit soil sample\n3. Get Soil Health Card within 2-3 weeks\n4. Follow nutrient recommendations',
      ta: '1. அருகில் உள்ள மண் பரிசோதனை ஆய்வகத்திற்கு செல்லவும்\n2. மண் மாதிரியை சமர்ப்பிக்கவும்\n3. 2-3 வாரங்களில் மண் ஆரோக்கிய அட்டையை பெறவும்\n4. ஊட்டச்சத்து பரிந்துரைகளை பின்பற்றவும்',
      hi: '1. निकटतम मिट्टी परीक्षण प्रयोगशाला जाएं\n2. मिट्टी नमूना जमा करें\n3. 2-3 सप्ताह में मिट्टी स्वास्थ्य कार्ड प्राप्त करें\n4. पोषक सिफारिशें अपनाएं',
    },
    link: 'https://soilhealth.dac.gov.in',
    states: [],
    farmer_types: ['small', 'marginal'],
    categories: ['soil'],
  },
  {
    id: 'pmksy',
    name: {
      en: 'PMKSY (Pradhan Mantri Krishi Sinchayee Yojana)',
      ta: 'பிஎம்கேஎஸ்ஒய் (பிரதான மந்திரி கிருஷி சின்சாயீ யோஜனா)',
      hi: 'पीएमकेएसवाई (प्रधानमंत्री कृषि सिंचाई योजना)',
    },
    purpose: {
      en: 'Subsidy for micro-irrigation systems (drip and sprinkler) to improve water use efficiency.',
      ta: 'நீர் பயன்பாட்டு செயல்திறனை மேம்படுத்த நுண் நீர்ப்பாசன அமைப்புகளுக்கு (சொட்டு மற்றும் தெளிப்பு) மானியம்.',
      hi: 'जल उपयोग दक्षता बढ़ाने के लिए सूक्ष्म सिंचाई (टपक और छिड़काव) पर सब्सिडी।',
    },
    eligibility: {
      en: 'All farmers. Small and marginal farmers get higher subsidy (up to 55%).',
      ta: 'அனைத்து விவசாயிகள். சிறு மற்றும் குறுகிய விவசாயிகளுக்கு அதிக மானியம் (55% வரை).',
      hi: 'सभी किसान। छोटे और सीमांत किसानों को अधिक सब्सिडी (55% तक)।',
    },
    documents: {
      en: 'Aadhaar card, land records, bank details, quotation from approved supplier.',
      ta: 'ஆதார் அட்டை, நில பதிவேடுகள், வங்கி விவரங்கள், அங்கீகரிக்கப்பட்ட வழங்குநரிடமிருந்து மேற்கோள்.',
      hi: 'आधार कार्ड, भूमि रिकॉर्ड, बैंक विवरण, स्वीकृत आपूर्तिकर्ता से कोटेशन।',
    },
    steps: {
      en: '1. Visit your agriculture department office\n2. Get quotation for drip/sprinkler system\n3. Submit application with documents\n4. Get approval and installation\n5. Subsidy credited to bank account',
      ta: '1. உங்கள் வேளாண்மை துறை அலுவலகத்திற்கு செல்லவும்\n2. சொட்டு/தெளிப்பு அமைப்பிற்கு மேற்கோள் பெறவும்\n3. ஆவணங்களுடன் விண்ணப்பத்தை சமர்ப்பிக்கவும்\n4. ஒப்புதல் மற்றும் நிறுவல் பெறவும்\n5. மானியம் வங்கி கணக்கில் வரவு வைக்கப்படும்',
      hi: '1. अपने कृषि विभाग कार्यालय जाएं\n2. टपक/छिड़काव के लिए कोटेशन लें\n3. दस्तावेज़ के साथ आवेदन जमा करें\n4. अनुमोदन और स्थापना प्राप्त करें\n5. सब्सिडी बैंक खाते में जमा',
    },
    link: 'https://pmksy.gov.in',
    states: [],
    farmer_types: ['small', 'marginal'],
    categories: ['irrigation', 'subsidy'],
  },
  {
    id: 'kcc',
    name: {
      en: 'Kisan Credit Card (KCC)',
      ta: 'கிசான் கிரெடிட் கார்டு (கேசிசி)',
      hi: 'किसान क्रेडिट कार्ड (केसीसी)',
    },
    purpose: {
      en: 'Short-term credit at low interest for agricultural inputs, equipment, and post-harvest expenses.',
      ta: 'வேளாண் உள்ளீடுகள், உபகரணங்கள் மற்றும் அறுவடைக்கு பின் செலவுகளுக்கு குறைந்த வட்டியில் குறுகிய கால கடன்.',
      hi: 'कृषि इनपुट, उपकरण और कटाई के बाद के खर्च के लिए कम ब्याज पर अल्पकालिक ऋण।',
    },
    eligibility: {
      en: 'All farmers with cultivable land, including tenant farmers and oral lessees. Interest subvention up to ₹3 lakh.',
      ta: 'சாகுபடி நிலம் கொண்ட அனைத்து விவசாயிகள், குத்தகைதார்கள் உட்பட. ₹3 லட்சம் வரை வட்டி தள்ளுபடி.',
      hi: 'कृषि योग्य भूमि वाले सभी किसान, पट्टेदार सहित। ₹3 लाख तक ब्याज सब्वेंशन।',
    },
    documents: {
      en: 'Aadhaar card, land records, bank account details, passport-size photo.',
      ta: 'ஆதார் அட்டை, நில பதிவேடுகள், வங்கி கணக்கு விவரங்கள், பாஸ்போர்ட் அளவு புகைப்படம்.',
      hi: 'आधार कार्ड, भूमि रिकॉर्ड, बैंक खाता विवरण, पासपोर्ट आकार फोटो।',
    },
    steps: {
      en: '1. Visit your bank branch\n2. Fill KCC application form\n3. Submit land and identity documents\n4. Bank verifies and issues KCC\n5. Withdraw as needed during crop season',
      ta: '1. உங்கள் வங்கி கிளைக்கு செல்லவும்\n2. கேசிசி விண்ணப்ப படிவத்தை நிரப்பவும்\n3. நில மற்றும் அடையாள ஆவணங்களை சமர்ப்பிக்கவும்\n4. வங்கி சரிபார்த்து கேசிசி வழங்கும்\n5. பயிர் பருவத்தில் தேவைப்படும்போது திரும்பவும்',
      hi: '1. अपने बैंक शाखा जाएं\n2. केसीसी आवेदन फॉर्म भरें\n3. भूमि और पहचान दस्तावेज़ जमा करें\n4. बैंक जांच कर केसीसी जारी करता है\n5. फसल मौसम में आवश्यकतानुसार निकासी',
    },
    link: 'https://www.myscheme.gov.in/schemes/kcc',
    states: [],
    farmer_types: ['small', 'marginal'],
    categories: ['loan'],
  },
  {
    id: 'pmay-g',
    name: {
      en: 'PMAY-G (Pradhan Mantri Awas Yojana - Gramin)',
      ta: 'பிஎம்ஏஒய்-ஜி (பிரதான மந்திரி ஆவாஸ் யோஜனா - கிராமிய)',
      hi: 'पीएमएवाई-जी (प्रधानमंत्री आवास योजना - ग्रामीण)',
    },
    purpose: {
      en: 'Financial assistance for construction of pucca houses for rural families without pucca housing.',
      ta: 'பக்கா வீடு இல்லாத கிராமிய குடும்பங்களுக்கு பக்கா வீடு கட்ட நிதி உதவி.',
      hi: 'पक्का आवास रहित ग्रामीण परिवारों को पक्का मकान निर्माण हेतु वित्तीय सहायता।',
    },
    eligibility: {
      en: 'Rural families without pucca house, with annual income below the state-defined threshold. Priority to SC/ST, women, and differently-abled.',
      ta: 'பக்கா வீடு இல்லாத கிராமிய குடும்பங்கள், ஆண்டு வருமானம் மாநில அளவுக்கு கீழ். எஸ்சி/எஸ்டி, பெண்கள், மாற்றுத்திறனாளிகளுக்கு முன்னுரிமை.',
      hi: 'पक्का घर रहित ग्रामीण परिवार, वार्षिक आय राज्य-निर्धारित सीमा से कम। एससी/एसटी, महिलाओं, और दिव्यांग को प्राथमिकता।',
    },
    documents: {
      en: 'Aadhaar card, bank account details, income certificate, caste certificate (if applicable).',
      ta: 'ஆதார் அட்டை, வங்கி கணக்கு விவரங்கள், வருமான சான்றிதழ், சாதி சான்றிதழ் (பொருந்தினால்).',
      hi: 'आधार कार्ड, बैंक खाता विवरण, आय प्रमाणपत्र, जाति प्रमाणपत्र (यदि लागू)।',
    },
    steps: {
      en: '1. Visit pmayg.nic.in or your Gram Panchayat\n2. Check eligibility in SECC database\n3. Register with Aadhaar\n4. Get approval from Gram Sabha\n5. Receive funds in installments',
      ta: '1. pmayg.nic.in அல்லது உங்கள் கிராம பஞ்சாயத்திற்கு செல்லவும்\n2. எஸ்இசிசி தரவுத்தளத்தில் தகுதி சரிபார்க்கவும்\n3. ஆதாருடன் பதிவு செய்யவும்\n4. கிராம சபையிடம் ஒப்புதல் பெறவும்\n5. தவணைகளில் நிதி பெறவும்',
      hi: '1. pmayg.nic.in या अपने ग्राम पंचायत जाएं\n2. सेक सेन्सस डेटाबेस में पात्रता जांचें\n3. आधार से पंजीकरण करें\n4. ग्राम सभा से अनुमोदन प्राप्त करें\n5. किस्तों में धन प्राप्त करें',
    },
    link: 'https://pmayg.nic.in',
    states: [],
    farmer_types: ['small', 'marginal'],
    categories: ['subsidy'],
  },
  {
    id: 'pm-kmy',
    name: {
      en: 'PM-KMY (Pradhan Mantri Kisan Maan-Dhan Yojana)',
      ta: 'பிஎம்-கேஎம்ஒய் (பிரதான மந்திரி கிசான் மான்-தன் யோஜனா)',
      hi: 'पीएम-केएमवाई (प्रधानमंत्री किसान मान-धन योजना)',
    },
    purpose: {
      en: 'Pension of ₹3,000 per month to small and marginal farmers after age 60.',
      ta: '60 வயதிற்கு பிறகு சிறு மற்றும் குறுகிய விவசாயிகளுக்கு மாதம் ₹3,000 ஓய்வூதியம்.',
      hi: '60 वर्ष के बाद छोटे और सीमांत किसानों को ₹3,000 प्रति माह पेंशन।',
    },
    eligibility: {
      en: 'Small and marginal farmers aged 18-40 years. Monthly contribution based on age of entry.',
      ta: '18-40 வயதுடைய சிறு மற்றும் குறுகிய விவசாயிகள். நுழைவு வயதின் அடிப்படையில் மாதாந்திர பங்களிப்பு.',
      hi: '18-40 वर्ष के छोटे और सीमांत किसान। प्रवेश आयु के आधार पर मासिक योगदान।',
    },
    documents: {
      en: 'Aadhaar card, land records, bank account details, mobile number.',
      ta: 'ஆதார் அட்டை, நில பதிவேடுகள், வங்கி கணக்கு விவரங்கள், மொபைல் எண்.',
      hi: 'आधार कार्ड, भूमि रिकॉर्ड, बैंक खाता विवरण, मोबाइल नंबर।',
    },
    steps: {
      en: '1. Visit nearest Common Service Center (CSC)\n2. Provide Aadhaar and land details\n3. Choose monthly contribution amount\n4. Auto-debit from bank account\n5. Receive pension after age 60',
      ta: '1. அருகில் உள்ள பொது சேவை மையத்திற்கு (சிஎஸ்சி) செல்லவும்\n2. ஆதார் மற்றும் நில விவரங்களை வழங்கவும்\n3. மாதாந்திர பங்களிப்பு தொகையை தேர்வு செய்யவும்\n4. வங்கி கணக்கிலிருந்து தானியங்கி பிரிப்பு\n5. 60 வயதிற்கு பிறகு ஓய்வூதியம் பெறவும்',
      hi: '1. निकटतम कॉमन सर्विस सेंटर (सीएससी) जाएं\n2. आधार और भूमि विवरण दें\n3. मासिक योगदान चुनें\n4. बैंक खाते से ऑटो-डेबिट\n5. 60 वर्ष बाद पेंशन प्राप्त करें',
    },
    link: 'https://pmkmy.gov.in',
    states: [],
    farmer_types: ['small', 'marginal'],
    categories: ['pension'],
  },
  {
    id: 'smam',
    name: {
      en: 'SMAM (Sub-Mission on Agricultural Mechanization)',
      ta: 'எஸ்எஏஎம் (வேளாண் இயந்திரமயமாக்கல் துணை-மிஷன்)',
      hi: 'एसएएम (कृषि यांत्रिकीकरण उप-मिशन)',
    },
    purpose: {
      en: 'Subsidy for purchase of agricultural machinery and equipment to improve farm efficiency.',
      ta: 'பண்ணை செயல்திறனை மேம்படுத்த வேளாண் இயந்திரங்கள் மற்றும் உபகரணங்கள் கொள்முதலுக்கு மானியம்.',
      hi: 'खेत दक्षता बढ़ाने के लिए कृषि मशीनरी और उपकरण खरीद पर सब्सिडी।',
    },
    eligibility: {
      en: 'Individual farmers, farmer groups, and custom hiring centers. Subsidy ranges from 25-50%.',
      ta: 'தனிப்பட்ட விவசாயிகள், விவசாயி குழுக்கள், மற்றும் தனிப்பயன் வாடகை மையங்கள். மானியம் 25-50%.',
      hi: 'व्यक्तिगत किसान, किसान समूह, और कस्टम हायरिंग सेंटर। सब्सिडी 25-50%।',
    },
    documents: {
      en: 'Aadhaar card, land records, quotation from approved manufacturer.',
      ta: 'ஆதார் அட்டை, நில பதிவேடுகள், அங்கீகரிக்கப்பட்ட உற்பத்தியாளரிடமிருந்து மேற்கோள்.',
      hi: 'आधार कार्ड, भूमि रिकॉर्ड, स्वीकृत निर्माता से कोटेशन।',
    },
    steps: {
      en: '1. Visit your agriculture department\n2. Select approved machinery\n3. Submit application with quotation\n4. Get approval\n5. Purchase and claim subsidy',
      ta: '1. உங்கள் வேளாண்மை துறைக்கு செல்லவும்\n2. அங்கீகரிக்கப்பட்ட இயந்திரத்தை தேர்வு செய்யவும்\n3. மேற்கோளுடன் விண்ணப்பத்தை சமர்ப்பிக்கவும்\n4. ஒப்புதல் பெறவும்\n5. கொள்முதல் செய்து மானியம் கோரவும்',
      hi: '1. अपने कृषि विभाग जाएं\n2. स्वीकृत मशीनरी चुनें\n3. कोटेशन के साथ आवेदन जमा करें\n4. अनुमोदन प्राप्त करें\n5. खरीदें और सब्सिडी का दावा करें',
    },
    link: 'https://farmech.dac.gov.in',
    states: [],
    farmer_types: ['small', 'marginal'],
    categories: ['equipment', 'subsidy'],
  },
];

export interface SchemeMatchCriteria {
  state?: string;
  farmerType?: FarmerType;
  landSize?: number;
  crop?: string;
  ageGroup?: string;
  category?: string;
}

export function matchSchemes(criteria: SchemeMatchCriteria): GovernmentScheme[] {
  return GOVERNMENT_SCHEMES.filter((scheme) => {
    if (criteria.farmerType && !scheme.farmer_types.includes(criteria.farmerType)) return false;
    if (criteria.category && criteria.category !== 'all' && !scheme.categories.includes(criteria.category)) return false;
    return true;
  });
}

export function getLocalizedSchemeField(field: { en: string; ta: string; hi: string }, lang: LanguageCode): string {
  return field[lang] || field.en;
}
