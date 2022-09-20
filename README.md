# Task-manager-api

This is a basic rest api project where users store their tasks. 

# Endpoints

## Users

### User Sign up

**url** : `/users/signup`

**method** : `POST`

**Auth required** : NO

**Success response code** : `201 OK`

**Expected request body** :

```json
{
    "name": "username",
    "email": "username@example.com",
    "password": "userPassword"
}
```

**Response** : user info and auth token


### User Login

**url** : `/users/login`

**method** : `POST`

**Auth required** : NO

**Success response code **: `200 OK`

**Expected request body** :

```json
{
    "email": "username@example.com",
    "password": "userPassword"
}
```

**Response** : user info and auth token


### User Logout

**url** : `/users/logout`

**method** : `POST`

**Auth required** : YES

**Auth type** : Bearer

**Success response code** : `200 OK`

**Expected request body** : NONE

**Response** : deleted auth token


### User Logout From All Devices

**url** : `/users/logoutAll`

**method** : `POST`

**Auth required** : YES

**Auth type** : Bearer

**Success response code** : `200 OK`

**Expected request body** : NONE

**Response** : NONE


### Get User Profile

**url** : `/users/me`

**method** : `GET`

**Auth required** : YES

**Success response code** : `200 OK`

**expected request body** : NONE

**Response** : user info


### Update User Profile

**url** : `/users/me`

**method** : `PATCH`

**Auth required** : YES

**Success response code** : `200 OK`

**expected request body** : json object including any of the fields: "name", "age", "email", "password"

```json
{
    "name": "Mike",
    "age": 45, 
    "email": "mike@xyz.com", 
    "password": "123456"
}
```

**Response** : user info


### Delete User

**url** : `/users/me`

**method** : `DELETE`

**Auth required** : YES

**Success response code** : `200 OK`

**expected request body** : NONE

**Response** : deleted user info


### Upload User Avatar Image

**url** : `/users/me/avatar`

**method** : `POST`

**Auth required** : YES

**Success response code** : `200 OK`

**expected request body** : form-data body with the key "avatar"

**Response** : NONE


### Delete User Avatar Image

**url** : `/users/me/avatar`

**method** : `DELETE`

**Auth required** : YES

**Success response code** : `200 OK`

**expected request body** : NONE

**Response** : NONE


## Tasks

### Create Task

**url** : `/tasks`

**method** : `POST`

**Auth required** : YES

**Success response code** : `201 OK`

**expected request body** : 

```json
{
    "description": "An example task",
    "completed": false
}
```
**Response** : task info


### Get Single Task

**url** : `/tasks/:taskId`

**method** : `GET`

**Auth required** : YES

**Success response code** : `200 OK`

**expected request body** : NONE

**Response** : task info


### Get All Tasks

**url** : `/tasks`

**method** : `GET`

**Auth required** : YES

**Success response code** : `200 OK`

**expected request body** : NONE

**Response** : array of tasks


### Update Task

**url** : `/tasks/:taskId`

**method** : `PATCH`

**Auth required** : YES

**Success response code** : `200 OK`

**expected request body** : json object including either or both fields: "description", "completed"

```json
{
    "description": "Another example task",
    "completed": true
}
```
**Response** : updated task info


### Delete Task

**url** : `/tasks`

**method** : `DELETE`

**Auth required** : YES

**Success response code** : `200 OK`

**expected request body** : NONE

**Response** : deleted task info