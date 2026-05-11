import { useState } from "react";

export const useLocalStorage = (key: string, initialValue: string = '') => {
    const [storedValue, setStoredValue] = useState(() => {
        const item = window?.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
    });

    const setValue = (value: string) => {
        setStoredValue(value);
        window?.localStorage.setItem(key, JSON.stringify(value));
    };

    return [storedValue, setValue] as const;
}
