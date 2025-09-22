# Full-Stack Web Application with Nuxt.js Frontend and Node.js Backend

This is a full-stack web application built with Nuxt.js for the frontend and Node.js/Express for the backend, featuring a SQLite database for data persistence.

## 🏗️ Project Structure

```
node_nuxt/
├── backend/                 # Node.js backend server
│   ├── src/
│   │   ├── config/         # Database and configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Data models
│   │   ├── routes/         # API route definitions
│   │   └── server.js       # Main server file
│   ├── data/               # SQLite database files
│   └── package.json        # Backend dependencies
├── node-nuxt/              # Nuxt.js frontend
│   ├── app/
│   │   └── app.vue         # Main application component
│   ├── nuxt.config.ts      # Nuxt configuration
│   └── package.json        # Frontend dependencies
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Yarn package manager

### 1. Install Backend Dependencies
```bash
cd backend
yarn install
```

### 2. Install Frontend Dependencies
```bash
cd node-nuxt
yarn install
```

### 3. Start the Backend Server
```bash
cd backend
yarn dev
```
The backend will start on `http://localhost:3002`

### 4. Start the Frontend
```bash
cd node-nuxt
yarn dev
```
The frontend will start on `http://localhost:3003`

## 🗄️ Database

The application uses SQLite as the database, which is perfect for development and small to medium applications.

### Database Schema
- **messages** table:
  - `id` (INTEGER, PRIMARY KEY, AUTOINCREMENT)
  - `content` (TEXT, NOT NULL)
  - `created_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP)

### Database Location
The SQLite database file is automatically created at `backend/data/app.db`

## 🔌 API Endpoints

### Base URL: `http://localhost:3002/api`

#### Messages
- **POST** `/messages` - Create a new message
  - Body: `{"content": "Your message text"}`
  - Response: `{"success": true, "message": "Message created successfully", "data": {...}}`

- **GET** `/messages` - Get all messages
  - Response: `{"success": true, "count": 1, "data": [...]}`

- **GET** `/messages/:id` - Get a specific message by ID
  - Response: `{"success": true, "data": {...}}`

- **DELETE** `/messages/:id` - Delete a message by ID
  - Response: `{"success": true, "message": "Message deleted successfully"}`

#### Health Check
- **GET** `/health` - Server health status
  - Response: `{"status": "OK", "message": "Backend is running"}`

## 🎯 MVP Features

✅ **Complete CRUD Operations**: Create, Read, Update, Delete messages  
✅ **Database Integration**: SQLite database with automatic table creation  
✅ **RESTful API**: Clean, RESTful API design  
✅ **Frontend Interface**: Modern, responsive UI built with Nuxt.js  
✅ **Real-time Updates**: Frontend automatically refreshes after operations  
✅ **Error Handling**: Comprehensive error handling on both frontend and backend  
✅ **CORS Support**: Cross-origin requests enabled for development  

## 🛠️ Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **SQLite3** - Database
- **CORS** - Cross-origin resource sharing
- **Body-parser** - Request body parsing

### Frontend
- **Nuxt.js 4** - Vue.js framework
- **Vue 3** - Progressive JavaScript framework
- **Tailwind CSS** - Utility-first CSS framework
- **Composition API** - Vue 3 composition functions

## 🔧 Configuration

### Backend Configuration
- Port: 3002 (configurable via environment variable `PORT`)
- Database: SQLite with automatic initialization
- CORS: Enabled for development

### Frontend Configuration
- Port: 3003 (configurable in `nuxt.config.ts`)
- API Base URL: `http://localhost:3002` (configurable in runtime config)
- API Proxy: Configured for development

## 📱 Frontend Features

The frontend provides a clean, modern interface with:
- **Message Form**: Add new messages with validation
- **Message List**: Display all messages with timestamps
- **Delete Functionality**: Remove messages with confirmation
- **Real-time Updates**: Automatic refresh after operations
- **Responsive Design**: Works on all device sizes
- **Loading States**: Visual feedback during operations

## 🚀 Development

### Adding New Features
1. **Backend**: Add new models, controllers, and routes in the `backend/src` directory
2. **Frontend**: Update the Vue components in `node-nuxt/app`
3. **Database**: Modify the database schema in `backend/src/config/database.js`

### File Structure Best Practices
- Keep controllers thin - business logic goes in models
- Use async/await for database operations
- Implement proper error handling
- Follow RESTful API conventions

## 🔍 Testing the API

You can test the API endpoints using curl or any API testing tool:

```bash
# Create a message
curl -X POST http://localhost:3002/api/messages \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello World!"}'

# Get all messages
curl http://localhost:3002/api/messages

# Get a specific message
curl http://localhost:3002/api/messages/1

# Delete a message
curl -X DELETE http://localhost:3002/api/messages/1
```

## 🌟 Next Steps

This MVP provides a solid foundation for building more complex applications. Consider adding:

- **User Authentication**: JWT tokens, user registration/login
- **Data Validation**: Input sanitization and validation
- **File Uploads**: Image/file handling capabilities
- **Real-time Features**: WebSocket integration for live updates
- **Testing**: Unit and integration tests
- **Deployment**: Docker configuration and production setup

## 📝 License

This project is open source and available under the [ISC License](LICENSE).

## 🤝 Contributing

Feel free to contribute to this project by:
- Reporting bugs
- Suggesting new features
- Submitting pull requests
- Improving documentation

---

**Happy Coding! 🚀**
