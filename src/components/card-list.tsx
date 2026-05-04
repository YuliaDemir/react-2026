import { Component } from 'react';
import Card from './card';
import type { ListProps } from './types/interfaces';

class CardList extends Component<ListProps> {
  render() {
    return (
      <div className="container">
        <header className="header">
          <h3>Name</h3>
          <h3>Description URL</h3>
        </header>
        <main className="main">
          {this.props.data.map((card) => {
            const urlParts = card.url.split('/');
            const id = urlParts[urlParts.length - 2];

            return (
              <div key={id}>
                <Card name={card.name} description={card.url} />
              </div>
            );
          })}
        </main>
      </div>
    );
  }
}

export default CardList;
