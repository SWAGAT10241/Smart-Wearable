.PHONY: all build run test clean docker-build

APP_NAME=trailguard-gateway-go
PORT?=8080

all: test build

build:
	go build -o bin/gateway ./cmd/server

run:
	go run ./cmd/server

test:
	go test -v ./internal/...

docker-build:
	docker build -t $(APP_NAME):latest .

docker-run:
	docker run -p $(PORT):8080 -p 9090:9090/udp $(APP_NAME):latest

clean:
	rm -rf bin/
