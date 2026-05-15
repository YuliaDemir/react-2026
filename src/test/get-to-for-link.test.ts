import { beforeEach, describe, expect, it } from 'vitest';

import { getToForLink } from '../utils/get-to-for-link';

const setLocation = (url: string) => {
    window.history.pushState({}, '', url);
};

describe('getToForLink', () => {
    beforeEach(() => {
        setLocation('/products');
    });

    it('returns current pathname', () => {
        setLocation('/products?page=2');

        expect(getToForLink()).toEqual({
            pathname: '/products',
            search: 'page=2',
        });
    });

    it('adds details param when id is provided', () => {
        setLocation('/products?page=2');

        expect(getToForLink(15)).toEqual({
            pathname: '/products',
            search: 'page=2&details=15',
        });
    });

    it('replaces existing details param when id is provided', () => {
        setLocation('/products?page=2&details=10');

        expect(getToForLink(25)).toEqual({
            pathname: '/products',
            search: 'page=2&details=25',
        });
    });

    it('removes details param when id is not provided', () => {
        setLocation('/products?page=2&details=10');

        expect(getToForLink()).toEqual({
            pathname: '/products',
            search: 'page=2',
        });
    });

    it('sets page param when page is provided', () => {
        setLocation('/products');

        expect(getToForLink(undefined, 3)).toEqual({
            pathname: '/products',
            search: 'page=3',
        });
    });

    it('replaces existing page param when page is provided', () => {
        setLocation('/products?page=1');

        expect(getToForLink(undefined, 5)).toEqual({
            pathname: '/products',
            search: 'page=5',
        });
    });

    it('sets both details and page params', () => {
        setLocation('/products?query=mascara');

        expect(getToForLink(12, 4)).toEqual({
            pathname: '/products',
            search: 'query=mascara&details=12&page=4',
        });
    });

    it('preserves existing params when adding details and page', () => {
        setLocation('/products?query=lipstick&sort=price');

        expect(getToForLink(7, 2)).toEqual({
            pathname: '/products',
            search: 'query=lipstick&sort=price&details=7&page=2',
        });
    });

    it('preserves existing page when page is not provided', () => {
        setLocation('/products?page=6&details=10');

        expect(getToForLink(20)).toEqual({
            pathname: '/products',
            search: 'page=6&details=20',
        });
    });

    it('returns empty search string when there are no params', () => {
        setLocation('/products');

        expect(getToForLink()).toEqual({
            pathname: '/products',
            search: '',
        });
    });

    it('removes only details param and preserves others', () => {
        setLocation('/products?page=3&details=9&query=mascara');

        expect(getToForLink()).toEqual({
            pathname: '/products',
            search: 'page=3&query=mascara',
        });
    });
});