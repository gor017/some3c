import express from 'express';
import { startAutomation } from '../controllers/index.js';

const router = (app) => {
    // GET home route
    app.get('/', (req, res) => {
        res.send('Welcome to the Express Router!');
    });
    
    // Example POST route
    app.post('/submit', startAutomation);
}


// Add additional routes as needed

export default router;