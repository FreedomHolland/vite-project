import express from 'express';
import cors from 'cors';
import { despensorCycle } from './src/functions/despensorCycle.js';
import { checkForCanOrCup } from './src/functions/gpio_module.js';

const app = express();
const port = 3003;

app.use(express.json());
app.use(cors());

// A list to hold SSE connections
const clients = [];
let latestLog = '';

// Function to handle GPIO events and update the log
const handleGpioEvents = (log) => {
    latestLog = log;
    // Send the latest log to all connected clients
    clients.forEach(client => client.write(`data: ${log}\n\n`));
};

// Start monitoring GPIO pins
checkForCanOrCup(handleGpioEvents);

// Endpoint to get the server status
app.get('/api/status', (req, res) => {
    res.json({ status: 'Server is running and monitoring GPIO pins.' });
});

// Endpoint to get the latest GPIO log
app.get('/api/logs', (req, res) => {
    res.json({ log: latestLog });
});

// Endpoint to start the machine process
app.post('/api/machine-process', (req, res) => {
    const { taste } = req.body;

    if (!taste) {
        return res.status(400).json({ error: 'Taste is required' });
    }

    try {
        despensorCycle(taste);
        res.sendStatus(200);
    } catch (error) {
        console.error('Error processing machine:', error);
        res.status(500).json({ error: 'Failed to process machine' });
    }
});

// Endpoint to check for can/cup presence
app.get('/api/check-can-or-cup', (req, res) => {
    try {
        const hasCupOrCan = checkForCanOrCup();
        res.status(200).json({ hasCupOrCan });
    } catch (error) {
        console.error('Error checking can/cup presence:', error);
        res.status(500).json({ message: 'Failed to check can/cup presence', error: error.message });
    }
});

// Endpoint to get the current temperature
app.get('/api/temperature', (req, res) => {
    try {
        const temperature = readTemperature();
        res.status(200).json({ temperature });
    } catch (error) {
        console.error('Error reading temperature:', error);
        res.status(500).json({ message: 'Failed to read temperature', error: error.message });
    }
});

// Server-Sent Events (SSE) endpoint for real-time GPIO event streaming
app.get('/api/gpio-events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Add the client to the list
    clients.push(res);

    // Send the latest log to the newly connected client
    if (latestLog) {
        res.write(`data: ${latestLog}\n\n`);
    }

    // Remove client from the list on disconnect
    req.on('close', () => {
        console.log('Client disconnected from SSE');
        const index = clients.indexOf(res);
        if (index !== -1) {
            clients.splice(index, 1);
        }
        res.end();
    });
});

app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
});
