import { render, screen } from "@testing-library/react";
import CardList from "./card-list";
import type { Product } from "../../types/interfaces";
import { mockFetchFailure } from "../../utils/test-utils/mock-fetch-failure";

const baseURL = 'https://pokeapi.co/api/v2/pokemon/';

describe('CardList', () => {
    it('Renders correct number of items when data is provided', () => {
        const mockData = [
            { name: 'Card 1', url: `${baseURL}1/` },
            { name: 'Card 2', url: `${baseURL}2/` },
            { name: 'Card 3', url: `${baseURL}3/` },
        ];

        render(<CardList data={mockData} />);

        const cards = screen.getAllByTestId('card');
        expect(cards).toHaveLength(3);
    });

    it('Correctly displays item names and descriptions', () => {
        const mockData = [
            { name: 'Card 1', url: `${baseURL}1/` },
            { name: 'Card 2', url: `${baseURL}2/` },
            { name: 'Card 3', url: `${baseURL}3/` },
        ];

        render(<CardList data={mockData} />);

        const cardNames = screen.getAllByText(/Card \d/);
        const cardUrls = screen.getAllByText(/https:/);

        expect(cardNames).toHaveLength(3);
        expect(cardUrls).toHaveLength(3);

        cardNames.forEach((name, index) => {
            expect(name).toHaveTextContent(`Card ${index + 1}`);
        });

        cardUrls.forEach((url, index) => {
            expect(url).toHaveTextContent(`${baseURL}${index + 1}/`);
        });
    });

    it('Handles empty data array gracefully', () => {
        render(<CardList data={[]} />)

        expect(screen.queryAllByTestId('card')).toHaveLength(0)
    });


    it('Handles item with missing name gracefully', () => {
        const mockData = [
            { url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        ] as unknown as Product[]
        render(<CardList data={mockData} />)

        expect(screen.getByText(/https:\/\/pokeapi/i)).toBeInTheDocument()
    });

    it('Displays error message when API call fails', async () => {
        mockFetchFailure(500)

        render(<App />)

        expect(
            await screen.findByText(/unable to load/i)
        ).toBeInTheDocument()

        expect(screen.queryAllByTestId('card')).toHaveLength(0)
    })
});