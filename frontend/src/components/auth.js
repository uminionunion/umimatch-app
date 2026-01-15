class Auth {
  static render() {
    return `
      <div class="auth-container">
        <form class="auth-form">
          <div id="auth-error"></div>
          
          <div id="login-form">
            <h2>Login to UmiMatch</h2>
            <div class="form-group">
              <label>Username</label>
              <input type="text" id="login-username" placeholder="Enter username" required>
            </div>
            <div class="form-group">
              <label>Password</label>
              <input type="password" id="login-password" placeholder="Enter password" required>
            </div>
            <div class="auth-buttons">
              <button type="button" class="btn btn-primary" id="login-btn">Login</button>
              <button type="button" class="btn btn-secondary" id="toggle-register-btn">Create Account</button>
            </div>
          </div>

          <div id="register-form" style="display: none;">
            <h2>Create Account</h2>
            <div class="form-group">
              <label>Username</label>
              <input type="text" id="register-username" placeholder="Choose username" required>
            </div>
            <div class="form-group">
              <label>Phone Number</label>
              <input type="tel" id="register-phone" placeholder="Enter phone number" required>
            </div>
            <div class="form-group">
              <label>Password</label>
              <input type="password" id="register-password" placeholder="Create password" required>
            </div>
            <div class="auth-buttons">
              <button type="button" class="btn btn-primary" id="register-btn">Register</button>
              <button type="button" class="btn btn-secondary" id="toggle-login-btn">Back to Login</button>
            </div>
          </div>
        </form>
      </div>
    `;
  }

  static attachEventListeners() {
    // Toggle forms
    document.getElementById('toggle-register-btn').addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('login-form').style.display = 'none';
      document.getElementById('register-form').style.display = 'block';
    });

    document.getElementById('toggle-login-btn').addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('login-form').style.display = 'block';
      document.getElementById('register-form').style.display = 'none';
    });

    // Login
    document.getElementById('login-btn').addEventListener('click', async (e) => {
      e.preventDefault();
      const username = document.getElementById('login-username').value;
      const password = document.getElementById('login-password').value;

      try {
        const result = await API.login(username, password);
        if (result.success) {
          Storage.setToken(result.token);
          Storage.setUser(result.user);
          app.currentScreen = 'discover';
          app.render();
        } else {
          document.getElementById('auth-error').innerHTML = `<div class="error">${result.error}</div>`;
        }
      } catch (err) {
        document.getElementById('auth-error').innerHTML = `<div class="error">Login failed</div>`;
      }
    });

    // Register
    document.getElementById('register-btn').addEventListener('click', async (e) => {
      e.preventDefault();
      const username = document.getElementById('register-username').value;
      const phone = document.getElementById('register-phone').value;
      const password = document.getElementById('register-password').value;

      try {
        const result = await API.register(username, password, phone);
        if (result.success) {
          Storage.setToken(result.token);
          Storage.setUser(result.user);
          app.currentScreen = 'discover';
          app.render();
        } else {
          document.getElementById('auth-error').innerHTML = `<div class="error">${result.error}</div>`;
        }
      } catch (err) {
        document.getElementById('auth-error').innerHTML = `<div class="error">Registration failed</div>`;
      }
    });
  }
}