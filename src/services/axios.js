import axios from 'axios';

const url = 'https://api-projeto-node.herokuapp.com/';
export default axios.create({
  baseURL: url,
});
