"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
// imports
var axios_1 = __importDefault(require("axios"));
var BITBOX_1 = require("./BITBOX");
// consts
// TODO: port require statements to impprt
var Bitcoin = require("@bitcoin-dot-com/bitcoincashjs2-lib");
var cashaddr = require("cashaddrjs");
var coininfo = require("coininfo");
var Address = /** @class */ (function () {
    function Address(restURL) {
        if (restURL === void 0) { restURL = BITBOX_1.REST_URL; }
        this.restURL = restURL;
    }
    // Translate address from any address format into a specific format.
    Address.prototype.toLegacyAddress = function (address) {
        var _a = this._decode(address), prefix = _a.prefix, type = _a.type, hash = _a.hash;
        var bitcoincash = coininfo.bitcoincash.main;
        switch (prefix) {
            case "bitcoincash":
                bitcoincash = coininfo.bitcoincash.main;
                break;
            case "bchtest":
                bitcoincash = coininfo.bitcoincash.test;
                break;
            case "bchreg":
                bitcoincash = coininfo.bitcoincash.regtest;
                break;
        }
        var version = bitcoincash.versions.public;
        switch (type) {
            case "P2PKH":
                version = bitcoincash.versions.public;
                break;
            case "P2SH":
                version = bitcoincash.versions.scripthash;
                break;
        }
        var hashBuf = Buffer.from(hash);
        return Bitcoin.address.toBase58Check(hashBuf, version);
    };
    Address.prototype.toCashAddress = function (address, prefix, regtest) {
        if (prefix === void 0) { prefix = true; }
        if (regtest === void 0) { regtest = false; }
        var decoded = this._decode(address);
        var prefixString;
        if (regtest)
            prefixString = "bchreg";
        else
            prefixString = decoded.prefix;
        var cashAddress = cashaddr.encode(prefixString, decoded.type, decoded.hash);
        if (prefix)
            return cashAddress;
        return cashAddress.split(":")[1];
    };
    // Converts legacy address format to hash160
    Address.prototype.legacyToHash160 = function (address) {
        var bytes = Bitcoin.address.fromBase58Check(address);
        return bytes.hash.toString("hex");
    };
    // Converts cash address format to hash160
    Address.prototype.cashToHash160 = function (address) {
        var legacyAddress = this.toLegacyAddress(address);
        var bytes = Bitcoin.address.fromBase58Check(legacyAddress);
        return bytes.hash.toString("hex");
    };
    // Converts regtest address format to hash160
    // regtestToHash160(address: string): string {
    //   const legacyAddress = this.toLegacyAddress(address)
    //   const bytes = Bitcoin.address.fromBase58Check(legacyAddress)
    //   return bytes.hash.toString("hex")
    // }
    // Converts hash160 to Legacy Address
    Address.prototype.hash160ToLegacy = function (hash160, network) {
        if (network === void 0) { network = Bitcoin.networks.bitcoin.pubKeyHash; }
        var buffer = Buffer.from(hash160, "hex");
        return Bitcoin.address.toBase58Check(buffer, network);
    };
    // Converts hash160 to Cash Address
    Address.prototype.hash160ToCash = function (hash160, network, regtest) {
        if (network === void 0) { network = Bitcoin.networks.bitcoin.pubKeyHash; }
        if (regtest === void 0) { regtest = false; }
        var legacyAddress = this.hash160ToLegacy(hash160, network);
        return this.toCashAddress(legacyAddress, true, regtest);
    };
    Address.prototype.isLegacyAddress = function (address) {
        return this.detectAddressFormat(address) === "legacy";
    };
    Address.prototype.isCashAddress = function (address) {
        return this.detectAddressFormat(address) === "cashaddr";
    };
    Address.prototype.isHash160 = function (address) {
        return this._detectHash160Format(address) === "hash160";
    };
    // Test for address network.
    Address.prototype.isMainnetAddress = function (address) {
        if (address[0] === "x")
            return true;
        else if (address[0] === "t")
            return false;
        return this.detectAddressNetwork(address) === "mainnet";
    };
    Address.prototype.isTestnetAddress = function (address) {
        if (address[0] === "x")
            return false;
        else if (address[0] === "t")
            return true;
        return this.detectAddressNetwork(address) === "testnet";
    };
    Address.prototype.isRegTestAddress = function (address) {
        return this.detectAddressNetwork(address) === "regtest";
    };
    // Test for address type.
    Address.prototype.isP2PKHAddress = function (address) {
        return this.detectAddressType(address) === "p2pkh";
    };
    Address.prototype.isP2SHAddress = function (address) {
        return this.detectAddressType(address) === "p2sh";
    };
    Address.prototype.detectAddressFormat = function (address) {
        var decoded = this._decode(address);
        return decoded.format;
    };
    Address.prototype.detectAddressNetwork = function (address) {
        if (address[0] === "x")
            return "mainnet";
        else if (address[0] === "t")
            return "testnet";
        var decoded = this._decode(address);
        var prefix = "";
        switch (decoded.prefix) {
            case "bitcoincash":
                prefix = "mainnet";
                break;
            case "bchtest":
                prefix = "testnet";
                break;
            case "bchreg":
                prefix = "regtest";
                break;
        }
        return prefix;
    };
    Address.prototype.detectAddressType = function (address) {
        var decoded = this._decode(address);
        return decoded.type.toLowerCase();
    };
    Address.prototype.fromXPub = function (xpub, path) {
        if (path === void 0) { path = "0/0"; }
        var bitcoincash;
        if (xpub[0] === "x")
            bitcoincash = coininfo.bitcoincash.main;
        else
            bitcoincash = coininfo.bitcoincash.test;
        var bitcoincashBitcoinJSLib = bitcoincash.toBitcoinJS();
        var HDNode = Bitcoin.HDNode.fromBase58(xpub, bitcoincashBitcoinJSLib);
        var address = HDNode.derivePath(path);
        return this.toCashAddress(address.getAddress());
    };
    Address.prototype.fromXPriv = function (xpriv, path) {
        if (path === void 0) { path = "0'/0"; }
        var bitcoincash;
        if (xpriv[0] === "x")
            bitcoincash = coininfo.bitcoincash.main;
        else
            bitcoincash = coininfo.bitcoincash.test;
        var bitcoincashBitcoinJSLib = bitcoincash.toBitcoinJS();
        var HDNode = Bitcoin.HDNode.fromBase58(xpriv, bitcoincashBitcoinJSLib);
        var address = HDNode.derivePath(path);
        return this.toCashAddress(address.getAddress());
    };
    Address.prototype.fromOutputScript = function (scriptPubKey, network) {
        if (network === void 0) { network = "mainnet"; }
        var netParam;
        if (network !== "bitcoincash" && network !== "mainnet")
            netParam = Bitcoin.networks.testnet;
        var regtest = network === "bchreg";
        return this.toCashAddress(Bitcoin.address.fromOutputScript(scriptPubKey, netParam), true, regtest);
    };
    Address.prototype.details = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var response, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!(typeof address === "string")) return [3 /*break*/, 2];
                        return [4 /*yield*/, axios_1.default.get(this.restURL + "address/details/" + address)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data
                            // Handle array of addresses.
                        ];
                    case 2:
                        if (!Array.isArray(address)) return [3 /*break*/, 4];
                        return [4 /*yield*/, axios_1.default.post(this.restURL + "address/details", {
                                addresses: address
                            })];
                    case 3:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 4: throw new Error("Input address must be a string or array of strings.");
                    case 5:
                        error_1 = _a.sent();
                        if (error_1.response && error_1.response.data)
                            throw error_1.response.data;
                        else
                            throw error_1;
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Address.prototype.utxo = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var response, response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!(typeof address === "string")) return [3 /*break*/, 2];
                        return [4 /*yield*/, axios_1.default.get(this.restURL + "address/utxo/" + address)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        if (!Array.isArray(address)) return [3 /*break*/, 4];
                        return [4 /*yield*/, axios_1.default.post(this.restURL + "address/utxo", {
                                addresses: address
                            })];
                    case 3:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 4: throw new Error("Input address must be a string or array of strings.");
                    case 5:
                        error_2 = _a.sent();
                        if (error_2.response && error_2.response.data)
                            throw error_2.response.data;
                        else
                            throw error_2;
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Address.prototype.unconfirmed = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var response, response, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!(typeof address === "string")) return [3 /*break*/, 2];
                        return [4 /*yield*/, axios_1.default.get(this.restURL + "address/unconfirmed/" + address)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data
                            // Handle an array of addresses
                        ];
                    case 2:
                        if (!Array.isArray(address)) return [3 /*break*/, 4];
                        return [4 /*yield*/, axios_1.default.post(this.restURL + "address/unconfirmed", {
                                addresses: address
                            })];
                    case 3:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 4: throw new Error("Input address must be a string or array of strings.");
                    case 5:
                        error_3 = _a.sent();
                        if (error_3.response && error_3.response.data)
                            throw error_3.response.data;
                        else
                            throw error_3;
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Address.prototype.transactions = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var response, response, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!(typeof address === "string")) return [3 /*break*/, 2];
                        return [4 /*yield*/, axios_1.default.get(this.restURL + "address/transactions/" + address)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data
                            // Handle an array of addresses
                        ];
                    case 2:
                        if (!Array.isArray(address)) return [3 /*break*/, 4];
                        return [4 /*yield*/, axios_1.default.post(this.restURL + "address/transactions", {
                                addresses: address
                            })];
                    case 3:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 4: throw new Error("Input address must be a string or array of strings.");
                    case 5:
                        error_4 = _a.sent();
                        if (error_4.response && error_4.response.data)
                            throw error_4.response.data;
                        else
                            throw error_4;
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Address.prototype._detectHash160Format = function (address) {
        var decoded = this._decodeHash160(address);
        return decoded.format;
    };
    Address.prototype._decode = function (address) {
        try {
            return this._decodeLegacyAddress(address);
        }
        catch (error) { }
        try {
            return this._decodeCashAddress(address);
        }
        catch (error) { }
        throw new Error("Unsupported address format : " + address);
    };
    Address.prototype._decodeHash160 = function (address) {
        try {
            return this._decodeAddressFromHash160(address);
        }
        catch (error) { }
        throw new Error("Unsupported address format : " + address);
    };
    Address.prototype._decodeLegacyAddress = function (address) {
        var _a = Bitcoin.address.fromBase58Check(address), version = _a.version, hash = _a.hash;
        var info = coininfo.bitcoincash;
        var decoded = {
            prefix: "",
            type: "",
            hash: hash,
            format: ""
        };
        switch (version) {
            case info.main.versions.public:
                decoded = {
                    prefix: "bitcoincash",
                    type: "P2PKH",
                    hash: hash,
                    format: "legacy"
                };
                break;
            case info.main.versions.scripthash:
                decoded = {
                    prefix: "bitcoincash",
                    type: "P2SH",
                    hash: hash,
                    format: "legacy"
                };
                break;
            case info.test.versions.public:
                decoded = {
                    prefix: "bchtest",
                    type: "P2PKH",
                    hash: hash,
                    format: "legacy"
                };
                break;
            case info.test.versions.scripthash:
                decoded = {
                    prefix: "bchtest",
                    type: "P2SH",
                    hash: hash,
                    format: "legacy"
                };
                break;
        }
        return decoded;
    };
    Address.prototype._decodeCashAddress = function (address) {
        if (address.indexOf(":") !== -1) {
            var decoded = cashaddr.decode(address);
            decoded.format = "cashaddr";
            return decoded;
        }
        var prefixes = ["bitcoincash", "bchtest", "bchreg"];
        for (var i = 0; i < prefixes.length; ++i) {
            try {
                var decoded = cashaddr.decode(prefixes[i] + ":" + address);
                decoded.format = "cashaddr";
                return decoded;
            }
            catch (error) { }
        }
        throw new Error("Invalid format : " + address);
    };
    Address.prototype._decodeAddressFromHash160 = function (address) {
        var decodedHash160 = {
            legacyAddress: "",
            cashAddress: "",
            format: ""
        };
        if (address.length === 40) {
            decodedHash160 = {
                legacyAddress: this.hash160ToLegacy(address),
                cashAddress: this.hash160ToCash(address),
                format: "hash160"
            };
        }
        else if (this.isCashAddress(address) || this.isLegacyAddress(address)) {
            decodedHash160 = {
                legacyAddress: this.toLegacyAddress(address),
                cashAddress: this.toCashAddress(address),
                format: "nonHash160"
            };
        }
        return decodedHash160;
    };
    return Address;
}());
exports.Address = Address;
//# sourceMappingURL=Address.js.map