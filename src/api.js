const API_BASE_URL = 'http://localhost:8000'; 

/**
 * @param {string} endpoint 
 * @param {string} method 
 * @param {string} token 
 * @param {object} body 
 * @returns {Promise<any>} 
 */
export async function fetchProtected(endpoint, method = 'GET', token, body = null) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, 
    },
    body: body ? JSON.stringify(body) : null,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }
  if (response.status === 204) {
      return null;
  }
  
  return await response.json();
}



export async function createEntry(entryData, token) {
  return await fetchProtected('/tracker/', 'POST', token, entryData);
}

export async function fetchTrackerData(token) {
  const entriesResponse = await fetchProtected('/tracker/', 'GET', token);
  const summaryResponse = await fetchProtected('/tracker/summary', 'GET', token);
  return {
    entries: entriesResponse,
    summary: summaryResponse
  };
}


/**
 * @param {string} token 
 * @param {number} entryId 
 * @returns {Promise<void>}
 */
export async function deleteEntry(token, entryId) {
    const endpoint = `/tracker/${entryId}`;
    
    const result = await fetchProtected(
        endpoint,     
        'DELETE',      
        token,          
        null           
    );

    if (result === null) {
        return; 
    }
    
    throw new Error('Failed to delete entry: Unexpected response.');
}


export async function loginUser(username, password) {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);


  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Login failed. Check username and password.');
  }

  return await response.json();
}

export async function registerUser(username, email, password) {
  const response = await fetch(`${API_BASE_URL}/users/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', 
    },
    body: JSON.stringify({
      username: username,
      email: email,
      password: password,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Registration failed.');
  }

  return await response.json();
}