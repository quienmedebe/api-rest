### /unauthorized

#### GET
##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 401 | Authorization information is missing or invalid. | object |

### /auth/signup

#### POST
##### Description

Creates an account with an email and a password and returns an access token to make authenticated requests

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Success | object |
| 400 | Invalid parameters | object |

### /auth/login

#### POST
##### Description

Returns the access token to make authenticated requests

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Success | object |
| 401 | Unauthorized | object |

### /auth/check

#### GET
##### Description

Checks if a token is valid and returns the account information

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Success | object |
| 401 | Unauthorized | object |
