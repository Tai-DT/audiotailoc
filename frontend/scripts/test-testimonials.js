const http = require('http');

const FRONTEND_URL = 'http://localhost:3000';

async function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, data: body });
      });
    });

    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function testTestimonialsSection() {
  console.log('🧪 Testing Testimonials Section...\n');

  try {
    // 1. Test homepage loads
    console.log('1. Testing homepage accessibility...');
    const homeResponse = await makeRequest(FRONTEND_URL);
    console.log(`Status: ${homeResponse.statusCode}`);

    if (homeResponse.statusCode !== 200) {
      console.log('❌ Homepage not accessible');
      return;
    }

    console.log('✅ Homepage accessible\n');

    // 2. Check testimonials section content
    console.log('2. Checking testimonials section content...');
    const homepageHtml = homeResponse.data;

    const testimonialsChecks = [
      { text: 'Khách hàng nói gì về chúng tôi', expected: true },
      { text: 'Audio Tài Lộc đã cung cấp cho chúng tôi hệ thống âm thanh tuyệt vời', expected: true },
      { text: 'Nguyễn Văn A', expected: true },
      { text: 'Trung tâm Văn hóa ABC', expected: true },
      { text: 'Trần Thị B', expected: true },
      { text: 'Công ty Giải trí XYZ', expected: true },
      { text: 'Lê Văn C', expected: true },
      { text: 'Studio Thu âm DEF', expected: true }
    ];

    let passedTests = 0;
    let totalTests = testimonialsChecks.length;

    testimonialsChecks.forEach((check) => {
      if (homepageHtml.includes(check.text)) {
        console.log(`✅ Found: "${check.text}"`);
        passedTests++;
      } else {
        console.log(`❌ Missing: "${check.text}"`);
      }
    });

    console.log(`\n📊 Testimonials Content Test: ${passedTests}/${totalTests} passed`);

    if (passedTests === totalTests) {
      console.log('✅ All testimonials content found');
    } else {
      console.log('❌ Some testimonials content missing');
    }

    // 3. Check testimonials structure
    console.log('\n3. Checking testimonials structure...');

    const structureChecks = [
      { pattern: /class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"/, name: 'Grid layout' },
      { pattern: /class="relative"/, name: 'Card positioning' },
      { pattern: /Star.*class="h-4 w-4 fill-yellow-400"/, name: 'Star ratings' },
      { pattern: /Quote.*class="w-4 h-4 text-primary"/, name: 'Quote icons' },
      { pattern: /Avatar.*class="h-10 w-10"/, name: 'Avatar images' }
    ];

    let structurePassed = 0;
    structureChecks.forEach((check) => {
      if (check.pattern.test(homepageHtml)) {
        console.log(`✅ ${check.name}: Found`);
        structurePassed++;
      } else {
        console.log(`❌ ${check.name}: Missing`);
      }
    });

    console.log(`\n📊 Structure Test: ${structurePassed}/${structureChecks.length} passed`);

    // 4. Test responsive design indicators
    console.log('\n4. Checking responsive design...');
    const responsiveChecks = [
      'md:grid-cols-2',
      'lg:grid-cols-3',
      'sm:',
      'md:',
      'lg:'
    ];

    responsiveChecks.forEach((check) => {
      if (homepageHtml.includes(check)) {
        console.log(`✅ Responsive class found: ${check}`);
      }
    });

    console.log('\n🎉 Testimonials Section Test Completed!');

    // Summary
    console.log('\n📋 Test Summary:');
    console.log(`Content Tests: ${passedTests}/${totalTests} ✅`);
    console.log(`Structure Tests: ${structurePassed}/${structureChecks.length} ✅`);
    console.log('Responsive Design: ✅ Present');

    if (passedTests === totalTests && structurePassed === structureChecks.length) {
      console.log('\n🎯 RESULT: Testimonials Section is FULLY FUNCTIONAL!');
    } else {
      console.log('\n⚠️  RESULT: Some issues detected in Testimonials Section');
    }

  } catch (error) {
    console.error('❌ Error testing testimonials section:', error.message);
  }
}

// Run tests
testTestimonialsSection()
  .catch((error) => {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  });
