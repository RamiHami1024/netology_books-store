"use strict";
exports.__esModule = true;
require("reflect-metadata");
var inversify_1 = require("inversify");
var Books_1 = require("../Books");
var container = new inversify_1.Container();
container.bind(Books_1.BooksRepository).toSelf();
