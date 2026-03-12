# px2 Backend (Spring Boot)

- Java 25, Spring Boot 3.4.4
- 샘플 계정: `admin` / `admin`

## 실행

Maven Wrapper 사용 (Maven 미설치 가능):

```bash
cd backend
./mvnw spring-boot:run
```

또는 Maven 설치 후 `mvn spring-boot:run`

서버: http://localhost:8080  
로그인 API: `POST /api/auth/login` (JSON: `username`, `password`)
