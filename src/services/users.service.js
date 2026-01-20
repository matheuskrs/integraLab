import http from './http';

export function getUsers() {
  return http.get('/users');
}