(function () {
    'use strict';
    angular.module('app')
        .controller('customerController', ['customerService', '$q', '$mdDialog', '$scope', CustomerController]);

    function CustomerController(customerService, $q, $mdDialog, $scope) {
        var self = this;

        self.selected = null;
        self.customers = [];
        self.selectedIndex = 0;
        self.filterText = "";
        self.selectCustomer = selectCustomer;
        self.deleteCustomer = deleteCustomer;
        self.saveCustomer = saveCustomer;
        self.createCustomer = createCustomer;

        // Load initial data
        getAllCustomers();

        //----------------------
        // Internal functions
        //----------------------

        function selectCustomer(customer, index) {
            self.selected = angular.isNumber(customer) ? self.customers[customer] : customer;
            self.selectedIndex = angular.isNumber(customer) ? customer: index;
        }

        function deleteCustomer($event) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure?')
                .content('Are you sure want to delete this customer?')
                .ok('Yes')
                .cancel('No')
                .targetEvent($event);


            $mdDialog.show(confirm).then(function () {
                customerService.destroy(self.selected.id).then(function (affectedRows) {
                    self.customers.splice(self.selectedIndex, 1);
                });
            }, function () { });
        }

        function saveCustomer($event) {
            if (self.selected != null && self.selected.id != null) {
                customerService.update(angular.copy(self.selected)).then(function (affectedRows) {
                    $mdDialog.show(
                        $mdDialog
                            .alert()
                            .clickOutsideToClose(true)
                            .title('Success')
                            .content('Data Updated Successfully!')
                            .ok('Ok')
                            .targetEvent($event)
                    );
                });
            }
            else {
                //self.selected.customer_id = new Date().getSeconds();
                customerService.create(self.selected).then(function (affectedRows) {
                    self.customers.push(self.selected);
                    self.selectedIndex(self.customers.length-1);
                    $mdDialog.show(
                        $mdDialog
                            .alert()
                            .clickOutsideToClose(true)
                            .title('Success')
                            .content('Data Added Successfully!')
                            .ok('Ok')
                            .targetEvent($event)
                    );
                });
            }
        }

        function createCustomer() {
            self.selected = {};
            self.selectedIndex = null;
        }

        function getAllCustomers() {
            self.customers = [1, 8];

            customerService.getCustomers().then(function (customers) {
                self.customers = [].concat(customers);
                self.selected = customers[0];
                $scope.$apply();
            });
        }
    }

})();