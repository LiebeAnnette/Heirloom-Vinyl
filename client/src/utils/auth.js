// client/src/utils/auth.js

// Save token to localStorage
export const login = (token) => {
  localStorage.setItem("id_token", token);
};

// Remove token from localStorage
export const logout = () => {
  localStorage.removeItem("id_token");
};

// Get the token
export const getToken = () => {
  return localStorage.getItem("id_token");
};

// Check if token exists & is valid (no expiration check yet)
export const loggedIn = () => {
  return !!localStorage.getItem("id_token");
};
