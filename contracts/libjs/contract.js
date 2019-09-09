'use strict';

var esprima = require('esprima/dist/esprima.js');
var escodegen = require('escodegen');

var lang = "javascript";
var version = "1.0.0";

function isStaticConstantsDecl(stat){
	if (!stat || stat === null) {
		return false;
	}
	if (stat.type === "VariableDeclaration") {
		
		if(stat.declarations[0].init&&stat.declarations[0].init.type ==='CallExpression'||
		stat.declarations[0].id&&stat.declarations[0].id.name ==='blockchain'||
		stat.declarations[0].id&&stat.declarations[0].id.name ==='storage'
		){
			return false;
		}
		
		return true;
	}
	return false;
}

function isClassDecl(stat) {
	if (!stat || stat === null) {
		return false;
	}
	if (stat.type === "ClassDeclaration") {
		return true;
	}
	return false;
}

function isExport(stat) {
	if (!stat || stat === null) {
		return false;
	}
	if (stat.type === "AssignmentExpression" && stat.left.type === "MemberExpression" &&
			stat.left.object.type === "Identifier" && stat.left.object.name === "module" &&
			stat.left.property.type === "Identifier" && stat.left.property.name === "exports") {
		return true;
	}
	return false;
}

function getExportName(stat) {
	if (stat.right.type != "Identifier") {
		throw "module.exports should be assigned to an identifier";
	}
	return stat.right.name;
}

function isPublicMethod(def) {
	return def.key.type === "Identifier" && def.value.type === "FunctionExpression" && !def.key.name.startsWith("_");
}

function genAbi(def) {
	var abi = {
		"name": def.key.name,
		"args": new Array(def.value.params.length).fill("string")
	};
	return abi;
}

function genAbiArr(stat) {
	var abiArr = [];
	if (!isClassDecl(stat) || stat.body.type !== "ClassBody") {
		console.error("invalid statment for generate abi. stat = " + stat);
		return null;
	}
	var initFound = false;
	for (var i in stat.body.body) {
		var def = stat.body.body[i];
		if (def.type === "MethodDefinition" && isPublicMethod(def)) {
			if (def.key.name == "constructor") {
			} else if (def.key.name == "init") {
				initFound = true;
			} else {
				abiArr.push(genAbi(def));
			}
		}
	}
	if (!initFound) {
		console.error("init not found!");
		return null;
	}
	return abiArr;
}

function processContract(source) {
	var newSource, abi;
    var ast = esprima.parseModule(source, {
		range: true,
		loc: true,
		tokens: true
	});

	var abiArr = [];
	if (!ast || ast === null || !ast.body || ast.body === null || ast.body.length === 0) {
		console.error("invalid source! ast = " + ast);
		return ["", ""]
	}
	var validRange = [];
	var className;
	for (var i in ast.body) {
		var stat = ast.body[i];
		if (isStaticConstantsDecl(stat)){
			validRange.push(stat.range);
		}else if (isClassDecl(stat)) {
			validRange.push(stat.range);
		}else if (stat.type === "ExpressionStatement" && isExport(stat.expression)) {
			validRange.push(stat.range);
			className = getExportName(stat.expression);
		}
	}

	for (var i in ast.body) {
		var stat = ast.body[i];

		if (isClassDecl(stat) && stat.id.type == "Identifier" && stat.id.name == className) {
			abiArr = genAbiArr(stat);
		}
	}

	newSource = '\"use strict\";\n';
	for (var i in validRange) {
		var r = validRange[i];
    	newSource += source.slice(r[0], r[1]) + "\n";
	}
	newSource = escodegen.generate( esprima.parse(newSource));

	var abi = {};
	abi["lang"] = lang;
	abi["version"] = version;
	abi["abi"] = abiArr;
	var abiStr = JSON.stringify(abi, null, 4); 

	return [newSource, abiStr]
}
module.exports = processContract;
