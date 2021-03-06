/* eslint-disable no-unused-vars */
function db_fill(req,res){
	var unitTestsHelpers = require('./unit-test-helper');
	var result = unitTestsHelpers.db.fill();
	res.headers["Content-Type"] = "application/json";
	res.body = JSON.stringify(result);
}

function db_flush(req,res){
	var unitTestsHelpers = require('./unit-test-helper');
	var result = unitTestsHelpers.db.clear();
	res.headers["Content-Type"] = "application/json";
	res.body = JSON.stringify(result);
}

function db_reset(req,res){
	var unitTestsHelpers = require('./unit-test-helper');
	var result = unitTestsHelpers.db.reset();
	res.headers["Content-Type"] = "application/json";
	res.body = JSON.stringify(result);
}

function db_state(req,res){
	var unitTestsHelpers = require('./unit-test-helper');
	var result = unitTestsHelpers.db.state();
	res.headers["Content-Type"] = "application/json";
	res.body = JSON.stringify(result);
}