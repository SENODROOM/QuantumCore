# QuantumDocsSyncer Backend

**Node.js/Express backend for automated documentation generation and synchronization**

## 🎯 Overview

The QuantumDocsSyncer backend is a RESTful API service that automatically generates and maintains technical documentation for C++ codebases. It integrates with HuggingFace's AI models to analyze source code and produce comprehensive README files with explanations of architecture, design decisions, and implementation details.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │  HuggingFace    │
│   (React)       │◄──►│   (Express)     │◄──►│     API         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │  File System    │
                       │ (Quantum Lang)  │
                       └─────────────────┘
```

### Core Components

- **Express Server**: RESTful API with authentication and rate limiting
- **File Scanner**: Monitors codebase for changes and new files
- **AI Integration**: HuggingFace API client for code analysis
- **Documentation Engine**: Generates and updates README files
- **Git Integration**: Tracks documentation changes in version control

## 🚀 Features

### 📝 Documentation Generation
- **Automatic Analysis**: Scans C++ source files and generates comprehensive documentation
- **Smart Updates**: Detects code changes and updates existing documentation incrementally
- **Multi-format Support**: Handles header files, source files, and documentation files
- **Context Awareness**: Maintains existing documentation structure and style

### 🤖 AI-Powered Analysis
- **Code Understanding**: Uses Qwen/Qwen2.5-Coder-7B-Instruct model for C++ code analysis
- **Design Decision Documentation**: Explains WHY architectural choices were made
- **Tradeoff Analysis**: Documents limitations and design tradeoffs honestly
- **Technical Accuracy**: Generates technically precise documentation with proper terminology

### 🔧 Development Features
- **Hot Reloading**: Automatically regenerates docs when source files change
- **Batch Processing**: Handles multiple files efficiently
- **Error Handling**: Comprehensive error reporting and recovery
- **Logging**: Detailed logging for debugging and monitoring

## 📋 API Endpoints

### Documentation Management
```http
POST   /api/docs/generate          Generate documentation for a file
GET    /api/docs/:filePath        Get existing documentation
PUT    /api/docs/:filePath        Update documentation
DELETE /api/docs/:filePath        Delete documentation
```

### File System Operations
```http
GET    /api/files                 List all source files
GET    /api/files/scan            Scan for new/changed files
POST   /api/files/watch           Start file watching service
```

### Project Management
```http
GET    /api/projects              List all projects
POST   /api/projects              Create new project
GET    /api/projects/:id          Get project details
PUT    /api/projects/:id          Update project configuration
```

### System Status
```http
GET    /api/health                 System health check
GET    /api/stats                  Usage statistics
GET    /api/logs                   Recent log entries
```

## 🛠️ Technology Stack

### Backend Framework
- **Node.js** (v18+) - JavaScript runtime
- **Express.js** (v4.18+) - Web framework
- **TypeScript** - Type-safe JavaScript development

### Core Dependencies
- **axios** - HTTP client for external API calls
- **chokidar** - File system watcher
- **winston** - Logging framework
- **joi** - Data validation
- **jsonwebtoken** - Authentication tokens
- **bcrypt** - Password hashing

### AI & Processing
- **HuggingFace API** - Code analysis and documentation generation
- **node-cron** - Scheduled task processing
- **worker_threads** - Parallel processing capabilities

### Data & Storage
- **sqlite3** - Lightweight database for metadata
- **fs-extra** - Enhanced file system operations
- **archiver** - File compression utilities

## 📦 Installation

### Prerequisites
- Node.js 18.0 or higher
- npm 8.0 or higher
- Git (for version control integration)

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/SENODROOM/QuantumDocsSyncer.git
cd QuantumDocsSyncer/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment configuration**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Database initialization**
```bash
npm run db:init
npm run db:migrate
```

5. **Start the development server**
```bash
npm run dev
```

## ⚙️ Configuration

### Environment Variables

```bash
# Server Configuration
PORT=3001
NODE_ENV=development

# HuggingFace API
HF_TOKEN=your_huggingface_api_token
HF_MODEL=Qwen/Qwen2.5-Coder-7B-Instruct

# Database
DB_PATH=./data/database.sqlite

# Security
JWT_SECRET=your_jwt_secret_key
API_RATE_LIMIT=100

