# Query Builder Documentation

The query builder provides a flexible way to filter, search, sort, and paginate database queries across the application.

## Features

- **Filtering**: Filter by specific fields, ranges, and nested relations
- **Searching**: Full-text search across multiple fields
- **Sorting**: Sort by multiple fields with ascending/descending order
- **Pagination**: Page-based or offset-based pagination
- **Relations**: Include related data in queries

## Query Parameters

### Filtering

- `status`: Filter by booking status (comma-separated for multiple values)
  - Example: `?status=CONFIRMED,COMPLETED`
- `tutorId`: Filter by tutor ID
- `studentId`: Filter by student ID
- `amountMin` & `amountMax`: Filter by amount range
  - Example: `?amountMin=100&amountMax=500`
- `createdFrom` & `createdTo`: Filter by creation date range
  - Example: `?createdFrom=2024-01-01&createdTo=2024-12-31`
- `tutorName`: Filter by tutor name (case-insensitive)
- `studentName`: Filter by student name (case-insensitive)
- `tutorEmail`: Filter by tutor email (case-insensitive)
- `studentEmail`: Filter by student email (case-insensitive)

### Searching

- `search`: Search across relevant text fields
  - For admin bookings: searches tutor name, student name, tutor email, student email
  - For student bookings: searches tutor name, tutor email
  - For tutor bookings: searches student name, student email
- Example: `?search=john`

### Sorting

- `sort`: Fields to sort by (comma-separated)
- `sortDirection`: Sort direction for each field (comma-separated, defaults to 'asc')
- Example: `?sort=createdAt,amount&sortDirection=desc,asc`

### Pagination

- `page`: Page number (1-based)
- `limit`: Number of items per page
- `offset`: Number of items to skip (alternative to page)
- Example: `?page=2&limit=10`

## API Endpoints

### Admin Bookings
```
GET /bookings/admin
```
Supports all query parameters for comprehensive booking management.

### Student Bookings
```
GET /bookings/student
```
Supports filtering, searching, sorting, and pagination within student's own bookings.

### Tutor Bookings
```
GET /bookings/tutor
```
Supports filtering, searching, sorting, and pagination within tutor's own bookings.

## Response Format

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 150,
    "page": 2,
    "limit": 10,
    "totalPages": 15
  }
}
```

## Examples

### Get confirmed bookings with pagination
```
GET /bookings/admin?status=CONFIRMED&page=1&limit=20
```

### Search for bookings by tutor name and sort by creation date
```
GET /bookings/admin?search=john&sort=createdAt&sortDirection=desc
```

### Get bookings within date range and amount range
```
GET /bookings/admin?createdFrom=2024-01-01&createdTo=2024-12-31&amountMin=50&amountMax=200
```

### Get student bookings with pagination and search
```
GET /bookings/student?search=math&page=1&limit=5
```

## Using the Query Builder in Code

```typescript
import { QueryBuilder, parseQueryParams } from '../../lib/query-builder';

// In your service method
const queryOptions = parseQueryParams(req.query);
const queryBuilder = new QueryBuilder(prisma.booking);

queryBuilder
  .where(queryOptions.filters || {})
  .search(queryOptions.search, ['field1', 'field2'])
  .orderBy(queryOptions.sort || [])
  .paginate(queryOptions.pagination || {})
  .include({ relation: true });

const result = await queryBuilder.executeWithCount();
```