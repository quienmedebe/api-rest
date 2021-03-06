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

### /auth/new-password

#### POST
##### Description

Changes the password using a token

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| emailProviderId | body | Id of the email requesting the password change | No | string |
| token | body | Token to change the password | No | string |
| newPassword | body | New password to associate with the email provider | No | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Success | object |
| 400 | Bad request | object |

### /debt

#### POST
##### Description

Creates a new Debt

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| amount | body | Debt amount | No | number |
| type | body | is it a debt or a credit | No | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Success | object |
| 400 | Bad request | object |
| 401 | Unauthorized | object |

### /debt/balance

#### GET
##### Description

Returns the current balance of the account

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Success | object |
| 401 | Unauthorized | object |

### /debt/list/:page/:page_size

#### GET
##### Description

Returns the list of created debts

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| page | path | Page to return results | No | number |
| page_size | path | Size of each page | No | number |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Success | object |
| 401 | Unauthorized | object |

### /debt/:id

#### GET
##### Description

Returns an existing debt

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Success | object |
| 400 | Bad request | object |
| 401 | Unauthorized | object |

#### DELETE
##### Description

Removes an existing debt

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Success | object |
| 400 | Bad request | object |
| 401 | Unauthorized | object |

#### PATCH
##### Description

Updates (partially) an existing debt

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Success | object |
| 400 | Bad request | object |
| 401 | Unauthorized | object |
