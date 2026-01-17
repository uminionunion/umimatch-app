class Auth {
  static render() {
    return `
      <div class="auth-container">
        <form class="auth-form">
          <div id="auth-error"></div>
          
          <!-- LOGIN FORM -->
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

          <!-- REGISTER FORM -->
          <div id="register-form" style="display: none;">
            <h2>Create Account</h2>
            
            <!-- USERNAME -->
            <div class="form-group">
              <label>Username</label>
              <input type="text" id="register-username" placeholder="Choose username" required>
            </div>

            <!-- EMAIL (NEW) -->
            <div class="form-group">
              <label>Email</label>
              <input type="email" id="register-email" placeholder="Enter your email" required>
            </div>
            
            <!-- PHONE NUMBER -->
            <div class="form-group">
              <label>Phone Number</label>
              <input type="tel" id="register-phone" placeholder="Enter phone number" required>
            </div>

            <!-- PASSWORD -->
            <div class="form-group">
              <label>Password</label>
              <input type="password" id="register-password" placeholder="Create password" required>
            </div>

            <!-- BIRTHDAY (NEW) -->
            <div class="form-group">
              <label>Birthday (Must be 18+)</label>
              <input type="date" id="register-birthday" required>
              <p id="age-warning" style="color: red; display: none; font-size: 12px; margin-top: 5px;">❌ You must be 18 or older</p>
            </div>

            <!-- TERMS OF SERVICE (NEW) -->
            <div class="form-group">
              <label>Terms of Service</label>
              <div class="terms-box">
                <p><strong>TERMS OF SERVICE AND USE:</strong> By checking this box, you agree (that you are 18+ & agree:) to receive emails and/or text messages from the uminion union (and/or its active G.U.S (General Union Secretary)). Your email will be used for future password recovery measures and updates from the union; while your phone number will be used for future verification (required to gain access to the uminion union website and all of its features like this app) along with some union updates. Standard messaging rates may apply. These Terms of Service & Use may evolve overtime. -Last Updated: 3:10pm on 1/17/26</p>
              </div>
              <label class="terms-checkbox">
                <input type="checkbox" id="terms-agree" required>
                <span>I agree to the Terms of Service and Use</span>
              </label>
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

    // CHECK AGE WHEN BIRTHDAY CHANGES (NEW)
    const birthdayInput = document.getElementById('register-birthday');
    if (birthdayInput) {
      birthdayInput.addEventListener('change', () => {
        const birthdayValue = birthdayInput.value;
        const birthday = new Date(birthdayValue);
        const today = new Date();
        let age = today.getFullYear() - birthday.getFullYear();
        const monthDiff = today.getMonth() - birthday.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
          age--;
        }

        const ageWarning = document.getElementById('age-warning');
        const registerBtn = document.getElementById('register-btn');

        if (age < 18) {
          ageWarning.style.display = 'block';
          registerBtn.disabled = true;
          registerBtn.style.opacity = '0.5';
        } else {
          ageWarning.style.display = 'none';
          registerBtn.disabled = false;
          registerBtn.style.opacity = '1';
        }
      });
    }

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

    // Register (UPDATED WITH NEW FIELDS)
    document.getElementById('register-btn').addEventListener('click', async (e) => {
      e.preventDefault();
      const username = document.getElementById('register-username').value;
      const email = document.getElementById('register-email').value;
      const phone = document.getElementById('register-phone').value;
      const password = document.getElementById('register-password').value;
      const birthday = document.getElementById('register-birthday').value;
      const termsAgreed = document.getElementById('terms-agree').checked;

      // VALIDATION
      if (!username || !email || !phone || !password || !birthday) {
        document.getElementById('auth-error').innerHTML = `<div class="error">Please fill in all fields</div>`;
        return;
      }

      if (!termsAgreed) {
        document.getElementById('auth-error').innerHTML = `<div class="error">You must agree to the Terms of Service</div>`;
        return;
      }

      try {
        const result = await API.register(username, password, phone, email, birthday);
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