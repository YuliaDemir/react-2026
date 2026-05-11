import { render, screen } from '@testing-library/react'
import Card from '../components/card';
import { bulbasaurDescription, bulbasaurName } from './constants';

describe('Card', () => {
    it('Displays item name and description correctly', () => {
        render(<Card name={bulbasaurName} description={bulbasaurDescription} />)

        expect(screen.getByText(bulbasaurName)).toBeInTheDocument()
        expect(screen.getByText(bulbasaurDescription)).toBeInTheDocument()
    })
})