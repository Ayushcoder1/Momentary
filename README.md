# Momentary

A lightweight “temporary cloud” for one‐off file sharing—no login required. Users upload a file, choose a retention period (10, 20 or 30 minutes), and receive a unique 4-character access code. Anyone with that code can retrieve the file until it auto-expires.

---

## Features

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
  - **Storage:** A S3 bucket or Local filesystem
  - **Frontend:** React + TypeScript + Tailwind CSS (or your CSS framework of choice)  
