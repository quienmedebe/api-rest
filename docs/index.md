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

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| email | body |  | No | string |
| password | body |  | No | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Success | object |
| 400 | Invalid parameters | object |

### /auth/login

#### POST
##### Description

Returns the access token to make authenticated requests

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| email | body |  | No | string |
| password | body |  | No | string |

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

### /auth/refresh

#### POST
##### Description

Returns a new access token

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| accountId | body | Id of the account which requests a new access token | No | number |
| refreshToken | body | refreshToken to get the new access token | No | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Success | object |
| 400 | Bad request | object |
| 401 | Unauthorized | object |

### /auth/recover-password

#### POST
##### Description

Sends an email to change the password when you forget the credentials

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| email | body | Email to recover the password from | No | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Success | object |
| 400 | Bad request | object |
