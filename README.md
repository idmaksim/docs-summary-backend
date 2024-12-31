# 📚 NestJS Project for Text Summarization

## 📝 Description

This project implements an API for summarizing text documents. It supports `.txt`, `.docx`, and `.pdf` formats. Leveraging the power of NestJS, the project ensures high performance and scalability.

## 🚀 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/idmaksim/docs-summary-backend.git
   ```

2. Navigate to the project directory:

   ```bash
   cd docs-summary-backend
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

## ▶️ Running

To run the project in development mode, execute:

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`.

API documentation is available at `http://localhost:3000/api`.

## 📂 Usage

Send a POST request to `/summarize/file` with a file in the request body (form-data). Supported file formats: `.txt`, `.docx`, `.pdf`, `.doc`.

Send a POST request to `/summarize/text` with a text in the request body.

## 🛠️ Technologies

- **NestJS**: A framework for building server-side applications on Node.js.
- **Multer**: Middleware for handling `multipart/form-data`, used for file uploads.
- **pdf-parse**: A library for working with PDF files.
- **mammoth**: A tool for converting `.docx` to text.
- **OpenAI Models**: Utilized for advanced text summarization capabilities.
- **BullMQ**: Used with Redis for message queue processing related to neural network tasks, allowing users to track their position in the queue.

### 📦 Features

- **Text Summarization**: API for summarizing text documents.
- **File Support**: Supports `.txt`, `.docx`, `.doc`, and `.pdf` formats.
- **Scalable Architecture**: Utilizes NestJS for high performance and scalability.
- **Real-time Updates**: Real-time updates via Socket.io, including the ability to track your position in the queue.
- **Authentication**: JWT authentication to secure the API

### 🔧 Environment Variables

The following environment variables need to be configured in the `.env` file for proper project operation:

#### Core Settings
- `PORT`: Server port (defaults to `3000`)
- `DATABASE_URL`: PostgreSQL database connection URL

#### Authentication
- `ACCESS_SECRET`: Secret key for generating JWT access tokens
- `REFRESH_SECRET`: Secret key for generating JWT refresh tokens

#### GigaChat API
- `GIGACHAT_API_KEY`: Authorization key for GigaChat API access
- `GIGACHAT_AUTH_URL`: URL for obtaining GigaChat authorization token
- `GIGACHAT_BASE_URL`: Base URL for GigaChat API requests
- `GIGACHAT_REQUEST_ID`: Unique identifier for GigaChat requests

#### Redis (optional)
- `REDIS_URL`: Redis server connection URL for queue management

Example `.env` file:
```env
GIGACHAT_API_KEY=your_api_key
GIGACHAT_AUTH_URL=https://ngw.devices.sberbank.ru:9443/api/v2/oauth
GIGACHAT_BASE_URL=https://gigachat.devices.sberbank.ru/api/v1/chat/completions
GIGACHAT_REQUEST_ID=your_request_id
REDIS_URL=redis://localhost:6379
REFRESH_SECRET=your_refresh_secret
ACCESS_SECRET=your_access_secret
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```
