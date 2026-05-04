import { Component } from 'react';
import './App.css';
import Search from './components/search';
import CardList from './components/card-list';
import type { AppState } from './components/types/interfaces';
import Loader from './components/loader';

class App extends Component<
  Record<string, never>,
  AppState
> {
  state = {
    data: [],
    error: null,
    isLoading: false,
    query: null,
  };

  async getAllPokemons(): Promise<void> {
    this.setState({ isLoading: true });
    const requestedData = await fetch(
      'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20'
    ).then((res) => res.json());
    this.setState({ data: requestedData.results, isLoading: false, query: '' });
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
    const trimmedQuery = query.trim();
    if (trimmedQuery === this.state.query) {
      return;
    }
    try {
      this.setState({ isLoading: true });
      if (!trimmedQuery) {
        await this.getAllPokemons();
        return;
      }
      const pokemonData = await fetch(`https://pokeapi.co/api/v2/pokemon/${trimmedQuery}`).then(
        (res) => {
          if (!res.ok) {
            this.setState({
              error: 'Pokemon not found. Please check the name and try again.',
              isLoading: false,
            });
            return;
          }
          return res.json();
        }
      );

      this.setState({
        data: [
          {
            name: pokemonData.name,
            url: `https://pokeapi.co/api/v2/pokemon/${pokemonData.name}`,
          },
        ],
        isLoading: false,
        query: trimmedQuery,
      });
      localStorage.setItem('query', trimmedQuery);
    } catch (err) {
      this.setState({
        error: 'Pokemon not found. Please check the name and try again.',
        isLoading: false,
      });
    }
  };

  render() {
    return (
      <>
        <Search value="" onSearch={this.handleSearch} />
        {this.state.isLoading ? (
          <Loader />
        ) : (
          this.state.error ? (
            <div className="error">{this.state.error}</div>
          ) : (
            <CardList data={this.state.data} />
          ))}
        <button
          onClick={() => this.setState({ error: new Error('Test error') })}
        >
          Throw error
        </button>
      </>
    );
  }
}
export default App;
