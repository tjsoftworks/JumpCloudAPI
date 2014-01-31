JumpCloud API
============

* [Introduction](#introduction)
* [Authentication](#authentication)
* [Parameters](#parameters)
* [Data structures](#data-structures)
* [Systems](#systems)
* [Tags](#tags)
* [System users](#system-users)
### Introduction

The JumpCloud API is a REST API for retrieving and manipulating the systems, system users, and tags managed by JumpCloud.
To use the JumpCloud API, you must first [create a JumpCloud account](https://console.jumpcloud.com/register/).


### Authentication

**TODO: Add information about getting the API credentials from the JumpCloud UI and how to set the correct auth headers**

### Parameters

Parameters can be passed to all GET, PUT, and POST methods and controls what data is returned from the API. There are two kinds of parameters that can be used **Common parameters** and **Filter parameters**. Common parameters can be passed as url query parameters or in the body of the POST or PUT method. Filter parameters can only be passed in the body of POST or PUT methods. When using PUT or POST parameters the format of the request body needs top match the Content-Type specified as the API supports both JSON and http form parameter content types.

#### Common parameters
|Parameter(s)|Description|Usage|
|---------|-----------------|-----|
|`limit` `skip`| `limit` will limit the returned results and `skip` will skip results.  | ` /api/systems?limit=5&skip=1` returns records 2 - 6 . |
|`sort`         | `sort` will sort results by the specified field name.                      | `/api/systems?sort=name&limit=5` returns tags sorted by hostname in ascending order. `/api/systems?sort=-name&limit=5` returns systems sorted by hostname in descending order. |
|`fields`       | `fields` is a space-separated string of field names to include or exclude from the result(s). | `/api/system/:id?fields=-patches -logins` |

#### Filter parameters
|Parameter(s)|Description|Usage|
|||


### Data structures

#### Input data

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


#### Output data

All results will be formatted as [JSON](www.json.org). There are two kinds of output data single record and multi-record.

##### Single record output:

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


##### Multi-record output:

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

### Systems

The Systems section of the JumpCloud API allows you to retrieve, delete, and modify attributes of the system.

**Note: Adding of a system is only allowed via the Kickstart script. Log in into the [JumpCloud console](https://console.jumpcloud.com) for details.**
#### Routes

|Resource|Description|
|--------|-----------|
|[GET /api/systems](#get-apisystems)| [TODO: ADD DESCRIPTION] |
|[POST /api/systems](#post-apisystems)| [TODO: ADD DESCRIPTION] |
|[GET /api/systems/:id](#get-apisystemsid)| [TODO: ADD DESCRIPTION] |
|[PUT /api/systems/:id](#put-apisystemsid)| [TODO: ADD DESCRIPTION] |
|[DELETE /api/systems/:id](#delete-apisystemsid)| [TODO: ADD DESCRIPTION] |


### Tags

**TODO: add routes and content**

### System users

**TODO: add routes and content**