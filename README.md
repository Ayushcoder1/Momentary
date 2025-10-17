# Momentary

A lightweight “temporary cloud” for one‐off file sharing—no login required. Users upload a file, choose a retention period (10, 20 or 30 minutes), and receive a unique 4-character access code. Anyone with that code can retrieve the file until it auto-expires.

---

## 🚀 Features

- **Simple Upload & Download**  
  - Upload any file via REST API or web UI  
  - Select retention: 10 min, 20 min or 30 min  
  - Receive a 4-character code (letters & digits)  
  - Retrieve file by entering code—no authentication  

- **Automatic Expiry**  
  - Files auto-deleted after selected TTL  
  - Background cleanup job  

- **Tech Stack**  
  - **Backend:** Node.js + TypeScript + Express  
  - **Storage:** A S3 bucket 
  - **Frontend:** React + TypeScript + Tailwind CSS (or your CSS framework of choice)  

---
## Getting Started

### Prerequisites
- Node.js 18+
- For S3 mode: AWS credentials in environment (or use local filesystem fallback)

### Backend
1. Configure environment variables in `backend/.env` (create it):
   - `PORT=4000`
   - `STORAGE_DRIVER=fs` (use `s3` for S3)
   - `LOCAL_STORE_DIR=data` (used in fs mode)
   - `S3_BUCKET=your-bucket` (when STORAGE_DRIVER=s3)
   - `AWS_REGION=us-east-1`
   - `S3_ENDPOINT=http://localhost:9000` (optional, for MinIO/localstack)

2. Install and run backend:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

Endpoints:
- `POST /files/upload` form-data: `file`, `ttlMinutes` (10|20|30) → `{ code, expiresAt }`
- `GET /files/:code` → returns file bytes until expiry

### Frontend
1. Run the app:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

The dev server proxies `/files` to the backend at `http://localhost:4000`.

### Cleanup Job
The server runs a background cleanup every minute to remove expired files.

---
## Docker

### Quick start
- Build and run the backend API:

  ```bash
  docker compose up --build
  ```

- API base URL: http://localhost:4000
  - Health: `GET /health`
  - Upload: `POST /files/upload` (form-data: `file`, `ttlMinutes` 10|20|30)
  - Download: `GET /files/:code`

### What it does
- `backend`: Node.js API on port `4000`. Uses local filesystem storage by default with a persistent Docker volume.

### Persistent storage (fs driver)
- Uploaded files are stored in a named Docker volume `backend_data` mounted at `/data` in the backend container.

### Switch to S3 storage
Edit `docker-compose.yml` and set the following under the `backend` service:

```yaml
environment:
  - STORAGE_DRIVER=s3
  - S3_BUCKET=your-bucket
  - AWS_REGION=us-east-1
```

Ensure the backend has access to AWS credentials (env vars or IAM role, depending on your environment).
