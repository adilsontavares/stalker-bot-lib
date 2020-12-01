.PHONY: clear-cache
clear-cache:
	@rm -rf .cache && mkdir .cache

.PHONY: install
install:
	@yarn install

.PHONY: build
build:
	@yarn tsc

.PHONY: run
run: build
	@yarn start
