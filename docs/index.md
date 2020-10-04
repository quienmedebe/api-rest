### /unauthorized

#### GET
##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 401 | Authorization information is missing or invalid. | object |

### /auth/signup

#### POST
##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Success | object |
| 400 | Invalid parameters | object |

### /auth/login

#### POST
##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Success | object |
| 401 | Unauthorized | object |
