class Settings {
  static async render() {
    try {
      const profileData = await API.getProfile();
      const user = profileData.user || {};

      return `
        <div class="settings-container">
          <div class="settings-header">
            <h2>Settings</h2>
            <button onclick="app.openDiscover()">← Back</button>
          </div>

          <div class="settings-section">
            <h3>Profile</h3>
            
            <div class="settings-group">
              <label>Bio (max 1000 characters)</label>
              <textarea id="bio" maxlength="1000">${user.bio || ''}</textarea>
            </div>

            <div class="settings-group">
              <label>City</label>
              <input type="text" id="city" value="${user.city || ''}" placeholder="e.g., New York">
            </div>

            <!-- ADD PICTURES BUTTON HERE -->
            <div class="settings-group">
              <label>Add Pictures</label>
              <button id="add-pictures-btn" class="btn btn-add-pictures">
                📸 Add Pictures
              </button>
              <input 
                type="file" 
                id="file-input" 
                multiple 
                accept="image/*" 
                style="display: none;"
              >
            </div>
          </div>

          <div class="settings-section">
            <h3>Personal Info</h3>
            
            <div class="settings-group">
              <label>What would you consider yourself?</label>
              <select id="gender">
                <option value="Male" ${user.gender === 'Male' ? 'selected' : ''}>Male</option>
                <option value="Female" ${user.gender === 'Female' ? 'selected' : ''}>Female</option>
                <option value="EveryoneElse" ${user.gender === 'EveryoneElse' ? 'selected' : ''}>EveryoneElse</option>
              </select>
            </div>

            <div class="settings-group">
              <label>Who would you like to match with?</label>
              <select id="interested_in">
                <option value="Male" ${user.interested_in === 'Male' ? 'selected' : ''}>Male</option>
                <option value="Female" ${user.interested_in === 'Female' ? 'selected' : ''}>Female</option>
                <option value="EveryoneElse" ${user.interested_in === 'EveryoneElse' ? 'selected' : ''}>EveryoneElse</option>
                <option value="Everyone" ${user.interested_in === 'Everyone' ? 'selected' : ''}>Everyone</option>
              </select>
            </div>
          </div>

          <div class="settings-section">
            <h3>Distance Preferences</h3>
            
            <div class="settings-group">
              <label>Match distance</label>
              <div class="range-display">
                <input type="range" id="max_distance" min="1" max="100" value="${user.max_distance || 100}">
                <span class="range-value"><span id="distance-value">${user.max_distance || 100}</span> miles</span>
              </div>
            </div>

            <div class="settings-group">
              <div class="checkbox-group">
                <input type="checkbox" id="allow_anyone" ${user.allow_anyone ? 'checked' : ''}>
                <label for="allow_anyone">Allow me to match with everyone</label>
              </div>
            </div>
          </div>

          <div class="settings-buttons">
            <button class="btn btn-save" onclick="app.saveSettings()">Save Settings</button>
            <button class="btn btn-logout" onclick="app.logout()">Logout</button>
          </div>
        </div>
      `;
    } catch (err) {
      return '<div class="error">Failed to load settings</div>';
    }
  }

  static attachEventListeners() {
    const allowAnyoneCheckbox = document.getElementById('allow_anyone');
    const maxDistanceInput = document.getElementById('max_distance');
    const distanceValue = document.getElementById('distance-value');

    if (allowAnyoneCheckbox) {
      allowAnyoneCheckbox.addEventListener('change', () => {
        maxDistanceInput.disabled = allowAnyoneCheckbox.checked;
      });

      if (allowAnyoneCheckbox.checked) {
        maxDistanceInput.disabled = true;
      }
    }

    if (maxDistanceInput) {
      maxDistanceInput.addEventListener('input', () => {
        distanceValue.textContent = maxDistanceInput.value;
      });
    }

    // ADD PICTURES BUTTON LISTENER
    const addPicturesBtn = document.getElementById('add-pictures-btn');
    const fileInput = document.getElementById('file-input');

    if (addPicturesBtn) {
      addPicturesBtn.addEventListener('click', () => {
        fileInput.click();
      });
    }

    if (fileInput) {
      fileInput.addEventListener('change', async (e) => {
        const files = e.target.files;
        if (files.length === 0) return;

        const formData = new FormData();
        for (let file of files) {
          formData.append('pictures', file);
        }

        try {
          const response = await fetch('/api/users/upload-pictures', {
            method: 'POST',
            body: formData,
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          });

          if (response.ok) {
            alert('✅ Pictures uploaded successfully!');
          } else {
            alert('❌ Failed to upload pictures');
          }
        } catch (error) {
          console.error('Error uploading pictures:', error);
          alert('❌ Error uploading pictures');
        }
      });
    }
  }
}