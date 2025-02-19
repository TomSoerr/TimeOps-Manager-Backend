import express from 'express';
import { setRoutes } from './routes/index';
import { connectToDatabase } from './config/database';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to PostgreSQL database
connectToDatabase();

// Set up routes
setRoutes(app);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});