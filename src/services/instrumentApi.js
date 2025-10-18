import axios from "axios";

// Create an axios instance with base URL
const api = axios.create({
    baseURL: "http://localhost:5000", // change to your backend URL
});

// API call to create an instrument
export const createInstrument = async (data) => {
    return api.post("/api/instruments", data);
};

// API call to get all instruments with pagination + search
export const getAllInstruments = async ({ page = 1, limit = 20, search = '', filters = {} }) => {
    return api.get("/api/instruments", {
        params: {
            page,
            limit,
            search,
            ...filters, // <--- spreads keys directly
        },
    });
};


export const getInstrumentsByCustomer = async (
    customer_id,
    {
        department_id,
        instrument_type_id,
        model_number,
        warranty_service,
        supplier_warranty,
        service_warranty,
        page = 1,
        limit = 50,
        search = "",
    } = {}
) => {
    return getAllInstruments({
        page,
        limit,
        search,
        filters: {
            customer_id,
            department_id,
            instrument_type_id,
            model_number,
            warranty_service,
            supplier_warranty,
            service_warranty,
        },
    });
};



export const deleteInstrument = async (id) => {
    return api.delete(`/api/instruments/${id}`);
}

export const getInstrumentTypes = async () => {
    return api.get("/api/instruments/instrument_types");
};


export const updateInstrument = async (id, data) => {
    return api.put(`/api/instruments/${id}`, data);
};

export const getInstrumentById = async (id) => {
    return api.get(`/api/instruments/${id}`);
};
