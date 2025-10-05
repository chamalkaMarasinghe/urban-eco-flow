import React from 'react'

export const localStorageUtil = {

  set(key, value) {
    try {
      const data = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, data);
    } catch (error) {
      console.error(`Error setting localStorage item: ${key}`, error);
    }
  },

  get(key) {
    try {
      const item = localStorage.getItem(key);
      try {
        return JSON.parse(item);
      } catch (error) {
        return item;
      }
    } catch (error) {
      console.error(`Error getting localStorage item: ${key}`, error);
      return null;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage item: ${key}`, error);
    }
  },

  clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error(`Error clearing localStorage`, error);
    }
  }
  
}