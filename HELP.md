Debugging suggestions:

# Check running containers
docker-compose ps

# Check container logs
docker-compose logs

# Connect to MySQL container
docker-compose exec db mysql -u healthcare_user -p healthcare_db
# Password: healthcare_password

# Once connected, check tables
SHOW TABLES;

# Test the health endpoint
curl http://localhost:8000/health

# Test the root endpoint
curl http://localhost:8000/