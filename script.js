// ============================================
// MATRIX TERMINAL - CONFIGURATION
// ============================================

// API endpoint (proxied through Vercel serverless function)
const API_ENDPOINT = '/api/webhook';

// ============================================
// DOM ELEMENTS
// ============================================

const messageWindow = document.getElementById('messageWindow');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get current timestamp in terminal format
 * @returns {string} Formatted timestamp [HH:MM:SS]
 */
function getTimestamp() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `[${hours}:${minutes}:${seconds}]`;
}

/**
 * Scroll message window to bottom
 */
function scrollToBottom() {
    messageWindow.scrollTop = messageWindow.scrollHeight;
}

/**
 * Create a message element
 * @param {string} content - Message content
 * @param {string} type - Message type: 'user', 'system', 'error', 'loading'
 * @returns {HTMLElement} Message element
 */
function createMessageElement(content, type = 'system') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;

    const timestamp = document.createElement('span');
    timestamp.className = 'timestamp';
    timestamp.textContent = getTimestamp();

    const prefix = document.createElement('span');
    prefix.className = 'prefix';
    prefix.textContent = type === 'user' ? '>' : '[SYSTEM]:';

    const contentSpan = document.createElement('span');
    contentSpan.className = 'content';
    contentSpan.textContent = content;

    messageDiv.appendChild(timestamp);
    messageDiv.appendChild(prefix);
    messageDiv.appendChild(contentSpan);

    return messageDiv;
}

/**
 * Add a message to the chat window
 * @param {string} content - Message content
 * @param {string} type - Message type
 * @returns {HTMLElement} The added message element
 */
function addMessage(content, type = 'system') {
    const messageElement = createMessageElement(content, type);
    messageWindow.appendChild(messageElement);
    scrollToBottom();
    return messageElement;
}

/**
 * Display typing animation for bot response
 * @param {string} text - Full text to animate
 * @param {HTMLElement} element - Element to animate into
 * @returns {Promise} Resolves when animation complete
 */
function typeMessage(text, element) {
    return new Promise((resolve) => {
        const contentSpan = element.querySelector('.content');
        contentSpan.textContent = '';
        contentSpan.classList.add('typing-indicator');

        let index = 0;
        const speed = 20; // milliseconds per character

        function type() {
            if (index < text.length) {
                contentSpan.textContent += text.charAt(index);
                index++;
                scrollToBottom();
                setTimeout(type, speed);
            } else {
                contentSpan.classList.remove('typing-indicator');
                resolve();
            }
        }

        // Small delay before starting to type
        setTimeout(type, 300);
    });
}

// ============================================
// N8N WEBHOOK INTEGRATION
// ============================================

/**
 * Send message to n8n webhook
 * @param {string} message - User message
 * @returns {Promise<string>} Bot response
 */
async function sendToN8n(message) {
    try {
        const url = `${API_ENDPOINT}?message=${encodeURIComponent(message)}`;
        const response = await fetch(url, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();

        // Handle empty response
        if (!text) {
            return 'Webhook triggered successfully (no response data)';
        }

        const data = JSON.parse(text);

        // Handle different response formats from n8n
        // Array format: [{"text": "..."}]
        if (Array.isArray(data) && data.length > 0) {
            return data[0].text || data[0].response || data[0].message || data[0].output || JSON.stringify(data[0]);
        }

        // Object format: {"response": "..."} or {"message": "..."} etc.
        return data.response || data.message || data.output || data.text || JSON.stringify(data);
    } catch (error) {
        console.error('Error communicating with n8n:', error);
        throw new Error('Connection failed. Check your network or webhook configuration.');
    }
}

/**
 * Simulate bot response for demo mode
 * @param {string} message - User message
 * @returns {string} Simulated response
 */
function simulateResponse(message) {
    const responses = [
        "The Matrix has you... Follow the white rabbit.",
        "Wake up, Neo... The Matrix has you.",
        "Unfortunately, no one can be told what the Matrix is. You have to see it for yourself.",
        "I know kung fu.",
        "There is no spoon.",
        "Free your mind.",
        "Welcome to the real world.",
        "The body cannot live without the mind.",
        "I'm trying to free your mind, Neo. But I can only show you the door. You're the one that has to walk through it.",
        "What is real? How do you define 'real'?"
    ];

    // Return random response after a small delay to simulate processing
    return new Promise((resolve) => {
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * responses.length);
            resolve(responses[randomIndex]);
        }, 500 + Math.random() * 1000);
    });
}

