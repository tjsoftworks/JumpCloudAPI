JumpCloud API
============

* [Introduction](#introduction)
* [Authentication](#authentication)
* [Parameters](#parameters)
* [Data structures](#data-structures)
* [Systems](#systems)
    * [the `filter` parameter](#the-filter-parameter)
* [Tags](#tags)
    * [the `search` parameter](#the-search-parameter)
* [System users](#system-users)
    * [the `search` parameter](#the-search-parameter)


## Introduction

The JumpCloud API is a REST API for retrieving and manipulating the systems, system users, and tags managed by JumpCloud.
To use the JumpCloud API, you must first [create a JumpCloud account](https://console.jumpcloud.com/register/).


## Authentication

**TODO: Add information about getting the API credentials from the JumpCloud UI and how to set the correct auth headers**

## Parameters

Most parameters can be passed to all GET, PUT, and POST methods and controls what data is returned from the API. Parameters can be passed as url query parameters or in the body of the POST or PUT method. When using PUT or POST parameters the format of the request body needs top match the Content-Type specified. The API supports both `application/json` and `application/x-www-form-urlencoded` parameter content types when using the POST or PUT method.


|Parameter|Description|Usage|
|---------|-----------------|-----|
|`limit` `skip`| `limit` will limit the returned results and `skip` will skip results.  | ` /api/systems?limit=5&skip=1` returns records 2 - 6 . |
|`sort`         | `sort` will sort results by the specified field name.                      | `/api/systems?sort=name&limit=5` returns tags sorted by hostname in ascending order. `/api/systems?sort=-name&limit=5` returns systems sorted by hostname in descending order. |
|`fields`       | `fields` is a space-separated string of field names to include or exclude from the result(s). | `/api/system/:id?fields=-patches -logins` will system records *excluding* the `patches` and `logins` fields. `/api/system/:id?fields=hostname displayName` will return system records *including only* the `hostname`, `displayName`, and `_id`. **NOTE: the `_id` field will always be returned.**  |



## Data structures

### Input data

All PUT and POST methods should use the HTTP Content-Type header with a value of 'application/json'.
PUT methods are used for updating a record and POST methods are used for adding new records.

The following example demonstrates how to update the `displayName` of the system.

```
curl -iq \
  -d "{\"displayName\" : \"updated-system-name-1\"}" \
  -X "PUT" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Date: ${now}" \
  -H "Authorization: [TODO: Add auth info] \
  --url https://console.jumpcloud.com/api/systems/${systemKey}
```


### Output data

All results will be formatted as [JSON](www.json.org). There are two kinds of output data single record and multi-record.

#### Single record output:

Example of returning a single system record.

```
{
  "__v": 0,
  "_id": "525ee96f52e144993e000015",
  "agentServer": "lappy386",
  "agentVersion": "0.9.42",
  "arch": "x86_64",
  "connectionKey": "127.0.0.1_51812",
  "displayName": "ubuntu-1204",
  "firstContact": "2013-10-16T19:30:55.611Z",
  "hostname": "ubuntu-1204"
  ...
```


#### Multi record output:

Example of returning multiple system records.

```
{
  "totalCount": 1,
  "results": [
    {
      "_id": "52e96aef8977c9010e0003c0",
      "amazonInstanceID": "",
      "arch": "x86_64",
      "displayName": "01ec40634d50",
      "hostname": "9209cad3cbff",
      "lastContact": "2014-01-29T23:16:31.870Z",
      "os": "Ubuntu",
      "version": "12.04",
      "active": true,
      ...

```

## Systems

The Systems section of the JumpCloud API allows you to retrieve, delete, and modify systems. The vast majority of system records properties are *read-only* because the JumpCloud agent, running on your systems, is the source of most of the data. There are however a some properties of a system record that can be modified allowing you to control the configuration of your systems.

### Modifiable properties

|System property                  |Type       |Description|
|---------------------------------|-----------|-----------|
|`tags`                           |*array*    | An array of tag id's that the system belongs to. Whatever is set in this list will be the new tags for the system.|
|`displayName`                    |*string*   | A string representing the name to display in the JumpCloud for the system.|
|`allowSshPasswordAuthentication` |*boolean*  |`true` will enable password based authentication and `false` will disable password based authentication for ssh logins.|
|`allowSshRootLogin`              |*boolean*  |`true` will enable root user authentication and `false` will disable root user authentication ofr ssh.|
|`allowMultiFactorAuthentication` |*boolean*  |`true` will enable multi-factor authentication and `false` will disable multi-factor authentication for ssh.|
|`allowPublicKeyAuthentication`   |*boolean*  |`true` will enable public-key authentication and `false` will disable public-key authentication for ssh.|

**Note: Adding of a system is only allowed via the Kickstart script. Log in into the [JumpCloud console](https://console.jumpcloud.com) for details.**


### Routes

|Resource                |Description|
|------------------------|-----------------------------------------------------------------------------------|
|GET /api/systems        | Get systems in [multi record format](#multi-record-output)|
|POST /api/systems       | Get systems in [multi record format](#multi-record-output) allowing for the passing of the `filter` parameter. The route WILL NOT allow you to add a new system. |
|GET /api/systems/:id    | Get a system record by `id` in [single record format](#single-record-output) |
|PUT /api/systems/:id    | Update a system record by its `id` and return the modified system record in [single record format](#single-record-output). |
|DELETE /api/systems/:id | Delete a system record by its `id`. **NOTE: This command will cause the system to uninstall the JumpCloud agent from its self which can can take about a minute. If the system is not connected to JumpCloud the system record will simply be removed** |


### The `filter` parameter

To support advanced filtering of systems there is a **`filter` parameter** that can only be passed in the body of the POST /api/systems route. The `filter` parameter must be passed as Content-Type application/json supports advanced filtering using the [mongodb JSON query syntax](http://docs.mongodb.org/manual/reference/operator/query/). The `filter` parameter is an object with a single property, either `and` or `or` with the value of the property being an array of query expressions. This allows you to filter records using the logic of matching *ALL* or *ANY* records in the array of query expressions.


#### `filter` parameter examples

Get all systems with a hostname start with "www" or "db".

```
{
"filter" :
    {
        "or" :
            [
                {"hostname" : { "$regex" : "^www" }},
                {"hostname" : {"$regex" : "^db"}}
            ]
    },
"fields" : "os hostname displayName"
}
```

Get only Ubuntu servers with a hostname starting with "www"

```
{
"filter" :
    {
        "and" :
            [
                {"hostname" : { "$regex" : "^www" }},
                {"os" : {"$regex" : "Ubuntu", $options: "i"}}
            ]
    },
"fields" : "os hostname displayName"
}
```

## Tags

The Tags section of the JumpCloud API allows you to add, retrieve, delete, and modify Tags. Tags are used to associate system users to systems and visa-versa. For example if you have system A and user A both associated to Tag A then system user A will be able to login to system A. If either the system or system user are removed from the Tag access will denied for system user A to system A.

### Modifiable properties

|System property                  |Type       |Description|Required|
|---------------------------------|-----------|-----------|:--------:|
|`name`                           |*string*   | A unique name for the Tag. | **X** |
|`systems`                        |*array*    | An array of system ids that are associated to the Tag.|
|`systemusers`                    |*array*    | An array of system user ids that are associated to the Tag.|
|`regularExpressions`             |*array*    | An array of regular expressions that when matched against a systems hostname will cause the system to be associated to the Tag.|
|`expirationTime`                 |*datetime* | A date timestamp indicating when this Tag will expire its self. When a Tag expires it will revoke any system user to system associations.|

### Routes

|Resource                |Description|
|------------------------|-----------------------------------------------------------------------------------|
|GET /api/tags           | Get tags in [multi record format](#multi-record-output)|
|POST /api/tags          | Add a new Tag and return the newly created Tag in a [single record format](#single-record-output) |
|GET /api/tags/:name     | Get a Tag record by `id` or `name` in [single record format](#single-record-output) |
|PUT /api/tags/:name     | Update a Tag record by its `id` or `name` and return the modified Tag record in a [single record format](#single-record-output). |
|DELETE /api/tags/:name  | Delete a Tag record by its `id` or `name`. |


**TODO: search needs to be replaced with filter like systems has. si-mongoose-express-rest already supports it but it needs to be added to the api.**

### The `search` parameter

To support searching for tags there is a **`search` parameter** that can only be passed in the body of the POST /api/systems route. The `filter` parameter must be passed as Content-Type application/json supports advanced filtering using the [mongodb JSON query syntax](http://docs.mongodb.org/manual/reference/operator/query/). The `filter` parameter is an object with a single property, either `and` or `or` with the value of the property being an array of query expressions. This allows you to filter records using the logic of matching *ALL* or *ANY* records in the array of query expressions.


#### `search` parameter examples


## System users

The System users section of the JumpCloud API allows you to add, retrieve, delete, and modify System users. **TODO: add more description**
### Modifiable properties

|System property                  |Type       |Description|Required|
|---------------------------------|-----------|-----------|:--------:|
|`email`                          |*string*   | TODO | **X** |
|`username`                       |*string*   | TODO | **X** |
|`password`                       |*string*   | TODO |  |
|`allow_public_key`               |*boolean*  | TODO |  |
|`passwordless_sudo`              |*boolean*  | TODO |  |
|`sudo`                           |*boolean*  | TODO |  |
|`public_key`                     |*string*   | TODO |  |
|`unix_uid`                       |*integer*  | TODO |  |
|`unix_guid`                      |*integer*  | TODO |  |
|`tags`                           |*array*    | TODO |  |

### Routes

|Resource                    |Description|
|----------------------------|-----------------------------------------------------------------------------------|
|GET /api/search/systemusers | Get System Users in [multi record format](#multi-record-output)|
|POST /api/systemusers       | Add a new System User and return the newly created System User in a [single record format](#single-record-output) |
|GET /api/systemusers/:id    | Get a System User record by `id` in [single record format](#single-record-output) |
|PUT /api/systemusers/:id    | Update a System User record by its `id` and return the modified System User record in a [single record format](#single-record-output). |
|DELETE /api/systemusers/:id | Delete a System User record by its `id`. |


**TODO: search needs to be replaced with filter like systems has. si-mongoose-express-rest already supports it but it needs to be added to the api.**

### The `search` parameter

To support searching for tags there is a **`search` parameter** that can only be passed in the body of the POST /api/systems route. The `filter` parameter must be passed as Content-Type application/json supports advanced filtering using the [mongodb JSON query syntax](http://docs.mongodb.org/manual/reference/operator/query/). The `filter` parameter is an object with a single property, either `and` or `or` with the value of the property being an array of query expressions. This allows you to filter records using the logic of matching *ALL* or *ANY* records in the array of query expressions.


#### `search` parameter examples