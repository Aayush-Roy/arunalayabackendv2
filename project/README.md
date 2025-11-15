# Physiotherapy Doorstep Service - Backend API

A complete production-grade backend system for a physiotherapy doorstep service mobile application, similar to "Yes Madam". Built with Node.js, Express, and MongoDB.

## Features

### User Management
- User registration and authentication with JWT
- User profile management with complete details (name, phone, email, address, profile image)
- Secure password hashing with bcrypt
- User location tracking with coordinates

### Services Module
- Create, read, update, and delete physiotherapy services
- Service categorization (Pain Management, Sports Injury, Post Surgery, etc.)
- Service pricing and duration management
- Average rating and review count for each service
- Service status management (active/inactive)

### Booking System
- Smart booking with distance calculation using Haversine formula
- Service availability validation (max 7 km from service center)
- Automatic cost calculation:
  - Travel time: 3.5 minutes per km
  - Travel cost: 5 INR per km
  - Final bill: service price + travel cost
- Booking status management (pending, confirmed, on-the-way, completed, cancelled)
- Payment status tracking (pending, paid)
- User booking history

### Agent/Professional Dashboard
- Agent registration and authentication
- View all assigned bookings
- Update booking status
- Update payment status
- Agent profile with ratings and total bookings

### Feedback System
- User can submit feedback after service completion
- Rating (1-5) and review message
- Automatic calculation of average service ratings
- Automatic calculation of agent ratings
- Feedback history for users and services

### Billing System
- Complete invoice generation
- Detailed breakdown of charges
- Service details, travel details, and customer information
- Export-ready JSON format

## Project Structure

```
/src
  /config
    db.js                      # MongoDB connection
  /models
    User.js                    # User schema
    Service.js                 # Service schema
    Booking.js                 # Booking schema
    Feedback.js                # Feedback schema
    Agent.js                   # Agent schema
  /controllers
    authController.js          # Authentication logic
    userController.js          # User profile management
    serviceController.js       # Service CRUD operations
    bookingController.js       # Booking management
    agentController.js         # Agent dashboard operations
    feedbackController.js      # Feedback operations
    billingController.js       # Invoice generation
  /routes
    authRoutes.js              # Auth endpoints
    userRoutes.js              # User endpoints
    serviceRoutes.js           # Service endpoints
    bookingRoutes.js           # Booking endpoints
    agentRoutes.js             # Agent endpoints
    feedbackRoutes.js          # Feedback endpoints
    billingRoutes.js           # Billing endpoints
  /middlewares
    authMiddleware.js          # JWT authentication
    errorMiddleware.js         # Error handling
  /utils
    distance.js                # Haversine distance calculation
    calculateCost.js           # Travel cost calculations
server.js                      # App entry point
```

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/physioApp
JWT_SECRET=mysecret123
NODE_ENV=development
```

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd physio-doorstep-backend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start MongoDB (if running locally)
```bash
mongod
```

5. Run the application
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### User Signup
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "Aayush Kumar",
  "email": "aayush@gmail.com",
  "password": "123456",
  "phone": "9876543210",
  "address": "123 Main Street, Delhi"
}
```

#### User Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "aayush@gmail.com",
  "password": "123456"
}
```

#### Agent Signup
```http
POST /api/auth/agent/signup
Content-Type: application/json

{
  "name": "Dr. Rajesh Sharma",
  "email": "rajesh@physio.com",
  "password": "agent123",
  "phone": "9988776655",
  "specialization": "Sports Physiotherapy"
}
```

#### Agent Login
```http
POST /api/auth/agent/login
Content-Type: application/json

{
  "email": "rajesh@physio.com",
  "password": "agent123"
}
```

### User Endpoints

#### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

#### Update User Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Aayush Kumar Updated",
  "phone": "9876543211",
  "address": "456 New Street, Delhi",
  "coordinates": {
    "latitude": 28.7041,
    "longitude": 77.1025
  }
}
```

### Service Endpoints

#### Create Service
```http
POST /api/services
Content-Type: application/json

{
  "title": "Full Body Massage Therapy",
  "description": "Complete body massage therapy for pain relief",
  "price": 800,
  "durationMins": 60,
  "category": "Pain Management",
  "imageUrl": "https://example.com/image.jpg"
}
```

