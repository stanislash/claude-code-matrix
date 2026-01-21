export default async function handler(req, res) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const webhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!webhookUrl) {
        return res.status(500).json({ error: 'Webhook URL not configured' });
    }

    const message = req.query.message;

    if (!message) {
        return res.status(400).json({ error: 'Message parameter is required' });
    }

    try {
        const response = await fetch(`${webhookUrl}?message=${encodeURIComponent(message)}`);

        const text = await response.text();

        if (!response.ok) {
            return res.status(response.status).json({ error: `Webhook error: ${response.status}` });
        }

        // Return empty response handling
        if (!text) {
            return res.status(200).json({ text: 'Webhook triggered successfully' });
        }

        // Parse and forward the response
        const data = JSON.parse(text);
        return res.status(200).json(data);
    } catch (error) {
        console.error('Webhook proxy error:', error);
        return res.status(500).json({ error: 'Failed to connect to webhook' });
    }
}
