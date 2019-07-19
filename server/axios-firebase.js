const axios = require('axios');

const instance = axios.create({
    baseURL: 'https://my-fanfic-lybrare.firebaseio.com/'
});

module.exports = instance;