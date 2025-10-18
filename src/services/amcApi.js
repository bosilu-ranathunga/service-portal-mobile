import axios from "axios";

// Create an axios instance with base URL
const api = axios.create({
    baseURL: "http://localhost:5000", // change to your backend URL
});

// API call to create a amc
export const getAmcs = async ({ page = 1, limit = 20, search = '', filters = {} }) => {
    return api.get("/api/amc/get_amc", {
        params: {
            page,
            limit,
            search,
            ...filters, // <--- spreads keys directly
        },
    });
}


export const createAmc = async (amcData) => {
    return api.post("/api/amc/create_amc", amcData);
}
