# Acquisitions API

## Docker Setup

### Development (Neon Local)

To run the application locally with Neon Local:

1.  **Prerequisites**: Ensure you have Docker and Docker Compose installed.
2.  **Environment**:
    - Copy `.env.development.example` to `.env`.
    - Fill in your `NEON_API_KEY` and `NEON_PROJECT_ID` from the Neon Console.
    - The `DATABASE_URL` is pre-configured to point to the local Neon proxy.
3.  **Run**:
    ```bash
    docker compose -f docker-compose.dev.yml up --build
    ```
    This will start the application on `http://localhost:3000` and the Neon Local proxy.

### Production

To deploy the application in production:

1.  **Environment**:
    - Set `DATABASE_URL` to your Neon Cloud connection string.
    - Set `JWT_SECRET` and other production variables.
2.  **Run**:
    ```bash
    docker compose -f docker-compose.prod.yml up --build -d
    ```
    Or build the image separately:
    ```bash
    docker build -t acquisitions-app .
    docker run -p 3000:3000 -e DATABASE_URL=... acquisitions-app
    ```

## Notes

- The `neon-local` service acts as a proxy to your Neon Cloud project. It uses `NEON_API_KEY` to authenticate and create ephemeral branches if configured.
- Local database data (if using local storage options) is persisted in the `neon_data` volume.
