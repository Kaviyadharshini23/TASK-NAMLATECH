import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { fetchHotel } from "../redux/hotelSlice";

function HotelDetails() {
	const { id } = useParams();
	const dispatch = useDispatch();
	const hotel = useSelector((state) => state.hotels.hotels.find((item) => String(item.id) === String(id)));
	const requestStatus = useSelector((state) => state.hotels.hotelRequests[id]);
	useEffect(() => {
		dispatch(fetchHotel(id));
	}, [dispatch, id]);

	if (!hotel && requestStatus !== "failed") return <main className="page-shell"><Helmet><title>Loading hotel | HotelHub</title></Helmet><section className="empty-state"><h1>Loading hotel…</h1></section></main>;
	if (!hotel) return <main className="page-shell"><Helmet><title>Hotel not found | HotelHub</title><meta name="description" content="This hotel listing could not be found." /></Helmet><section className="empty-state"><span className="empty-icon">⌂</span><h1>Hotel not found</h1><p>This listing may have been removed or the link may be incorrect.</p><Link className="button button-primary" to="/">Back to hotels</Link></section></main>;

	const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${hotel.longitude - 0.02}%2C${hotel.latitude - 0.02}%2C${hotel.longitude + 0.02}%2C${hotel.latitude + 0.02}&layer=mapnik&marker=${hotel.latitude}%2C${hotel.longitude}`;

	return (
		<main className="page-shell details-page">
			<Helmet>
				<title>{hotel.title} | HotelHub</title>
				<meta name="description" content={`${hotel.title} — ${hotel.description}`} />
			</Helmet>
			<Link to="/" className="back-link">← Back to hotels</Link>
			<div className="details-title"><div><p className="eyebrow">HOTEL DETAILS</p><h1>{hotel.title}</h1><p className="details-location">⌖ {Number(hotel.latitude).toFixed(4)}, {Number(hotel.longitude).toFixed(4)}</p></div><div className="details-price"><strong>₹{Number(hotel.price).toLocaleString("en-IN")}</strong><span>per night</span></div></div>
			<img className="details-image" src={hotel.image} alt={`${hotel.title} hotel`} />
			<div className="details-columns">
				<section className="details-description"><p className="eyebrow">ABOUT THIS HOTEL</p><h2>{hotel.title}</h2><p>{hotel.description}</p></section>
				<section className="location-card"><div><p className="eyebrow">FIND YOUR WAY</p><h2>Location</h2><p>{Number(hotel.latitude).toFixed(4)}° N, {Number(hotel.longitude).toFixed(4)}° E</p></div><iframe title={`Map showing the location of ${hotel.title}`} src={mapUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></section>
			</div>
			<Link to="/" className="button button-primary details-back-button">← Back to all hotels</Link>
		</main>
	);
}

export default HotelDetails;
