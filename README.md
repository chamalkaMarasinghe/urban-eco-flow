# UrbanEcoFlow API

A comprehensive smart waste management platform API built with Node.js, Express, and MongoDB. This system enables residents and businesses to manage waste collection requests, purchase and manage sensors for waste bins, and provides tools for collection teams and operations planners.

## Features

### Core Functionality
- **User Management**: Resident and business account management with role-based access control
- **Sensor Management**: Purchase, installation, and monitoring of waste bin sensors
- **Collection Requests**: Create, schedule, and manage waste collection requests
- **Bin Management**: Register and manage waste bins with sensor integration
- **Real-time Monitoring**: Track fill levels, weights, and collection events

### User Roles
- **Resident**: Create collection requests, manage personal bins and sensors
- **Business**: Enterprise waste management with bulk operations
- **Collection Team**: Execute collection routes and update bin status
- **Operations Planner**: Optimize routes and manage scheduling
- **Maintenance Crew**: Handle sensor and bin maintenance
- **Admin**: Full system administration

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with role-based authorization
- **Validation**: Express-validator for input validation
- **Documentation**: Swagger/OpenAPI 3.0
- **Testing**: Jest with Supertest
- **Logging**: Winston for structured logging
- **Geospatial**: MongoDB geospatial queries for location-based services

## Project Structure

```
api/
├── src/
│   ├── config/           # Configuration files
│   ├── constants/        # Application constants
│   ├── controllers/      # Request handlers
│   ├── docs/            # API documentation
│   ├── middlewares/     # Express middlewares
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── services/        # Business logic layer
│   ├── tests/           # Unit and integration tests
│   ├── utils/           # Utility functions
│   └── validators/      # Input validation schemas
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd urban-eco-flow/api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the api directory:
   ```env
   ENVIRONMENT=DEV
   API_VERSION=1
   PORT=3000
   DB_URI=mongodb://localhost:27017/urbanecoflow
   JWT_SECRET=your_jwt_secret_key
   CLIENT=http://localhost:3001
   ADMIN=http://localhost:3002
   SERVICE_PROVIDER=http://localhost:3003
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## API Documentation

The API documentation is available via Swagger UI when running in development mode:
- **URL**: `http://localhost:3000/api-docs`
- **OpenAPI Spec**: Available at `/api/v1/docs.json`

### Key Endpoints

#### Authentication
- `POST /api/v1/auth/signup/user` - Register as resident
- `POST /api/v1/auth/signup/servicepro` - Register as service provider
- `POST /api/v1/auth/signin` - User login
- `POST /api/v1/auth/forgot-password` - Password reset

#### Sensors
- `GET /api/v1/sensors` - Get all sensors (Admin/Staff)
- `POST /api/v1/sensors` - Register new sensor
- `GET /api/v1/sensors/my-sensors` - Get user's sensors
- `PUT /api/v1/sensors/:id` - Update sensor
- `POST /api/v1/sensors/:id/install` - Install sensor to bin
- `POST /api/v1/sensors/:id/report-faulty` - Report sensor issues

#### Collection Requests
- `GET /api/v1/collection-requests` - Get all requests (Admin/Staff)
- `POST /api/v1/collection-requests` - Create collection request
- `GET /api/v1/collection-requests/my-requests` - Get user's requests
- `POST /api/v1/collection-requests/:id/schedule` - Schedule collection
- `POST /api/v1/collection-requests/:id/complete` - Complete collection

#### Bins
- `GET /api/v1/bins` - Get all bins (Admin/Staff)
- `POST /api/v1/bins` - Register new bin
- `GET /api/v1/bins/my-bins` - Get user's bins
- `PUT /api/v1/bins/:id/fill-level` - Update fill level
- `POST /api/v1/bins/:id/attach-sensor` - Attach sensor to bin

## Testing

Run the test suite:
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure
- **Unit Tests**: Test individual functions and methods
- **Integration Tests**: Test API endpoints and database interactions
- **Mock Data**: Comprehensive test data for all scenarios

## Database Models

### User Model
- Personal information and contact details
- Role-based access control
- Address and location data
- Business details for enterprise users
- Notification preferences

### Sensor Model
- Hardware specifications and status
- Location and installation data
- Battery level and maintenance schedules
- Owner and bin associations

### Bin Model
- Physical characteristics and capacity
- Location and installation data
- Fill level and weight tracking
- Collection history and sensor integration

### CollectionRequest Model
- Request details and priority levels
- Scheduling and assignment data
- Waste category and special instructions
- Payment and completion tracking

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Authorization**: Granular permission system
- **Input Validation**: Comprehensive request validation
- **Data Sanitization**: Protection against injection attacks
- **Rate Limiting**: API abuse prevention
- **CORS Configuration**: Cross-origin request security

## Logging

The application uses Winston for structured logging:
- **Request Logging**: HTTP request/response tracking
- **Business Events**: Important system events
- **Error Logging**: Detailed error information
- **Performance Metrics**: Operation timing and monitoring
- **Security Events**: Authentication and authorization events

## Error Handling

Comprehensive error handling with:
- **Custom Error Classes**: Specific error types for different scenarios
- **Global Error Handler**: Centralized error processing
- **Validation Errors**: Detailed input validation feedback
- **Database Errors**: MongoDB-specific error handling
- **HTTP Status Codes**: Appropriate response codes

## Code Quality

The codebase follows best practices:
- **SOLID Principles**: Single responsibility and dependency inversion
- **Clean Architecture**: Separation of concerns
- **Service Layer**: Business logic abstraction
- **Comprehensive Comments**: Detailed code documentation
- **ESLint Configuration**: Code style enforcement

## Performance Considerations

- **Database Indexing**: Optimized queries with proper indexes
- **Pagination**: Efficient data retrieval for large datasets
- **Geospatial Queries**: Optimized location-based searches
- **Connection Pooling**: Efficient database connections
- **Caching Strategy**: Redis integration for session management

## Deployment

### Production Environment
1. Set `ENVIRONMENT=PROD` in environment variables
2. Configure production database connection
3. Set up SSL certificates
4. Configure reverse proxy (nginx)
5. Set up monitoring and logging

### Docker Support
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the test cases for usage examples

## Future Enhancements

- **Real-time Notifications**: WebSocket integration
- **Mobile App Support**: React Native integration
- **Analytics Dashboard**: Data visualization
- **Route Optimization**: AI-powered collection routes
- **IoT Integration**: Direct sensor communication
- **Payment Integration**: Stripe/PayPal support
- **Multi-language Support**: Internationalization
- **Advanced Reporting**: Business intelligence features