const Address = require('./address');

class Employee {
    constructor(args) {
        this._employeeId = args.employeeId;
        this._firstName = args.firstName;
        this._lastName = args.lastName;
        this._email = args.email;
        this._birthDate = args.birthDate;
        this._hireDate = args.hireDate;
        this._reportsTo = args.reportsTo;
        this._title = args.title;
    }
    // Employee's properties
    set employeeId(value) {
        this._employeeId = value;
    }
    get employeeId() {
        return this._employeeId;
    }
    set email(value) {
        this._email = value;
    }
    get email() {
        return this._email;
    }
    set firstName(value) {
        this._firstName = value;
    }
    get firstName() {
        return this._firstName;
    }
    set lastName(value) {
        this._lastName = value;
    }
    get lastName() {
        return this._lastName;
    }
    set title(value) {
        this._title = value;
    }
    get title() {
        return this._title;
    }
    set birthDate(value) {
        this._birthDate = value;
    }
    get birthDate() {
        return this._birthDate;
    }
    set hireDate(value) {
        this._hireDate = value;
    }
    get hireDate() {
        return this._hireDate;
    }
    set reportsTo(value) {
        this._reportsTo = value;
    }
    get reportsTo() {
        return this._reportsTo;
    }
    set address(value) {
        this._address = new Address(value);
    }
    get address() {
        return this._address;
    }
    get FullName() {
        return `${this.lastName} ${this.lastName}`;
    }
    save() {
        return {
            'firstName': this.firstName,
            'lastName': this.lastName,
            'email': this.email,
            'title': this.title,
            'reportsTo': this.reportsTo,
            'birthDate': this.birthDate,
            'hireDate': this.hireDate,
            'country': this.address.country,
            'city': this.address.city,
            'state': this.address.state,
            'address': this.address.address,
            'postalCode': this.address.postalCode,
            'phone': this.address.phone,
            'fax': this.address.fax
        };
    }
}

module.exports = Employee;
