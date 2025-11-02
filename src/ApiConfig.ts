export const BACKEND_IP = '192.168.1.8';
export const BACKEND_PORT = '8082';
export const BASE_URL = `http://${BACKEND_IP}:${BACKEND_PORT}`
export const BASE_API_URL = `http://${BACKEND_IP}:${BACKEND_PORT}/api/`; 
export const USER_API_URL = BASE_API_URL + "users"
export const LOGIN_URL = USER_API_URL + "/login"; 