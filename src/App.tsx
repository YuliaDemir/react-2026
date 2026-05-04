import { Component } from 'react';

import './App.css';

import Search from './components/search';
import CardList from './components/card-list';
import type { AppState } from './components/types/interfaces';
import Loader from './components/loader';

const API_URL = 'https://pokeapi.co/api/v2/pokemon';

class App extends Component<Record<string, never>, AppState> {
  state = {
    data: [],
    error: null,
    isLoading: false,
    query: null,
  };

  async getAllPokemons(): Promise<void> {
    this.setState({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_URL}/?offset=0&limit=20`);

      if (!response.ok) {
        this.setState({
          error: 'Unable to load Pokémon list. Please try again later.',
          isLoading: false,
        });
        return;
      }

      const requestedData = await response.json();

      this.setState({
        data: requestedData.results,
        isLoading: false,
        query: '',
        error: null,
      });
    } catch {
      this.setState({
        error: 'Network error. Please check your internet connection and try again.',
        isLoading: false,
      });
    }
  }

  async componentDidMount(): Promise<void> {
    const previousQuery = localStorage.getItem('query')?.trim();

    if (previousQuery) {
      this.handleSearch(previousQuery);
    } else {
      await this.getAllPokemons();
    }
  }

  handleSearch = async (query: string) => {
    const trimmedQuery = query.trim().toLowerCase();

    if (trimmedQuery === this.state.query) {
      return;
    }

    this.setState({ isLoading: true, error: null });

    try {
      if (!trimmedQuery) {
        await this.getAllPokemons();
        return;
      }

      const response = await fetch(`${API_URL}/${encodeURIComponent(trimmedQuery)}`);

      if (!response.ok) {
        this.setState({
          data: [],
          error: 'Pokemon not found. Please check the name and try again.',
          isLoading: false,
          query: trimmedQuery,
        });
        return;
      }

      const pokemonData = await response.json();

      this.setState({
        data: [
          {
            name: pokemonData.name,
            url: `${API_URL}/${pokemonData.name}`,
          },
        ],
        isLoading: false,
        query: trimmedQuery,
        error: null,
      });

      localStorage.setItem('query', trimmedQuery);
    } catch {
      this.setState({
        data: [],
        error: 'Network error. Please check your connection and try again.',
        isLoading: false,
      });
    }
  };

  render() {
    if (this.state.error === 'Test error') {
      throw new Error('Test application error');
    }
    return (
      <>
        <Search value="" onSearch={this.handleSearch} />

        {this.state.error && <p role="alert">{this.state.error}</p>}

        {this.state.isLoading ? <Loader /> : <CardList data={this.state.data} />}

        <button onClick={() => this.setState({ error: 'Test error' })}>
          Throw error
        </button>
      </>
    );
  }
}

export default App;