"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = catchFunction;
function catchFunction(fn) {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}
