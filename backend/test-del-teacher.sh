#!/bin/bash
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@gmail.com","password":"Admin@123"}' | jq -r '.token')
curl -X DELETE http://localhost:8080/api/admin/users/16 -H "Authorization: Bearer $TOKEN"
