include .env

build-docker:
	docker build --no-cache . -f ./docker/NodeDockerfile -t store-frontend
	docker build --no-cache . -f ./docker/NginxDockerfile -t store-frontend-nginx

generate-local-certs:
	 openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout nginx/localhost.key -out nginx/localhost.crt

generate-prod-certs:
	docker compose exec nginx certbot certonly --nginx

deploy:
	make vps-update-repo
	npm run build
	zip -r build.zip build 
	scp -i ${SSH_KEY_FILE_PATH} build.zip ${SSH_USER}@${SERVER_IP}:${REMOTE_FOLDER}/build.zip
	rm build.zip
	scp -i ${SSH_KEY_FILE_PATH} .env.production ${SSH_USER}@${SERVER_IP}:${REMOTE_FOLDER}/.env
	ssh -i ${SSH_KEY_FILE_PATH} ${SSH_USER}@${SERVER_IP} "cd ${REMOTE_FOLDER}; make run-prod;"

run-prod:
	rm -rf build
	unzip build.zip
	rm build.zip
	docker compose exec frontend bash -c 'npm install --verbose; pm2 restart build/index.js --update-env'

error-logs:
	docker compose exec frontend bash -c 'tail -f ~/.pm2/logs/index-error.log'

vps-initial-setup:
# Install docker and unzip and make
	scp -i ${SSH_KEY_FILE_PATH} vps-setup.sh ${SSH_USER}@${SERVER_IP}:/root/vps-setup.sh
	ssh -i ${SSH_KEY_FILE_PATH} ${SSH_USER}@${SERVER_IP} "cd /root/; ./vps-setup.sh"
	ssh -i ${SSH_KEY_FILE_PATH} ${SSH_USER}@${SERVER_IP} "cd /root/; rm -f vps-setup.sh"
# Push docker images
	docker save -o store-frontend.tar store-frontend
	scp -i ${SSH_KEY_FILE_PATH} store-frontend.tar ${SSH_USER}@${SERVER_IP}:/root/store-frontend.tar
	rm store-frontend.tar
	docker save -o store-frontend-nginx.tar store-frontend-nginx
	scp -i ${SSH_KEY_FILE_PATH} store-frontend-nginx.tar ${SSH_USER}@${SERVER_IP}:/root/store-frontend-nginx.tar
	rm store-frontend-nginx.tar
# Load docker images
	ssh -i ${SSH_KEY_FILE_PATH} ${SSH_USER}@${SERVER_IP} "cd /root/; docker load -i store-frontend.tar"
	ssh -i ${SSH_KEY_FILE_PATH} ${SSH_USER}@${SERVER_IP} "cd /root/; docker load -i store-frontend-nginx.tar"
	ssh -i ${SSH_KEY_FILE_PATH} ${SSH_USER}@${SERVER_IP} "cd /root/; rm -f *.tar"
# Setup repository
	make vps-update-repo
# Setup initial config to run the containers
	ssh -i ${SSH_KEY_FILE_PATH} ${SSH_USER}@${SERVER_IP} "cd ${REMOTE_FOLDER}; cp docker-compose.override.yml.dist docker-compose.override.yml; cp nginx/nginx.conf.dist nginx/nginx.conf"
	scp -i ${SSH_KEY_FILE_PATH} .env.production ${SSH_USER}@${SERVER_IP}:${REMOTE_FOLDER}/.env
	ssh -t -i ${SSH_KEY_FILE_PATH} ${SSH_USER}@${SERVER_IP} "cd ${REMOTE_FOLDER}; make generate-local-certs"
# Run containers
	ssh -i ${SSH_KEY_FILE_PATH} ${SSH_USER}@${SERVER_IP} "cd ${REMOTE_FOLDER}; make up;"
# Generate ssl certificates and update nginx conf
	ssh -t -i ${SSH_KEY_FILE_PATH} ${SSH_USER}@${SERVER_IP} "cd ${REMOTE_FOLDER}; make generate-prod-certs"
	ssh -i ${SSH_KEY_FILE_PATH} ${SSH_USER}@${SERVER_IP} "cd ${REMOTE_FOLDER}; make vps-setup-nginx-conf"
	ssh -i ${SSH_KEY_FILE_PATH} ${SSH_USER}@${SERVER_IP} "cd ${REMOTE_FOLDER}; make up;"
# Run deploy script to finalize the setup
	make deploy

vps-update-repo: 
	mkdir -p .git-zip
	cp -r .git .git-zip/
	zip -r repo.zip .git-zip
	rm -rf .git-zip
	scp -i ${SSH_KEY_FILE_PATH} repo.zip ${SSH_USER}@${SERVER_IP}:${REMOTE_FOLDER}/repo.zip
	rm repo.zip
	ssh -i $

vps-setup-nginx-conf:
	sed -i "s/server_name localhost;/server_name ${DOMAIN_NAME};/g" nginx/nginx.conf
	sed -i 's|ssl_certificate /etc/nginx/localhost.crt;|ssl_certificate /etc/letsencrypt/live/${DOMAIN_NAME}/fullchain.pem;|g' nginx/nginx.conf
	sed -i 's|ssl_certificate_key /etc/nginx/localhost.key;|ssl_certificate /etc/letsencrypt/live/${DOMAIN_NAME}/privkey.pem;|g' nginx/nginx.conf