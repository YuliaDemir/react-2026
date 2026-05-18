import { useState } from "react";

export const useLocalStorage = (key: string, initialValue: string = '') => {

    const getValueFromLS = () => {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
    }

    const [storedValue, setStoredValue] = useState(getValueFromLS);

    const setValue = (value: string) => {
        setStoredValue(value);
        localStorage.setItem(key, JSON.stringify(value));
    };

    return [storedValue, setValue] as const;
}
