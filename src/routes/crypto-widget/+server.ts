import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width" />
            <script src="/widget.js"></script>
            <style>
            * {
                margin: 0;
                padding: 0;
            }
            body {
                overflow-x: hidden;
            }
            #crypto-widget-container-container {
                padding: 10px 16px;
                max-width: 750px;
                margin: 0 auto;
            }
            </style>
        </head>
        <body>
            <div id="crypto-widget-container-container">
            <div id="crypto-widget-container"></div>
            </div>
            <script>
            CRYPTO_GATEWAY.init("crypto-widget-container");
            </script>
        </body>
        </html>
    `;

	return new Response(html, {
		headers: {
			'Content-Type': 'text/html'
		}
	});
};
