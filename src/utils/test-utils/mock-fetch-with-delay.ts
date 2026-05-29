import { vi } from 'vitest'
import type { Product } from '../../types'

export const mockFetchSuccessWithDelay = (
    results: Product[],
    delay = 100,
) =>
    vi.stubGlobal(
        'fetch',
        vi.fn().mockImplementation(
            () =>
                new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({
                            ok: true,
                            json: async () => ({
                                results,
                            }),
                        })
                    }, delay)
                }),
        ),
    )