// Test API calls from frontend
const API_BASE = 'http://localhost:3010/api/v1';

async function testProjectsAPI() {
  try {
    console.log('🧪 Testing projects API calls...');

    // Test without auth
    const response1 = await fetch(`${API_BASE}/projects`);
    console.log('Response without auth:', response1.status);

    // Test featured projects
    const response2 = await fetch(`${API_BASE}/projects/featured`);
    console.log('Featured projects response:', response2.status);

    if (response2.ok) {
      const data = await response2.json();
      console.log('Featured projects data:', data);
    }

    // Test with admin key
    const response3 = await fetch(`${API_BASE}/projects`, {
      headers: {
        'X-Admin-Key': 'dev-admin-key-2024'
      }
    });
    console.log('Response with admin key:', response3.status);

  } catch (error) {
    console.error('❌ API test failed:', error);
  }
}

// Run test when page loads
if (typeof window !== 'undefined') {
  testProjectsAPI();
}

export { testProjectsAPI };
