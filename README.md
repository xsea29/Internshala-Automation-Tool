# 🚀 Internshala Automation Tool

An intelligent automation platform that streamlines the internship application process on Internshala. Apply to dozens of matching internships with just one click while you sleep.

## ✨ Features

- 🎯 **Smart Automation**: Automatically finds and applies to internships matching your profile
- 📊 **Real-time Progress Tracking**: Live updates via Server-Sent Events (SSE) with progress bar and activity feed
- ⏸️ **Stop/Resume Control**: Pause automation mid-process with confirmation dialog
- 📱 **Modern UI**: Clean, responsive design with Tailwind CSS and Lucide React icons
- 🎉 **Completion Celebration**: Confetti animation when automation completes
- 📜 **Application History**: View all submitted applications in organized table format
- 🔐 **User Authentication**: Secure login/register system with Flask-Login
- ⏱️ **Elapsed Time Tracker**: Monitor how long automation has been running
- 🎨 **Custom Design System**: Beautiful gradients, animations, and typography

## 🛠️ Tech Stack

### Frontend
- **React 18.0.0** - UI framework
- **React Router 7.1.1** - Client-side routing
- **Tailwind CSS 3.4.17** - Utility-first styling
- **Lucide React 0.577.0** - Icon library
- **EventSource API** - Real-time server updates

### Backend (Separate Repository)
- **Flask** - Python web framework
- **Puppeteer** - Browser automation
- **Flask-SQLAlchemy** - Database ORM
- **Flask-Login** - User session management
- **Flask-CORS** - Cross-origin resource sharing
- **Flask-Bcrypt** - Password hashing

## 📁 Project Structure

```
Internshala-Automation-Tool/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── Homepage.js          # Landing page with features
│   │   ├── Login.js              # User login
│   │   ├── Register.js           # User registration
│   │   ├── Apply.js              # Automation form & progress tracking
│   │   ├── Applications.js       # Application history table
│   │   ├── Navbar.js             # Navigation bar
│   │   └── PageNotFound.js       # 404 page
│   ├── App.js                    # Main app component & routing
│   ├── App.css                   # Global styles
│   ├── index.js                  # React entry point
│   └── index.css                 # Custom CSS with design system
├── .env                          # Environment variables
├── package.json                  # Dependencies
├── tailwind.config.js            # Tailwind configuration
└── README.md                     # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 14+ and npm
- Backend server running (separate repository)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/xsea29/Internshala-Automation-Tool.git
   cd Internshala-Automation-Tool
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_BACKEND_URL=http://127.0.0.1:5000
   ```
   
   For production, use your deployed backend URL:
   ```env
   REACT_APP_BACKEND_URL=https://your-backend.onrender.com
   ```

4. **Start development server**
   ```bash
   npm start
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

### `npm run build`
Builds the app for production to the `build` folder. Optimized and minified.

### `npm test`
Launches the test runner in interactive watch mode.

## 🌐 Deployment

### Frontend (Vercel)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "your message"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Framework: **Create React App**
   - Build Command: `npm run build`
   - Output Directory: `build`

3. **Add Environment Variable**
   - Settings → Environment Variables
   - Add `REACT_APP_BACKEND_URL` with your backend URL

### Backend Requirements
The backend must implement these endpoints:

- `POST /api/login` - User authentication
- `POST /api/register` - User registration
- `POST /logout` - User logout
- `POST /api/apply-internships` - Start automation, returns `{session_id}`
- `GET /api/apply-internships-stream?session={id}` - SSE progress stream
- `POST /api/stop-automation` - Stop automation with `{session_id}`
- `GET /api/submitted-applications` - Fetch application history

## 🔧 Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_BACKEND_URL` | Backend API base URL | `http://127.0.0.1:5000` |

### CORS Configuration
Ensure your backend allows requests from your frontend domain:

```python
CORS(app, origins=["https://your-app.vercel.app"], supports_credentials=True)
```

## 🎯 Usage

1. **Register/Login** - Create an account or sign in
2. **Navigate to Apply** - Click "Apply" or "Start automating"
3. **Enter Details**:
   - Internship role (e.g., "Web Development")
   - Cover letter (max 500 characters)
4. **Submit** - Automation starts, showing real-time progress
5. **Monitor Progress** - Watch live updates with percentage and count
6. **Stop Anytime** - Click stop button if needed (with confirmation)
7. **View Results** - See completion stats and confetti celebration
8. **Check History** - View all applications in the Applications page

## 📸 Screenshots

### Landing Page
Modern hero section with feature cards explaining the automation workflow.

### Application Form
Clean form to enter internship role and cover letter with character counter.

### Live Progress Tracking
Real-time progress bar, elapsed time, activity feed, and stop button.

### Completion Screen
Celebration with confetti animation, stats cards, and action buttons.

### Application History
Table view of all submitted applications with status badges.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 👤 Author

**xsea29**
- GitHub: [@xsea29](https://github.com/xsea29)

## 🙏 Acknowledgments

- Built with [Create React App](https://create-react-app.dev/)
- Icons from [Lucide React](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Deployed on [Vercel](https://vercel.com)

---

**Note**: This is the frontend repository. The backend (Flask + Puppeteer) runs separately and must be deployed independently.

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
# Internshala-Automation-Tool
