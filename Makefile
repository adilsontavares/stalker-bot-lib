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
