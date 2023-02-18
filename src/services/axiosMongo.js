import axios from 'axios';

// const url = 'https://api-projeto-node.herokuapp.com/';
// const url = 'http://192.16.1.209:3001';
// const url = 'http://192.168.0.186:3001';
// const url = 'http://localhost:3001';
const url = 'https://apigincana.herokuapp.com/';

export default axios.create({
  baseURL: url,
});
