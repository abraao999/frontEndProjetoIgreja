import axios from 'axios';

const url = 'http://31.220.52.85:3001';
// const url = 'http://localhost:3001';

export default axios.create({
  baseURL: url,
});
