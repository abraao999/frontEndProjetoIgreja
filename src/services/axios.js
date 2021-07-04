import axios from 'axios';

// const url = 'https://31.220.52.85:3001';
const url = 'https://api-projeto-node.herokuapp.com/';
// const url = 'http://localhost:3001';

export default axios.create({
  baseURL: url,
});
