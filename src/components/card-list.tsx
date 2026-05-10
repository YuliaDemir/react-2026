import { Component } from 'react';
import Card from './card/card';
import type { ListProps } from '../types/interfaces';

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

            return (
              <div key={card.id} data-testid="card">
                <Card name={card.title} description={card.description} imgUrl={card.imgUrl} imgAlt={card.imgAlt} />
              </div>
            );
          })}
        </main>
      </div>
    );
  }
}

export default CardList;
