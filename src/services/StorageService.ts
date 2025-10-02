const StorageService = {
  /**
   * Save data to localStorage
   * @param {string} key - The key to store the data under
   * @param {string} value - The value to store
   */
  setItem: (key: string, value: string) => {
    localStorage.setItem(key, value);
  },

  /**
   * Retrieve data from localStorage
   * @param {string} key - The key to retrieve the data from
   * @returns {string | null} - The retrieved value or null if not found
   */
  getItem: (key: string): string | null => {
    return localStorage.getItem(key);
  },

  /**
   * Remove data from localStorage
   * @param {string} key - The key to remove the data from
   */
  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },

  /**
   * Clear all data from localStorage
   */
  clear: () => {
    localStorage.clear();
  },
};

export default StorageService;
