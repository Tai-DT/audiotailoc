
import axios from 'axios';

async function main() {
    console.log('Testing Settings API...');
    try {
        const response = await axios.get('http://localhost:3010/api/v1/content/settings');
        console.log('Response Status:', response.status);
        console.log('Response Data:', response.data);
    } catch (error: any) {
        console.error('API Error:', error.message);
        if (error.response) {
            console.error('Response Status:', error.response.status);
            console.error('Response Data:', error.response.data);
        }
    }
}

main();
