#!/bin/bash
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@gmail.com","password":"Admin@123"}' | jq -r '.token')
curl -X PUT http://localhost:8080/api/courses/4/assign -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"teacherId": 5}'
