// Currency utilities for tracking and displaying different currency symbols

export interface CurrencyInfo {
  symbol: string
  code: string
  name: string
  position: 'before' | 'after'
  decimalPlaces: number
}

export const CURRENCIES: Record<string, CurrencyInfo> = {
  // African Currencies
  ZAR: {
    symbol: 'R',
    code: 'ZAR',
    name: 'South African Rand',
    position: 'before',
    decimalPlaces: 2
  },
  NGN: {
    symbol: '₦',
    code: 'NGN',
    name: 'Nigerian Naira',
    position: 'before',
    decimalPlaces: 2
  },
  GHS: {
    symbol: '₵',
    code: 'GHS',
    name: 'Ghanaian Cedi',
    position: 'before',
    decimalPlaces: 2
  },
  KES: {
    symbol: 'KSh',
    code: 'KES',
    name: 'Kenyan Shilling',
    position: 'before',
    decimalPlaces: 2
  },
  EGP: {
    symbol: 'E£',
    code: 'EGP',
    name: 'Egyptian Pound',
    position: 'before',
    decimalPlaces: 2
  },
  MAD: {
    symbol: 'MAD',
    code: 'MAD',
    name: 'Moroccan Dirham',
    position: 'before',
    decimalPlaces: 2
  },
  TND: {
    symbol: 'DT',
    code: 'TND',
    name: 'Tunisian Dinar',
    position: 'before',
    decimalPlaces: 2
  },
  DZD: {
    symbol: 'DA',
    code: 'DZD',
    name: 'Algerian Dinar',
    position: 'before',
    decimalPlaces: 2
  },
  ETB: {
    symbol: 'Br',
    code: 'ETB',
    name: 'Ethiopian Birr',
    position: 'before',
    decimalPlaces: 2
  },
  UGX: {
    symbol: 'USh',
    code: 'UGX',
    name: 'Ugandan Shilling',
    position: 'before',
    decimalPlaces: 2
  },
  TZS: {
    symbol: 'TSh',
    code: 'TZS',
    name: 'Tanzanian Shilling',
    position: 'before',
    decimalPlaces: 2
  },
  BWP: {
    symbol: 'P',
    code: 'BWP',
    name: 'Botswana Pula',
    position: 'before',
    decimalPlaces: 2
  },
  ZMW: {
    symbol: 'ZK',
    code: 'ZMW',
    name: 'Zambian Kwacha',
    position: 'before',
    decimalPlaces: 2
  },
  MWK: {
    symbol: 'MK',
    code: 'MWK',
    name: 'Malawian Kwacha',
    position: 'before',
    decimalPlaces: 2
  },
  MZN: {
    symbol: 'MT',
    code: 'MZN',
    name: 'Mozambican Metical',
    position: 'before',
    decimalPlaces: 2
  },
  AOA: {
    symbol: 'Kz',
    code: 'AOA',
    name: 'Angolan Kwanza',
    position: 'before',
    decimalPlaces: 2
  },
  // Major International Currencies
  USD: {
    symbol: '$',
    code: 'USD',
    name: 'US Dollar',
    position: 'before',
    decimalPlaces: 2
  },
  EUR: {
    symbol: '€',
    code: 'EUR',
    name: 'Euro',
    position: 'before',
    decimalPlaces: 2
  },
  GBP: {
    symbol: '£',
    code: 'GBP',
    name: 'British Pound',
    position: 'before',
    decimalPlaces: 2
  },
  CAD: {
    symbol: 'C$',
    code: 'CAD',
    name: 'Canadian Dollar',
    position: 'before',
    decimalPlaces: 2
  },
  AUD: {
    symbol: 'A$',
    code: 'AUD',
    name: 'Australian Dollar',
    position: 'before',
    decimalPlaces: 2
  },
  JPY: {
    symbol: '¥',
    code: 'JPY',
    name: 'Japanese Yen',
    position: 'before',
    decimalPlaces: 0
  },
  CNY: {
    symbol: '¥',
    code: 'CNY',
    name: 'Chinese Yuan',
    position: 'before',
    decimalPlaces: 2
  },
  INR: {
    symbol: '₹',
    code: 'INR',
    name: 'Indian Rupee',
    position: 'before',
    decimalPlaces: 2
  },
  BRL: {
    symbol: 'R$',
    code: 'BRL',
    name: 'Brazilian Real',
    position: 'before',
    decimalPlaces: 2
  },
  MXN: {
    symbol: '$',
    code: 'MXN',
    name: 'Mexican Peso',
    position: 'before',
    decimalPlaces: 2
  },
  ARS: {
    symbol: '$',
    code: 'ARS',
    name: 'Argentine Peso',
    position: 'before',
    decimalPlaces: 2
  },
  CLP: {
    symbol: '$',
    code: 'CLP',
    name: 'Chilean Peso',
    position: 'before',
    decimalPlaces: 2
  },
  COP: {
    symbol: '$',
    code: 'COP',
    name: 'Colombian Peso',
    position: 'before',
    decimalPlaces: 2
  },
  PEN: {
    symbol: 'S/',
    code: 'PEN',
    name: 'Peruvian Sol',
    position: 'before',
    decimalPlaces: 2
  },
  UYU: {
    symbol: '$U',
    code: 'UYU',
    name: 'Uruguayan Peso',
    position: 'before',
    decimalPlaces: 2
  },
  // Middle East & Asia
  AED: {
    symbol: 'د.إ',
    code: 'AED',
    name: 'UAE Dirham',
    position: 'before',
    decimalPlaces: 2
  },
  SAR: {
    symbol: '﷼',
    code: 'SAR',
    name: 'Saudi Riyal',
    position: 'before',
    decimalPlaces: 2
  },
  QAR: {
    symbol: '﷼',
    code: 'QAR',
    name: 'Qatari Riyal',
    position: 'before',
    decimalPlaces: 2
  },
  KWD: {
    symbol: 'د.ك',
    code: 'KWD',
    name: 'Kuwaiti Dinar',
    position: 'before',
    decimalPlaces: 2
  },
  BHD: {
    symbol: 'د.ب',
    code: 'BHD',
    name: 'Bahraini Dinar',
    position: 'before',
    decimalPlaces: 2
  },
  OMR: {
    symbol: '﷼',
    code: 'OMR',
    name: 'Omani Rial',
    position: 'before',
    decimalPlaces: 2
  },
  JOD: {
    symbol: 'د.ا',
    code: 'JOD',
    name: 'Jordanian Dinar',
    position: 'before',
    decimalPlaces: 2
  },
  LBP: {
    symbol: 'ل.ل',
    code: 'LBP',
    name: 'Lebanese Pound',
    position: 'before',
    decimalPlaces: 2
  },
  ILS: {
    symbol: '₪',
    code: 'ILS',
    name: 'Israeli Shekel',
    position: 'before',
    decimalPlaces: 2
  },
  TRY: {
    symbol: '₺',
    code: 'TRY',
    name: 'Turkish Lira',
    position: 'before',
    decimalPlaces: 2
  },
  // Southeast Asia
  SGD: {
    symbol: 'S$',
    code: 'SGD',
    name: 'Singapore Dollar',
    position: 'before',
    decimalPlaces: 2
  },
  MYR: {
    symbol: 'RM',
    code: 'MYR',
    name: 'Malaysian Ringgit',
    position: 'before',
    decimalPlaces: 2
  },
  THB: {
    symbol: '฿',
    code: 'THB',
    name: 'Thai Baht',
    position: 'before',
    decimalPlaces: 2
  },
  IDR: {
    symbol: 'Rp',
    code: 'IDR',
    name: 'Indonesian Rupiah',
    position: 'before',
    decimalPlaces: 2
  },
  PHP: {
    symbol: '₱',
    code: 'PHP',
    name: 'Philippine Peso',
    position: 'before',
    decimalPlaces: 2
  },
  VND: {
    symbol: '₫',
    code: 'VND',
    name: 'Vietnamese Dong',
    position: 'before',
    decimalPlaces: 2
  },
  KRW: {
    symbol: '₩',
    code: 'KRW',
    name: 'South Korean Won',
    position: 'before',
    decimalPlaces: 2
  },
  TWD: {
    symbol: 'NT$',
    code: 'TWD',
    name: 'Taiwan Dollar',
    position: 'before',
    decimalPlaces: 2
  },
  HKD: {
    symbol: 'HK$',
    code: 'HKD',
    name: 'Hong Kong Dollar',
    position: 'before',
    decimalPlaces: 2
  },
  // European
  CHF: {
    symbol: 'CHF',
    code: 'CHF',
    name: 'Swiss Franc',
    position: 'before',
    decimalPlaces: 2
  },
  SEK: {
    symbol: 'kr',
    code: 'SEK',
    name: 'Swedish Krona',
    position: 'before',
    decimalPlaces: 2
  },
  NOK: {
    symbol: 'kr',
    code: 'NOK',
    name: 'Norwegian Krone',
    position: 'before',
    decimalPlaces: 2
  },
  DKK: {
    symbol: 'kr',
    code: 'DKK',
    name: 'Danish Krone',
    position: 'before',
    decimalPlaces: 2
  },
  PLN: {
    symbol: 'zł',
    code: 'PLN',
    name: 'Polish Zloty',
    position: 'before',
    decimalPlaces: 2
  },
  CZK: {
    symbol: 'Kč',
    code: 'CZK',
    name: 'Czech Koruna',
    position: 'before',
    decimalPlaces: 2
  },
  HUF: {
    symbol: 'Ft',
    code: 'HUF',
    name: 'Hungarian Forint',
    position: 'before',
    decimalPlaces: 2
  },
  RON: {
    symbol: 'lei',
    code: 'RON',
    name: 'Romanian Leu',
    position: 'before',
    decimalPlaces: 2
  },
  BGN: {
    symbol: 'лв',
    code: 'BGN',
    name: 'Bulgarian Lev',
    position: 'before',
    decimalPlaces: 2
  },
  HRK: {
    symbol: 'kn',
    code: 'HRK',
    name: 'Croatian Kuna',
    position: 'before',
    decimalPlaces: 2
  },
  RSD: {
    symbol: 'дин',
    code: 'RSD',
    name: 'Serbian Dinar',
    position: 'before',
    decimalPlaces: 2
  },
  UAH: {
    symbol: '₴',
    code: 'UAH',
    name: 'Ukrainian Hryvnia',
    position: 'before',
    decimalPlaces: 2
  },
  RUB: {
    symbol: '₽',
    code: 'RUB',
    name: 'Russian Ruble',
    position: 'before',
    decimalPlaces: 2
  }
}