// ============================================
// CHAT LOGIC
// ============================================

let isProcessing = false;

/**
 * Handle sending a message
 */
async function handleSendMessage() {
    const message = userInput.value.trim();

    // Validate input
    if (!message || isProcessing) {
        return;
    }

    isProcessing = true;
    userInput.value = '';
    userInput.disabled = true;
    sendButton.disabled = true;

    // Add user message
    addMessage(message, 'user');

    // Add loading indicator
    const loadingMessage = addMessage('Processing request...', 'loading');

    try {
        // Get response from n8n (or demo mode)
        const response = await sendToN8n(message);

        // Remove loading message
        loadingMessage.remove();

        // Create system message and type the response
        const systemMessage = createMessageElement('', 'system');
        messageWindow.appendChild(systemMessage);
        await typeMessage(response, systemMessage);
    } catch (error) {
        // Remove loading message
        loadingMessage.remove();

        // Show error message
        addMessage(error.message, 'error');
    } finally {
        isProcessing = false;
        userInput.disabled = false;
        sendButton.disabled = false;
        userInput.focus();
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

// Send button click
sendButton.addEventListener('click', handleSendMessage);

// Enter key press
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        handleSendMessage();
    }
});

// Focus input on page load
document.addEventListener('DOMContentLoaded', () => {
    userInput.focus();

    // Update initial timestamps
    const initialMessages = document.querySelectorAll('.message .timestamp');
    const timestamp = getTimestamp();
    initialMessages.forEach(ts => {
        if (ts.textContent === '[--:--:--]') {
            ts.textContent = timestamp;
        }
    });
});

// ============================================
// MATRIX RAIN EFFECT (Background)
// ============================================

function initMatrixRain() {
    const canvas = document.getElementById('matrixCanvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();

    // Matrix characters (alphanumeric only - A-Z and 0-9)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charArray = chars.split('');

    const fontSize = 14;
    let columns = Math.floor(canvas.width / fontSize);
    let drops = [];

    // Initialize drops
    function initDrops() {
        columns = Math.floor(canvas.width / fontSize);
        drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100;
        }
    }
    initDrops();

    // Blue color palette
    const colors = [
        '#00bfff',  // Bright blue
        '#0088cc',  // Medium blue
        '#006699',  // Darker blue
        '#004466',  // Even darker
    ];

    function draw() {
        // Semi-transparent black to create fade effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            // Random character
            const char = charArray[Math.floor(Math.random() * charArray.length)];

            // Calculate y position
            const y = drops[i] * fontSize;

            // Head of the drop is brightest
            if (y > 0) {
                // Bright head
                ctx.fillStyle = '#ffffff';
                ctx.fillText(char, i * fontSize, y);

                // Trail with varying blue shades
                for (let j = 1; j < 20; j++) {
                    const trailY = y - (j * fontSize);
                    if (trailY > 0) {
                        const alpha = 1 - (j / 20);
                        const colorIndex = Math.min(j, colors.length - 1);
                        ctx.fillStyle = colors[Math.floor(j / 5)] || colors[colors.length - 1];
                        ctx.globalAlpha = alpha * 0.8;
                        const trailChar = charArray[Math.floor(Math.random() * charArray.length)];
                        ctx.fillText(trailChar, i * fontSize, trailY);
                    }
                }
                ctx.globalAlpha = 1;
            }

            // Reset drop when it goes off screen
            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            // Move drop down
            drops[i]++;
        }
    }

    // Animation loop
    setInterval(draw, 33);

    // Handle window resize
    window.addEventListener('resize', () => {
        resizeCanvas();
        initDrops();
    });
}

// Initialize Matrix rain on page load
initMatrixRain();
