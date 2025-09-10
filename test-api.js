// Test script to check API endpoint
const fetchServiceTypes = async () => {
  try {
    console.log('Testing API fetch...');
    const response = await fetch('http://localhost:3001/api/service-types', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Response data:', data);
  } catch (err) {
    console.error('Error:', err);
  }
};

fetchServiceTypes();