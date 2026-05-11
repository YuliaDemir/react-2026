import { vi } from 'vitest'
import type { Pokemons } from '../../components/types/interfaces'

export const mockFetchSuccessWithDelay = (
    results: Pokemons[],
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