
const API_BASE_URL = 'http://localhost:8000'; 

/**
 * Executes a protected API call.
 * @param {string} endpoint The API path (e.g., '/users/me')
 * @param {string} method HTTP method (e.g., 'GET')
 * @param {string} token Access token
 * @returns {Promise<any>}
 */
export async function fetchProtected(endpoint, method = 'GET', token) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      // Attach the token for protected routes
      'Authorization': `Bearer ${token}`, 
    },
    // Add other options like body if needed
  });

  if (!response.ok) {
    // Handle 401 Unauthorized, 403 Forbidden, etc.
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

/**
 * Handles the login request to your FastAPI backend.
 * Uses FormData because your FastAPI /users/login endpoint expects form data.
 */
export async function loginUser(username, password) {
  // 1. Create the Form Data payload
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  // 2. Make the POST request
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: {
      // Your FastAPI endpoint expects 'application/x-www-form-urlencoded'
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });

  if (!response.ok) {
    // Check for 401 Unauthorized from your FastAPI logic
    throw new Error('Login failed. Check username and password.');
  }

  // 3. Return the token data: { access_token: "...", token_type: "bearer" }
  return await response.json();
}

export async function registerUser(username, email, password) {
  const API_BASE_URL = 'http://localhost:8000'; // Make sure this is still defined at the top of api.js
  
  const response = await fetch(`${API_BASE_URL}/users/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // FastAPI POST /users/ expects JSON
    },
    body: JSON.stringify({
      username: username,
      email: email,
      password: password,
    }),
  });

  if (!response.ok) {
    // Attempt to read error message from backend
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Registration failed.');
  }

  return await response.json();
}