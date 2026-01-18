"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/langchain";
exports.ids = ["vendor-chunks/langchain"];
exports.modules = {

/***/ "(rsc)/./node_modules/langchain/dist/document_loaders/base.js":
/*!**************************************************************!*\
  !*** ./node_modules/langchain/dist/document_loaders/base.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   BaseDocumentLoader: () => (/* reexport safe */ _langchain_core_document_loaders_base__WEBPACK_IMPORTED_MODULE_0__.BaseDocumentLoader)\n/* harmony export */ });\n/* harmony import */ var _langchain_core_document_loaders_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @langchain/core/document_loaders/base */ \"(rsc)/./node_modules/@langchain/core/document_loaders/base.js\");\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbGFuZ2NoYWluL2Rpc3QvZG9jdW1lbnRfbG9hZGVycy9iYXNlLmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQXNEIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdml0ZV9yZWFjdF9zaGFkY25fdHMvLi9ub2RlX21vZHVsZXMvbGFuZ2NoYWluL2Rpc3QvZG9jdW1lbnRfbG9hZGVycy9iYXNlLmpzP2Q5NzAiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0ICogZnJvbSBcIkBsYW5nY2hhaW4vY29yZS9kb2N1bWVudF9sb2FkZXJzL2Jhc2VcIjtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/langchain/dist/document_loaders/base.js\n");

/***/ }),

