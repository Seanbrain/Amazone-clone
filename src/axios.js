import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:5001/my-e-clone-c271b/us-central1/appi/' //THE API (cloud function ) URL
})

export default instance;