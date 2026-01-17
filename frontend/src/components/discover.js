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
      
      // BUILD ALL PICTURES
      let picturesHTML = '';
      if (currentUser.image1) picturesHTML += `<img src="${currentUser.image1}" alt="Picture 1" class="card-image">`;
      if (currentUser.image2) picturesHTML += `<img src="${currentUser.image2}" alt="Picture 2" class="card-image">`;
      if (currentUser.image3) picturesHTML += `<img src="${currentUser.image3}" alt="Picture 3" class="card-image">`;
      if (currentUser.image4) picturesHTML += `<img src="${currentUser.image4}" alt="Picture 4" class="card-image">`;
      if (currentUser.image5) picturesHTML += `<img src="${currentUser.image5}" alt="Picture 5" class="card-image">`;
      
      // IF NO PICTURES, SHOW PLACEHOLDER
      if (!picturesHTML) {
        picturesHTML = `<img src="data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="280" height="400"%3E%3Crect fill="%23eee" width="280" height="400"/%3E%3C/svg%3E" alt="profile" class="card-image">`;
      }

      return `
        <div class="discover-container">
          <div class="discover-header">
            <h2>Discover</h2>
            <button onclick="app.openMatches()">Matches</button>
            <button onclick="app.openSettings()">Settings</button>
          </div>
          
          <div class="cards-container">
            <div class="card" id="current-card">
              <div class="pictures-container">
                ${picturesHTML}
              </div>
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