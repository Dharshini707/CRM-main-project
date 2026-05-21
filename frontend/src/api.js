const BASE_URL = "https://crm-main-project.onrender.com";

const getAuthHeaders = () => {
  const token = localStorage.getItem("crm_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
};

// Auth APIs
export const authAPI = {
  register: (body) =>
    fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(handleResponse),

  login: (body) =>
    fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(handleResponse),
};

// Customer APIs
export const customerAPI = {
  getAll: () =>
    fetch(`${BASE_URL}/customers`, {
      headers: getAuthHeaders(),
    }).then(handleResponse),

  create: (body) =>
    fetch(`${BASE_URL}/customers`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  update: (id, body) =>
    fetch(`${BASE_URL}/customers/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  delete: (id) =>
    fetch(`${BASE_URL}/customers/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    }).then(handleResponse),
};