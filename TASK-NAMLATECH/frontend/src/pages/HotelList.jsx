import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import HotelCard from "../components/HotelCard";
import Pagination from "../components/Pagination";
import { deleteHotel, fetchHotels } from "../redux/hotelSlice";

const PAGE_SIZE = 6;

function HotelList() {
	const hotels = useSelector((state) => state.hotels.hotels);
	const hotelsTotal = useSelector((state) => state.hotels.hotelsTotal);
	const apiError = useSelector((state) => state.hotels.error);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const [search, setSearch] = useState("");
	const [minPrice, setMinPrice] = useState("");
	const [maxPrice, setMaxPrice] = useState("");
	const [page, setPage] = useState(1);
	const [notice, setNotice] = useState(location.state?.notice || "");

	useEffect(() => {
		if (!notice) return undefined;
		const timeout = window.setTimeout(() => setNotice(""), 3500);
		return () => window.clearTimeout(timeout);
	}, [notice]);

	useEffect(() => {
		dispatch(fetchHotels({ title: search, minPrice, maxPrice, offset: (page - 1) * PAGE_SIZE, limit: PAGE_SIZE }));
	}, [dispatch, search, minPrice, maxPrice, page, hotels.length]);

	const pageCount = Math.max(1, Math.ceil(hotelsTotal / PAGE_SIZE));
	const visibleHotels = hotels;

	async function confirmDelete(id) {
		const hotel = hotels.find((item) => String(item.id) === String(id));
		if (hotel && window.confirm(`Delete “${hotel.title}”? This action cannot be undone.`)) {
			try {
				await dispatch(deleteHotel(id)).unwrap();
				const lastPage = Math.max(1, Math.ceil((hotelsTotal - 1) / PAGE_SIZE));
				if (page > lastPage) setPage(lastPage);
				setNotice("Hotel deleted successfully.");
			} catch (error) {
				setNotice(error.message || "Could not delete hotel.");
			}
		}
	}

	function updateFilter(setter, value) {
		setter(value);
		setPage(1);
	}

	return (
		<main>
			<Helmet>
				<title>Find your next stay | HotelHub</title>
				<meta name="description" content="Discover comfortable stays, compare prices, and find the perfect hotel for your next trip with HotelHub." />
			</Helmet>
			<section className="hero">
				<div className="hero-content">
						<p className="eyebrow"><span className="eyebrow-dot" /> A PLACE FOR YOUR NEXT TRIP</p>
						<h1>A good stay<br /><span>makes the trip.</span></h1>
						<p className="hero-copy">Browse hotels, check the details, and find somewhere that suits your plans.</p>
						<a className="hero-link" href="#hotel-list">Browse the hotels <span aria-hidden="true">↓</span></a>
				</div>
				<div className="hero-image" role="img" aria-label="A peaceful luxury hotel surrounded by tropical greenery" />
			</section>

			<section className="listing-section" id="hotel-list">
				<div className="section-heading">
					<div><p className="eyebrow">FIND YOUR NEXT STAY</p><h2>Hotels to explore</h2><p className="section-subtitle">A few places to get you started. Filter by name or nightly price.</p></div>
					<span className="results-count">{hotelsTotal} {hotelsTotal === 1 ? "stay" : "stays"}</span>
				</div>
				<div className="filter-bar">
					<label className="search-field"><span aria-hidden="true">⌕</span><span className="sr-only">Search by hotel name</span><input type="search" value={search} onChange={(event) => updateFilter(setSearch, event.target.value)} placeholder="Search hotels by name" /></label>
					<div className="price-filters"><span className="filter-label">Price per night</span><label><span className="sr-only">Minimum price</span><span>₹</span><input type="number" min="0" value={minPrice} onChange={(event) => updateFilter(setMinPrice, event.target.value)} placeholder="Min" /></label><span className="price-dash">–</span><label><span className="sr-only">Maximum price</span><span>₹</span><input type="number" min="0" value={maxPrice} onChange={(event) => updateFilter(setMaxPrice, event.target.value)} placeholder="Max" /></label></div>
					{(search || minPrice || maxPrice) && <button className="clear-filters" onClick={() => { setSearch(""); setMinPrice(""); setMaxPrice(""); setPage(1); }}>Clear filters</button>}
				</div>
				{(notice || apiError) && <div className="toast" role={apiError && !notice ? "alert" : "status"}><span aria-hidden="true">{apiError && !notice ? "!" : "✓"}</span>{notice || apiError}<button onClick={() => { setNotice(""); }} aria-label="Dismiss notification">×</button></div>}
				{visibleHotels.length > 0 ? <div className="hotel-grid">{visibleHotels.map((hotel) => <HotelCard key={hotel.id} hotel={hotel} onView={(id) => navigate(`/hotel/${id}`)} onEdit={(id) => navigate(`/edit/${id}`)} onDelete={confirmDelete} />)}</div> : <div className="empty-state"><span className="empty-icon">⌕</span><h2>No stays found</h2><p>Try adjusting your search or price range to find a match.</p><button className="button button-outline" onClick={() => { setSearch(""); setMinPrice(""); setMaxPrice(""); }}>Clear filters</button></div>}
				{hotelsTotal > PAGE_SIZE && <Pagination currentPage={page} totalPages={pageCount} onPageChange={setPage} />}
			</section>
			<footer className="site-footer"><span className="footer-logo">HotelHub</span><span>Find a stay that feels like yours.</span><span>© 2026 HotelHub</span></footer>
		</main>
	);
}

export default HotelList;
