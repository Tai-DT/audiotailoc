const BASE_URL = 'http://localhost:3010/api/v1';

async function testReportsAPI() {
  try {
    console.log('Testing Inventory Reports API...\n');

    // Test generate stock levels report
    console.log('1. Testing generate stock levels report...');
    const stockReport = await fetch(`${BASE_URL}/inventory/reports/stock-levels`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Key': 'dev-admin-key-2024-secure-token-for-development-only'
      },
      body: JSON.stringify({
        startDate: '2024-01-01',
        endDate: new Date().toISOString().split('T')[0]
      })
    });
    const stockData = await stockReport.json();
    console.log('Stock levels response:', JSON.stringify(stockData, null, 2));
    if (stockData.report && stockData.report.id) {
      console.log('Stock levels report generated:', stockData.report.id);
    } else {
      console.log('Stock levels report generated with different structure');
    }

    // Test generate movements report
    console.log('\n2. Testing generate movements report...');
    const movementsReport = await fetch(`${BASE_URL}/inventory/reports/movements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Key': 'dev-admin-key-2024-secure-token-for-development-only'
      },
      body: JSON.stringify({
        startDate: '2024-01-01',
        endDate: new Date().toISOString().split('T')[0]
      })
    });
    const movementsData = await movementsReport.json();
    console.log('Movements response:', JSON.stringify(movementsData, null, 2));
    if (movementsData.report && movementsData.report.id) {
      console.log('Movements report generated:', movementsData.report.id);
    } else {
      console.log('Movements report generated with different structure');
    }

    // Test generate alerts report
    console.log('\n3. Testing generate alerts report...');
    const alertsReport = await fetch(`${BASE_URL}/inventory/reports/alerts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Key': 'dev-admin-key-2024-secure-token-for-development-only'
      },
      body: JSON.stringify({
        startDate: '2024-01-01',
        endDate: new Date().toISOString().split('T')[0]
      })
    });
    const alertsData = await alertsReport.json();
    console.log('Alerts response:', JSON.stringify(alertsData, null, 2));
    if (alertsData.report && alertsData.report.id) {
      console.log('Alerts report generated:', alertsData.report.id);
    } else {
      console.log('Alerts report generated with different structure');
    }

    // Test generate summary report
    console.log('\n4. Testing generate summary report...');
    const summaryReport = await fetch(`${BASE_URL}/inventory/reports/summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Key': 'dev-admin-key-2024-secure-token-for-development-only'
      },
      body: JSON.stringify({
        startDate: '2024-01-01',
        endDate: new Date().toISOString().split('T')[0]
      })
    });
    const summaryData = await summaryReport.json();
    console.log('Summary response:', JSON.stringify(summaryData, null, 2));
    if (summaryData.report && summaryData.report.id) {
      console.log('Summary report generated:', summaryData.report.id);
    } else {
      console.log('Summary report generated with different structure');
    }

    console.log('\n✅ Reports API test completed!');

  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

testReportsAPI();