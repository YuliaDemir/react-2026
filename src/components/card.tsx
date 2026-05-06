import { Component } from 'react';
import type { CardProps } from './types/interfaces';

class Card extends Component<CardProps> {
  render() {
    return (
      <div className="card-row">
        <div className="card-name">{this.props.name}</div>
        <div className="card-description">{this.props.description}</div>
      </div>
    );
  }
}

export default Card;
