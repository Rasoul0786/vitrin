# Vitrin

[![CI](https://github.com/Rasoul0786/vitrin/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Rasoul0786/vitrin/actions/workflows/ci.yml)
[![Deploy](https://github.com/Rasoul0786/vitrin/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/Rasoul0786/vitrin/actions/workflows/deploy.yml)
![Python](https://img.shields.io/badge/Python-3.12%20%7C%203.13-3776AB?logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-5.1-092E20?logo=django&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=20232A)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)

**Vitrin (ویترین)** is a Persian, RTL e-commerce application for a women's clothing store. It provides a React storefront backed by a Django REST API, with product variants, inventory, customer accounts, a Redis-backed shopping cart, wishlists, coupons, and order management.

- **Live website:** [https://vitrinsbz.ir](https://vitrinsbz.ir)
- **Repository:** [Rasoul0786/vitrin](https://github.com/Rasoul0786/vitrin)

## Features

### Storefront
- Responsive, Persian RTL interface with Vazirmatn typography.
- Product catalogue with categories, search, filtering, sorting, and pagination.
- Product detail pages with images, color and size variants, stock availability, and ratings.
- Shopping cart for guests and signed-in customers.
- Wishlist with guest-to-account merging after login.
- Coupon codes with validity dates, minimum purchase amounts, usage limits, and capped discounts.
- Customer registration, login, profile management, and saved addresses.
- Authenticated order creation, order history, order details, and cancellation.
- Product reviews with moderation before public display.
- Django Admin for managing store data.

### Backend
- REST API built with Django REST Framework.
- JWT authentication with refresh-token rotation and session authentication.
- Role-aware permissions for staff and read-only public catalogue access.
- Redis storage for carts and Django caching.
- PostgreSQL database.
- Atomic order creation with stock validation and inventory updates.
- API schema and Swagger UI in development mode.

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React 19, React Router 7, Vite 6 |
| Styling | Tailwind CSS 4, Vazirmatn |
| Backend | Python, Django 5.1, Django REST Framework |
| Authentication | Simple JWT |
| API documentation | drf-spectacular, OpenAPI, Swagger UI |
| Database | PostgreSQL 16 |
| Cache and cart storage | Redis 7, django-redis |
| Web server | Nginx, Gunicorn |
| Infrastructure | Docker, Docker Compose, GitHub Actions, Certbot |

## Project Structure

```text
vitrin/
├── backend/
│   ├── config/             # Django settings and URL configuration
│   ├── users/              # Accounts, profiles, and addresses
│   ├── products/           # Products, categories, variants, reviews, wishlist
│   ├── cart/               # Redis cart and coupon logic
│   ├── orders/             # Orders, order items, and inventory operations
│   ├── requirements/       # Base, development, production, and test dependencies
│   └── manage.py
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/     # Shared UI components
│       ├── contexts/       # Application state
│       ├── lib/            # API client and helpers
│       └── pages/          # Storefront pages
├── nginx/                  # Nginx configuration and frontend image
├── .github/workflows/      # CI and deployment workflows
└── docker-compose.yml
```

## Getting Started

### Prerequisites

- Python 3.12 or 3.13
- Node.js and npm
- PostgreSQL 16
- Redis 7

You can run PostgreSQL and Redis locally or start them as separate Docker containers:

```bash
docker run -d --name vitrin-postgres \
  -e POSTGRES_DB=vitrin \
  -e POSTGRES_USER=vitrin \
  -e POSTGRES_PASSWORD=vitrin_dev \
  -p 5432:5432 postgres:16-alpine

docker run -d --name vitrin-redis \
  -p 6379:6379 redis:7-alpine
```

### 1. Configure the backend

Create and activate a virtual environment:

```bash
cd backend
python -m venv .venv

# Linux / macOS
source .venv/bin/activate

# Windows PowerShell
# .venv\Scripts\Activate.ps1
```

Install development dependencies:

```bash
pip install -r requirements/development.txt
```

Create `.env` from the example file:

```bash
# Linux / macOS
cp .env.example .env

# Windows PowerShell
# Copy-Item .env.example .env
```

Update at least the following values in `.env` for local development:

```dotenv
SECRET_KEY=replace-with-a-long-random-secret
DEBUG=True
DATABASE_URL=postgres://vitrin:vitrin_dev@127.0.0.1:5432/vitrin
REDIS_URL=redis://127.0.0.1:6379/0
```

Run database migrations and create an admin account:

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

The backend will be available at [http://127.0.0.1:8000](http://127.0.0.1:8000).

Useful development URLs:

| Resource | URL |
| --- | --- |
| Django Admin | [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/) |
| API root | [http://127.0.0.1:8000/api/](http://127.0.0.1:8000/api/) |
| OpenAPI schema | [http://127.0.0.1:8000/api/schema/](http://127.0.0.1:8000/api/schema/) |
| Swagger UI | [http://127.0.0.1:8000/api/docs/](http://127.0.0.1:8000/api/docs/) |
| ReDoc | [http://127.0.0.1:8000/api/redoc/](http://127.0.0.1:8000/api/redoc/) |

The schema and interactive API documentation are enabled by the development settings.

### 2. Run the frontend

Open a second terminal:

```bash
cd frontend
npm ci
npm run dev
```

Vite starts the frontend (usually at [http://localhost:5173](http://localhost:5173)). Requests to `/api` are proxied to the Django development server at `http://localhost:8000`.

### 3. Frontend checks

From the `frontend/` directory:

```bash
npm run lint
npm run build
```

### 4. Backend tests

With the backend virtual environment activated, PostgreSQL and Redis running, and the local environment variables configured:

```bash
cd backend
pytest
```

The CI workflow also checks code formatting and linting, verifies migrations, and runs the test suite against PostgreSQL and Redis.

## API Overview

The API is mounted under `/api/`.

| Resource | Main endpoints |
| --- | --- |
| Authentication | `/auth/signup/`, `/auth/login/`, `/auth/refresh/`, `/auth/logout/` |
| Current user and addresses | `/me/`, `/addresses/` |
| Catalogue | `/products/`, `/categories/`, `/colors/`, `/sizes/` |
| Product reviews | `/products/{slug}/comments/`, `/comments/` |
| Wishlist | `/wishlist/`, `/wishlist/ids/`, `/wishlist/toggle/`, `/wishlist/merge/` |
| Cart | `/cart/`, `/cart/items/`, `/cart/coupon/`, `/cart/merge/` |
| Orders | `/orders/`, `/orders/{pk}/`, `/orders/{pk}/cancel/` |

Most catalogue reads are public. Creating or modifying catalogue data is restricted to staff users. Order endpoints require authentication.

## Deployment

The repository includes Dockerfiles, a Docker Compose configuration, Nginx reverse-proxy configuration, and GitHub Actions workflows for CI and deployment. The intended production stack uses PostgreSQL, Redis, Django/Gunicorn, Nginx, and Certbot for TLS certificates.

Before using the checked-in Compose/deployment setup for a new production environment, review the build context and service names noted below. Configure secrets and environment variables outside version control; never commit a real `.env` file or production credentials.

## Implementation Notes

- **Online payment gateway:** the current codebase implements order creation and order status management, but does not include a payment-provider integration.
- **Compose build context:** the Nginx Dockerfile copies both `frontend/` and `nginx/` paths, while the Compose service currently uses `./nginx` as its build context. Build from the repository root and point to `nginx/Dockerfile` to make those paths available.
- **Deployment service name:** the deployment workflow references a Compose service named `backend`, while the checked-in Compose file names the Django service `web`. Align the workflow and Compose service/image configuration before relying on automated deployment.
- **Order detail lookup:** the backend order viewset currently uses DRF’s default primary-key lookup, while the frontend API helper sends an order code. Align the lookup field or the frontend request so order detail links resolve correctly.
- **Unwired frontend API calls:** the frontend API client contains contact, newsletter, and password-change requests, but matching backend URL handlers are not currently registered in the Django URL configuration.

## License

No license file is currently included in this repository. All rights are reserved unless the project owner specifies otherwise.
