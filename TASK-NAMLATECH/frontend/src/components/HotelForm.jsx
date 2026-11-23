import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import { createHotel, fetchHotel, updateHotel } from "../redux/hotelSlice";

const emptyHotel = { title: "", description: "", latitude: "", longitude: "", price: "", image: "" };

function HotelForm() {
	const { id } = useParams();
	const dispatch = useDispatch();
	const isEditing = Boolean(id);
	const hotel = useSelector((state) => state.hotels.hotels.find((item) => String(item.id) === String(id)));
	const requestStatus = useSelector((state) => state.hotels.hotelRequests[id]);
	useEffect(() => {
		if (isEditing) dispatch(fetchHotel(id));
	}, [dispatch, id, isEditing]);
	if (isEditing && requestStatus !== "succeeded" && requestStatus !== "failed") {
		return <main className="page-shell"><section className="empty-state"><h1>Loading hotel…</h1></section></main>;
	}
	if (isEditing && !hotel) {
		return <main className="page-shell"><section className="empty-state"><span className="empty-icon">⌂</span><h1>Hotel not found</h1><p>This listing may have been removed.</p><Link className="button button-primary" to="/">Back to hotels</Link></section></main>;
	}
	return <HotelFormEditor key={id || "new"} hotel={hotel} isEditing={isEditing} />;
}

