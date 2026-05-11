import type { CardProps } from "../../types/props";

export const Card = (data: CardProps) => {
  return (
    <div className="card-row">
      <img src={data.imgUrl} alt={data.imgAlt} />
      <div className="card-name">{data.name}</div>
      <div className="card-description">{data.description}</div>
    </div>
  );
}

export default Card;
