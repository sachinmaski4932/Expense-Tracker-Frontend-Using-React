import axios from "axios";
import { AXIOS_URL } from "../constanst/config";

const Ax = axios.create({
    baseURL: AXIOS_URL,
    withCredentials: true,
});

export default Ax;