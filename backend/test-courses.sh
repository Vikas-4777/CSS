#!/bin/bash
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@gmail.com","password":"Admin@123"}' | jq -r '.token')
curl -v -X GET http://localhost:8080/api/courses -H "Authorization: Bearer $TOKEN"
