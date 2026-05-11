import type { ResponseItem } from "../components/types/interfaces";

export const testURL = 'testURL';

export const mockData = [
    { name: 'Card 1', url: `${testURL}/1` },
    { name: 'Card 2', url: `${testURL}/2` },
    { name: 'Card 3', url: `${testURL}/3` },
];

export const missingNameData = [
    { url: testURL },
];

export const bulbasaurName = 'Bulbasaur';
export const bulbasaurDescription = 'Grass/Poison Pokémon';

export const pikachuName = 'Pikachu';
export const pikachuDescription = 'Mouse Pokémon';

export const bulbasaurObject: ResponseItem = {
    name: 'Bulbasaur',
    url: "https://pokeapi.co/api/v2/pokemon/1/",
};

export const localStorageKey = 'query';


export const API_URL = 'https://pokeapi.co/api/v2/pokemon';