function HotelFormEditor({ hotel, isEditing }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [values, setValues] = useState(() => hotel ? { ...hotel } : emptyHotel);
	const [errors, setErrors] = useState({});
	const [imageFile, setImageFile] = useState(null);
	const [submitError, setSubmitError] = useState("");
	const [submitting, setSubmitting] = useState(false);

	function updateField(event) {
		const { name, value } = event.target;
		setValues((current) => ({ ...current, [name]: value }));
		setErrors((current) => ({ ...current, [name]: "" }));
	}

	function handleImage(event) {
		const file = event.target.files?.[0];
		if (!file) return;
		if (!file.type.startsWith("image/")) {
			setErrors((current) => ({ ...current, image: "Please choose an image file." }));
			return;
		}
		if (file.size > 5 * 1024 * 1024) {
			setErrors((current) => ({ ...current, image: "Image size must be 5 MB or less." }));
			return;
		}
		setImageFile(file);
		const reader = new FileReader();
		reader.onload = () => {
			setValues((current) => ({ ...current, image: String(reader.result) }));
			setErrors((current) => ({ ...current, image: "" }));
		};
		reader.readAsDataURL(file);
	}

	function validate() {
		const nextErrors = {};
		if (!values.title.trim()) nextErrors.title = "Enter a hotel name.";
		if (!values.description.trim()) nextErrors.description = "Enter a description.";
		if (!values.image) nextErrors.image = "Upload a hotel image.";
		if (values.latitude === "" || !Number.isFinite(Number(values.latitude)) || Number(values.latitude) < -90 || Number(values.latitude) > 90) nextErrors.latitude = "Latitude must be between -90 and 90.";
		if (values.longitude === "" || !Number.isFinite(Number(values.longitude)) || Number(values.longitude) < -180 || Number(values.longitude) > 180) nextErrors.longitude = "Longitude must be between -180 and 180.";
		if (values.price === "" || !Number.isFinite(Number(values.price)) || Number(values.price) <= 0) nextErrors.price = "Price must be a positive number.";
		setErrors(nextErrors);
		return Object.keys(nextErrors).length === 0;
	}

	async function handleSubmit(event) {
		event.preventDefault();
		if (!validate()) return;
		setSubmitting(true);
		setSubmitError("");
		const hotelData = {
			...values,
			id: isEditing ? hotel.id : undefined,
			image: imageFile ? hotel?.image || "" : values.image,
			title: values.title.trim(),
			description: values.description.trim(),
			latitude: Number(values.latitude),
			longitude: Number(values.longitude),
			price: Number(values.price),
		};
		try {
			await dispatch(isEditing ? updateHotel({ hotel: hotelData, imageFile }) : createHotel({ hotel: hotelData, imageFile })).unwrap();
			navigate("/", { state: { notice: isEditing ? "Hotel updated successfully." : "Hotel added successfully." } });
		} catch (error) {
			setSubmitError(error.message || "Could not save this hotel. Please try again.");
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<main className="page-shell form-page">
			<Helmet>
				<title>{isEditing ? `Edit ${hotel.title} | HotelHub` : "Add a hotel | HotelHub"}</title>
				<meta name="description" content={isEditing ? "Update your hotel listing on HotelHub." : "Add a hotel listing to HotelHub."} />
			</Helmet>
			<Link to="/" className="back-link">← Back to hotels</Link>
			<div className="form-heading">
				<p className="eyebrow">ADD A LISTING</p>
				<h1>{isEditing ? "Update your listing" : "Add a hotel"}</h1>
				<p>{isEditing ? "Update the details guests see when they view your hotel." : "Add the details guests need to find and book your hotel."}</p>
			</div>
			<form className="hotel-form" onSubmit={handleSubmit} noValidate>
				<div className="form-section-title"><span>01</span><div><h2>Hotel information</h2><p>Tell guests what makes this stay special.</p></div></div>
				<div className="form-grid">
					<label className="field field-full">Hotel name <span className="required">*</span>
						<input name="title" value={values.title} onChange={updateField} placeholder="e.g. The Grand Riverside" aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? "title-error" : undefined} />
						{errors.title && <span className="field-error" id="title-error">{errors.title}</span>}
					</label>
					<label className="field field-full">Description <span className="required">*</span>
						<textarea name="description" value={values.description} onChange={updateField} rows="4" placeholder="Describe the rooms, amenities, and nearby attractions..." aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? "description-error" : undefined} />
						{errors.description && <span className="field-error" id="description-error">{errors.description}</span>}
					</label>
					<div className="field field-full">Hotel image <span className="required">*</span>
						<label className="upload-box" htmlFor="hotel-image">
							{values.image ? <img className="image-preview" src={values.image} alt="Hotel image preview" /> : <><span className="upload-icon" aria-hidden="true">↑</span><strong>Choose an image to upload</strong><span>JPG, PNG, WebP, GIF or AVIF · Up to 5 MB</span></>}
							<input id="hotel-image" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" onChange={handleImage} aria-describedby={errors.image ? "image-error" : undefined} />
						</label>
						{errors.image && <span className="field-error" id="image-error">{errors.image}</span>}
					</div>
				</div>
				<div className="form-section-title location-title"><span>02</span><div><h2>Location & pricing</h2><p>Help guests find you and plan their stay.</p></div></div>
				<div className="form-grid">
					<label className="field">Latitude <span className="required">*</span>
						<input name="latitude" type="number" step="any" min="-90" max="90" value={values.latitude} onChange={updateField} placeholder="e.g. 19.0760" aria-invalid={Boolean(errors.latitude)} aria-describedby={errors.latitude ? "latitude-error" : undefined} />
						{errors.latitude && <span className="field-error" id="latitude-error">{errors.latitude}</span>}
					</label>
					<label className="field">Longitude <span className="required">*</span>
						<input name="longitude" type="number" step="any" min="-180" max="180" value={values.longitude} onChange={updateField} placeholder="e.g. 72.8777" aria-invalid={Boolean(errors.longitude)} aria-describedby={errors.longitude ? "longitude-error" : undefined} />
						{errors.longitude && <span className="field-error" id="longitude-error">{errors.longitude}</span>}
					</label>
					<label className="field field-full">Price per night <span className="required">*</span>
						<div className="input-prefix"><span>₹</span><input name="price" type="number" min="0.01" step="0.01" value={values.price} onChange={updateField} placeholder="e.g. 4500" aria-invalid={Boolean(errors.price)} aria-describedby={errors.price ? "price-error" : undefined} /></div>
						{errors.price && <span className="field-error" id="price-error">{errors.price}</span>}
					</label>
				</div>
				{submitError && <p className="field-error" role="alert">{submitError}</p>}
				<div className="form-actions"><Link className="button button-quiet" to="/">Cancel</Link><button className="button button-primary" type="submit" disabled={submitting}>{submitting ? "Saving…" : isEditing ? "Save changes" : "Add hotel"}<span aria-hidden="true">→</span></button></div>
			</form>
		</main>
	);
}

export default HotelForm;
