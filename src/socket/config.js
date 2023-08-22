import io from "socket.io-client";

const apiUrl = process.env.REACT_APP_AMJOR_API_URL;
let socket = io(`${apiUrl}`);

export default socket;