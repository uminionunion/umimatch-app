class Matches {
  static async render() {
    try {
      const response = await API.getMatches();
      const matches = response.matches || [];

      if (matches.length === 0) {
        return `
          <div class="matches-container">
            <div class="matches-header">
              <h2>Matches</h2>
              <button onclick="app.openDiscover()">← Back</button>
            </div>
            <div class="no-matches">
              <p>No matches yet!</p>
              <p>Keep swiping to find someone special.</p>
            </div>
          </div>
        `;
      }

      const matchesHTML = matches.map(match => {
        const imageUrl = match.image1 || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="60"%3E%3Crect fill="%23eee" width="60" height="60"/%3E%3C/svg%3E';
        return `
          <div class="match-item" onclick="app.openMatchDetail(${match.id})">
            <img src="${imageUrl}" class="match-avatar" alt="${match.username}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22%3E%3Crect fill=%22%23eee%22 width=%2260%22 height=%2260%22/%3E%3C/svg%3E'">
            <div class="match-info">
              <h3>${match.username}</h3>
              <p>${match.city || 'Location unknown'}</p>
            </div>
          </div>
        `;
      }).join('');

      return `
        <div class="matches-container">
          <div class="matches-header">
            <h2>Matches (${matches.length})</h2>
            <button onclick="app.openDiscover()">← Back</button>
          </div>
          <div class="matches-list">
            ${matchesHTML}
          </div>
        </div>
      `;
    } catch (err) {
      return '<div class="error">Failed to load matches</div>';
    }
  }
}