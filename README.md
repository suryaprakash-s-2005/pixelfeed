# 🎨 PixelFeed - AI Image Generator

PixelFeed is a full-stack AI-powered image generation platform where users can turn their imagination into reality. Create stunning artwork using AI, share it with the community, explore a responsive feed, and manage your personalized profile.


## ✨ Features

- **🧠 AI Image Generation**: Convert text prompts into high-quality images instantly.
- **📷 Manual Upload**: Share your own creations with the community.
- **🌍 Community Feed**: Explore a masonry-style gallery of user-generated content.
- **❤️ Interactive**: Like, download, and delete posts.
- **🌓 Dark/Light Mode**: Toggle between a cinematic dark theme and a clean light theme.
- **📱 Fully Responsive**: Optimized for Mobile, Tablet, and Desktop with a smooth hamburger menu.
- **🔐 Secure Authentication**: User registration and login protected with JWT.
- **⚡ Optimized Performance**: Lazy loading, Gzip compression, and secured HTTP headers.

## 🛠️ Tech Stack

### Frontend
- **React.js (Vite)**: Fast and modern UI library.
- **Context API**: For global state management (Auth, Theme).
- **CSS Modules / Variables**: Custom glassmorphism design system.
- **React Router**: Seamless client-side navigation.

### Backend
- **Node.js & Express**: Robust REST API.
- **MongoDB & Mongoose**: Scalable NoSQL database.
- **Security**: Helmet, CORS, Rate Limiting.
- **Optimization**: Compression (Gzip).

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (Local or Atlas URI)

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/yourusername/pixelfeed.git
    cd pixelfeed
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    # Create .env file (see Configuration)
    npm start
    ```

3.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## ⚙️ Configuration (.env)

Create a `.env` file in the **backend** directory with the following variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
# Custom Cloudflare AI Worker
WORKER_URL=https://your-worker.workers.dev
WORKER_API_KEY=your_custom_key
```

## 📱 Mobile Support
PixelFeed features a dedicated mobile experience with:
- Slide-in Hamburger Menu.
- Touch-optimized buttons.
- Single-column masonry layout for small screens.

## 🤝 Contributing
Contributions are welcome! Please fork the repo and submit a pull request.

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
