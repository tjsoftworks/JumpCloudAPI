#!/usr/bin/env node
/**
 * Created by kberg on 2/7/14.
 */

var util = require('util'),
  async = require('async'),
  request = require('superagent');

var apiKey = "80bc62abdf35d503201764a50bfce25569abaf92";
var username = null,
  tags = [],
//baseUrl = "https://console.jumpcloud.com",
  baseUrl = "http://localhost:3004";


process.argv.forEach(function (val, index, array) {
  if (index == 2) {
    username = val;
  } else if (index > 2) {
    tags.push(val);
  }
});

if (!username || tags.length == 0) {
  console.error("a user and at least one tag is required");
  console.error("usage: assign-user-to-tags.js <username> <tag> <tag> ...");
  process.exit(1);
}

//TODO: replace this the real auth
//set the authorization header
var headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'x-api-key': apiKey
};

//callback handler for superagent
function createCB(cb) {
  return function (err, res) {
    cb(err, res);
  }
}

function updateUser() {

  async.waterfall([
    function (cb) {
      //search for a user by user name
      request
        .post(util.format('%s/api/search/systemusers', baseUrl))
        .set(headers)
        .send({filter: [
          {username: username}
        ]})
        .end(createCB(cb));
    },
    function (res, cb) {

      if (res.ok) {

        if (res.body.totalCount == 1) {

          //fetch single user record returning the users associated tags
          request
            .get(util.format("%s/api/systemusers/%s", baseUrl, res.body.results[0]._id))
            .set(headers)
            .end(createCB(cb));

        } else {
          cb(new Error(util.format("user not found")));
        }

      } else {
        cb(new Error(res.statusCode + " : " + res.text));
      }

    },
    function (res, cb) {

      if (res.ok) {

        if (res.body) {
          var systemuser = res.body;

          //print existing user record
          console.log("CURRENT: " + JSON.stringify(systemuser, null, "  "));

          //add tags to system users tag array
          tags.forEach(function (t) {
            systemuser.tags.push(t);
          });

          //update system user record with new tags
          request
            .put(util.format("%s/api/systemusers/%s", baseUrl, res.body._id))
            .set(headers)
            .send(systemuser)
            .end(createCB(cb));

        }
      } else {
        cb(new Error(res.statusCode + " : " + res.text));
      }

    }
  ],
    function (err, res) {
      if (err) return console.error(err);
      if (res.ok) {

        //print out updated user record
        if (res.body) {
          console.log("UPDATED: " + JSON.stringify(res.body, null, "  "));
        }
      } else {
        console.error(new Error(res.statusCode + " : " + res.text));
      }

    });
}

updateUser();


