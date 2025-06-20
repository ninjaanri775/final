module.exports = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
    },
    servers: [
      { url: 'http://localhost:3000' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Blog: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'Blog ID' },
            title: { type: 'string', description: 'Blog title' },
            content: { type: 'string', description: 'Blog content' },
            image: { type: 'string', description: 'URL to blog image' },
            author: { type: 'string', description: 'Author ID' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          }
        },
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'User ID' },
            name: { type: 'string', description: 'Full name of the user' },
            email: { type: 'string', description: 'Email address' },
            profilePhoto: { type: 'string', description: 'URL of profile photo' },
            blogs: {
              type: 'array',
              items: { type: 'string', description: 'Blog IDs' },
              description: 'Array of blog IDs created by user'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
  },
  apis: ['./blogs/*.js', './users/*.js', './auth/*.js'],
};
