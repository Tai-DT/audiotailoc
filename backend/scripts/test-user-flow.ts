import axios from 'axios';

const API_URL = 'http://localhost:3010/api/v1'; // Backend runs on 3010 with /api/v1 prefix

async function runTest() {
    try {
        const email = `testuser_${Date.now()}@example.com`;
        const password = 'Password123!';

        console.log(`1. Registering user: ${email}`);
        await axios.post(`${API_URL}/auth/register`, {
            email,
            password,
            name: 'Test User',
            phone: '1234567890'
        });

        console.log('2. Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email,
            password
        });
        console.log('   Login response data:', JSON.stringify(loginRes.data, null, 2));
        const accessToken = loginRes.data.data.token;
        if (!accessToken) {
            console.error('   No accessToken found in response data.data.token');
            process.exit(1); // Added this to ensure test fails if token is missing
        }
        console.log('   Login successful.');

        const headers = { Authorization: `Bearer ${accessToken}` };

        console.log('3. Fetching initial profile...');
        const profileRes1 = await axios.get(`${API_URL}/users/profile`, { headers });
        console.log('   Initial profile:', profileRes1.data);

        console.log('4. Updating profile with new fields...');
        const updateData = {
            address: '123 Test St, Test City',
            dateOfBirth: '1990-01-01',
            gender: 'male',
            name: 'Updated Name'
        };
        const updateRes = await axios.patch(`${API_URL}/users/profile`, updateData, { headers });
        console.log('   Update response:', updateRes.data);

        console.log('5. Verifying updates...');
        const profileRes2 = await axios.get(`${API_URL}/users/profile`, { headers });
        const profile = profileRes2.data;

        const actualDob = profile.data.dateOfBirth ? new Date(profile.data.dateOfBirth).toISOString().split('T')[0] : null;

        if (profile.data.address !== updateData.address ||
            actualDob !== updateData.dateOfBirth ||
            profile.data.gender !== updateData.gender ||
            profile.data.name !== updateData.name) {
            console.error('   FAILURE: Profile data mismatch!');
            console.error('   Expected:', updateData);
            console.error('   Actual DOB:', actualDob);
            console.error('   Actual Full:', profile);
            process.exit(1);
        } else {
            console.log('   SUCCESS: Profile updated correctly!');
        }

        console.log('6. Testing security (updating role)...');
        try {
            await axios.patch(`${API_URL}/users/profile`, { role: 'ADMIN' }, { headers });
            // We expect the backend to ignore role update or return the user without role change
            // My implementation deletes role from DTO, so it should just ignore it.
            const profileRes3 = await axios.get(`${API_URL}/users/profile`, { headers });
            if (profileRes3.data.role !== 'USER') {
                console.error('   FAILURE: User was able to change role!');
                process.exit(1);
            }
            console.log('   SUCCESS: Role update ignored/prevented.');
        } catch (error) {
            console.log('   SUCCESS: Role update failed as expected (if it threw error).');
        }

    } catch (error: any) {
        console.error('TEST FAILED:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            console.error('No response received');
        }
        process.exit(1);
    }
}

runTest();
