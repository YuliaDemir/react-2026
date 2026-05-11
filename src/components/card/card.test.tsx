import { render, screen } from '@testing-library/react'
import Card from './card'

describe('Card', () => {
    it('Displays item name and description correctly', () => {
        render(<Card name="Bulbasaur" description="Grass/Poison Pokémon" />)

        expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
        expect(screen.getByText('Grass/Poison Pokémon')).toBeInTheDocument()
    })

})