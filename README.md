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

**allowed fields** : "name", "age", "email", "password"

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


## TASKS