/***/ "(rsc)/./node_modules/langchain/dist/document_loaders/fs/buffer.js":
/*!*******************************************************************!*\
  !*** ./node_modules/langchain/dist/document_loaders/fs/buffer.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   BufferLoader: () => (/* binding */ BufferLoader)\n/* harmony export */ });\n/* harmony import */ var _langchain_core_utils_env__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @langchain/core/utils/env */ \"(rsc)/./node_modules/@langchain/core/utils/env.js\");\n/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../base.js */ \"(rsc)/./node_modules/langchain/dist/document_loaders/base.js\");\n\n\n/**\n * Abstract class that extends the `BaseDocumentLoader` class. It\n * represents a document loader that loads documents from a buffer. The\n * `load()` method is implemented to read the buffer contents and metadata\n * based on the type of `filePathOrBlob`, and then calls the `parse()`\n * method to parse the buffer and return the documents.\n */\nclass BufferLoader extends _base_js__WEBPACK_IMPORTED_MODULE_1__.BaseDocumentLoader {\n    constructor(filePathOrBlob) {\n        super();\n        Object.defineProperty(this, \"filePathOrBlob\", {\n            enumerable: true,\n            configurable: true,\n            writable: true,\n            value: filePathOrBlob\n        });\n    }\n    /**\n     * Method that reads the buffer contents and metadata based on the type of\n     * `filePathOrBlob`, and then calls the `parse()` method to parse the\n     * buffer and return the documents.\n     * @returns Promise that resolves with an array of `Document` objects.\n     */\n    async load() {\n        let buffer;\n        let metadata;\n        if (typeof this.filePathOrBlob === \"string\") {\n            const { readFile } = await BufferLoader.imports();\n            buffer = await readFile(this.filePathOrBlob);\n            metadata = { source: this.filePathOrBlob };\n        }\n        else {\n            buffer = await this.filePathOrBlob\n                .arrayBuffer()\n                .then((ab) => Buffer.from(ab));\n            metadata = { source: \"blob\", blobType: this.filePathOrBlob.type };\n        }\n        return this.parse(buffer, metadata);\n    }\n    /**\n     * Static method that imports the `readFile` function from the\n     * `fs/promises` module in Node.js. It is used to dynamically import the\n     * function when needed. If the import fails, it throws an error\n     * indicating that the `fs/promises` module is not available in the\n     * current environment.\n     * @returns Promise that resolves with an object containing the `readFile` function.\n     */\n    static async imports() {\n        try {\n            const { readFile } = await Promise.resolve(/*! import() */).then(__webpack_require__.t.bind(__webpack_require__, /*! node:fs/promises */ \"node:fs/promises\", 19));\n            return { readFile };\n        }\n        catch (e) {\n            console.error(e);\n            throw new Error(`Failed to load fs/promises. TextLoader available only on environment 'node'. It appears you are running environment '${(0,_langchain_core_utils_env__WEBPACK_IMPORTED_MODULE_0__.getEnv)()}'. See https://<link to docs> for alternatives.`);\n        }\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbGFuZ2NoYWluL2Rpc3QvZG9jdW1lbnRfbG9hZGVycy9mcy9idWZmZXIuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQW1EO0FBQ0g7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTywyQkFBMkIsd0RBQWtCO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsV0FBVztBQUMvQjtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLFdBQVcsUUFBUSxzSUFBMEI7QUFDakUscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBLG9KQUFvSixpRUFBTSxHQUFHO0FBQzdKO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3ZpdGVfcmVhY3Rfc2hhZGNuX3RzLy4vbm9kZV9tb2R1bGVzL2xhbmdjaGFpbi9kaXN0L2RvY3VtZW50X2xvYWRlcnMvZnMvYnVmZmVyLmpzPzU5NWQiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0RW52IH0gZnJvbSBcIkBsYW5nY2hhaW4vY29yZS91dGlscy9lbnZcIjtcbmltcG9ydCB7IEJhc2VEb2N1bWVudExvYWRlciB9IGZyb20gXCIuLi9iYXNlLmpzXCI7XG4vKipcbiAqIEFic3RyYWN0IGNsYXNzIHRoYXQgZXh0ZW5kcyB0aGUgYEJhc2VEb2N1bWVudExvYWRlcmAgY2xhc3MuIEl0XG4gKiByZXByZXNlbnRzIGEgZG9jdW1lbnQgbG9hZGVyIHRoYXQgbG9hZHMgZG9jdW1lbnRzIGZyb20gYSBidWZmZXIuIFRoZVxuICogYGxvYWQoKWAgbWV0aG9kIGlzIGltcGxlbWVudGVkIHRvIHJlYWQgdGhlIGJ1ZmZlciBjb250ZW50cyBhbmQgbWV0YWRhdGFcbiAqIGJhc2VkIG9uIHRoZSB0eXBlIG9mIGBmaWxlUGF0aE9yQmxvYmAsIGFuZCB0aGVuIGNhbGxzIHRoZSBgcGFyc2UoKWBcbiAqIG1ldGhvZCB0byBwYXJzZSB0aGUgYnVmZmVyIGFuZCByZXR1cm4gdGhlIGRvY3VtZW50cy5cbiAqL1xuZXhwb3J0IGNsYXNzIEJ1ZmZlckxvYWRlciBleHRlbmRzIEJhc2VEb2N1bWVudExvYWRlciB7XG4gICAgY29uc3RydWN0b3IoZmlsZVBhdGhPckJsb2IpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwiZmlsZVBhdGhPckJsb2JcIiwge1xuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgdmFsdWU6IGZpbGVQYXRoT3JCbG9iXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBNZXRob2QgdGhhdCByZWFkcyB0aGUgYnVmZmVyIGNvbnRlbnRzIGFuZCBtZXRhZGF0YSBiYXNlZCBvbiB0aGUgdHlwZSBvZlxuICAgICAqIGBmaWxlUGF0aE9yQmxvYmAsIGFuZCB0aGVuIGNhbGxzIHRoZSBgcGFyc2UoKWAgbWV0aG9kIHRvIHBhcnNlIHRoZVxuICAgICAqIGJ1ZmZlciBhbmQgcmV0dXJuIHRoZSBkb2N1bWVudHMuXG4gICAgICogQHJldHVybnMgUHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggYW4gYXJyYXkgb2YgYERvY3VtZW50YCBvYmplY3RzLlxuICAgICAqL1xuICAgIGFzeW5jIGxvYWQoKSB7XG4gICAgICAgIGxldCBidWZmZXI7XG4gICAgICAgIGxldCBtZXRhZGF0YTtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmZpbGVQYXRoT3JCbG9iID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBjb25zdCB7IHJlYWRGaWxlIH0gPSBhd2FpdCBCdWZmZXJMb2FkZXIuaW1wb3J0cygpO1xuICAgICAgICAgICAgYnVmZmVyID0gYXdhaXQgcmVhZEZpbGUodGhpcy5maWxlUGF0aE9yQmxvYik7XG4gICAgICAgICAgICBtZXRhZGF0YSA9IHsgc291cmNlOiB0aGlzLmZpbGVQYXRoT3JCbG9iIH07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBidWZmZXIgPSBhd2FpdCB0aGlzLmZpbGVQYXRoT3JCbG9iXG4gICAgICAgICAgICAgICAgLmFycmF5QnVmZmVyKClcbiAgICAgICAgICAgICAgICAudGhlbigoYWIpID0+IEJ1ZmZlci5mcm9tKGFiKSk7XG4gICAgICAgICAgICBtZXRhZGF0YSA9IHsgc291cmNlOiBcImJsb2JcIiwgYmxvYlR5cGU6IHRoaXMuZmlsZVBhdGhPckJsb2IudHlwZSB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlKGJ1ZmZlciwgbWV0YWRhdGEpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTdGF0aWMgbWV0aG9kIHRoYXQgaW1wb3J0cyB0aGUgYHJlYWRGaWxlYCBmdW5jdGlvbiBmcm9tIHRoZVxuICAgICAqIGBmcy9wcm9taXNlc2AgbW9kdWxlIGluIE5vZGUuanMuIEl0IGlzIHVzZWQgdG8gZHluYW1pY2FsbHkgaW1wb3J0IHRoZVxuICAgICAqIGZ1bmN0aW9uIHdoZW4gbmVlZGVkLiBJZiB0aGUgaW1wb3J0IGZhaWxzLCBpdCB0aHJvd3MgYW4gZXJyb3JcbiAgICAgKiBpbmRpY2F0aW5nIHRoYXQgdGhlIGBmcy9wcm9taXNlc2AgbW9kdWxlIGlzIG5vdCBhdmFpbGFibGUgaW4gdGhlXG4gICAgICogY3VycmVudCBlbnZpcm9ubWVudC5cbiAgICAgKiBAcmV0dXJucyBQcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2l0aCBhbiBvYmplY3QgY29udGFpbmluZyB0aGUgYHJlYWRGaWxlYCBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICBzdGF0aWMgYXN5bmMgaW1wb3J0cygpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHsgcmVhZEZpbGUgfSA9IGF3YWl0IGltcG9ydChcIm5vZGU6ZnMvcHJvbWlzZXNcIik7XG4gICAgICAgICAgICByZXR1cm4geyByZWFkRmlsZSB9O1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gbG9hZCBmcy9wcm9taXNlcy4gVGV4dExvYWRlciBhdmFpbGFibGUgb25seSBvbiBlbnZpcm9ubWVudCAnbm9kZScuIEl0IGFwcGVhcnMgeW91IGFyZSBydW5uaW5nIGVudmlyb25tZW50ICcke2dldEVudigpfScuIFNlZSBodHRwczovLzxsaW5rIHRvIGRvY3M+IGZvciBhbHRlcm5hdGl2ZXMuYCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/langchain/dist/document_loaders/fs/buffer.js\n");

