const express = require('express');
const axios = require('axios');

var app = express();
app.use(express.json());

const PORT = process.env.PORT || 4444;
const CLIENT_ID = process.env.CLIENT_ID || null;
const CLIENT_SECRET = process.env.CLIENT_SECRET || null;

app.get('/:album', (req, res) => {
    if (!CLIENT_ID) res.status(403).send('No client ID available.');
    if (!CLIENT_SECRET) res.status(403).send('No client secret available.');

    axios({
        url: 'https://accounts.spotify.com/api/token',
        method: 'post',
        params: {
            grant_type: 'client_credentials'
        },
        headers: {
            'Accept':'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        auth: {
            username: CLIENT_ID,
            password: CLIENT_SECRET
        }
    }).then(function(response) {
        return axios({
            url: `https://api.spotify.com/v1/search?q=${req.params.album}&type=album`,
            method: 'get',
            headers: {
                'Authorization': `${response.data.token_type} ${response.data.access_token}`,
                "Accept": "application/json",
                'Content-Type': 'application/json'
            }
        });
    }).then(function(response) {
        res.send(response.data);
    }).catch(function(error) {
        res.status(400).send(error);
    });
});

app.listen(PORT, () => console.log(`Running node app on port ${PORT}.`));