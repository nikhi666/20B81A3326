const express = require('express');
const axios = require('axios');

const app = express();
const port = 8008;

const fetchNumFromURL = async (url) => {
    try {
        const response = await axios.get(url);
        return response.data.numbers || [];
    } catch (error) {
        console.error(`Error fetching numbers from ${url}: ${error.message}`);
        return [];
    }
};

const mergeAndSortNum = async (urls) => {
    const N = new Set();

    for (const url of urls) {
        const numbers = await fetchNumFromURL(url);
        numbers.forEach(number => N.add(number));
    }

    return Array.from(N).sort((a, b) => a - b);
};

app.get('/numbers', async (req, res) => {
    try {
        const urlsWords = req.query.url || '';
        const urls = Array.isArray(urlsWords) ? urlsWords : [urlsWords];
        const sortedNum = await mergeAndSortNum(urls);
        res.json({ numbers: sortedNum });
    } catch (error) {
        console.error("An error occurred:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on the port ${port}`);
});