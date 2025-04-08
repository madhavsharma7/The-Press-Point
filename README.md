
# Project Title

📢 The Press Point
The Press Point is a full-stack MERN (MongoDB, Express, React, Node.js) application designed for publishing and managing news articles or press releases. It features:

🔐 User authentication (login/signup)

📝 Create, edit, and delete articles

🔍 Browse and read published content

📱 Responsive UI for all devices

Built with scalability and simplicity in mind, The Press Point offers a seamless content publishing experience for both writers and readers.


## Deployment

The frontend of The Press Point is deployed on Vercel for fast and reliable hosting.

🔗 Live Demo
You can check out the live version here: https://the-press-point.vercel.app/ 

#API Reference

The Press Point utilizes the GNews API to fetch and display the latest news articles. Below is an overview of the API integration:

GNews API Overview
The GNews API provides access to current and historical news articles from over 60,000 sources worldwide. It supports searching for articles, retrieving top headlines, and filtering news based on various parameters such as language, country, and topic.

Authentication
To access the GNews API, an API key is required. You can obtain a free API key by signing up at the GNews API Dashboard. Once registered, your API key will be available in the dashboard.

Example:

bash
Copy
Edit
https://gnews.io/api/v4/search?q=example&apikey=YOUR_API_KEY
Endpoints Used
1. Search Endpoint

Retrieves news articles based on a search query.

Endpoint: GET /v4/search

Parameters:

q: Search query (e.g., "technology")

lang: Language code (e.g., "en" for English)

country: Country code (e.g., "us" for United States)

max: Maximum number of articles to retrieve

apikey: Your API key

Example Request:

bash
Copy
Edit
https://gnews.io/api/v4/search?q=technology&lang=en&country=us&max=10&apikey=YOUR_API_KEY
2. Top Headlines Endpoint

Fetches the current top headlines.

Endpoint: GET /v4/top-headlines

Parameters:

category: News category (e.g., "general", "business", "technology")

lang: Language code

country: Country code

max: Maximum number of articles to retrieve

apikey: Your API key

Example Request:

bash
Copy
Edit
https://gnews.io/api/v4/top-headlines?category=technology&lang=en&country=us&max=10&apikey=YOUR_API_KEY
Integration in The Press Point
In The Press Point, the GNews API is integrated to fetch and display news articles dynamically. The backend server makes HTTP requests to the GNews API endpoints, processes the JSON responses, and serves the data to the React frontend for rendering.

Note: Ensure that your API key is kept secure and not exposed in the client-side code. It's recommended to store the API key in environment variables and access it securely in your server-side application.

For more detailed information on the GNews API, refer to their official documentation.


## Installation

Follow these steps to get The Press Point up and running on your local machine.

1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/your-username/the-press-point.git
cd the-press-point
2. Set Up the Backend (Express + Node + MongoDB)
📁 Navigate to the backend directory (adjust if yours is named differently):
bash
Copy
Edit
cd backend
📦 Install dependencies:
bash
Copy
Edit
npm install
⚙️ Create a .env file in the backend folder and add the following:
env
Copy
Edit
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GNEWS_API_KEY=your_gnews_api_key
Replace the values with your actual credentials.

▶️ Start the backend server:
bash
Copy
Edit
npm start
The server should run on http://localhost:5000

3. Set Up the Frontend (React)
📁 Open a new terminal and navigate to the frontend folder:
bash
Copy
Edit
cd ../frontend
📦 Install dependencies:
bash
Copy
Edit
npm install
⚙️ Create a .env file in the frontend folder and add:
env
Copy
Edit
REACT_APP_API_URL=http://localhost:5000
▶️ Start the React development server:
bash
Copy
Edit
npm start
The app should now run on http://localhost:3000

4. Access the App
Frontend: http://localhost:3000

Backend API: http://localhost:5000

✅ Project Structure Overview
csharp
Copy
Edit
the-press-point/
│
├── backend/          # Express + Node.js server
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   └── ...
│
├── frontend/         # React frontend
│   ├── src/
│   ├── public/
│   └── ...
│
├── README.md
└── ...