import { Component } from 'react';
import './App.css';
import Search from './components/search';
import CardList from './components/card-list';
import type { Pokemons } from './components/types/interfaces';
import Loader from './components/loader';

class App extends Component<
  Record<string, never>,
  { data: Pokemons[]; error: Error | null; isLoading: boolean }
> {
  state = {
    data: [],
    error: null,
    isLoading: false,
  };

  async getAllPokemons(): Promise<void> {
    const requestedData = await fetch(
      'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1302'
    ).then((res) => res.json());
    this.setState({ data: requestedData.results });
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
    try {
      this.setState({ isLoading: true });
      if (!trimmedQuery) {
        await this.getAllPokemons();
        this.setState({ isLoading: false });
        return;
      }
      await fetch(`https://pokeapi.co/api/v2/pokemon/${trimmedQuery}`).then(
        (res) => {
          if (!res.ok) {
            throw new Error('Not found!');
          }
          return res.json();
        }
      );

      this.setState({
        data: [
          {
            name: trimmedQuery,
            url: `https://pokeapi.co/api/v2/pokemon/${trimmedQuery}`,
          },
        ],
        isLoading: false,
      });
      localStorage.setItem('query', trimmedQuery);
    } catch (err) {
      this.setState({ error: err as Error, isLoading: false });
    }
  };

  render() {
    if (this.state.error) {
      throw this.state.error;
    }
    return (
      <>
        <Search value="" onSearch={this.handleSearch} />
        {this.state.isLoading ? (
          <Loader />
        ) : (
          <CardList data={this.state.data} />
        )}
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
