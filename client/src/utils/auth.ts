// Save token to localStorage
export const login = (token: string) => {
  localStorage.setItem("id_token", token);
};

// Remove token from localStorage
export const logout = () => {
  localStorage.removeItem("id_token");
};

// Get the token
export const getToken = (): string | null => {
  return localStorage.getItem("id_token");
};

// Check if token exists
export const loggedIn = (): boolean => {
  return !!localStorage.getItem("id_token");
};