# File System
WATCH_PATH=/path/to/quantum/language/source
OUTPUT_PATH=/path/to/documentation/output

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/app.log
```

### Application Config

```javascript
// config/default.js
module.exports = {
  server: {
    port: process.env.PORT || 3001,
    host: 'localhost'
  },
  
  ai: {
    model: process.env.HF_MODEL || 'Qwen/Qwen2.5-Coder-7B-Instruct',
    maxTokens: 1200,
    temperature: 0.3
  },
  
  documentation: {
    maxFileSize: '1MB',
    supportedExtensions: ['.cpp', '.h', '.hpp', '.c'],
    outputFormat: 'markdown'
  }
};
```

## 🔌 API Usage

### Generate Documentation

```javascript
const axios = require('axios');

// Generate documentation for a file
const response = await axios.post('http://localhost:3001/api/docs/generate', {
  filePath: 'src/lexer/Lexer.cpp',
  options: {
    updateExisting: true,
    includeExamples: true,
    detailLevel: 'comprehensive'
  }
});

const documentation = response.data;
console.log(documentation.content);
```

### Watch for Changes

```javascript
// Start file watching
const response = await axios.post('http://localhost:3001/api/files/watch', {
  paths: ['src/', 'include/'],
  options: {
    ignorePatterns: ['*.test.cpp', '*.tmp'],
    debounceMs: 1000
  }
});
```

## 🧪 Development

### Running Tests
```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# Coverage report
npm run test:coverage
```

### Code Quality
```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Format code
npm run format
```

### Database Operations
```bash
# Reset database
npm run db:reset

# Create migration
npm run db:migration:create add_file_metadata

# Run migrations
npm run db:migrate
```

## 📊 Monitoring

### Health Checks
```bash
curl http://localhost:3001/api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "services": {
    "database": "connected",
    "huggingface": "available",
    "fileSystem": "accessible"
  },
  "metrics": {
    "uptime": 86400,
    "memoryUsage": "45MB",
    "activeConnections": 3
  }
}
```

### Performance Metrics
```bash
curl http://localhost:3001/api/stats
```

## 🔒 Security

### Authentication
- JWT-based authentication for API access
- API key validation for external integrations
- Rate limiting to prevent abuse

### Data Protection
- Environment-based configuration management
- Secure token storage and validation
- Input validation and sanitization

### Access Control
```javascript
// Middleware example
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

## 🚀 Deployment

### Docker Deployment
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
EXPOSE 3001

CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - HF_TOKEN=${HF_TOKEN}
    volumes:
      - ./data:/app/data
      - ./logs:/app/logs
```

### Environment Setup
```bash
# Production environment variables
export NODE_ENV=production
export PORT=3001
export HF_TOKEN=your_production_token
export JWT_SECRET=your_production_secret
```

## 🔧 Troubleshooting

### Common Issues

**HuggingFace API Errors**
```bash
# Check token validity
curl -H "Authorization: Bearer $HF_TOKEN" \
     https://router.huggingface.co/v1/models

# Verify model availability
curl -H "Authorization: Bearer $HF_TOKEN" \
     https://router.huggingface.co/v1/models/Qwen/Qwen2.5-Coder-7B-Instruct
```

**File System Permissions**
```bash
# Ensure proper permissions
chmod 755 /path/to/source/directory
chown -R $USER:$USER /path/to/output/directory
```

**Database Connection Issues**
```bash
# Check database file permissions
ls -la ./data/database.sqlite

# Recreate database
npm run db:reset
```

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev

# Specific module debugging
DEBUG=app:ai,app:fs npm run dev
```

## 📈 Performance Optimization

### Caching Strategy
- **Response Caching**: Cache AI responses for identical code snippets
- **File Content Caching**: Cache file analysis results
- **API Rate Limiting**: Implement intelligent rate limiting for HuggingFace API

### Batch Processing
```javascript
// Process multiple files in parallel
const files = await scanForFiles(sourcePath);
const batchSize = 5;

for (let i = 0; i < files.length; i += batchSize) {
  const batch = files.slice(i, i + batchSize);
  await Promise.all(
    batch.map(file => generateDocumentation(file))
  );
}
```

### Memory Management
- **Stream Processing**: Process large files in chunks
- **Connection Pooling**: Reuse database connections
- **Garbage Collection**: Monitor and optimize memory usage

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Code Style
- Use ESLint and Prettier for code formatting
- Follow TypeScript best practices
- Write comprehensive tests
- Document public APIs

### Commit Messages
```
feat: add batch documentation processing
fix: resolve HuggingFace API timeout issues
docs: update API documentation
test: add integration tests for file watching
```

## 📄 License

MIT License - see LICENSE file for details.

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/SENODROOM/QuantumDocsSyncer/issues)
- **Discussions**: [GitHub Discussions](https://github.com/SENODROOM/QuantumDocsSyncer/discussions)
- **Email**: support@quantumdocs.com

---

*Built with ❤️ for the Quantum Language documentation ecosystem*
