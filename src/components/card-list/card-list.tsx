import type { ListProps } from '../../types/props';
import Card from '../card/card';

export const CardList = ({ data }: ListProps) => {
  return (
    <div className="main">
      <ul className="container">
        {data.map((card) => {
          return (
            <li key={card.id} data-testid="card">
              <Card name={card.title} description={card.description} imgUrl={card.imgUrl} imgAlt={card.imgAlt} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default CardList;
