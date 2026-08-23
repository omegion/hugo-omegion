.PHONY: dev build clean tidy

dev:
	cd exampleSite && hugo server

build:
	cd exampleSite && hugo

tidy:
	cd exampleSite && hugo mod tidy

clean:
	rm -rf exampleSite/public exampleSite/resources
