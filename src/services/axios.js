import axios from 'axios';

const url = 'https://api-projeto-node.herokuapp.com/';
// const url = 'http://localhost:3001';
export default axios.create({
  baseURL: url,
});
