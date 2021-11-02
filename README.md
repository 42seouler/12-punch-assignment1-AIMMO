# 프로젝트 소개

- NestJS
- MongoDB
- 기타 사용한 라이브러리
- 이외의 기능 구현 방법

# 프로젝트 사용법

## 로컬에서 테스트를 원할 경우

### 설치

```
$ npm install
```

### 실행 방법

```
# watch mode
$ npm run start:dev

# build
$ npm run build

# production mode
$ npm run start:prod
```

## 배포 서버 주소

# 성능 테스트

- 1000만여 건의 데이터 추가 후 페이지당 100개씩 pagination을 시도

### 1페이지 조회

- Total 88.94ms

![1page](https://user-images.githubusercontent.com/67426853/139943707-6bca8592-2697-480c-a668-047f6ead519b.png)

### 5만 페이지 조회

- Total 11.66s

![5만page](https://user-images.githubusercontent.com/67426853/139943512-0fdba110-9c71-4325-8313-bce1fde394b1.png)

### 10만 페이지 조회

- Total 1m 20.40s

![10만page](https://user-images.githubusercontent.com/67426853/139942967-728f3655-67ec-452e-a2e4-c50dc5db1b52.png)

# API 문서

- Swagger API Documentation 이용
- [주소] 접속시 테스트 가능

## 회원 가입

**URL**

```
POST http://localhost:3000/auth/signup
```

**Parameter**

| Name     | Type   | Description | Required |
| -------- | ------ | ----------- | :------: |
| email    | String | 이메일      |    O     |
| password | String | 비밀번호    |    O     |

> Request: 실행 예시

```

```

> Response

```
200 OK

회원 가입이 완료되었습니다.
```

```
409 Conflict

{
  "statusCode":409,
  "message":"이미 가입된 이메일 입니다",
  "error":"Conflict"
}
```

## 로그인

**URL**

```
POST http://localhost:3000/auth/signin
```

**Parameter**

| Name     | Type   | Description | Required |
| -------- | ------ | ----------- | :------: |
| email    | String | 이메일      |    O     |
| password | String | 비밀번호    |    O     |

> Request: 실행 예시

```

```

> Response

```
200 OK

{
  "accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImxlbW9uMDAxQGdtYWlsLmNvbSIsImlhdCI6MTYzNTIxNDc3OCwiZXhwIjoxNjM1MzAxMTc4fQ.96BrzmOo3BTN7ySLmeP8F8LmaPo2bRCswEjxeqcBrQ0"
}
```

```
400 Bad Request

{
  "statusCode":400,
  "message":["password must be longer than or equal to 8 characters"],
  "error":"Bad Request"
}
```

```
401 Unauthorized

{
    "statusCode": 401,
    "message": "로그인 정보를 다시 확인해 주세요.",
    "error": "Unauthorized"
}
```

## 게시글 목록 조회하기

- 게시글 목록을 받아 옵니다.

**URL**

```
GET http://localhost:3000/posts
```

**Parameter**

| Name | Type   | Description               | Required |
| ---- | ------ | ------------------------- | :------: |
| take | Number | 페이지당 표시할 게시글 수 |    X     |
| page | Number | 조회할 페이지 번호        |    X     |

> Request: 실행 예시

```
전체 목록 출력


```

```
페이지네이션 적용


```

> Response

```
200 OK

{
  "results":
    [
      {
        "id":12,
        "title":"cheese",
        "content":"donut",
        "created":"2021-10-25",
        "status":"OPEN"
      },
      {
        "id":11,
        "title":"olive",
        "content":"donut",
        "created":"2021-10-25",
        "status":"OPEN"
      },
      {
        "id":8,
        "title":"pink",
        "content":"banana",
        "created":"2021-10-25",
        "status":"OPEN"
      },
    ],
  "pageTotal":3,"total":10
}
```

## 단일 게시글 조회하기

- 게시글 id로 단일 게시글을 조회합니다.

**URL**

```
GET http://localhost:3000/posts/:id
```

**Parameter**

| Name | Type   | Description | Required |
| ---- | ------ | ----------- | :------: |
| id   | String | 콘텐츠 id   |    O     |

> Request: 실행 예시

```

```

> Response

```
200 OK

{
  "id":12,
  "title":"cheese",
  "content":"donut",
  "created":"2021-10-25",
  "status":"OPEN"
}
```

```
404 Not Found

{
  "statusCode":404,
  "message":"게시글 ID \"12\"번이 존재하지 않습니다.",
  "error":"Not Found"
}
```

## 게시글 작성하기

**URL**

```
POST http://localhost:3000/posts
```

**Parameter**

| Name    | Type   | Description | Required |
| ------- | ------ | ----------- | :------: |
| title   | String | 게시글 제목 |    O     |
| content | String | 게시글 내용 |    O     |

> Request: 실행 예시

```

```

> Response

```
200 OK

{
  "title":"title",
  "content":"content",
  "created":"2021-10-26",
  "status":"OPEN",
  "id":13
}
```

```
400 Bad Request
{
  "statusCode":400,
  "message":[
      "title must be a string",
      "title should not be empty",
      "content must be a string",
      "content should not be empty"
    ],
  "error":"Bad Request"
}
```

## 게시글 수정하기

- 게시글 id로 단일 게시글을 수정합니다.

**URL**

```
PATCH http://localhost:3000/posts/:id
```

**Parameter**

| Name    | Type   | Description | Required |
| ------- | ------ | ----------- | :------: |
| id      | String | 게시글 id   |    O     |
| title   | String | 게시글 제목 |    X     |
| content | String | 게시글 내용 |    X     |

> Request: 실행 예시

```

```

> Response

```
200 OK

{
  "title":"update!",
  "content":"content",
  "created":"2021-10-26",
  "status":"OPEN",
  "id":13
}
```

## 게시글 삭제하기

- 게시글 id로 단일 게시글을 삭제합니다.
- soft delete(논리 삭제): '게시글 상태 닫음'과 hard delete(물리 삭제): '게시글 완전 삭제'로 나뉩니다.

### 게시글 상태 닫기

- 게시글의 status 항목을 'OPEN'에서 'CLOSE'로 변경합니다.

**URL**

```
PATCH http://localhost:3000/posts/:id/close
```

**Parameter**

| Name | Type   | Description | Required |
| ---- | ------ | ----------- | :------: |
| id   | String | 게시글 id   |    O     |

> Request: 실행 예시

```

```

> Response

```
200 OK

{
  "id":13,
  "title":"update!",
  "content":"content",
  "created":"2021-10-26",
  "status":"CLOSE"
}
```

### 게시글 완전 삭제

- 게시글의 상태가 'CLOSE'인 글을 물리적으로 삭제합니다.

**URL**

```
DELETE http://localhost:3000/posts/:id
```

**Parameter**

| Name | Type   | Description | Required |
| ---- | ------ | ----------- | :------: |
| id   | String | 게시글 id   |    O     |

> Request: 실행 예시

```

```

> Response

```
200 OK

게시글 ID "${id}"번이 완전히 삭제되었습니다.
```

```
409 Conflict
{
  "statusCode":409,
  "message":"게시글 ID "${id}"번이 닫힌 상태가 아닙니다. 상태를 "CLOSE" 로 변경한 뒤 삭제해 주세요.",
  "error":"Conflict"
}
```
