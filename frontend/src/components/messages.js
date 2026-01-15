class Messages {
  static async render(matchId) {
    try {
      const matchData = await API.getMatchDetails(matchId);
      const messagesData = await API.getMessages(matchId);
      const messages = messagesData.messages || [];
      const currentUser = Storage.getUser();

      const messagesHTML = messages.map(msg => {
        const isSent = msg.sender_id === currentUser.id;
        return `
          <div class="message ${isSent ? 'sent' : 'received'}">
            <div class="message-content">${msg.content}</div>
          </div>
        `;
      }).join('');

      return `
        <div class="messages-container">
          <div class="messages-header">
            <h2>${matchData.user.username}</h2>
            <button onclick="app.openMatchDetail(${matchId})">← Back</button>
          </div>
          <div class="messages-list">
            ${messagesHTML}
          </div>
          <div class="messages-input">
            <input type="text" id="message-input" placeholder="Type a message..." />
            <button onclick="app.sendMessage(${matchId})">Send</button>
          </div>
        </div>
      `;
    } catch (err) {
      return '<div class="error">Failed to load messages</div>';
    }
  }

  static attachEventListeners(matchId) {
    const input = document.getElementById('message-input');
    if (input) {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          app.sendMessage(matchId);
        }
      });
    }
  }
}