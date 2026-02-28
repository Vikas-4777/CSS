#!/bin/bash
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@gmail.com","password":"Admin@123"}' | jq -r '.token')
echo "Token: $TOKEN"
curl -s -w "\nHTTP Status: %{http_code}" -X DELETE http://localhost:8080/api/admin/users/1 -H "Authorization: Bearer $TOKEN"
