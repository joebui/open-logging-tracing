up:
	docker compose up -d --remove-orphans

down:
	docker compose down

run:
	chmod +x api_call_test.sh && ./api_call_test.sh