export function formatCurrency(amount: number, currency: string = 'NGN'): string {
  const currencyInfo = CURRENCIES[currency] || CURRENCIES.NGN
  const formattedAmount = amount.toLocaleString('en-US', {
    minimumFractionDigits: currencyInfo.decimalPlaces,
    maximumFractionDigits: currencyInfo.decimalPlaces
  })

  if (currencyInfo.position === 'before') {
    return `${currencyInfo.symbol}${formattedAmount}`
  } else {
    return `${formattedAmount} ${currencyInfo.symbol}`
  }
}

export function formatCurrencyFromKobo(amountInKobo: number, currency: string = 'NGN'): string {
  const amount = amountInKobo / 100
  return formatCurrency(amount, currency)
}

export function getCurrencySymbol(currency: string = 'NGN'): string {
  return CURRENCIES[currency]?.symbol || '₦'
}

export function detectCurrencyFromUser(userCountry?: string): string {
  const countryCurrencyMap: Record<string, string> = {
    // African Countries
    'ZA': 'ZAR', // South Africa
    'NG': 'NGN', // Nigeria
    'GH': 'GHS', // Ghana
    'KE': 'KES', // Kenya
    'EG': 'EGP', // Egypt
    'MA': 'MAD', // Morocco
    'TN': 'TND', // Tunisia
    'DZ': 'DZD', // Algeria
    'ET': 'ETB', // Ethiopia
    'UG': 'UGX', // Uganda
    'TZ': 'TZS', // Tanzania
    'BW': 'BWP', // Botswana
    'ZM': 'ZMW', // Zambia
    'MW': 'MWK', // Malawi
    'MZ': 'MZN', // Mozambique
    'AO': 'AOA', // Angola
    'ZW': 'ZAR', // Zimbabwe (uses ZAR)
    'LS': 'ZAR', // Lesotho (uses ZAR)
    'SZ': 'ZAR', // Eswatini (uses ZAR)
    'NA': 'ZAR', // Namibia (uses ZAR)
    
    // North America
    'US': 'USD', // United States
    'CA': 'CAD', // Canada
    'MX': 'MXN', // Mexico
    
    // South America
    'BR': 'BRL', // Brazil
    'AR': 'ARS', // Argentina
    'CL': 'CLP', // Chile
    'CO': 'COP', // Colombia
    'PE': 'PEN', // Peru
    'UY': 'UYU', // Uruguay
    
    // Europe
    'GB': 'GBP', // United Kingdom
    'DE': 'EUR', // Germany
    'FR': 'EUR', // France
    'IT': 'EUR', // Italy
    'ES': 'EUR', // Spain
    'NL': 'EUR', // Netherlands
    'BE': 'EUR', // Belgium
    'AT': 'EUR', // Austria
    'FI': 'EUR', // Finland
    'IE': 'EUR', // Ireland
    'PT': 'EUR', // Portugal
    'GR': 'EUR', // Greece
    'LU': 'EUR', // Luxembourg
    'MT': 'EUR', // Malta
    'CY': 'EUR', // Cyprus
    'SI': 'EUR', // Slovenia
    'SK': 'EUR', // Slovakia
    'EE': 'EUR', // Estonia
    'LV': 'EUR', // Latvia
    'LT': 'EUR', // Lithuania
    'CH': 'CHF', // Switzerland
    'SE': 'SEK', // Sweden
    'NO': 'NOK', // Norway
    'DK': 'DKK', // Denmark
    'PL': 'PLN', // Poland
    'CZ': 'CZK', // Czech Republic
    'HU': 'HUF', // Hungary
    'RO': 'RON', // Romania
    'BG': 'BGN', // Bulgaria
    'HR': 'HRK', // Croatia
    'RS': 'RSD', // Serbia
    'UA': 'UAH', // Ukraine
    'RU': 'RUB', // Russia
    'TR': 'TRY', // Turkey
    
    // Middle East
    'AE': 'AED', // UAE
    'SA': 'SAR', // Saudi Arabia
    'QA': 'QAR', // Qatar
    'KW': 'KWD', // Kuwait
    'BH': 'BHD', // Bahrain
    'OM': 'OMR', // Oman
    'JO': 'JOD', // Jordan
    'LB': 'LBP', // Lebanon
    'IL': 'ILS', // Israel
    
    // Asia
    'CN': 'CNY', // China
    'JP': 'JPY', // Japan
    'KR': 'KRW', // South Korea
    'IN': 'INR', // India
    'SG': 'SGD', // Singapore
    'MY': 'MYR', // Malaysia
    'TH': 'THB', // Thailand
    'ID': 'IDR', // Indonesia
    'PH': 'PHP', // Philippines
    'VN': 'VND', // Vietnam
    'TW': 'TWD', // Taiwan
    'HK': 'HKD', // Hong Kong
    
    // Oceania
    'AU': 'AUD', // Australia
    'NZ': 'NZD', // New Zealand
    'FJ': 'FJD', // Fiji
    'PG': 'PGK', // Papua New Guinea
    
    // Default fallback
    'XX': 'ZAR'  // Default to ZAR for unknown countries
  }

  return countryCurrencyMap[userCountry || ''] || 'ZAR'
}

