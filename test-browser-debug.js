// Browser debug script for service types
// Copy and paste this into browser console on http://localhost:3001/dashboard/services/types

// Test API call directly
async function testServiceTypesAPI() {
  try {
    console.log('Testing service types API...');

    // Get token from localStorage
    const token = localStorage.getItem('accessToken');
    console.log('Token exists:', !!token);

    if (!token) {
      console.error('No access token found');
      return;
    }

    // Test API call
    const response = await fetch('http://localhost:3010/api/v1/services/types', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      const data = await response.json();
      console.log('API Response:', data);
      console.log('Service types count:', data.data?.length || 0);
    } else {
      const errorText = await response.text();
      console.error('API Error:', errorText);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

// Test auth status
function testAuthStatus() {
  const token = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  console.log('Auth Status:');
  console.log('- Access Token:', !!token);
  console.log('- Refresh Token:', !!refreshToken);
  console.log('- Token length:', token?.length || 0);
}

// Run tests
testAuthStatus();
testServiceTypesAPI();