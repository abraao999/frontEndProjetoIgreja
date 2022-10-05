import axios from "axios";

const url = "https://api-projeto-node.herokuapp.com/";
// const url = "http://192.16.1.211:3001";
// const url = "http://192.168.0.123:3001";
// const url = "http://localhost:3001";
export default axios.create({
  baseURL: url,
});
