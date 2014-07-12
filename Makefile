.PHONY: all clean

all: build/protex.min.js

build:
	mkdir -p build

build/protex.js: index.js build
	browserify -o $@ $< -s protex

build/protex.min.js: build/protex.js
	./node_modules/.bin/uglifyjs $< -o $@

clean:
	rm -rf build