// Base pricing in ZAR (South African Rand)
export const BASE_PRICES = {
  PRO: 1100,      // R1,100
  ENTERPRISE: 1800  // R1,800
}

// Currency conversion rates (approximate, should be updated with real-time rates)
export const CURRENCY_RATES: Record<string, number> = {
  'ZAR': 1.0,     // Base currency
  'USD': 0.055,   // 1 ZAR = 0.055 USD
  'EUR': 0.051,   // 1 ZAR = 0.051 EUR
  'GBP': 0.044,   // 1 ZAR = 0.044 GBP
  'NGN': 85.0,    // 1 ZAR = 85 NGN
  'GHS': 0.67,    // 1 ZAR = 0.67 GHS
  'KES': 7.2,     // 1 ZAR = 7.2 KES
  'EGP': 1.7,     // 1 ZAR = 1.7 EGP
  'MAD': 0.55,    // 1 ZAR = 0.55 MAD
  'TND': 0.17,    // 1 ZAR = 0.17 TND
  'DZD': 7.4,     // 1 ZAR = 7.4 DZD
  'ETB': 3.1,     // 1 ZAR = 3.1 ETB
  'UGX': 204.0,   // 1 ZAR = 204 UGX
  'TZS': 130.0,   // 1 ZAR = 130 TZS
  'BWP': 0.74,    // 1 ZAR = 0.74 BWP
  'ZMW': 1.1,     // 1 ZAR = 1.1 ZMW
  'MWK': 95.0,    // 1 ZAR = 95 MWK
  'MZN': 3.5,     // 1 ZAR = 3.5 MZN
  'AOA': 45.0,    // 1 ZAR = 45 AOA
  'CAD': 0.075,   // 1 ZAR = 0.075 CAD
  'AUD': 0.083,   // 1 ZAR = 0.083 AUD
  'JPY': 8.2,     // 1 ZAR = 8.2 JPY
  'CNY': 0.40,    // 1 ZAR = 0.40 CNY
  'INR': 4.6,     // 1 ZAR = 4.6 INR
  'BRL': 0.28,    // 1 ZAR = 0.28 BRL
  'MXN': 0.95,    // 1 ZAR = 0.95 MXN
  'ARS': 45.0,    // 1 ZAR = 45 ARS
  'CLP': 50.0,    // 1 ZAR = 50 CLP
  'COP': 220.0,   // 1 ZAR = 220 COP
  'PEN': 0.21,    // 1 ZAR = 0.21 PEN
  'UYU': 2.1,     // 1 ZAR = 2.1 UYU
  'AED': 0.20,    // 1 ZAR = 0.20 AED
  'SAR': 0.21,    // 1 ZAR = 0.21 SAR
  'QAR': 0.20,    // 1 ZAR = 0.20 QAR
  'KWD': 0.017,   // 1 ZAR = 0.017 KWD
  'BHD': 0.021,   // 1 ZAR = 0.021 BHD
  'OMR': 0.021,   // 1 ZAR = 0.021 OMR
  'JOD': 0.039,   // 1 ZAR = 0.039 JOD
  'LBP': 830.0,   // 1 ZAR = 830 LBP
  'ILS': 0.20,    // 1 ZAR = 0.20 ILS
  'TRY': 1.7,     // 1 ZAR = 1.7 TRY
  'SGD': 0.075,   // 1 ZAR = 0.075 SGD
  'MYR': 0.26,    // 1 ZAR = 0.26 MYR
  'THB': 2.0,     // 1 ZAR = 2.0 THB
  'IDR': 850.0,   // 1 ZAR = 850 IDR
  'PHP': 3.1,     // 1 ZAR = 3.1 PHP
  'VND': 1350.0,  // 1 ZAR = 1350 VND
  'KRW': 73.0,    // 1 ZAR = 73 KRW
  'TWD': 1.8,     // 1 ZAR = 1.8 TWD
  'HKD': 0.43,    // 1 ZAR = 0.43 HKD
  'CHF': 0.049,   // 1 ZAR = 0.049 CHF
  'SEK': 0.58,    // 1 ZAR = 0.58 SEK
  'NOK': 0.58,    // 1 ZAR = 0.58 NOK
  'DKK': 0.38,    // 1 ZAR = 0.38 DKK
  'PLN': 0.22,    // 1 ZAR = 0.22 PLN
  'CZK': 1.3,     // 1 ZAR = 1.3 CZK
  'HUF': 20.0,    // 1 ZAR = 20 HUF
  'RON': 0.25,    // 1 ZAR = 0.25 RON
  'BGN': 0.10,    // 1 ZAR = 0.10 BGN
  'HRK': 0.38,    // 1 ZAR = 0.38 HRK
  'RSD': 6.0,     // 1 ZAR = 6.0 RSD
  'UAH': 2.0,     // 1 ZAR = 2.0 UAH
  'RUB': 5.0,     // 1 ZAR = 5.0 RUB
  'NZD': 0.090,   // 1 ZAR = 0.090 NZD
  'FJD': 0.12,    // 1 ZAR = 0.12 FJD
  'PGK': 0.20     // 1 ZAR = 0.20 PGK
}

// Get pricing for a specific currency
export function getPricing(currency: string = 'ZAR') {
  const rate = CURRENCY_RATES[currency] || 1.0
  const proPrice = Math.round(BASE_PRICES.PRO * rate)
  const enterprisePrice = Math.round(BASE_PRICES.ENTERPRISE * rate)
  
  return {
    pro: proPrice,
    enterprise: enterprisePrice,
    currency: currency
  }
}

// Get pricing in kobo/cents for Paystack
export function getPricingInCents(currency: string = 'ZAR') {
  const pricing = getPricing(currency)
  return {
    pro: pricing.pro * 100, // Convert to cents
    enterprise: pricing.enterprise * 100, // Convert to cents
    currency: currency
  }
}

// Track currency usage for analytics
export function trackCurrencyUsage(currency: string, amount: number, context: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'currency_usage', {
      currency_code: currency,
      amount: amount,
      context: context
    })
  }
  
  // Also log to console for debugging
  console.log(`[Currency] ${currency} ${amount} used in ${context}`)
}
