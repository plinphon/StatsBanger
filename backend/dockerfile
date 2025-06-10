# Use official Golang image
FROM golang:1.21

# Set working directory inside the container
WORKDIR /app

# Copy go.mod and go.sum first to cache dependencies
COPY backend/go.mod backend/go.sum ./

# Download dependencies
RUN go mod download

# Copy the rest of the backend source code
COPY backend/ ./

# Build the Go application
RUN go build -o main .

# Command to run the binary
CMD ["./main"]
