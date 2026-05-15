// use-local-storage-hook.test.ts
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { useLocalStorage } from '../utils/hooks/use-local-storage-hook';

describe('useLocalStorage', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('returns empty string by default when localStorage is empty', () => {
        const { result } = renderHook(() => useLocalStorage('search'));

        expect(result.current[0]).toBe('');
    });

    it('returns initialValue when localStorage is empty', () => {
        const { result } = renderHook(() =>
            useLocalStorage('search', 'mascara'),
        );

        expect(result.current[0]).toBe('mascara');
    });

    it('returns value from localStorage when it exists', () => {
        localStorage.setItem('search', JSON.stringify('lipstick'));

        const { result } = renderHook(() =>
            useLocalStorage('search', 'mascara'),
        );

        expect(result.current[0]).toBe('lipstick');
    });

    it('updates stored value', () => {
        const { result } = renderHook(() => useLocalStorage('search'));

        act(() => {
            result.current[1]('foundation');
        });

        expect(result.current[0]).toBe('foundation');
    });

    it('saves new value to localStorage', () => {
        const { result } = renderHook(() => useLocalStorage('search'));

        act(() => {
            result.current[1]('eyeliner');
        });

        expect(localStorage.getItem('search')).toBe(JSON.stringify('eyeliner'));
    });

    it('uses provided key for localStorage', () => {
        const { result } = renderHook(() => useLocalStorage('products-query'));

        act(() => {
            result.current[1]('blush');
        });

        expect(localStorage.getItem('products-query')).toBe(
            JSON.stringify('blush'),
        );
    });

    it('does not affect other localStorage keys', () => {
        localStorage.setItem('another-key', JSON.stringify('saved value'));

        const { result } = renderHook(() => useLocalStorage('search'));

        act(() => {
            result.current[1]('powder');
        });

        expect(localStorage.getItem('search')).toBe(JSON.stringify('powder'));
        expect(localStorage.getItem('another-key')).toBe(
            JSON.stringify('saved value'),
        );
    });

    it('can save empty string', () => {
        const { result } = renderHook(() =>
            useLocalStorage('search', 'mascara'),
        );

        act(() => {
            result.current[1]('');
        });

        expect(result.current[0]).toBe('');
        expect(localStorage.getItem('search')).toBe(JSON.stringify(''));
    });
});