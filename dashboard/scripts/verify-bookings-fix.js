// Verification script for bookings API
// Tests endpoints against the running server

async function verifyBookings() {
    console.log('Verifying Booking API Fixes...');

    try {
        // 1. Fetch Bookings (GET)
        console.log('1. Testing GET http://localhost:3001/api/bookings...');
        const response = await fetch('http://localhost:3001/api/bookings');

        if (response.status === 200) {
            const data = await response.json();
            console.log('✅ GET /api/bookings - Success');
            const count = data.bookings ? data.bookings.length : (Array.isArray(data) ? data.length : 0);
            console.log(`   Fetched ${count} bookings`);

            // 2. Test PUT (which proxies to PATCH) if we have a booking
            let bookingId;
            if (data.bookings && data.bookings.length > 0) {
                bookingId = data.bookings[0].id;
            } else if (Array.isArray(data) && data.length > 0) {
                bookingId = data[0].id;
            }

            if (bookingId) {
                console.log(`2. Testing Update on Booking ID: ${bookingId}`);

                // Call the frontend API route with PUT
                // The route handler should proxy this to PATCH /bookings/:id on backend
                const updateResponse = await fetch(`http://localhost:3001/api/bookings?id=${bookingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ notes: `Updated check ${new Date().toISOString()}` })
                });

                if (updateResponse.status === 200) {
                    console.log('✅ PUT (Proxy to PATCH) - Success');
                    const updateData = await updateResponse.json();
                    console.log('   Response:', JSON.stringify(updateData).substring(0, 100) + '...');
                } else {
                    console.error('❌ PUT (Proxy to PATCH) - Failed', updateResponse.status);
                    const text = await updateResponse.text();
                    console.error('   Error:', text);
                }
            } else {
                console.log('⚠️ No bookings found to test update. Skipping step 2.');
            }

        } else {
            console.error('❌ GET /api/bookings - Failed', response.status);
            const text = await response.text();
            console.error('   Error:', text);
        }

    } catch (error) {
        console.error('Verification failed:', error);
    }
}

verifyBookings();
