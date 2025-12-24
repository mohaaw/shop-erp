# How to Run ERP-SHOP

You can run the ERP system in three ways: Development Mode, Production Mode, or using Docker.

### 1. Development Mode (Recommended for coding)
Use this mode when you are making changes to the code. This runs both the Next.js frontend and Express backend concurrently.

1.  **Install Dependencies** (Run from root):
    ```bash
    npm run install:all
    ```

2.  **Initialize Database**:
    ```bash
    cd client
    node init-sqlite.js # or equivalent initialization script
    cd ..
    ```

3.  **Start Dev Server**:
    ```bash
    npm run dev
    ```
    - Frontend: `http://localhost:3000`
    - Backend: `http://localhost:3001`

## 2. Production Mode (Recommended for deployment)
Use this mode to test the optimized build that will run on a real server.

1.  **Build the Application**:
    ```bash
    npm run build
    ```

2.  **Start Production Server**:
    ```bash
    npm start
    ```
    - Frontend: `http://localhost:3000`
    - Backend: `http://localhost:3001`

## 3. Docker (Recommended for containerization)
Use this mode to run the app in an isolated container, exactly as it would run in a cloud environment.

**Prerequisites:** Ensure Docker Desktop or Docker Engine is running.

1.  **Build and Start**:
    Run this from the root directory (where `docker-compose.yml` is):
    ```bash
    docker compose up --build
    ```

2.  **Access App**:
    Open `http://localhost:3000`.

3.  **Stop Containers**:
    Press `Ctrl+C` or run:
    ```bash
    docker compose down
    ```

## 4. Testing
To run the automated unit tests:
```bash
cd client
npx vitest run
```
