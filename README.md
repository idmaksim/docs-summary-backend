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

To run the project correctly, you need to configure the following environment variables:

- `PORT`: The port on which the server will run (default is `3000`).
- `DATABASE_URL`: URL for connecting to the PostgreSQL database.
- `ACCESS_SECRET`: Secret key for generating JWT access tokens.
- `REFRESH_SECRET`: Secret key for generating JWT refresh tokens.
- `AI_API_KEY`: API key for accessing OpenAI.
- `AI_API_URL`: URL for accessing the OpenAI API.
- `REDIS_URL`: URL for connecting to Redis.

These variables can be set in a `.env` file at the root of the project.