#### Get All Services
```http
GET /api/services
```

#### Get Service By ID
```http
GET /api/services/:id
```

### Booking Endpoints

#### Create Booking
```http
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "serviceId": "service_id_here",
  "selectedDate": "2025-11-20",
  "selectedTime": "10:00 AM",
  "userAddress": "123 Main Street, Delhi",
  "coordinates": {
    "latitude": 28.6315,
    "longitude": 77.2167
  }
}
```

#### Get My Bookings
```http
GET /api/bookings/my
Authorization: Bearer <token>
```

### Agent Endpoints

#### Get Agent Bookings
```http
GET /api/agents/bookings
Authorization: Bearer <agent_token>
```

#### Update Booking Status
```http
PUT /api/agents/bookings/:id/status
Authorization: Bearer <agent_token>
Content-Type: application/json

{
  "bookingStatus": "confirmed"
}
```

Valid booking statuses: `pending`, `confirmed`, `on-the-way`, `completed`, `cancelled`

#### Update Payment Status
```http
PUT /api/agents/bookings/:id/payment
Authorization: Bearer <agent_token>
Content-Type: application/json

{
  "paymentStatus": "paid"
}
```

### Feedback Endpoints

#### Submit Feedback
```http
POST /api/feedback
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookingId": "booking_id_here",
  "rating": 5,
  "reviewMessage": "Excellent service!"
}
```

#### Get Service Feedback
```http
GET /api/feedback/service/:serviceId
```

### Billing Endpoints

#### Get Invoice
```http
GET /api/billing/:bookingId
```

Returns complete invoice with:
- Customer details
- Service details
- Agent details
- Travel details (distance, time, cost)
- Billing breakdown
- Payment and booking status

## Booking Logic Explanation

### Distance Calculation
The system uses the **Haversine formula** to calculate the great-circle distance between two points on Earth given their latitude and longitude.

```javascript
// Formula implementation
const R = 6371; // Earth's radius in kilometers
const dLat = toRad(lat2 - lat1);
const dLon = toRad(lon2 - lon1);

const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);

const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
const distance = R * c; // Distance in kilometers
```

### Service Availability Check
- Maximum service radius: **7 km**
- If distance > 7 km, booking is rejected with message: "Service not available in your area"

### Cost Calculation

#### Travel Time
```javascript
travelTime = distance * 3.5 minutes per km
```

Example:
- Distance: 5 km
- Travel Time: 5 × 3.5 = 17.5 minutes (rounded to 18 minutes)

#### Travel Cost
```javascript
travelCost = distance * 5 INR per km
```

Example:
- Distance: 5 km
- Travel Cost: 5 × 5 = 25 INR

#### Final Bill
```javascript
finalBillAmount = servicePrice + travelCost
```

Example:
- Service Price: 800 INR
- Travel Cost: 25 INR
- Final Bill: 825 INR

### Booking Flow

1. User submits booking with service, date, time, address, and coordinates
2. System validates service exists
3. System calculates distance from service center to user location
4. If distance > 7 km, reject booking
5. Calculate travel time and travel cost
6. Calculate final bill amount
7. Create booking with status "pending" and payment status "pending"
8. Return booking details to user

## Error Handling

All endpoints use try-catch blocks and return consistent JSON responses:

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message here"
}
```

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Protected routes with middleware
- Request validation
- Secure password handling (never returned in responses)
- Environment variables for sensitive data

## HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **dotenv**: Environment variable management
- **cors**: Cross-origin resource sharing
- **express-validator**: Request validation

## Development Dependencies

- **nodemon**: Auto-restart during development

## Testing

Use the provided `api.http` file with the REST Client extension in VS Code, or import the endpoints into Postman.

## Notes

- Service center location is currently hardcoded to Delhi coordinates (28.7041, 77.1025)
- Modify `SERVICE_CENTER_LOCATION` in `bookingController.js` to change the base location
- All monetary values are in INR
- Distance calculations are in kilometers
- Time calculations are in minutes

## Support

For issues or questions, please contact the development team.

## License

ISC
