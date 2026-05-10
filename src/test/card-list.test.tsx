import { render, screen } from "@testing-library/react";
import CardList from "../components/card-list";
import type { Pokemons } from "../components/types/interfaces";
import { mockFetchFailure } from "./test-utils/mock-fetch-failure";
import App from "../App";
import { missingNameData, mockData, testURL } from "./constants";


describe('CardList', () => {
    it('Renders correct number of items when data is provided', () => {
        render(<CardList data={mockData} />);

        const cards = screen.getAllByTestId('card');
        expect(cards).toHaveLength(3);
    });

    it('Correctly displays item names and descriptions', () => {
        render(<CardList data={mockData} />);

        const cardNames = screen.getAllByText(/Card \d/);
        const cardUrls = screen.getAllByText(testURL);

        expect(cardNames).toHaveLength(3);
        expect(cardUrls).toHaveLength(3);

        cardNames.forEach((name, index) => {
            expect(name).toHaveTextContent(`Card ${index + 1}`);
        });

        cardUrls.forEach((url) => {
            expect(url).toHaveTextContent(testURL);
        });
    });

    it('Handles empty data array gracefully', () => {
        render(<CardList data={[]} />)

        expect(screen.queryAllByTestId('card')).toHaveLength(0)
    });


    it('Handles item with missing name gracefully', () => {
        render(<CardList data={missingNameData as unknown as Pokemons[]} />)

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