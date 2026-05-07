import { render, screen } from "@testing-library/react";
import CardList from "../components/card-list";
import { mockFetchSuccess } from "./test-utils/mock-fetch-success";

describe('CardList', () => {
    it('Renders correct number of items when data is provided', () => {
        const mockData = [
            { name: 'Card 1', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
            { name: 'Card 2', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
            { name: 'Card 3', url: 'https://pokeapi.co/api/v2/pokemon/3/' },
        ];

        render(<CardList data={mockData} />);

        const cards = screen.getAllByTestId('card');
        expect(cards).toHaveLength(3);
    });

});