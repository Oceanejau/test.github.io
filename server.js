const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/get-token', async (req, res) => {
    const { code } = req.body;

    const client_id = "u-s4t2ud-00d16a6189e88b09e29da3901b88914a2c9cbaea9f694ef4b02070089c7abcae";
    const client_secret = "votre_client_secret"; // Remplacez par votre client secret
    const redirect_uri = "https://oceanejau.github.io/test.github.io/";
    const token_url = "https://api.intra.42.fr/oauth/token";

    try {
        const response = await axios.post(token_url, null, {
            params: {
                grant_type: 'authorization_code',
                client_id,
                client_secret,
                code,
                redirect_uri
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/get-user-info', async (req, res) => {
    const { token } = req.body;

    const user_url = "https://api.intra.42.fr/v2/me";

    try {
        const response = await axios.get(user_url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
