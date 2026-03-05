Finance Visualizer

A small personal app to import, track and visualize personal finances. It stores transactions, shows category breakdowns and basic KPIs (income, expenses, net balance, average transaction) so you can understand monthly cashflow. Work in progress — features and APIs are still being developed.

- **Backend:** FastAPI + SQLAlchemy (Python)
- **Frontend:** Angular
- **Auth:** JWT access tokens
- **Database:** SQLite (development)

Quick start:

- Backend: create a virtualenv, install requirements, then run:
	```bash
	python -m uvicorn main:app --reload
	```
- Frontend: from `frontend/finance-visualizer` run your usual Angular start command (e.g. `npm start` / `ng serve`).

Nice to haves (future):

- 2FA Authentication
- Running on Docker
- AI / LLM integration for insights
- Advanced reporting and exports
- Authenticate Users via Keycloak
- Mobile App Integration

This repo is a work in progress.
