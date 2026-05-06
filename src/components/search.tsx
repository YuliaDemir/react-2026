import { Component } from 'react';

interface SearchState {
  value: string;
}

interface SearchProps {
  value: string;
  onSearch(query: string): void;
}

class Search extends Component<SearchProps, SearchState> {
  state = {
    value: localStorage.getItem('query') || '',
  };

  render() {
    return (
      <div className="search-panel">
        <input
          className="search-input"
          type="text"
          value={this.state.value}
          placeholder="Search Pokémon by name..."
          onChange={(e) => this.setState({ value: e.target.value })}
        />

        <button
          className="search-button"
          type="button"
          onClick={() => this.props.onSearch(this.state.value)}
        >
          Search
        </button>
      </div>
    );
  }
}

export default Search;
