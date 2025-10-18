import api from "./api";

export const getUsers = async ({
  page = 1,
  limit = 20,
  search = "",
  role = "",
  exp_level = "",
  user_status = "",
} = {}) => {
  const params = { page, limit, search };
  if (role) params.role = role;
  if (exp_level) params.exp_level = exp_level;
  if (user_status) params.user_status = user_status;
  return api.get("/api/users", { params }); // -> { success, data, total, page, limit, totalPages }
};

export const deleteUser = async (userId) => {
  // implement only if your backend has DELETE /api/users/:id
  return api.delete(`/api/users/delete_user/${userId}`);
};


/**
 * Update user with multipart form-data
 * Body fields: user_name, email, contact_no, exp_level, role, (optional) dp
 */
export const updateUser = (id, formData /* FormData */) =>
  api.put(`/api/users/update_user/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  export const getUserById = (id) =>
  api.get(`/api/users/${id}`);

/**
 * Create user with multipart form-data
 * Body fields: user_name, email, password, contact_no, exp_level, role, (optional) dp
 */
export const createUser = (formData /* FormData */) =>
  api.post("/api/users", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });