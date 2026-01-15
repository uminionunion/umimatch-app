class API {
  static baseURL = '/api';

  static getHeaders() {
    const token = Storage.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Auth
  static async register(username, password, phone) {
    const response = await fetch(`${this.baseURL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ username, password, phone })
    });
    return response.json();
  }

  static async login(username, password) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ username, password })
    });
    return response.json();
  }

  // Users
  static async getProfile() {
    const response = await fetch(`${this.baseURL}/users/profile`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  static async updateProfile(data) {
    const response = await fetch(`${this.baseURL}/users/profile`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  }

  static async updateProfileImages(data) {
    const response = await fetch(`${this.baseURL}/users/profile-images`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  }

  static async getDiscoverUsers() {
    const response = await fetch(`${this.baseURL}/users/discover`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  // Matches
  static async likeUser(likedUserId) {
    const response = await fetch(`${this.baseURL}/matches/like`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ likedUserId })
    });
    return response.json();
  }

  static async skipUser(skippedUserId) {
    const response = await fetch(`${this.baseURL}/matches/skip`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ skippedUserId })
    });
    return response.json();
  }

  static async getMatches() {
    const response = await fetch(`${this.baseURL}/matches/list`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  static async getMatchDetails(matchId) {
    const response = await fetch(`${this.baseURL}/matches/${matchId}`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  static async unmatch(matchId) {
    const response = await fetch(`${this.baseURL}/matches/unmatch`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ matchId })
    });
    return response.json();
  }

  // Messages
  static async sendMessage(receiverId, content) {
    const response = await fetch(`${this.baseURL}/messages/send`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ receiverId, content })
    });
    return response.json();
  }

  static async getMessages(userId) {
    const response = await fetch(`${this.baseURL}/messages/${userId}`, {
      headers: this.getHeaders()
    });
    return response.json();
  }
}