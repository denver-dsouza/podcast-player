const express = require('express');
// const axios = require('axios');
// const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const CryptoJS = require('crypto-js');
const fetch = require('node-fetch');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const authKey = process.env.AUTH_KEY;
const secretKey = process.env.SECRET_KEY;
const userAgent = process.env.USER_AGENT;
const apiEndpoint = process.env.API_ENDPOINT;

app.use(express.static(path.join(__dirname, 'public')));

// Shared authentication function
function generateAuthHeaders() {
    const apiHeaderTime = Math.floor(new Date().getTime() / 1000);
    const hash = CryptoJS.SHA1(authKey + secretKey + apiHeaderTime).toString(CryptoJS.enc.Hex);

    return {
        'User-Agent': userAgent,
        'X-Auth-Key': authKey,
        'X-Auth-Date': apiHeaderTime.toString(),
        'Authorization': hash
    }
}

// Search for podcasts

app.get('/api/search', async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: 'Query Parameter is required!' });
    }

    const headers = generateAuthHeaders();

    try {
        const response = await fetch(`${apiEndpoint}/search/byterm?q=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: headers
        });

        if (response.ok && response.headers.get('content-type').includes('application/JSON')) {
            const data = await response.json();
            res.json(data);
        } else {
            const rawText = await response.text();
            console.log('Raw Response: ', rawText);
            res.status(500).json({ error: 'Invalid response from API', rawText });
        }

    } catch(error) {
        console.error('Error fetching API: ', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT} pointing to ${apiEndpoint}`);
});


// const PANTRY_ID = process.env.PANTRY_ID; 

// Use your Pantry ID
// const PANTRY_API_BASE_URL = `https://getpantry.cloud/apiv1/pantry/${PANTRY_ID}/basket`;

// app.use(cors());
// app.use(express.json());

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'index.html'));
// });

// app.get('/favicon.ico', (req, res) => {
//     res.sendFile(path.join(__dirname, 'favicon.ico'));
// });

// // Generic handler for GET request to fetch data from a specific basket
// app.get('/:basketName', async (req, res) => {
//     const { basketName } = req.params;
//     try {
//         const response = await axios.get(`${PANTRY_API_BASE_URL}/${basketName}`);
//         res.json(response.data);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Generic handler for POST request to add new data to a specific basket
// app.post('/:basketName', async (req, res) => {
//     const { basketName } = req.params;
//     const newData = req.body;
//     try {
//         const response = await axios.post(`${PANTRY_API_BASE_URL}/${basketName}`, newData);
//         res.json(response.data);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Generic handler for PUT request to update data in a specific basket
// app.put('/:basketName', async (req, res) => {
//     const { basketName } = req.params;
//     const updatedData = req.body;
//     try {
//         const response = await axios.put(`${PANTRY_API_BASE_URL}/${basketName}`, updatedData);
//         res.json(response.data);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Generic handler for DELETE request to clear data from a specific basket
// app.delete('/:basketName', async (req, res) => {
//     const { basketName } = req.params;
//     try {
//         const response = await axios.delete(`${PANTRY_API_BASE_URL}/${basketName}`);
//         res.json({ message: `Basket ${basketName} cleared successfully.` });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });