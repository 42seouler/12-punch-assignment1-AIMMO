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

## 배포 서버

http://ec2-3-36-50-211.ap-northeast-2.compute.amazonaws.com:3000/api (swagger로 연결됨)


# 성능 테스트 조건

- 1000만여 건의 데이터 추가 후 페이지당 100개씩 pagination을 시도
- MongoDB에서 흔히 페이지네이션에서 사용하는 skip, limit를 사용하는 경우
- Bucket Patten을 사용하여 페이지네이션을 사용하는 경우

# 성능 테스트 의도

주어진 테스트 조건이 1000만건의 데이터를 저장하는 경우이기 때문에 하나의 문서에 방대한 데이터가 몰리거나 많은양의 데이터를 페이지네이션을
해야하는 경우가 언제든지 발생 할 수 있다고 판단했습니다.

#### 하나의 문서에 많은 양의 데이터가 몰리는 경우
- 첫째로 당연히 많은 메모리를 차지합니다. 이것은 문서를 가져오기 위해 서버와 문서가 수신될 때 클라이언트에 할당되어야 하는 메모리입니다.
- 둘째, 대용량 문서는 네트워크를 통해 이동하는 속도가 느립니다.
- 셋째, MongoDB는 (상당히 의도적인) 16MB 문서 크기 제한을 부과합니다.
#### 많은양의 문서가 있는 경우
- 결국 더 높은 번호의 페이지를 볼수록 페이지 사이를 이동하는 속도가 느려지게 됩니다.

우리는 위에 나열 된 테스트 조건을 테스트하기 위해 두가지 방법으로 프로젝트를 구현했습니다. 그리고 결론적으로 버킷 패턴을 사용해 많은 양의 데이터가 몰리는 것과 데이터를 스킵하는 과정을 줄이고자 했습니다.

## Skip, limit을 적용한 테스트 결과

![](https://images.velog.io/images/42seouler/post/e9e98737-99d7-478a-a62d-8c1f0a78f0ce/image.png)

### 1페이지 조회

- Total 88.94ms

![1page](https://user-images.githubusercontent.com/67426853/139943707-6bca8592-2697-480c-a668-047f6ead519b.png)

### 5만 페이지 조회

- Total 11.66s

![5만page](https://user-images.githubusercontent.com/67426853/139943512-0fdba110-9c71-4325-8313-bce1fde394b1.png)

### 10만 페이지 조회

- Total 1m 20.40s

![10만page](https://user-images.githubusercontent.com/67426853/139942967-728f3655-67ec-452e-a2e4-c50dc5db1b52.png)

skip, limit이 작동하는 방식으로 인해 발생하는 일반적인 문제입니다. 데이터베이스에서 점프해서 바로 이동하는게 아니라
데이터베이스는 빠르게 skip의 문서를 지나가고 limt에 맞춰 문서를 반환합니다.

## Bucket Patten

![](https://images.velog.io/images/42seouler/post/b73d0a47-652c-4889-99f0-843b7f2ae624/image.png)

### 1페이지 조회

![](https://images.velog.io/images/42seouler/post/834f662d-d020-453f-84c1-cf601b3065a0/image.png)

### 5만 페이지 조회

![](https://images.velog.io/images/42seouler/post/c3db0bb0-6322-4555-a7b2-c8e8a26ee36a/image.png)

### 70만 페이지 조회

![](https://images.velog.io/images/42seouler/post/9c4bd9c2-1171-4c8a-9763-93e7e0ec79b3/image.png)

skip, limit처럼 문서를 건너뛰는 것은 시간이 많이 걸리지만 반대로 문서를 건너뛰지 않는 것은 시간이 많이 걸리지 않습니다.
데이터 세트를 만들어두고 데이터 세트 단위로 바로 이동 할 수 있기 때문입니다.


# API 문서

- Swagger API Documentation 이용
- [주소] 접속시 테스트 가능


스웨거에 부족한 설명이 있는 API는 리드미에 예시와 함께 작성 하도록 하겠습니다.
인증이 꼭 필요한 부분을 제외하고는 테스트의 편의를 위해 인증절차를 풀어두었습니다.
테스트는 포스트맨으로 진행해주시면 감사하겠습니다 :)


# 유저

![](https://images.velog.io/images/42seouler/post/282e9d7b-217a-4b9d-a63a-d167bd64cb6e/image.png)

### get users

```
curl http://ec2-3-36-50-211.ap-northeast-2.compute.amazonaws.com:3000/users
```

![](https://images.velog.io/images/42seouler/post/4b505856-6158-41a8-9146-6eb7991ff292/image.png)

### post users

![](https://images.velog.io/images/42seouler/post/d0951c7c-4e5b-45f4-b60f-29f3461d9b39/image.png)

```
curl -X POST http://ec2-3-36-50-211.ap-northeast-2.compute.amazonaws.com:3000/users -d '{"email": "wanted", "password": "1234"}' -H "Content-Type: application/json"

```

### get users/{id}

![](https://images.velog.io/images/42seouler/post/38b4d5be-83e9-4668-bec4-e046da434160/image.png)

```
curl http://ec2-3-36-50-211.ap-northeast-2.compute.amazonaws.com:3000/users/6181ca21a0ce776a269ec81a
```

# 로그인

![](https://images.velog.io/images/42seouler/post/95ee62e3-146c-41d3-b7b1-f9d52b26ff9b/image.png)

### 로그인
```
curl -X POST http://ec2-3-36-50-211.ap-northeast-2.compute.amazonaws.com:3000/auth/login -d '{"username": "wanted", "password": "changeme"}' -H "Content-Type: application/json"

```

성공시
```
{"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG4xIiwic3ViIjoiNjE4MWNhMjFhMGNlNzc2YTI2OWVjODFhIiwiaWF0IjoxNjM1ODk2ODI3LCJleHAiOjE2MzU5NTY4Mjd9.3bhtU7BzjdcG9LEM9AP3U079AGseRl04zy5TiXuVNeI"}
```
# 포스트

![](https://images.velog.io/images/42seouler/post/2476ab4f-bd9b-40c9-a419-67f1214c44c4/image.png)

### 포스트 생성

![](https://images.velog.io/images/42seouler/post/ac306cc6-1038-4df3-ad9f-eed6ca103967/image.png)

```
curl -X POST http://ec2-3-36-50-211.ap-northeast-2.compute.amazonaws.com:3000/posts -d '{
	"title": "5sleep5",
	"content": "언제 잘까?",
	"category": "category_5"
}' -H "Content-Type: application/json" -H "Authorization: Bearer {token}"

```

### 검색

![](https://images.velog.io/images/42seouler/post/72275f2c-12ff-499d-a958-3e9018d940e5/image.png)

```
curl http://localhost:3000/posts/search?limit=5&offset=0 -d '{"search": "category_5"}' -H "Content-Type: application/json"
```


# 카테고리

![](https://images.velog.io/images/42seouler/post/72250add-92e8-4d11-b09b-4b4f0847b9c6/image.png)

### 카테고리 생성

```
curl -X POST http://ec2-3-36-50-211.ap-northeast-2.compute.amazonaws.com:3000/categories -d '{"name": "category_5"}' -H "Content-Type: application/json" -H "Authorization: Bearer {eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IndhbnRlZCIsInN1YiI6IjYxODFkN2Q4NTNmYzM3YmQ0Y2FlNzQ4OCIsImlhdCI6MTYzNTg5OTQwMywiZXhwIjoxNjM1OTU5NDAzfQ.3CyLY0rgA_0bFi4VtP4MGs0ZVYlAoNRQlt-zKEJOeZ4}"
```


# 댓글

![](https://images.velog.io/images/42seouler/post/dcb6286b-be8b-4375-89cd-631af34274db/image.png)

### 코멘드 생성
![](https://images.velog.io/images/42seouler/post/5c78ba11-16b2-4de4-b712-7e6882ab1875/image.png)
```
curl -X POST http://ec2-3-36-50-211.ap-northeast-2.compute.amazonaws.com:3000/comments -d '{"content": "내일 잔다", "post": "6181ca4ca0ce776a269ec82a"}' -H "Content-Type: application/json" -H "Authorization: Bearer {eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IndhbnRlZCIsInN1YiI6IjYxODFkN2Q4NTNmYzM3YmQ0Y2FlNzQ4OCIsImlhdCI6MTYzNTg5OTQwMywiZXhwIjoxNjM1OTU5NDAzfQ.3CyLY0rgA_0bFi4VtP4MGs0ZVYlAoNRQlt-zKEJOeZ4}"
```



# 블로그 포스팅

## 김서경 (팀장님)
- https://bit.ly/2ZJLRzz
- https://bit.ly/3wdR9iY

## 김요셉 (팀원님)
- https://dev.to/jokim/deploying-to-aws-ec2-2m10

## 김남형 (팀원님)
- https://velog.io/@42seouler/wanted-1