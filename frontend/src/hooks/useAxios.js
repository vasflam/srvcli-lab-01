import axios from 'axios';
import { config } from '../config';

const api = axios.create({
  baseURL: `${config.apiUrl}`,
});

export function useAxios() {
  return api;
}
