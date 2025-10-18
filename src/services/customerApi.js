import axios from "axios";

// Create an axios instance with base URL
const api = axios.create({
    baseURL: "http://localhost:5000", // change to your backend URL
});

// API call to create a customer
export const createCustomer = async (data) => {
    return api.post("/api/customers", data);
};

export const getCustomers = async ({ page = 1, limit = 20, search = '', filters = {} } = {}) => {
    return api.get("/api/customers", {
        params: {
            page,
            limit,
            search,
            ...filters,
        },
    });
};



export const getCustomerDepartments = async (customerId) => {
    return api.get(`/api/customers/${customerId}/departments`);
};

export const deleteCustomer = async (id) => {
    return api.delete(`/api/customers/${id}`);
};

export const updateCustomer = async (id, data) => {
    return api.put(`/api/customers/${id}`, data);
};

export const getCustomerById = async (id) => {
    return api.get(`/api/customers/${id}`);
};

export const deleteDepartment = async (id) => {
    return api.delete(`/api/customers/departments/${id}`);
};

export const deleteContactPerson = async (id) => {
    return api.delete(`/api/customers/contacts/${id}`);
};

export const deletePhone = async (id) => {
    return api.delete(`/api/customers/contacts/phones/${id}`);
};