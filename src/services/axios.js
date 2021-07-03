import axios from 'axios';

const url = '31.220.52.85';
// const url = 'http://localhost:3001';

export default axios.create({
  baseURL: url,
});
