import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

console.log("axiosConfig.js", axios.defaults.baseURL)

export default axios;