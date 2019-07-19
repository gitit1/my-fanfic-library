import axios from 'axios';

console.log('process.env.NODE_ENV:',process.env.NODE_ENV)

const instance = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') 
                 ? axios.create({baseURL: 'http://localhost:5000'})
                 : axios.create({baseURL: 'https://192.236.176.82:5000'});


export default instance;