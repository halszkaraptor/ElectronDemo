(function () {
    'use strict';
    const Dexie = require('dexie');

    Dexie.debug = true;

    let db = new Dexie("db");
    db.version(1).stores({ runs: "++id,name", customers: "++id,email,name,address,city,country,phone,remarks" });

    db.transaction('rw', [db.runs, db.customers], function*() {
        if ((yield db.runs.limit(1).count()) === 0) {
            db.customers.bulkPut([
                {id: 4, email: "email@email.com", name: "Person Name", address: "180 Address Road", city: "City", country: "country", phone: "phone", remarks: "remraks"},
                {id: 5, email: "email@email.com1", name: "Person Name1", address: "180 Address Road1", city: "City1", country: "country1", phone: "phone1", remarks: "remraks1"},
                {id: 6, email: "tom@org.com", name: "Tom Tester", address: "42 Testing Drive", city: "Testville", country: "Demoaria", phone: "123456789", remarks: "Really testworthy"}
            ]);

            db.runs.put({"id": 1, "name": "init"});
        }
    }).catch(e => {
        console.error (e.stack);
    });

    angular.module('app')
        .service('customerService', ['$q', CustomerService]);

    function CustomerService($q) {
        return {
            getCustomers: getCustomers,
            getById: getCustomerById,
            getByName: getCustomerByName,
            create: createCustomer,
            destroy: deleteCustomer,
            update: updateCustomer
        };

        function getCustomers() {
            return db.customers.toArray();
        }

        function getCustomerById(id) {
            return db.customers.where("id").equals(id).toArray();
        }

        function getCustomerByName(name) {
            return db.custoemrs.toArray();
        }

        function createCustomer(customer) {
            return db.customers.put(customer);
        }

        function deleteCustomer(id) {
            return db.customers.delete(id);
        }

        function updateCustomer(customer) {
            return createCustomer(customer);
        }
    }
})();