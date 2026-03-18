const fs = require('fs');
const path = require('path');

async function testBucket(bucketName) {
    const fileBuffer = Buffer.from('hello world');
    const filePath = encodeURIComponent(`equipments/${Date.now()}_test.txt`);
    const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o?name=${filePath}`;

    try {
        const res = await fetch(uploadUrl, {
            method: 'POST',
            body: fileBuffer,
            headers: {
                'Content-Type': 'text/plain',
            },
        });

        console.log(`Bucket ${bucketName} -> STATUS:`, res.status);
        const data = await res.json();
        if (res.status !== 200) console.log(JSON.stringify(data));
    } catch (err) {
        console.error('FETCH ERROR:', err);
    }
}

testBucket('ghost-trips.appspot.com');
testBucket('ghost-trips.firebasestorage.app');
