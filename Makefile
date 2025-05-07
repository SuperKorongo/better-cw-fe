include .env

build-docker:
	docker build --no-cache . -f ./docker/NodeDockerfile -t store-frontend
	docker build --no-cache . -f ./docker/NginxDockerfile -t store-frontend-nginx

generate-local-certs:
	 openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout nginx/localhost.key -out nginx/localhost.crt

generate-prod-certs:
	docker compose exec nginx certbot certonly --nginx

deploy:
	mkdir -p .git-zip
	cp -r .git .git-zip/
	zip -r repo.zip .git-zip
	rm -rf .git-zip
	npm run build
	zip -r build.zip build 
	scp -i ${SSH_KEY_FILE_PATH} build.zip ${SSH_USER}@${SERVER_IP}:${REMOTE_FOLDER}/build.zip
	rm build.zip
	scp -i ${SSH_KEY_FILE_PATH} repo.zip ${SSH_USER}@${SERVER_IP}:${REMOTE_FOLDER}/repo.zip
	rm repo.zip
	scp -i ${SSH_KEY_FILE_PATH} .env.production ${SSH_USER}@${SERVER_IP}:${REMOTE_FOLDER}/.env
	ssh -i ${SSH_KEY_FILE_PATH} ${SSH_USER}@${SERVER_IP} "cd ${REMOTE_FOLDER}; make run-prod;"

run-prod:
	rm -rf .git
	unzip repo.zip
	mv .git-zip/.git .
	rm -rf .git-zip
	git checkout -- .
	rm repo.zip
	rm -rf build
	unzip build.zip
	rm build.zip
	docker compose exec frontend bash -c 'npm install; pm2 restart build/index.js --update-env'

error-logs:
	docker compose exec frontend bash -c 'tail -f ~/.pm2/logs/index-error.log'