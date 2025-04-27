docker run \
  --rm \
  -p 3002:80 \
  -e VITE_SERVER_BASE_URL=http://localhost:3000 \
  --name vice_bank \
  vice_bank