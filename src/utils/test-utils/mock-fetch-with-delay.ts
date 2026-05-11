import { vi } from 'vitest'
import type { Item } from '../../types/interfaces'

export const mockFetchSuccessWithDelay = (
    results: Item[],
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