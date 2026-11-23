function HotelCard({ hotel, onDelete, onEdit, onView }) {
  return (
    <article className="hotel-card">
      <button className="card-image-button" onClick={() => onView(hotel.id)} aria-label={`View ${hotel.title} details`}>
        <img src={hotel.image} alt={`${hotel.title} property`} />
      </button>

      <div className="hotel-content">
        <div className="card-heading">
          <h2>{hotel.title}</h2>
        </div>
        <p className="card-description">{hotel.description}</p>
        <p className="card-location">⌖ {Number(hotel.latitude).toFixed(2)}, {Number(hotel.longitude).toFixed(2)}</p>

        <div className="actions">
          <p className="card-price"><strong>₹{Number(hotel.price).toLocaleString("en-IN")}</strong> <span>/ night</span></p>
          <button className="icon-button" onClick={() => onEdit(hotel.id)} aria-label={`Edit ${hotel.title}`}>✎</button>
          <button className="icon-button danger-icon" onClick={() => onDelete(hotel.id)} aria-label={`Delete ${hotel.title}`}>⌫</button>
        </div>
        <div className="card-links">
          <button className="button button-outline card-view" onClick={() => onView(hotel.id)}>View details</button>
        </div>
      </div>
    </article>
  );
}

export default HotelCard;