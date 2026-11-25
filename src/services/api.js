// API service for uploading, receiving files, and user authentication

const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');

// Helper to get auth token
function getAuthHeader() {
  const token = localStorage.getItem('sharedrop_auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Fallback in-memory store for client-only simulation if backend is not started
const clientSimulatedStore = new Map();

// ----------------- File Transfer API -----------------

export async function uploadFiles(files, durationMinutes = 10, onProgress = null) {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('durationMinutes', durationMinutes.toString());

    if (onProgress) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${API_BASE}/upload`);

        // Attach optional auth token
        const token = localStorage.getItem('sharedrop_auth_token');
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            onProgress(percentComplete);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const res = JSON.parse(xhr.responseText);
              resolve(res);
            } catch (e) {
              reject(new Error('Invalid response from server'));
            }
          } else {
            try {
              const err = JSON.parse(xhr.responseText);
              reject(new Error(err.message || 'Upload failed'));
            } catch (e) {
              reject(new Error(`Server error: ${xhr.status}`));
            }
          }
        };

        xhr.onerror = () => {
          console.warn('Backend server not reachable, using client storage fallback.');
          resolve(simulateClientUpload(files, durationMinutes));
        };

        xhr.send(formData);
      });
    }

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: {
        ...getAuthHeader(),
      },
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to upload files');
    }

    return await res.json();
  } catch (error) {
    console.warn('Upload API failed, using fallback:', error.message);
    return simulateClientUpload(files, durationMinutes);
  }
}

// Fetch transfer information by 6-digit key from hosted server
export async function getTransferByKey(key) {
  const cleanKey = key.toString().replace(/\s+/g, '');

  try {
    const res = await fetch(`${API_BASE}/transfer/${cleanKey}`);
    if (res.ok) {
      const data = await res.json();
      return data.transfer;
    }

    if (res.status === 404 || res.status === 410) {
      const err = await res.json().catch(() => ({}));
      if (clientSimulatedStore.has(cleanKey)) {
        return clientSimulatedStore.get(cleanKey);
      }
      throw new Error(err.message || 'Key not found or expired');
    }
  } catch (err) {
    if (clientSimulatedStore.has(cleanKey)) {
      return clientSimulatedStore.get(cleanKey);
    }
    throw err;
  }
}

// Direct file download URL from hosted server
export function getDownloadUrl(key, fileId) {
  const cleanKey = key.toString().replace(/\s+/g, '');
  if (clientSimulatedStore.has(cleanKey)) {
    const transfer = clientSimulatedStore.get(cleanKey);
    const file = transfer.files.find((f) => f.id === fileId);
    if (file && file.blobUrl) {
      return file.blobUrl;
    }
  }
  return `${API_BASE}/download/${cleanKey}/${fileId}`;
}

// Delete a transfer
export async function deleteTransfer(key) {
  const cleanKey = key.toString().replace(/\s+/g, '');
  try {
    await fetch(`${API_BASE}/transfer/${cleanKey}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
  } catch (err) {
    console.error('Delete error:', err);
  }
  clientSimulatedStore.delete(cleanKey);
}

// Check server health
export async function getServerHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Offline
  }
  return { status: 'offline', serverType: 'Offline Fallback', clientUrl: window.location.origin };
}

// ----------------- Authentication API (Optional) -----------------

export async function apiSignup(name, email, password) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to create account');
  }
  return data;
}

export async function apiLogin(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to login');
  }
  return data;
}

export async function apiForgotPassword(email) {
  const res = await fetch(`${API_BASE}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to request reset');
  }
  return data;
}

export async function apiResetPassword(email, code, newPassword) {
  const res = await fetch(`${API_BASE}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code, newPassword }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to reset password');
  }
  return data;
}

export async function apiGetMe() {
  const headers = getAuthHeader();
  if (!headers.Authorization) return null;

  try {
    const res = await fetch(`${API_BASE}/auth/me`, { headers });
    if (res.ok) {
      const data = await res.json();
      return data.user;
    }
  } catch (e) {
    // ignore
  }
  return null;
}

export async function apiLogout() {
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
  } catch (e) {
    // ignore
  }
}

// Helper: client fallback for demo
function simulateClientUpload(files, durationMinutes) {
  const key = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + durationMinutes * 60 * 1000;

  const filesMeta = files.map((f, idx) => ({
    id: idx.toString(),
    name: f.name,
    size: f.size,
    mimetype: f.type,
    blobUrl: URL.createObjectURL(f),
    rawFile: f,
  }));

  const totalSize = filesMeta.reduce((acc, f) => acc + f.size, 0);

  const transfer = {
    key,
    files: filesMeta,
    totalSize,
    createdAt: Date.now(),
    expiresAt,
    downloadCount: 0,
  };

  clientSimulatedStore.set(key, transfer);

  return {
    success: true,
    key,
    fileCount: filesMeta.length,
    files: filesMeta,
    totalSize,
    expiresAt,
    shareUrl: `/receive?key=${key}`,
  };
}
