class Address {
    constructor(args) {
        this._country = args.country;
        this._state = args.state;
        this._city = args.city;
        this._address = args.address;
        this._postalCode = args.postalCode;
        this._phone = args.phone;
        this._fax = args.fax;
    }
    set country(value) {
        this._country = value;
    }
    get country() {
        return this._country;
    }
    set state(value) {
        this._state = value;
    }
    get state() {
        return this._state;
    }
    set city(value) {
        this._city = value;
    }
    get city() {
        return this._city;
    }
    set address(value) {
        this._address = value;
    }
    get address() {
        return this._address;
    }
    set postalCode(value) {
        this._postalCode = value;
    }
    get postalCode() {
        return this._postalCode;
    }
    set phone(value) {
        this._phone = value;
    }
    get phone() {
        return this._phone;
    }
    set fax(value) {
        this._fax = value;
    }
    get fax() {
        return this._fax;
    }
}
module.exports = Address;
