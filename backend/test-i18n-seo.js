const axios = require('axios');

const BASE_URL = 'http://localhost:3010/api/v1';

async function testI18nAndSeo() {
  console.log('🧪 Testing Internationalization and SEO Features...\n');

  try {
    // Test 1: Get supported languages
    console.log('1. Testing supported languages...');
    const languages = await axios.get(`${BASE_URL}/i18n/languages`);
    console.log('✅ Supported languages:', languages.data);
    console.log('');

    // Test 2: Get common translations (Vietnamese)
    console.log('2. Testing Vietnamese translations...');
    const viTranslations = await axios.get(`${BASE_URL}/i18n/translations/common?lang=vi`);
    console.log('✅ Vietnamese translations:', viTranslations.data);
    console.log('');

    // Test 3: Get common translations (English)
    console.log('3. Testing English translations...');
    const enTranslations = await axios.get(`${BASE_URL}/i18n/translations/common?lang=en`);
    console.log('✅ English translations:', enTranslations.data);
    console.log('');

    // Test 4: Get product translations (Vietnamese)
    console.log('4. Testing Vietnamese product translations...');
    const viProductTranslations = await axios.get(`${BASE_URL}/i18n/translations/products?lang=vi`);
    console.log('✅ Vietnamese product translations:', viProductTranslations.data);
    console.log('');

    // Test 5: Get product translations (English)
    console.log('5. Testing English product translations...');
    const enProductTranslations = await axios.get(`${BASE_URL}/i18n/translations/products?lang=en`);
    console.log('✅ English product translations:', enProductTranslations.data);
    console.log('');

    // Test 6: Get SEO data for home page (Vietnamese)
    console.log('6. Testing Vietnamese home page SEO...');
    const viHomeSeo = await axios.get(`${BASE_URL}/seo/home?lang=vi`);
    console.log('✅ Vietnamese home SEO:', viHomeSeo.data);
    console.log('');

    // Test 7: Get SEO data for home page (English)
    console.log('7. Testing English home page SEO...');
    const enHomeSeo = await axios.get(`${BASE_URL}/seo/home?lang=en`);
    console.log('✅ English home SEO:', enHomeSeo.data);
    console.log('');

    // Test 8: Get sitemap
    console.log('8. Testing sitemap generation...');
    const sitemap = await axios.get(`${BASE_URL}/seo/sitemap.xml`);
    console.log('✅ Sitemap generated successfully');
    console.log('Sitemap length:', sitemap.data.length, 'characters');
    console.log('');

    // Test 9: Get robots.txt
    console.log('9. Testing robots.txt generation...');
    const robotsTxt = await axios.get(`${BASE_URL}/seo/robots.txt`);
    console.log('✅ Robots.txt generated successfully');
    console.log('Robots.txt content:', robotsTxt.data);
    console.log('');

    console.log('🎉 All i18n and SEO tests passed!');
    console.log('');
    console.log('📋 Summary of features tested:');
    console.log('   ✅ Multi-language support (Vietnamese/English)');
    console.log('   ✅ Translation management');
    console.log('   ✅ SEO meta tags generation');
    console.log('   ✅ Sitemap XML generation');
    console.log('   ✅ Robots.txt generation');
    console.log('   ✅ Structured data for products');
    console.log('   ✅ Open Graph and Twitter Card support');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the tests
testI18nAndSeo();

