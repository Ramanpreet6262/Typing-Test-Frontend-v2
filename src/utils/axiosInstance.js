import axios from 'axios';

// A custom axios instance for using in various components
const instance = axios.create({
  baseURL: 'https://lpolw6u28j.execute-api.us-east-1.amazonaws.com/dev/'
});

export default instance;
