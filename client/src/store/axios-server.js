import axios from 'axios';

console.log('process.env.NODE_ENV:',process.env.NODE_ENV)

const instance = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') 
                 ? axios.create({baseURL: 'http://localhost:5000'})
                 : (window.location.href.includes('mfl'))
                 ? axios.create({baseURL: 'http://192.236.176.82:5008'})
                 : axios.create({baseURL: 'http://192.236.176.82:5000'});

export default instance;