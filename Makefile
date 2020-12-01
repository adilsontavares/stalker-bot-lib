.PHONY: deps/install
deps/install:
	@npm i -g typescript

.PHONY: clear-cache
clear-cache:
	@rm -rf .cache && mkdir .cache

.PHONY: install
install:
	@yarn install

.PHONY: build
build:
	@tsc

.PHONY: run
run: build
	@node ./out/main.js
