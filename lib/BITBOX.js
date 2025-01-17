"use strict";
/// <reference path="./interfaces/vendors.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
exports.BITBOX = exports.TBITDB_URL = exports.BITDB_URL = exports.TREST_URL = exports.REST_URL = exports.TBITSOCKET_URL = exports.BITSOCKET_URL = exports.TWS_URL = exports.WS_URL = void 0;
// imports
var Address_1 = require("./Address");
var BitcoinCash_1 = require("./BitcoinCash");
var BitDB_1 = require("./BitDB");
var Block_1 = require("./Block");
var Blockchain_1 = require("./Blockchain");
var CashAccounts_1 = require("./CashAccounts");
var Control_1 = require("./Control");
var Crypto_1 = require("./Crypto");
var ECPair_1 = require("./ECPair");
var Generating_1 = require("./Generating");
var HDNode_1 = require("./HDNode");
var Mining_1 = require("./Mining");
var Mnemonic_1 = require("./Mnemonic");
var Price_1 = require("./Price");
var RawTransactions_1 = require("./RawTransactions");
var Schnorr_1 = require("./Schnorr");
var Script_1 = require("./Script");
var Socket_1 = require("./Socket");
var Transaction_1 = require("./Transaction");
var TransactionBuilder_1 = require("./TransactionBuilder");
var Util_1 = require("./Util");
// Defaults
exports.WS_URL = "wss://ws.bitcoin.com";
exports.TWS_URL = "wss://tws.bitcoin.com";
exports.BITSOCKET_URL = "https://bitsocket.bch.sx";
exports.TBITSOCKET_URL = "https://tbitsocket.bitcoin.com";
exports.REST_URL = "https://rest.bitcoin.com/v2/";
exports.TREST_URL = "https://trest.bitcoin.com/v2/";
exports.BITDB_URL = "https://bitdb.bitcoin.com/";
exports.TBITDB_URL = "https://tbitdb.bitcoin.com/";
var BITBOX = /** @class */ (function () {
    function BITBOX(config) {
        if (config === void 0) { config = {}; }
        if (config && config.restURL && config.restURL !== "")
            this.restURL = config.restURL;
        else
            this.restURL = exports.REST_URL;
        if (config && config.wsURL && config.wsURL !== "")
            this.wsURL = config.wsURL;
        else
            this.wsURL = exports.WS_URL;
        if (config && config.bitdbURL && config.bitdbURL !== "")
            this.bitdbURL = config.bitdbURL;
        else
            this.bitdbURL = exports.BITDB_URL;
        this.Address = new Address_1.Address(this.restURL);
        this.BitcoinCash = new BitcoinCash_1.BitcoinCash(this.Address);
        this.BitDB = new BitDB_1.BitDB(this.bitdbURL);
        this.Block = new Block_1.Block(this.restURL);
        this.Blockchain = new Blockchain_1.Blockchain(this.restURL);
        this.CashAccounts = new CashAccounts_1.CashAccounts(this.restURL);
        this.Control = new Control_1.Control(this.restURL);
        this.Crypto = new Crypto_1.Crypto();
        this.ECPair = new ECPair_1.ECPair(this.Address);
        this.Generating = new Generating_1.Generating(this.restURL);
        this.HDNode = new HDNode_1.HDNode(this.Address);
        this.Mining = new Mining_1.Mining(this.restURL);
        this.Mnemonic = new Mnemonic_1.Mnemonic(this.Address);
        this.Price = new Price_1.Price();
        this.RawTransactions = new RawTransactions_1.RawTransactions(this.restURL);
        this.Script = new Script_1.Script();
        this.Transaction = new Transaction_1.Transaction(this.restURL);
        this.TransactionBuilder = TransactionBuilder_1.TransactionBuilder;
        this.Util = new Util_1.Util(this.restURL);
        this.Socket = Socket_1.Socket;
        this.Schnorr = new Schnorr_1.Schnorr();
    }
    return BITBOX;
}());
exports.BITBOX = BITBOX;
//# sourceMappingURL=BITBOX.js.map