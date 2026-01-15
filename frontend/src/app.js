class App {
  constructor() {
    this.currentScreen = null;
    this.currentMatchDetail = null;
    this.currentMessagesMatch = null;
  }

  async render() {
    const appContainer = document.getElementById('app-container');
    let html = '';

    if (!Storage.isAuthenticated()) {
      html = Auth.render();
      appContainer.innerHTML = html;
      Auth.attachEventListeners();
    } else {
      switch (this.currentScreen) {
        case 'discover':
          html = await Discover.render();
          appContainer.innerHTML = html;
          Discover.attachEventListeners();
          break;
        case 'matches':
          html = await Matches.render();
          appContainer.innerHTML = html;
          break;
        case 'match-detail':
          html = await this.renderMatchDetail();
          appContainer.innerHTML = html;
          break;
        case 'messages':
          html = await Messages.render(this.currentMessagesMatch);
          appContainer.innerHTML = html;
          Messages.attachEventListeners(this.currentMessagesMatch);
          break;
        case 'settings':
          html = await Settings.render();
          appContainer.innerHTML = html;
          Settings.attachEventListeners();
          break;
        default:
          this.currentScreen = 'discover';
          this.render();
      }
    }
  }

  async renderMatchDetail() {
    const matchData = await API.getMatchDetails(this.currentMatchDetail);
    const user = matchData.user;
    const profile = matchData.profile || {};

    const images = [
      profile.image1,
      profile.image2,
      profile.image3,
      profile.image4,
      profile.image5
    ].filter(img => img).map(img => `<img src="${img}" alt="profile" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22150%22 height=%22150%22%3E%3Crect fill=%22%23eee%22 width=%22150%22 height=%22150%22/%3E%3C/svg%3E'">`);

    if (images.length === 0) {
      images.push(`<img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22150%22 height=%22150%22%3E%3Crect fill=%23%23eee%22 width=%22150%22 height=%22150%22/%3E%3C/svg%3E" alt="no profile">`);
    }

    return `
      <div class="match-detail-container">
        <div class="match-detail-header">
          <h2>${user.username}</h2>
          <button onclick="app.openMatches()">← Back</button>
        </div>

        <div class="match-detail-images">
          ${images.join('')}
        </div>

        <div class="match-detail-info">
          <h3>${user.username}, ${user.gender}</h3>
          <p>${user.bio || 'No bio provided'}</p>
          <p>${user.city || 'Location unknown'}</p>
        </div>

        <div class="match-detail-actions">
          <button class="btn btn-message" onclick="app.openMessages(${this.currentMatchDetail})">Message</button>
          <button class="btn btn-profile" onclick="app.viewFullProfile(${this.currentMatchDetail})">Full Profile</button>
        </div>

        <div class="match-detail-actions" style="margin-top: 0.5rem;">
          <button class="btn btn-unmatch" onclick="app.unmatch(${this.currentMatchDetail})" style="grid-column: span 2;">Unmatch</button>
        </div>
      </div>
    `;
  }

  openDiscover() {
    this.currentScreen = 'discover';
    this.render();
  }

  openMatches() {
    this.currentScreen = 'matches';
    this.render();
  }

  openMatchDetail(matchId) {
    this.currentMatchDetail = matchId;
    this.currentScreen = 'match-detail';
    this.render();
  }

  openMessages(matchId) {
    this.currentMessagesMatch = matchId;
    this.currentScreen = 'messages';
    this.render();
  }

  openSettings() {
    this.currentScreen = 'settings';
    this.render();
  }

  async likeUser(userId) {
    try {
      const result = await API.likeUser(userId);
      if (result.isMatch) {
        this.showMatchNotification();
      }
      this.openDiscover();
    } catch (err) {
      console.error('Error liking user', err);
    }
  }

  async skipUser(userId) {
    try {
      await API.skipUser(userId);
      this.openDiscover();
    } catch (err) {
      console.error('Error skipping user', err);
    }
  }

  showMatchNotification() {
    const notification = document.createElement('div');
    notification.className = 'match-notification';
    notification.innerHTML = `
      <h2>It's a Match! 🎉</h2>
      <p>You and this person liked each other!</p>
      <button class="btn btn-primary" onclick="this.parentElement.remove(); app.openMatches()">View Match</button>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      if (notification.parentElement) notification.remove();
    }, 5000);
  }

  async sendMessage(matchId) {
    const input = document.getElementById('message-input');
    const content = input.value.trim();

    if (!content) return;

    try {
      await API.sendMessage(matchId, content);
      input.value = '';
      this.render(); // Refresh messages
    } catch (err) {
      console.error('Error sending message', err);
    }
  }

  async saveSettings() {
    const gender = document.getElementById('gender').value;
    const interested_in = document.getElementById('interested_in').value;
    const bio = document.getElementById('bio').value;
    const city = document.getElementById('city').value;
    const max_distance = document.getElementById('max_distance').value;
    const allow_anyone = document.getElementById('allow_anyone').checked;

    try {
      await API.updateProfile({
        gender,
        interested_in,
        bio,
        city,
        max_distance,
        allow_anyone
      });
      this.openDiscover();
    } catch (err) {
      console.error('Error saving settings', err);
    }
  }

  async unmatch(matchId) {
    if (confirm('Are you sure you want to unmatch?')) {
      try {
        await API.unmatch(matchId);
        this.openMatches();
      } catch (err) {
        console.error('Error unmatching', err);
      }
    }
  }

  viewFullProfile(matchId) {
    // Could show a full screen view
    alert('Full profile view coming soon!');
  }

  logout() {
    Storage.clear();
    this.currentScreen = null;
    this.render();
  }
}

const app = new App();

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  const launchBtn = document.getElementById('launch-btn');
  const modal = document.getElementById('app-modal');

  launchBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
    if (Storage.isAuthenticated()) {
      app.currentScreen = 'discover';
    }
    app.render();
  });
});