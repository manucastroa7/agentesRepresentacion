const http = require('http');

http.get('http://localhost:3000/public/players', (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
        data += chunk;
    });

    resp.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log('Keys:', Object.keys(json));
            if (json.data) {
                console.log('Data is array:', Array.isArray(json.data));
                console.log('Data length:', json.data.length);
                if (json.data.length > 0) {
                    console.log('First item keys:', Object.keys(json.data[0]));
                }
            }
        } catch (e) {
            console.log('Error parsing JSON:', e.message);
            console.log('Raw data:', data.substring(0, 100));
        }
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});
