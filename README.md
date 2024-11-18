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

Send a POST request to `/summarize` with a file in the request body. Supported file formats: `.txt`, `.docx`, `.pdf`.

## 🛠️ Technologies

- **NestJS**: A framework for building server-side applications on Node.js.
- **Multer**: Middleware for handling `multipart/form-data`, used for file uploads.
- **PDF-lib**: A library for working with PDF files.
- **Mammoth**: A tool for converting `.docx` to text.
- **OpenAI Models**: Utilized for advanced text summarization capabilities.
