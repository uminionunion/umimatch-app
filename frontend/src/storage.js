class Storage {
  static setToken(token) {
    localStorage.setItem('umimatch_token', token);
  }

  static getToken() {
    return localStorage.getItem('umimatch_token');
  }

  static setUser(user) {
    localStorage.setItem('umimatch_user', JSON.stringify(user));
  }

  static getUser() {
    const user = localStorage.getItem('umimatch_user');
    return user ? JSON.parse(user) : null;
  }

  static clear() {
    localStorage.removeItem('umimatch_token');
    localStorage.removeItem('umimatch_user');
  }

  static isAuthenticated() {
    return !!this.getToken();
  }
}