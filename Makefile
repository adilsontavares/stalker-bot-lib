.PHONY: clear-cache
clear-cache:
	@rm -rf .cache && mkdir .cache

.PHONY: install
install:
	@yarn install

.PHONY: build
build:
	@yarn build

.PHONY: run
run:
	@yarn start

.PHONY: dev
dev:
	@yarn dev

.PHONY: docker/up
docker/up:
	docker-compose build
	docker-compose up -d 

.PHONY: docker/down
docker/down:
	docker-compose down