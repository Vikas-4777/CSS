export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', user.token);
};

export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  window.location.href = '/';
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};
