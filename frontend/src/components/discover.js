class Discover {
  static async render() {
    try {
      const response = await API.getDiscoverUsers();
      const users = response.users || [];

      if (users.length === 0) {
        return `
          <div class="discover-container">
            <div class="discover-header">
              <h2>Discover</h2>
              <button onclick="app.openMatches()">Matches</button>
              <button onclick="app.openSettings()">Settings</button>
            </div>
            <div class="no-more-users">
              <p>That's enough people in your area for now.</p>
              <p>Come back later!</p>
            </div>
          </div>
        `;
      }

      const currentUser = users[0];
      const imageUrl = currentUser.image1 || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="280" height="400"%3E%3Crect fill="%23eee" width="280" height="400"/%3E%3C/svg%3E';

      return `
        <div class="discover-container">
          <div class="discover-header">
            <h2>Discover</h2>
            <button onclick="app.openMatches()">Matches</button>
            <button onclick="app.openSettings()">Settings</button>
          </div>
          
          <div class="cards-container">
            <div class="card" id="current-card">
              <img src="${imageUrl}" class="card-image" alt="profile" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22280%22 height=%22400%22%3E%3Crect fill=%22%23eee%22 width=%22280%22 height=%22400%22/%3E%3C/svg%3E'">
              <div class="card-info">
                <h3>${currentUser.username}, ${currentUser.gender}</h3>
                <p>${currentUser.city || 'Location unknown'}</p>
              </div>
            </div>
          </div>

          <div class="actions">
            <button class="action-btn skip" onclick="app.skipUser(${currentUser.id})">👋</button>
            <button class="action-btn like" onclick="app.likeUser(${currentUser.id})">❤️</button>
          </div>
        </div>
      `;
    } catch (err) {
      return '<div class="error">Failed to load users</div>';
    }
  }

  static attachEventListeners() {
    // Drag functionality could be added here
  }
}