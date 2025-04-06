SERVER_IP = "142.93.162.193"
SSH_USER = "root"
SSH_KEY = "~/.ssh/sporestack/id_rsa"
REMOTE_FOLDER = "/root/repo/store-frontend"

build-docker:
	docker build --no-cache . -f ./docker/NodeDockerfile -t store-frontend
	docker build --no-cache . -f ./docker/NginxDockerfile -t store-frontend-nginx

generate-local-certs:
	 openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout nginx/localhost.key -out nginx/localhost.crt

generate-prod-certs:
	docker compose exec nginx certbot certonly --nginx

deploy:
	git push origin master
	npm run build
	zip -r build.zip build 
	ssh -i ${SSH_KEY} ${SSH_USER}@${SERVER_IP} "cd ${REMOTE_FOLDER}; git pull origin master;"
	scp -i ${SSH_KEY} build.zip ${SSH_USER}@${SERVER_IP}:${REMOTE_FOLDER}/build.zip
	scp -i ${SSH_KEY} .env.production ${SSH_USER}@${SERVER_IP}:${REMOTE_FOLDER}/.env
	rm build.zip
	ssh -i ${SSH_KEY} ${SSH_USER}@${SERVER_IP} "cd ${REMOTE_FOLDER}; make run-prod;"

run-prod:
	rm -rf build
	unzip build.zip
	rm build.zip
	docker compose exec frontend bash -c 'npm install; pm2 restart build/index.js --update-env'

error-logs:
	docker compose exec frontend bash -c 'tail -f ~/.pm2/logs/index-error.log'