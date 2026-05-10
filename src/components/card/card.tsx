export const Card = (data: { imgUrl?: string, imgAlt?: string, name: string, description: string }) => {
  return (
    <div className="card-row">
      <img src={data.imgUrl} alt={data.imgAlt} />
      <div className="card-name">{data.name}</div>
      <div className="card-description">{data.description}</div>
    </div>
  );
}

export default Card;
