/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh', 'ru', 'es', 'ko', 'ja', 'pt', 'tr', 'vi', 'de', 'fr', 'hi', 'id'],
  },
  /** To avoid issues when deploying to some paas (vercel...) */
  localePath:
    typeof window === 'undefined'
      ? require('path').resolve('./public/locales')
      : '/locales',

  reloadOnPrerender: process.env.NODE_ENV === 'development',
  
  /**
   * @link https://github.com/i18next/next-i18next#6-advanced-configuration
   */
  // saveMissing: false,
  strictMode: true,
  serializeConfig: false,
  react: { 
    useSuspense: false,
    // Ensure consistent hydration
    bindI18n: 'languageChanged loaded',
    bindI18nStore: 'added removed',
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p', 'span'],
  }
}