/***/ }),

/***/ "(rsc)/./node_modules/langchain/dist/text_splitter.js":
/*!******************************************************!*\
  !*** ./node_modules/langchain/dist/text_splitter.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   CharacterTextSplitter: () => (/* reexport safe */ _langchain_textsplitters__WEBPACK_IMPORTED_MODULE_0__.CharacterTextSplitter),\n/* harmony export */   LatexTextSplitter: () => (/* reexport safe */ _langchain_textsplitters__WEBPACK_IMPORTED_MODULE_0__.LatexTextSplitter),\n/* harmony export */   MarkdownTextSplitter: () => (/* reexport safe */ _langchain_textsplitters__WEBPACK_IMPORTED_MODULE_0__.MarkdownTextSplitter),\n/* harmony export */   RecursiveCharacterTextSplitter: () => (/* reexport safe */ _langchain_textsplitters__WEBPACK_IMPORTED_MODULE_0__.RecursiveCharacterTextSplitter),\n/* harmony export */   SupportedTextSplitterLanguages: () => (/* reexport safe */ _langchain_textsplitters__WEBPACK_IMPORTED_MODULE_0__.SupportedTextSplitterLanguages),\n/* harmony export */   TextSplitter: () => (/* reexport safe */ _langchain_textsplitters__WEBPACK_IMPORTED_MODULE_0__.TextSplitter),\n/* harmony export */   TokenTextSplitter: () => (/* reexport safe */ _langchain_textsplitters__WEBPACK_IMPORTED_MODULE_0__.TokenTextSplitter)\n/* harmony export */ });\n/* harmony import */ var _langchain_textsplitters__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @langchain/textsplitters */ \"(rsc)/./node_modules/@langchain/textsplitters/index.js\");\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbGFuZ2NoYWluL2Rpc3QvdGV4dF9zcGxpdHRlci5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUF5QyIsInNvdXJjZXMiOlsid2VicGFjazovL3ZpdGVfcmVhY3Rfc2hhZGNuX3RzLy4vbm9kZV9tb2R1bGVzL2xhbmdjaGFpbi9kaXN0L3RleHRfc3BsaXR0ZXIuanM/NzEwOCJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgKiBmcm9tIFwiQGxhbmdjaGFpbi90ZXh0c3BsaXR0ZXJzXCI7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/langchain/dist/text_splitter.js\n");

