include .env

build-docker:
	docker build --no-cache . -f ./docker/NodeDockerfile -t store-frontend
	docker build --no-cache . -f ./docker/NginxDockerfile -t store-frontend-nginx

generate-local-certs:
	 openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout nginx/localhost.key -out nginx/localhost.crt

generate-prod-certs:
	docker compose exec -it nginx certbot certonly --nginx -d ${DOMAIN_NAME} -d www.${DOMAIN_NAME}

deploy:
	[ -f "static/widget.js" ] && true || false;
	git push origin master
	node src/sitemap_generator.ts
	./update-robots.sh
	scp -i ${SSH_KEY_FILE_PATH} .env.production ${SSH_USER}@${SERVER_IP}:${REMOTE_FOLDER}/.env
	ssh -i ${SSH_KEY_FILE_PATH} ${SSH_USER}@${SERVER_IP} "cd ${REMOTE_FOLDER}; git pull origin master;"
	npm run build
	zip -r build.zip build 
	scp -i ${SSH_KEY_FILE_PATH} build.zip ${SSH_USER}@${SERVER_IP}:${REMOTE_FOLDER}/build.zip
	rm build.zip
	ssh -i ${SSH_KEY_FILE_PATH} ${SSH_USER}@${SERVER_IP} "cd ${REMOTE_FOLDER}; make run-prod;"

run-prod:
	rm -rf build
	unzip build.zip
	rm build.zip
	docker compose exec frontend bash -c 'npm install --verbose; pm2 restart build/index.js --update-env'

error-logs:
	docker compose exec frontend bash -c 'tail -f ~/.pm2/logs/index-error.log'

nginx-logs:
	docker logs store-frontend-nginx --tail 5 --follow | jq

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
# Send private ssh key and pull from repository
	ssh -i ${SSH_KEY_FILE_PATH} ${SSH_USER}@${SERVER_IP} "mkdir -p /root/.ssh"
	scp -i ${SSH_KEY_FILE_PATH} ~/.ssh/github-better-cw/id_rsa ${SSH_USER}@${SERVER_IP}:/root/.ssh/id_rsa
	ssh -i ${SSH_KEY_FILE_PATH} ${SSH_USER}@${SERVER_IP} "mkdir -p ${REMOTE_FOLDER};"
	ssh -i ${SSH_KEY_FILE_PATH} ${SSH_USER}@${SERVER_IP} "ssh-keyscan -t rsa github.com >> ~/.ssh/known_hosts"
	ssh -i ${SSH_KEY_FILE_PATH} ${SSH_USER}@${SERVER_IP} "cd ${REMOTE_FOLDER}; git init; git remote add origin git@github.com:SuperKorongo/better-cw-fe.git; git pull origin master;"
# Setup initial config to run the containers
	ssh -i ${SSH_KEY_FILE_PATH} ${SSH_USER}@${SERVER_IP} "cd ${REMOTE_FOLDER}; cp docker-compose.override.yml.dist docker-compose.override.yml; cp nginx/nginx.conf.dist nginx/nginx.conf;"
	ssh -i ${SSH_KEY_FILE_PATH} ${SSH_USER}@${SERVER_IP} "cd ${REMOTE_FOLDER}; cp static/robots.txt.dist static/robots.txt; sed -i "s/DOMAIN/${PUBLIC_DOMAIN}/g" static/robots.txt"
	scp -i ${SSH_KEY_FILE_PATH} .env.production ${SSH_USER}@${SERVER_IP}:${REMOTE_FOLDER}/.env
	ssh -t -i ${SSH_KEY_FILE_PATH} ${SSH_USER}@${SERVER_IP} "cd ${REMOTE_FOLDER}; make generate-local-certs"
# Run containers
	make deploy || true
	ssh -i ${SSH_KEY_FILE_PATH} ${SSH_USER}@${SERVER_IP} "cd ${REMOTE_FOLDER}; docker compose up -d;"
# Generate ssl certificates and update nginx conf
	ssh -t -i ${SSH_KEY_FILE_PATH} ${SSH_USER}@${SERVER_IP} "cd ${REMOTE_FOLDER}; make generate-prod-certs"
	ssh -i ${SSH_KEY_FILE_PATH} ${SSH_USER}@${SERVER_IP} "cd ${REMOTE_FOLDER}; make vps-setup-nginx-conf"
	ssh -i ${SSH_KEY_FILE_PATH} ${SSH_USER}@${SERVER_IP} "cd ${REMOTE_FOLDER}; docker compose stop; docker compose up -d;"
# System monitor script to log cpu, memory and disk usage
	ssh -i ${SSH_KEY_FILE_PATH} ${SSH_USER}@${SERVER_IP} "cd ${REMOTE_FOLDER}; cp system_monitor.sh ~/; chmod +x ~/system_monitor.sh; ~/system_monitor.sh &"
# Run deploy script to finalize the setup
	make deploy

vps-setup-nginx-conf:
	sed -i 's|ssl_certificate /etc/nginx/localhost.crt;|ssl_certificate /etc/letsencrypt/live/${DOMAIN_NAME}/fullchain.pem;|g' nginx/nginx.conf
	sed -i 's|ssl_certificate_key /etc/nginx/localhost.key;|ssl_certificate_key /etc/letsencrypt/live/${DOMAIN_NAME}/privkey.pem;|g' nginx/nginx.conf
	sed -i "s/localhost/${DOMAIN_NAME}/g" nginx/nginx.conf
