import type { LandingStrings } from '../types.landing';

export const meta = {
  code: 'ur',
  nativeName: 'اردو',
};

const UR: LandingStrings = {
  header: {
    brand: 'THESDEL',
    signIn: 'سائن اِن',
    joinFree: 'مفت شامل ہوں',
    backToLogin: 'لاگ اِن پر واپس جائیں',
    backToHome: 'ہوم پر واپس جائیں',
  },

  hero: {
    badge: 'طلبہ کے لیے اسمارٹ ٹائم ٹیبل',
    replacesLabel: 'کی جگہ',
    headlinePrefix: 'آپ کا تعلیمی دن،',
    headlineSuffix: 'آخرکار ایک ہی جگہ۔',
    subtitle:
      'اپنے کلاس شیڈول، حاضری اور کلاس اپ ڈیٹس کو ایک جگہ منظم رکھیں۔',
    ctaPrimary: 'مفت شروع کریں',
    ctaSecondary: 'لاگ اِن',
    replacesWords: [
      'کاغذی ٹائم ٹیبل',
      'چیٹس میں بکھرے شیڈول',
      'بھولی ہوئی کلاسز',
      'غیر منظم نوٹس',
    ],
  },

  features: {
    sectionLabel: 'یہ کیسے کام کرتا ہے',
    sectionTitle: 'آپ کی پڑھائی، ایک جگہ۔',
    step1Title: 'اپنی کلاس شامل کریں',
    step1Body:
      'اپنی کلاس میں شامل ہوں یا اپنی کلاس اسپیس بنائیں۔',
    step2Title: 'اپنا شیڈول دیکھیں',
    step2Body:
      'اپنی روزانہ کی کلاسز اور آنے والے لیکچرز ایک نظر میں دیکھیں۔',
    step3Title: 'باخبر رہیں',
    step3Body:
      'کلاس اپ ڈیٹس، اعلانات اور حاضری کو ایک ہی جگہ پر ٹریک کریں۔',
  },

  footer: {
    builtBy: 'طلبہ کے لیے بنایا گیا',
    terms: 'شرائط',
    privacy: 'رازداری',
    about: 'ہمارے بارے میں',
    linksTagline: 'طلبہ کے لیے۔ طلبہ کے ساتھ۔',
    brandMark: 'THESDEL',
    descriptor: 'The Student Digital Exchange Layer',
  },

  login: {
    topMarker: 'اکاؤنٹ',
    title: 'خوش آمدید',
    subtitle: 'اپنے THESDEL اکاؤنٹ میں سائن اِن کریں۔',
    emailLabel: 'ای میل',
    emailPlaceholder: 'اپنا ای میل درج کریں',
    passwordLabel: 'پاس ورڈ',
    passwordPlaceholder: 'اپنا پاس ورڈ درج کریں',
    forgotLink: 'پاس ورڈ بھول گئے؟',
    showPassword: 'پاس ورڈ دکھائیں',
    hidePassword: 'پاس ورڈ چھپائیں',
    submitIdle: 'سائن اِن',
    submitLoading: 'سائن اِن ہو رہا ہے...',
    newTo: 'THESDEL پر نئے ہیں؟',
    createAccount: 'اکاؤنٹ بنائیں',
    footnote: 'محفوظ اور سادہ تعلیمی انتظام۔',
    emptyFieldsError: 'ای میل اور پاس ورڈ درج کریں۔',
    fallbackProfileError:
      'پروفائل لوڈ نہیں ہو سکا۔ براہ کرم دوبارہ کوشش کریں۔',
    genericError:
      'سائن اِن کرتے وقت کچھ غلط ہو گیا۔ براہ کرم دوبارہ کوشش کریں۔',
    close: 'بند کریں',
  },

  forgot: {
    topMarker: 'اکاؤنٹ کی بازیابی',
    title: 'پاس ورڈ بھول گئے؟',
    subtitle:
      'اپنا ای میل درج کریں اور ہم آپ کو پاس ورڈ دوبارہ ترتیب دینے کا لنک بھیج دیں گے۔',
    emailLabel: 'ای میل',
    emailPlaceholder: 'اپنا ای میل درج کریں',
    submitIdle: 'ری سیٹ لنک بھیجیں',
    submitLoading: 'بھیجا جا رہا ہے...',
    backToSignIn: 'سائن اِن پر واپس جائیں',
    successTitle: 'اپنا ای میل چیک کریں',
    successBodyPrefix: 'ہم نے پاس ورڈ ری سیٹ کرنے کا لنک بھیجا ہے:',
    successBodySuffix: 'لنک استعمال کر کے نیا پاس ورڈ سیٹ کریں۔',
    returnToSignIn: 'سائن اِن پر واپس جائیں',
    footnote: 'اپنے اکاؤنٹ تک دوبارہ محفوظ رسائی حاصل کریں۔',
    emptyEmailError: 'اپنا ای میل درج کریں۔',
    genericError:
      'ری سیٹ لنک بھیجنے میں کچھ غلط ہو گیا۔ براہ کرم دوبارہ کوشش کریں۔',
    close: 'بند کریں',
  },

  signup: {
    topMarker: 'نیا اکاؤنٹ',
    title: 'اپنا اکاؤنٹ بنائیں',
    subtitle:
      'اپنی کلاسز، شیڈول اور تعلیمی دن کو ایک جگہ منظم کریں۔',

    sectionIdentity: 'شناخت',
    sectionContact: 'رابطہ',
    sectionRole: 'کردار',
    sectionSecurity: 'سیکیورٹی',

    nameLabel: 'نام',
    namePlaceholder: 'اپنا نام درج کریں',

    usernameLabel: 'یوزرنیم',
    usernamePlaceholder: 'اپنا یوزرنیم درج کریں',
    usernameChecking: 'چیک کیا جا رہا ہے...',
    usernameAvailable: 'یوزرنیم دستیاب ہے',
    usernameUnavailable: 'یوزرنیم دستیاب نہیں',
    usernameHint:
      'صرف حروف، اعداد، انڈر اسکور اور ڈاٹ استعمال کریں۔',

    emailLabel: 'ای میل',
    emailPlaceholder: 'اپنا ای میل درج کریں',

    phoneLabel: 'فون نمبر',
    phonePlaceholder: 'اپنا فون نمبر درج کریں',
    phoneHint: 'ایک فعال فون نمبر درج کریں۔',
    phoneChecking: 'چیک کیا جا رہا ہے...',
    phoneAvailable: 'فون نمبر دستیاب ہے',
    phoneUnavailable: 'فون نمبر پہلے سے استعمال ہو رہا ہے',

    roleQuestion: 'آپ کا کردار کیا ہے؟',
    roleStudentTitle: 'طالب علم',
    roleStudentBody:
      'کلاسز میں شامل ہوں، اپنا شیڈول دیکھیں اور حاضری ٹریک کریں۔',
    roleRepTitle: 'کلاس نمائندہ',
    roleRepBody:
      'اپنی کلاس بنائیں، ارکان کا انتظام کریں اور اعلانات بھیجیں۔',

    passwordLabel: 'پاس ورڈ',
    passwordPlaceholder: 'ایک مضبوط پاس ورڈ بنائیں',
    passwordHint:
      'کم از کم 8 حروف کا مضبوط پاس ورڈ استعمال کریں۔',
    passwordProtected: 'آپ کا پاس ورڈ محفوظ رکھا جاتا ہے۔',
    showPassword: 'پاس ورڈ دکھائیں',
    hidePassword: 'پاس ورڈ چھپائیں',

    termsPrefix: 'میں',
    termsOfService: 'شرائطِ استعمال',
    termsConjunction: 'اور',
    privacyPolicy: 'رازداری کی پالیسی',
    termsSuffix: 'سے اتفاق کرتا ہوں۔',

    submitIdle: 'اکاؤنٹ بنائیں',
    submitLoading: 'اکاؤنٹ بنایا جا رہا ہے...',
    alreadyHaveAccount: 'پہلے سے اکاؤنٹ ہے؟',
    signIn: 'سائن اِن',
    footnote: 'آپ کی معلومات محفوظ اور نجی رکھی جاتی ہیں۔',

    errorAllRequired: 'تمام ضروری معلومات درج کریں۔',
    errorUsernameFormat: 'یوزرنیم کا فارمیٹ درست نہیں۔',
    errorUsernameTaken: 'یہ یوزرنیم پہلے سے استعمال ہو رہا ہے۔',
    errorPhoneInvalid: 'فون نمبر درست نہیں۔',
    errorPhoneTaken: 'یہ فون نمبر پہلے سے استعمال ہو رہا ہے۔',
    errorTermsRequired:
      'جاری رکھنے کے لیے شرائط اور رازداری کی پالیسی سے اتفاق کریں۔',
    errorEmailRegistered:
      'یہ ای میل پہلے سے رجسٹرڈ ہے۔',
    errorProfileCreate:
      'پروفائل بنانے میں ناکامی ہوئی۔ براہ کرم دوبارہ کوشش کریں۔',
    errorDuplicate:
      'یہ معلومات پہلے سے استعمال ہو رہی ہیں۔',
    errorGenericRegistration:
      'رجسٹریشن مکمل نہیں ہو سکی۔ براہ کرم دوبارہ کوشش کریں۔',

    captchaLabel: 'تصدیق',
    captchaQuestion: (a, b) => `حل کریں: ${a} + ${b} = ؟`,
    captchaPlaceholder: 'جواب',
    captchaNewQuestion: 'نیا سوال',
    errorCaptchaRequired: 'تصدیقی سوال کا جواب دیں۔',
    errorCaptchaIncorrect: 'غلط جواب۔',
    errorRateLimited:
      'بہت زیادہ کوششیں ہو چکی ہیں۔ براہ کرم کچھ دیر بعد دوبارہ کوشش کریں۔',
  },

  legal: {
    terms: {
      eyebrow: 'قانونی',
      title: 'شرائطِ استعمال',
      description:
        'THESDEL استعمال کرتے وقت آپ کے حقوق اور ذمہ داریاں۔',
      footerLabel: 'شرائطِ استعمال',
      buttonLabel: 'میں سمجھتا ہوں',
      effectiveDateLabel: 'نافذ العمل تاریخ',
      effectiveDate: '13 ستمبر 2026',
      sections: [
        {
          number: '01',
          title: 'قبولیت',
          body:
            'THESDEL استعمال کرتے ہوئے آپ ان شرائطِ استعمال سے اتفاق کرتے ہیں۔ اگر آپ ان شرائط سے اتفاق نہیں کرتے تو سروس استعمال نہ کریں۔',
        },
        {
          number: '02',
          title: 'اکاؤنٹ',
          body:
            'آپ اپنے اکاؤنٹ کی معلومات کو درست رکھنے اور اپنے اکاؤنٹ کی سیکیورٹی برقرار رکھنے کے ذمہ دار ہیں۔',
        },
        {
          number: '03',
          title: 'کلاس اسپیسز',
          body:
            'کلاس بناتے یا اس میں شامل ہوتے وقت آپ کو مناسب اور درست معلومات فراہم کرنی ہوں گی۔ کلاس نمائندگان اپنی کلاس اسپیسز کے انتظام کے ذمہ دار ہیں۔',
        },
        {
          number: '04',
          title: 'قابل قبول استعمال',
          body:
            'THESDEL کو غیر قانونی، نقصان دہ یا دوسروں کے حقوق کی خلاف ورزی کرنے والی سرگرمیوں کے لیے استعمال نہیں کیا جا سکتا۔',
        },
        {
          number: '05',
          title: 'سروس میں تبدیلیاں',
          body:
            'ہم THESDEL کی خصوصیات کو وقتاً فوقتاً تبدیل، بہتر یا ختم کر سکتے ہیں۔',
        },
      ],
    },

    privacy: {
      eyebrow: 'قانونی',
      title: 'رازداری کی پالیسی',
      description:
        'ہم آپ کی معلومات کو کیسے جمع، استعمال اور محفوظ کرتے ہیں۔',
      footerLabel: 'رازداری',
      buttonLabel: 'میں سمجھتا ہوں',
      effectiveDateLabel: 'نافذ العمل تاریخ',
      effectiveDate: '13 ستمبر 2026',
      sections: [
        {
          number: '01',
          title: 'ہم کیا جمع کرتے ہیں',
          body:
            'ہم آپ کے اکاؤنٹ، کلاس رکنیت، شیڈول اور حاضری سے متعلق وہ معلومات جمع کرتے ہیں جو THESDEL کی بنیادی خصوصیات فراہم کرنے کے لیے ضروری ہیں۔',
        },
        {
          number: '02',
          title: 'معلومات کا استعمال',
          body:
            'آپ کی معلومات کا استعمال آپ کو کلاسز، شیڈول، حاضری اور متعلقہ اپ ڈیٹس فراہم کرنے کے لیے کیا جاتا ہے۔',
        },
        {
          number: '03',
          title: 'آپ کا کنٹرول',
          body:
            'آپ اپنی اکاؤنٹ کی معلومات اور دستیاب ترجیحات کو تبدیل کر سکتے ہیں۔ آپ اپنا اکاؤنٹ حذف کرنے کی درخواست بھی کر سکتے ہیں۔',
        },
        {
          number: '04',
          title: 'ڈیٹا سیکیورٹی',
          body:
            'ہم آپ کی معلومات کو غیر مجاز رسائی، تبدیلی یا افشا سے محفوظ رکھنے کے لیے مناسب اقدامات کرتے ہیں۔',
        },
        {
          number: '05',
          title: 'اپ ڈیٹس',
          body:
            'ہم اپنی رازداری کی پالیسی میں تبدیلیاں کر سکتے ہیں۔ اہم تبدیلیاں ہونے پر ہم مناسب اطلاع فراہم کریں گے۔',
        },
      ],
    },

    about: {
      eyebrow: 'THESDEL',
      title: 'ہمارے بارے میں',
      description:
        'طلبہ کے لیے ایک بہتر تعلیمی تجربہ بنانے کی کوشش۔',
      footerLabel: 'ہمارے بارے میں',
      buttonLabel: 'واپس جائیں',
      sections: [
        {
          number: '01',
          title: 'THESDEL کیا ہے؟',
          body:
            'THESDEL، یعنی The Student Digital Exchange Layer، طلبہ کے لیے ایک ڈیجیٹل پلیٹ فارم ہے جو ان کی روزمرہ تعلیمی زندگی کو منظم اور مربوط بنانے کے لیے بنایا گیا ہے۔',
        },
        {
          number: '02',
          title: 'ہمارا مقصد',
          body:
            'ہم طلبہ کو ان کی کلاسز، شیڈول، حاضری اور کلاس کمیونٹی سے جڑے رہنے کے لیے ایک سادہ اور قابل اعتماد جگہ دینا چاہتے ہیں۔',
        },
        {
          number: '03',
          title: 'طلبہ پہلے',
          body:
            'THESDEL طلبہ کی حقیقی ضروریات کے گرد بنایا جا رہا ہے، غیر ضروری پیچیدگی کے بجائے سادہ اور مفید تجربے پر توجہ کے ساتھ۔',
        },
      ],
    },
  },
};

export default UR;