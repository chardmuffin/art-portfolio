import axios from 'axios';

axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_API_BASE_URL: 'http://localhost:3001';
axios.defaults.withCredentials = true;

console.log("axiosConfig.js", axios.defaults.baseURL)

export default axios;