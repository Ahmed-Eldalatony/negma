import { Helmet } from 'react-helmet-async';

interface MetadataProps {
	title?: string;
	description?: string;
	image?: string;
	url?: string;
	favicon?: string;
}

export const Metadata = ({ title, description, image, url, favicon }: MetadataProps) => {
	return (
		<Helmet>
			{title && <title>{title}</title>}
			{description && <meta name="description" content={description} />}
			{favicon && <link rel="icon" type="image/x-icon" href={favicon} />}

			{/* Open Graph / Facebook */}
			{title && <meta property="og:title" content={title} />}
			{description && <meta property="og:description" content={description} />}
			{image && <meta property="og:image" content={image} />}
			{url && <meta property="og:url" content={url} />}
			<meta property="og:type" content="website" />

			{/* Twitter */}
			{title && <meta property="twitter:title" content={title} />}
			{description && <meta property="twitter:description" content={description} />}
			{image && <meta property="twitter:image" content={image} />}
			<meta property="twitter:card" content="summary_large_image" />
		</Helmet>
	);
};