/***/ }),

/***/ "(rsc)/./node_modules/langchain/document_loaders/fs/buffer.js":
/*!**************************************************************!*\
  !*** ./node_modules/langchain/document_loaders/fs/buffer.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BufferLoader: () => (/* reexport safe */ _dist_document_loaders_fs_buffer_js__WEBPACK_IMPORTED_MODULE_0__.BufferLoader)
/* harmony export */ });
/* harmony import */ var _dist_document_loaders_fs_buffer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../dist/document_loaders/fs/buffer.js */ "(rsc)/./node_modules/langchain/dist/document_loaders/fs/buffer.js");


/***/ }),

/***/ "(rsc)/./node_modules/langchain/text_splitter.js":
/*!*************************************************!*\
  !*** ./node_modules/langchain/text_splitter.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CharacterTextSplitter: () => (/* reexport safe */ _dist_text_splitter_js__WEBPACK_IMPORTED_MODULE_0__.CharacterTextSplitter),
/* harmony export */   LatexTextSplitter: () => (/* reexport safe */ _dist_text_splitter_js__WEBPACK_IMPORTED_MODULE_0__.LatexTextSplitter),
/* harmony export */   MarkdownTextSplitter: () => (/* reexport safe */ _dist_text_splitter_js__WEBPACK_IMPORTED_MODULE_0__.MarkdownTextSplitter),
/* harmony export */   RecursiveCharacterTextSplitter: () => (/* reexport safe */ _dist_text_splitter_js__WEBPACK_IMPORTED_MODULE_0__.RecursiveCharacterTextSplitter),
/* harmony export */   SupportedTextSplitterLanguages: () => (/* reexport safe */ _dist_text_splitter_js__WEBPACK_IMPORTED_MODULE_0__.SupportedTextSplitterLanguages),
/* harmony export */   TextSplitter: () => (/* reexport safe */ _dist_text_splitter_js__WEBPACK_IMPORTED_MODULE_0__.TextSplitter),
/* harmony export */   TokenTextSplitter: () => (/* reexport safe */ _dist_text_splitter_js__WEBPACK_IMPORTED_MODULE_0__.TokenTextSplitter)
/* harmony export */ });
/* harmony import */ var _dist_text_splitter_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dist/text_splitter.js */ "(rsc)/./node_modules/langchain/dist/text_splitter.js");


/***/ })

};
;