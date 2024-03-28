'use client'
import { useEffect, useState } from "react";

const useLocalStorage = <T>(key: string, initialValue: T): [T, (value : T) => void, () => void] => {
  const [storedValue, setStoredValue] = useState(initialValue);

  useEffect(() => {
    const item = window.localStorage.getItem(key);
    try{
      if (item) 
        setStoredValue(JSON.parse(item));
    } catch (err) {
      console.log(err);
    }
  }, [key]);

  const setValue = (value: T) => {
    setStoredValue(value);
    localStorage.setItem(key, JSON.stringify(value));
  };

  const clearValue = () => {
    localStorage.removeItem(key);
    setStoredValue(initialValue);
  }

  return [storedValue, setValue, clearValue];
};

export default useLocalStorage;