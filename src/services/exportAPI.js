import api from "./api";

/**
 * Export data with specified columns, filters, and format
 * @param {Object} config - Export configuration
 * @param {string[]} config.columns - Array of column keys to include
 * @param {string} config.format - Export format ('csv', 'excel', 'pdf')
 * @param {string} config.filename - Filename without extension
 * @param {string} config.exportType - Type of export ('current', 'filtered', 'all')
 * @param {Object} config.filters - Current active filters
 * @param {string} endpoint - API endpoint for the specific resource
 * @returns {Promise} - Returns blob for download
 */
export const exportData = async (config, endpoint) => {
  try {
    const response = await api.post(endpoint, config, {
      responseType: 'blob', // Important for file downloads
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Get the file extension based on format
    const extension = getFileExtension(config.format);
    link.setAttribute('download', `${config.filename}.${extension}`);
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return response;
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
};

/**
 * Get file extension based on format
 * @param {string} format - Export format
 * @returns {string} - File extension
 */
const getFileExtension = (format) => {
  switch (format) {
    case 'csv': return 'csv';
    case 'excel': return 'xlsx';
    case 'pdf': return 'pdf';
    default: return 'csv';
  }
};

/**
 * Get available columns for an entity
 * @param {string} entity - Entity type ('users', 'customers', 'instruments', 'amc', 'tickets')
 * @returns {Promise} - Returns available columns
 */
export const getAvailableColumns = async (entity) => {
  try {
    const response = await api.get(`/api/export/${entity}/columns`);
    return response.data;
  } catch (error) {
    console.error('Get columns failed:', error);
    throw error;
  }
};

/**
 * Export users data
 * @param {Object} config - Export configuration
 * @returns {Promise}
 */
export const exportUsers = (config) => {
  return exportData(config, '/api/export/users');
};

/**
 * Export customers data
 * @param {Object} config - Export configuration
 * @returns {Promise}
 */
export const exportCustomers = (config) => {
  return exportData(config, '/api/export/customers');
};

/**
 * Export instruments data
 * @param {Object} config - Export configuration
 * @returns {Promise}
 */
export const exportInstruments = (config) => {
  return exportData(config, '/api/export/instruments');
};

/**
 * Export tickets data
 * @param {Object} config - Export configuration
 * @returns {Promise}
 */
export const exportTickets = (config) => {
  return exportData(config, '/api/export/tickets');
};

/**
 * Export AMC data
 * @param {Object} config - Export configuration
 * @returns {Promise}
 */
export const exportAMCs = (config) => {
  return exportData(config, '/api/export/amc');
};

/**
 * Generic export function for any endpoint
 * @param {Object} config - Export configuration
 * @param {string} endpoint - API endpoint
 * @returns {Promise}
 */
export const exportGeneric = (config, endpoint) => {
  return exportData(config, endpoint);
};