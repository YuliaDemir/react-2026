// use-detalisation.test.ts
import { createElement, type ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { useDetalisation } from '../utils/hooks/use-detalisation';

type WrapperProps = {
    children: ReactNode;
};

const createWrapper = (initialEntry: string) => {
    const Wrapper = ({ children }: WrapperProps) => {
        return createElement(
            MemoryRouter,
            {
                initialEntries: [initialEntry],
            },
            children,
        );
    };

    return Wrapper;
};

describe('useDetalisation', () => {
    it('returns detailsId from search params', () => {
        const { result } = renderHook(() => useDetalisation(), {
            wrapper: createWrapper('/products?details=12'),
        });

        expect(result.current.detailsId).toBe('12');
    });

    it('returns null detailsId when details param does not exist', () => {
        const { result } = renderHook(() => useDetalisation(), {
            wrapper: createWrapper('/products?page=2'),
        });

        expect(result.current.detailsId).toBeNull();
    });

    it('returns searchParams', () => {
        const { result } = renderHook(() => useDetalisation(), {
            wrapper: createWrapper('/products?page=2&details=12'),
        });

        expect(result.current.searchParams.get('page')).toBe('2');
        expect(result.current.searchParams.get('details')).toBe('12');
    });

    it('opens details by setting details search param', async () => {
        const { result } = renderHook(() => useDetalisation(), {
            wrapper: createWrapper('/products'),
        });

        act(() => {
            result.current.openDetails(15);
        });

        await waitFor(() => {
            expect(result.current.detailsId).toBe('15');
        });

        expect(result.current.searchParams.get('details')).toBe('15');
    });

    it('preserves existing search params when opening details', async () => {
        const { result } = renderHook(() => useDetalisation(), {
            wrapper: createWrapper('/products?page=3&query=mascara'),
        });

        act(() => {
            result.current.openDetails(25);
        });

        await waitFor(() => {
            expect(result.current.searchParams.get('details')).toBe('25');
        });

        expect(result.current.searchParams.get('page')).toBe('3');
        expect(result.current.searchParams.get('query')).toBe('mascara');
    });

    it('replaces existing details param when opening another details', async () => {
        const { result } = renderHook(() => useDetalisation(), {
            wrapper: createWrapper('/products?page=1&details=10'),
        });

        act(() => {
            result.current.openDetails(20);
        });

        await waitFor(() => {
            expect(result.current.detailsId).toBe('20');
        });

        expect(result.current.searchParams.get('details')).toBe('20');
        expect(result.current.searchParams.get('page')).toBe('1');
    });

    it('closes details by removing details search param', async () => {
        const { result } = renderHook(() => useDetalisation(), {
            wrapper: createWrapper('/products?details=12'),
        });

        act(() => {
            result.current.closeDetails();
        });

        await waitFor(() => {
            expect(result.current.detailsId).toBeNull();
        });

        expect(result.current.searchParams.get('details')).toBeNull();
    });

    it('preserves other search params when closing details', async () => {
        const { result } = renderHook(() => useDetalisation(), {
            wrapper: createWrapper('/products?page=4&query=lipstick&details=12'),
        });

        act(() => {
            result.current.closeDetails();
        });

        await waitFor(() => {
            expect(result.current.searchParams.get('details')).toBeNull();
        });

        expect(result.current.searchParams.get('page')).toBe('4');
        expect(result.current.searchParams.get('query')).toBe('lipstick');
    });
});