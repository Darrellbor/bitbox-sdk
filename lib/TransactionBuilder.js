"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionBuilder = void 0;
var Address_1 = require("./Address");
var BITBOX_1 = require("./BITBOX");
// consts
var Bitcoin = require("@bitcoin-dot-com/bitcoincashjs2-lib");
var coininfo = require("coininfo");
var bip66 = require("bip66");
var bip68 = require("bc-bip68");
var TransactionBuilder = /** @class */ (function () {
    function TransactionBuilder(network) {
        if (network === void 0) { network = "mainnet"; }
        var bitcoincash;
        if (network === "mainnet") {
            this._address = new Address_1.Address();
        }
        else {
            this._address = new Address_1.Address(BITBOX_1.TREST_URL);
        }
        if (network === "bitcoincash" || network === "mainnet")
            bitcoincash = coininfo.bitcoincash.main;
        else
            bitcoincash = coininfo.bitcoincash.test;
        var bitcoincashBitcoinJSLib = bitcoincash.toBitcoinJS();
        this.transaction = new Bitcoin.TransactionBuilder(bitcoincashBitcoinJSLib);
        this.DEFAULT_SEQUENCE = 0xffffffff;
        this.hashTypes = {
            SIGHASH_ALL: 0x01,
            SIGHASH_NONE: 0x02,
            SIGHASH_SINGLE: 0x03,
            SIGHASH_ANYONECANPAY: 0x80,
            SIGHASH_BITCOINCASH_BIP143: 0x40,
            ADVANCED_TRANSACTION_MARKER: 0x00,
            ADVANCED_TRANSACTION_FLAG: 0x01
        };
        this.signatureAlgorithms = {
            ECDSA: Bitcoin.ECSignature.ECDSA,
            SCHNORR: Bitcoin.ECSignature.SCHNORR
        };
        this.bip66 = bip66;
        this.bip68 = bip68;
        this.p2shInput = false;
        this.tx;
    }
    TransactionBuilder.prototype.addInput = function (txHash, vout, sequence, prevOutScript) {
        if (sequence === void 0) { sequence = this.DEFAULT_SEQUENCE; }
        if (prevOutScript === void 0) { prevOutScript = null; }
        this.transaction.addInput(txHash, vout, sequence, prevOutScript);
    };
    TransactionBuilder.prototype.addInputScript = function (vout, script) {
        this.tx = this.transaction.buildIncomplete();
        this.tx.setInputScript(vout, script);
        this.p2shInput = true;
    };
    TransactionBuilder.prototype.addInputScripts = function (scripts) {
        var _this = this;
        this.tx = this.transaction.buildIncomplete();
        scripts.forEach(function (script) {
            _this.tx.setInputScript(script.vout, script.script);
        });
        this.p2shInput = true;
    };
    TransactionBuilder.prototype.addOutput = function (scriptPubKey, amount) {
        try {
            this.transaction.addOutput(
            // @ts-ignore
            this._address.toLegacyAddress(scriptPubKey), amount);
        }
        catch (error) {
            this.transaction.addOutput(scriptPubKey, amount);
        }
    };
    TransactionBuilder.prototype.setLockTime = function (locktime) {
        this.transaction.setLockTime(locktime);
    };
    TransactionBuilder.prototype.sign = function (vin, keyPair, redeemScript, hashType, value, signatureAlgorithm) {
        if (hashType === void 0) { hashType = this.hashTypes.SIGHASH_ALL; }
        if (signatureAlgorithm === void 0) { signatureAlgorithm = 0; }
        var witnessScript;
        this.transaction.sign(vin, keyPair, redeemScript, hashType, value, witnessScript, signatureAlgorithm);
    };
    TransactionBuilder.prototype.build = function () {
        if (this.p2shInput === true)
            return this.tx;
        return this.transaction.build();
    };
    return TransactionBuilder;
}());
exports.TransactionBuilder = TransactionBuilder;
//# sourceMappingURL=TransactionBuilder.js.map