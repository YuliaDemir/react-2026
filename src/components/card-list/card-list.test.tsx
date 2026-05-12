import { render, screen } from "@testing-library/react";
import CardList from "../components/card-list";
import type { Pokemons } from "../components/types/interfaces";
import { mockFetchFailure } from "./test-utils/mock-fetch-failure";
import App from "../App";


describe('CardList', () => {
    it('Renders correct number of items when data is provided', () => {
        render(<CardList data={mockData} />);

        const cards = screen.getAllByTestId('card');
        expect(cards).toHaveLength(3);
    });

    it('Correctly displays item names and descriptions', () => {
        render(<CardList data={mockData} />);

        const cardNames = screen.getAllByText(/Card \d/);
        const cardUrls = screen.getAllByText(/testURL\/\d/);

        expect(cardNames).toHaveLength(3);
        expect(cardUrls).toHaveLength(3);

        cardNames.forEach((name, index) => {
            expect(name).toHaveTextContent(`Card ${index + 1}`);
        });

        cardUrls.forEach((url, index) => {
            expect(url).toHaveTextContent(`${testURL}/${index + 1}`);
        });
    });

    it('Handles empty data array gracefully', () => {
        render(<CardList data={[]} />)

        expect(screen.queryAllByTestId('card')).toHaveLength(0)
    });


    it('Handles item with missing name gracefully', () => {
        const mockData = [
            { url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        ] as unknown as Pokemons[]
        render(<CardList data={mockData} />)

        expect(screen.getByText(testURL)).toBeInTheDocument()
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