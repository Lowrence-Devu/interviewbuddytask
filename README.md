# Organization & Users Management System

A full-stack web application for managing organizations and their users, built as part of the InterviewBuddy Campus Recruitment task.

## 🚀 Features

- **Dashboard**: Overview of organizations and users with statistics
- **Organization Management**: Create, read, update, and delete organizations
- **User Management**: Create, read, update, and delete users within organizations
- **Responsive Design**: Mobile-first design using Tailwind CSS
- **Real-time Updates**: Instant UI updates with proper error handling
- **Data Validation**: Client and server-side validation
- **Modern UI**: Clean, professional interface with loading states and notifications

## 🛠️ Tech Stack

### Frontend
- **React 18** with functional components and hooks
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **React Hot Toast** for notifications
- **Lucide React** for icons
- **Vite** for build tooling

### Backend
- **Node.js** with Express.js
- **MySQL** database
- **Sequelize ORM** for database operations
- **Express Validator** for input validation
- **CORS** for cross-origin requests
- **Helmet** for security headers
- **Morgan** for request logging

## 📊 Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐
│   Organization  │       │      User       │
├─────────────────┤       ├─────────────────┤
│ org_id (PK)     │◄──────┤ org_id (FK)     │
│ name            │       │ user_id (PK)    │
│ address         │       │ name            │
│ created_at      │       │ email           │
└─────────────────┘       │ role            │
                          │ created_at      │
                          └─────────────────┘
```

### Tables

**Organizations**
- `org_id` (Primary Key, Auto Increment)
- `name` (VARCHAR, Not Null)
- `address` (TEXT, Not Null)
- `created_at` (DATETIME, Default: NOW)

**Users**
- `user_id` (Primary Key, Auto Increment)
- `name` (VARCHAR, Not Null)
- `email` (VARCHAR, Unique, Not Null)
- `role` (ENUM: 'Admin', 'Member', Default: 'Member')
- `org_id` (Foreign Key → Organizations.org_id)
- `created_at` (DATETIME, Default: NOW)

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd interviewbuddytask
   ```

2. **Set up the backend**
   ```bash
   cd server
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your database credentials:
   ```
   NODE_ENV=development
   PORT=5000
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=organization_users_db
   JWT_SECRET=your_jwt_secret_key_here
   CLIENT_URL=http://localhost:3000
   ```

4. **Initialize the database**
   ```bash
   npm run init-db
   ```

5. **Start the backend server**
   ```bash
   npm run dev
   ```

6. **Set up the frontend** (in a new terminal)
   ```bash
   cd client
   npm install
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
interviewbuddytask/
├── server/                 # Backend API
│   ├── config/
│   │   └── db.js          # Database configuration
│   ├── controllers/
│   │   ├── organizationController.js
│   │   └── userController.js
│   ├── models/
│   │   ├── organizationModel.js
│   │   ├── userModel.js
│   │   └── index.js       # Model associations
│   ├── routes/
│   │   ├── organizationRoutes.js
│   │   └── userRoutes.js
│   ├── scripts/
│   │   └── initDb.js      # Database initialization
│   ├── index.js           # Server entry point
│   └── package.json
├── client/                # Frontend React app
│   ├── src/
│   │   ├── api/           # API service functions
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── index.html
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

### Organizations
- `GET /api/organizations` - Get all organizations
- `GET /api/organizations/:id` - Get organization by ID
- `POST /api/organizations` - Create new organization
- `PUT /api/organizations/:id` - Update organization
- `DELETE /api/organizations/:id` - Delete organization

### Users
- `GET /api/users` - Get all users
- `GET /api/users/organization/:orgId` - Get users by organization
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Health Check
- `GET /api/health` - Server health status

## 🎨 UI Components

- **Layout**: Responsive sidebar navigation with mobile support
- **Dashboard**: Statistics cards and recent organizations table
- **Organizations**: Data table with CRUD operations
- **Users**: Data table with role badges and organization info
- **Modals**: Create/Edit forms for organizations and users
- **Loading States**: Skeleton loaders and spinners
- **Notifications**: Toast messages for success/error feedback

## 🧪 Testing

### API Testing with Postman

1. Import the API collection (if available)
2. Set the base URL to `http://localhost:5000`
3. Test all CRUD operations for both organizations and users

### Manual Testing

1. **Dashboard**: Verify statistics and recent organizations display
2. **Organizations**: Test create, edit, delete operations
3. **Users**: Test create, edit, delete operations with organization selection
4. **Responsive**: Test on different screen sizes
5. **Error Handling**: Test with invalid data and network errors

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Build and start the server:
   ```bash
   npm start
   ```

### Frontend Deployment
1. Build the React app:
   ```bash
   npm run build
   ```
2. Serve the `dist` folder with a web server

## 📝 Features Implemented

✅ **Complete CRUD Operations**
- Organizations: Create, Read, Update, Delete
- Users: Create, Read, Update, Delete

✅ **Database Design**
- Proper foreign key relationships
- Data validation and constraints
- Sample data initialization

✅ **Frontend Features**
- Responsive design with Tailwind CSS
- Modern React with hooks
- Form validation and error handling
- Loading states and notifications
- Mobile-friendly navigation

✅ **Backend Features**
- RESTful API design
- Input validation with express-validator
- Error handling middleware
- CORS configuration
- Security headers with Helmet

✅ **Additional Features**
- Dashboard with statistics
- Real-time UI updates
- Professional UI/UX design
- Comprehensive error handling
- Database initialization script

## 🎯 Future Enhancements

- User authentication and authorization
- Advanced search and filtering
- Data export functionality
- Bulk operations
- Audit logging
- Email notifications
- Advanced role-based permissions

## 👨‍💻 Author

**InterviewBuddy Task Submission**
- Role: Software Development Engineer (Full Stack)
- Submission Date: October 2024

## 📄 License

This project is created for educational purposes as part of the InterviewBuddy Campus Recruitment task.

---

**Note**: This application is built according to the specifications provided in the InterviewBuddy Full Stack SDE task requirements.
