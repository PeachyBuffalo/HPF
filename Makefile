.PHONY: setup setup-docker start stop clean test

setup:
	@bash scripts/setup.sh

setup-docker:
	@bash scripts/setup.sh --docker

start:
	@docker-compose up -d

stop:
	@docker-compose down

clean:
	@docker-compose down -v
	@rm -rf server/venv
	@rm -rf client/node_modules
	@find . -type d -name "__pycache__" -exec rm -r {} +

test:
	@cd server && pytest
	@cd client && npm test

logs:
	@docker-compose logs -f

migrate:
	@cd server && alembic upgrade head 