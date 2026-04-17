# Explore Dehradun Admin Panel - Next.js

A comprehensive Next.js-based admin panel for managing the Explore Dehradun website content, SEO, subscriptions, comments, and analytics.

## Features

- **Content Management**: CRUD operations for pages, posts, tours, and categories
- **SEO Management**: Manage meta tags, titles, descriptions, and keywords
- **Email Subscriptions**: Track and manage email subscribers with export functionality
- **Comments Management**: Moderate and manage user comments with approval workflow
- **Analytics Dashboard**: Track views, visitors, and page performance metrics
- **JWT Authentication**: Secure admin access with token-based authentication
- **Modern UI**: Beautiful and responsive admin interface built with Tailwind CSS
- **MongoDB Integration**: Connected to explore_dehradun database with Mongoose

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, Lucide Icons
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with HTTP-only cookies
- **Deployment**: Ready for Vercel, Netlify, or any Node.js hosting

## Prerequisites

- Node.js 18+ 
- MongoDB database
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd exp-new-doon-admin-nextjs
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/explore_dehradun?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
NEXTAUTH_SECRET=your-nextauth-secret-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
```

## Setup and Initialization

1. Initialize the database with default admin user:
```bash
npm run init
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to: `http://localhost:3000/login`

4. Login with default credentials:
   - Email: `admin@example.com`
   - Password: `admin123`

## Project Structure

```
src/
|-- app/                    # Next.js App Router
|   |-- admin/             # Admin panel routes
|   |-- api/               # API routes
|   |-- login/             # Login page
|   |-- layout.tsx         # Root layout
|   |-- middleware.ts      # Authentication middleware
|-- lib/                   # Utility libraries
|   |-- auth.ts           # Authentication utilities
|   |-- mongodb.ts        # Database connection
|   |-- models/           # Mongoose models
|-- components/           # Reusable components
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run init` - Initialize database with admin user

## Database Collections

The admin panel manages the following MongoDB collections:

- **admins**: Admin user accounts with authentication
- **content**: Pages, posts, tours, and categories
- **seo**: SEO metadata for pages
- **subscriptions**: Email subscribers
- **comments**: User comments with moderation status
- **analytics**: Page views and analytics data

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/verify` - Verify authentication

### Content Management
- `GET /api/content` - List content with pagination and filters
- `POST /api/content` - Create new content
- `GET /api/content/[id]` - Get single content item
- `PUT /api/content/[id]` - Update content
- `DELETE /api/content/[id]` - Delete content

### SEO Management
- `GET /api/seo` - List SEO configurations
- `POST /api/seo` - Create SEO config
- `GET /api/seo/[id]` - Get SEO config
- `PUT /api/seo/[id]` - Update SEO config
- `DELETE /api/seo/[id]` - Delete SEO config

### Subscriptions
- `GET /api/subscriptions` - List subscribers
- `POST /api/subscriptions` - Add subscriber
- `PUT /api/subscriptions/[id]` - Update subscriber
- `DELETE /api/subscriptions/[id]` - Delete subscriber

### Comments
- `GET /api/comments` - List comments
- `POST /api/comments` - Create comment
- `PUT /api/comments/[id]` - Update comment status
- `DELETE /api/comments/[id]` - Delete comment

### Analytics
- `GET /api/analytics` - Get analytics data
- `POST /api/analytics` - Record analytics event

## Admin Panel Features

### Dashboard
- Overview statistics
- Recent activity feed
- Quick action buttons
- Performance metrics

### Content Management
- Create, edit, delete content
- Support for pages, posts, tours, categories
- Rich text editing capabilities
- Status management (draft, published, archived)
- Tag and category management

### SEO Management
- Meta title and description editing
- Keyword management
- Open Graph configuration
- Canonical URL management

### Subscription Management
- View all subscribers
- Export to CSV
- Toggle active/inactive status
- Search and filter capabilities

### Comments Moderation
- Approve/reject comments
- View comment details
- Delete inappropriate comments
- Filter by status and page

### Analytics Dashboard
- Page view statistics
- Visitor tracking
- Performance trends
- Top pages by engagement

## Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on git push

### Other Platforms
1. Build the application: `npm run build`
2. Start the production server: `npm run start`
3. Deploy to any Node.js hosting platform

## Security Considerations

- Change default admin credentials in production
- Use strong JWT secrets
- Enable HTTPS in production
- Regularly update dependencies
- Implement rate limiting for API endpoints
- Use environment variables for sensitive data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
