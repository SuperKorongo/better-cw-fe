import { config } from 'dotenv';
import { createWriteStream } from 'fs';

// Load environment variables from .env file
config({
	path: '.env.production'
});

// Define interfaces for API response
interface ApiItem {
	slug: string;
}

interface ApiResponse {
	data: ApiItem[];
	meta: {
		page: number;
		totalPages: number;
		totalItems: number;
	};
}

// Configuration
const API_URL = process.env.PUBLIC_STORE_API_URL;
const BASE_URL = process.env.PUBLIC_DOMAIN;
const LANGUAGES = ['en', 'es', 'it'];
const DEFAULT_LANGUAGE = 'en'; // Used for <loc> and x-default
const MAX_ITEMS = 200;
const PAGE_SIZE = 25;

// Validate environment variables
if (!API_URL || !BASE_URL) {
	throw new Error(
		'Missing required environment variables: API_URL and BASE_URL must be defined in .env file'
	);
}

// Function to generate XML for a single item (tag or model)
function generateItemXml(item: string, type: 'tags' | 'models'): string {
	const mainUrl = `${BASE_URL}/${DEFAULT_LANGUAGE}/${type}/${item}`;
	let xml = `  <url>\n`;
	xml += `    <loc>${mainUrl}</loc>\n`;
	// Add hreflang for all languages
	for (const hrefLang of LANGUAGES) {
		xml += `    <xhtml:link rel="alternate" hreflang="${hrefLang}" href="${BASE_URL}/${hrefLang}/${type}/${item}" />\n`;
	}
	// Add x-default
	xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${mainUrl}" />\n`;
	xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
	xml += `    <changefreq>weekly</changefreq>\n`;
	xml += `    <priority>0.8</priority>\n`;
	xml += `  </url>\n`;
	return xml;
}

// Function to fetch and process paginated data, writing to stream
async function processPaginatedData(
	endpoint: string,
	type: 'tags' | 'models',
	maxItems: number,
	writeStream: NodeJS.WritableStream
): Promise<number> {
	let itemCount = 0;
	let page = 1;
	let hasMore = true;

	while (hasMore && itemCount < maxItems) {
		try {
			const response = await fetch(
				`${API_URL}${endpoint}?limit=${PAGE_SIZE}&offset=${(page - 1) * PAGE_SIZE}`
			);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const { data, meta }: ApiResponse = await response.json();

			// Process each item in the current page
			for (const item of data) {
				if (itemCount >= maxItems) break;
				writeStream.write(generateItemXml(item.slug, type));
				itemCount++;
			}

			// Check if there are more pages or if we've reached max items
			hasMore = page < meta.totalPages && itemCount < maxItems;
			page++;
		} catch (error) {
			console.error(`Error fetching data from ${endpoint}:`, error);
			break;
		}
	}

	return itemCount;
}

// Main function to run the sitemap generation
async function generateSitemapFile() {
	const outputFile = 'static/sitemap.xml';
	const writeStream = createWriteStream(outputFile, { encoding: 'utf-8' });

	try {
		// Write XML header and urlset opening tag
		writeStream.write(`<?xml version="1.0" encoding="UTF-8"?>\n`);
		writeStream.write(
			`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`
		);

		// Process tags and models
		const tagsCount = await processPaginatedData(
			'/api/v1/popular/tags',
			'tags',
			MAX_ITEMS,
			writeStream
		);
		const modelsCount = await processPaginatedData(
			'/api/v1/popular/models',
			'models',
			MAX_ITEMS,
			writeStream
		);

		// Close urlset
		writeStream.write(`</urlset>`);

		// End the stream
		writeStream.end();

		console.log(`Sitemap generated successfully: ${outputFile}`);
		console.log(`Included ${tagsCount} tags and ${modelsCount} models`);
	} catch (error) {
		console.error('Error generating sitemap:', error);
		writeStream.end();
		throw error;
	}
}

// Run the script
generateSitemapFile();
