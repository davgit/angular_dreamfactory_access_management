'use strict';


angular.module('dfAccessManagement', ['ngRoute', 'ngDreamFactory', 'ngAnimate'])
    .constant('MODACCESS_ROUTER_PATH', '/access-management')
    .constant('MODACCESS_ASSET_PATH', 'admin_components/dreamfactory-access-management/')
    .config(['$routeProvider', 'MODACCESS_ROUTER_PATH', 'MODACCESS_ASSET_PATH',
        function ($routeProvider, MODACCESS_ROUTER_PATH, MODACCESS_ASSET_PATH) {
            $routeProvider
                .when(MODACCESS_ROUTER_PATH, {
                    templateUrl: MODACCESS_ASSET_PATH + 'views/main.html',
                    controller: 'AccessManagementCtrl',
                    resolve: {
                        getRolesData: ['DSP_URL', '$http', 'accessManagementRulesService', function (DSP_URL, $http, accessManagementRulesService) {

                            var requestDataObj = {
                                fields: '*',
                                limit: accessManagementRulesService.roles.recordsLimit,
                                related: 'role_service_accesses,role_system_accesses'

                            };


                            return $http.get(DSP_URL + '/rest/system/role', {params: requestDataObj})
                                .success(function (data) {
                                    return data
                                })
                                .error(function (error) {

                                    throw {
                                        module: 'DreamFactory Access Management Module',
                                        type: 'error',
                                        provider: 'dreamfactory',
                                        exception: error
                                    }
                                })
                        }],
                        getUsersData: ['DSP_URL', '$http', 'accessManagementRulesService', function (DSP_URL, $http, accessManagementRulesService) {

                            var requestDataObj = {
                                fields: '*',
                                limit: accessManagementRulesService.users.recordsLimit,
                                related: null

                            };


                            return $http.get(DSP_URL + '/rest/system/user', {params: requestDataObj})
                                .success(function (data) {

                                    return data
                                })
                                .error(function (error) {

                                    throw {
                                        module: 'DreamFactory Access Management Module',
                                        type: 'error',
                                        provider: 'dreamfactory',
                                        exception: error
                                    }
                                })


                        }],
                        getAppsData: ['DSP_URL', '$http', 'accessManagementRulesService', function (DSP_URL, $http, accessManagementRulesService) {

                            var requestDataObj = {
                                fields: '*',
                                limit: accessManagementRulesService.apps.appRecordsLimit,
                                related: null

                            };

                            return $http.get(DSP_URL + '/rest/system/app', {params: requestDataObj})
                                .success(function (data) {
                                    return data
                                })
                                .error(function (error) {

                                    throw {
                                        module: 'DreamFactory Access Management Module',
                                        type: 'error',
                                        provider: 'dreamfactory',
                                        exception: error
                                    }
                                })
                        }],
                        getServicesData: ['DSP_URL', '$http', 'accessManagementRulesService', function (DSP_URL, $http, accessManagementRulesService) {

                            var requestDataObj = {
                                fields: '*',
                                limit: accessManagementRulesService.services.serviceRecordsLimit,
                                related:  null

                            };


                            function getServices() {

                                return $http.get(DSP_URL + '/rest/system/service', {params: requestDataObj})
                                    .success(function (data) {

                                        var services = data.record;

                                        if(services.length > 0) {

                                            angular.forEach(services, function(obj) {

                                                getServiceComponents(obj).then(
                                                    function(scResult) {

                                                        var serviceComponents = [];

                                                        if (scResult.data.resource) {
                                                            serviceComponents = scResult.data.resource;
                                                        }

                                                        if (serviceComponents.length > 1) {
                                                            serviceComponents.unshift(addStarDesignationForAllOptions());
                                                        }
                                                        obj['components'] = serviceComponents;
                                                    },
                                                    function(scReject) {
                                                        throw {
                                                            module: 'DreamFactory Access Management Module',
                                                            type: 'error',
                                                            provider: 'dreamfactory',
                                                            exception: scReject
                                                        }
                                                    })
                                            });

                                            services.unshift(addStarDesignationForAllOptions());

                                            var firstService = services[0];
                                            firstService['components'] = {
                                                config: {},
                                                data: {
                                                    resource:[]
                                                }
                                            };

                                            firstService.components.data.resource = addStarDesignationForAllOptions();
                                        }
                                    })
                                    .error(function (error) {

                                        return error;

                                    })
                            }

                            function getServiceComponents(serviceDataObj) {

                                if (!serviceDataObj) {
                                    throw {
                                        module: 'DreamFactory Access Management Module',
                                        type: 'error',
                                        provider: 'dreamfactory',
                                        exception: {
                                            error: [{
                                                message: 'No service object passed to getServiceComponents in resolve.'
                                            }]
                                        }
                                    }
                                }

                                // TODO: Change this from url parameters to request object
                                return $http.get(DSP_URL + '/rest/' + serviceDataObj.api_name + '/?app_name=admin&fields=*');

                            }

                            function addStarDesignationForAllOptions () {

                                return {id: 0, name: "*", type: ""};
                            }

                            return getServices().then(
                                function(result) {

                                    return result;
                                },
                                function(reject) {

                                    throw {
                                        module: 'DreamFactory Access Management Module',
                                        type: 'error',
                                        provider: 'dreamfactory',
                                        exception: reject
                                    }

                                })
                        }],

                        // Hack to get total number of users up to 1000
                        hackGetTotalNumUsers: ['DSP_URL', '$http', 'accessManagementRulesService', function (DSP_URL, $http, accessManagementRulesService) {

                            var requestDataObj = {
                                fields: 'id',
                                limit: null,
                                related: null

                            };


                            return $http.get(DSP_URL + '/rest/system/user', {params: requestDataObj})
                                .success(function (data) {

                                    return data
                                })
                                .error(function (error) {

                                    throw {
                                        module: 'DreamFactory Access Management Module',
                                        type: 'error',
                                        provider: 'dreamfactory',
                                        exception: error
                                    }
                                })
                        }],

                        // Hack to get total number of roles up to 1000
                        hackGetTotalNumRoles: ['DSP_URL', '$http', 'accessManagementRulesService', function (DSP_URL, $http, accessManagementRulesService) {

                            var requestDataObj = {
                                fields: 'id',
                                limit: null,
                                related: null

                            };


                            return $http.get(DSP_URL + '/rest/system/role', {params: requestDataObj})
                                .success(function (data) {

                                    return data
                                })
                                .error(function (error) {

                                    throw {
                                        module: 'DreamFactory Access Management Module',
                                        type: 'error',
                                        provider: 'dreamfactory',
                                        exception: error
                                    }
                                })


                        }]
                    }
                });
        }])
    .controller('AccessManagementCtrl', ['DSP_URL', '$scope', '$http', 'getRolesData', 'getUsersData', 'getAppsData', 'getServicesData', 'hackGetTotalNumUsers', 'hackGetTotalNumRoles', 'accessManagementRulesService', 'accessManagementEventsService',
        function (DSP_URL, $scope, $http, getRolesData, getUsersData, getAppsData, getServicesData, hackGetTotalNumUsers, hackGetTotalNumRoles, accessManagementRulesService, accessManagementEventsService) {



            // TODO: Filter out current user  Probably need to store a reference to the current user on the main app scope



            // PREPROCESS FUNCTIONS
            $scope.__getDataFromResponse = function (httpResponseObj) {
                return httpResponseObj.data.record;
            };

            $scope.__getMetaFromResponse = function (httpResponseObj) {
                return httpResponseObj.data.meta;
            };

            $scope.__getTotalNumRecordsFromResponse = function (httpResponseObj) {
                return httpResponseObj.data.record.length;
            };


            // CREATE SHORT NAMES
            $scope.es = accessManagementEventsService.module;
            $scope.rs = accessManagementRulesService;


            // PUBLIC API
            $scope.rolesDataArr = $scope.__getDataFromResponse(getRolesData);
            $scope.usersDataArr = $scope.__getDataFromResponse(getUsersData);
            $scope.appsDataArr = $scope.__getDataFromResponse(getAppsData);
            $scope.servicesDataArr = $scope.__getDataFromResponse(getServicesData);

            $scope.usersTotalRecords = $scope.__getTotalNumRecordsFromResponse(hackGetTotalNumUsers);
            $scope.rolesTotalRecords = $scope.__getTotalNumRecordsFromResponse(hackGetTotalNumRoles);


            $scope.viewUsersMasterActive = true;
            $scope.viewRolesMasterActive = false;
            $scope.viewAssignMasterActive = false;
            $scope.viewConfigMasterActive = false;

            $scope.toggleModuleNavigationBool = true;


            // PUBLIC API
            $scope.openUsersMaster = function () {

                $scope._openUsersMaster();
            };

            $scope.openRolesMaster = function () {

                $scope._openRolesMaster();
            };

            $scope.openAssignMaster = function () {

                $scope._openAssignMaster();
            };

            $scope.openConfigMaster = function () {

                $scope._openConfigMaster();
            };



            // PRIVATE API
            $scope._toggleViewUsersMaster = function (stateBool) {

                $scope.viewUsersMasterActive = stateBool;
            };

            $scope._toggleViewRolesMaster = function (stateBool) {

                $scope.viewRolesMasterActive = stateBool;
            };

            $scope._toggleViewAssignMaster = function (stateBool) {

                $scope.viewAssignMasterActive = stateBool;
            };

            $scope._toggleViewConfigMaster = function (stateBool) {

                $scope.viewConfigMasterActive = stateBool;
            };

            $scope._toggleViewUsersMasterActive = function () {

                $scope._toggleViewUsersMaster(true);
                $scope._toggleViewRolesMaster(false);
                $scope._toggleViewAssignMaster(false);
                $scope._toggleViewConfigMaster(false);
            };

            $scope._toggleViewRolesMasterActive = function () {

                $scope._toggleViewRolesMaster(true);
                $scope._toggleViewUsersMaster(false);
                $scope._toggleViewAssignMaster(false);
                $scope._toggleViewConfigMaster(false);
            };

            $scope._toggleViewAssignMasterActive = function () {

                $scope._toggleViewAssignMaster(true);
                $scope._toggleViewUsersMaster(false);
                $scope._toggleViewRolesMaster(false);
                $scope._toggleViewConfigMaster(false);
            };

            $scope._toggleViewConfigMasterActive = function () {

                $scope._toggleViewConfigMaster(true);
                $scope._toggleViewUsersMaster(false);
                $scope._toggleViewRolesMaster(false);
                $scope._toggleViewAssignMaster(false);
            };

            $scope._toggleModuleNavigation = function () {

                $scope.toggleModuleNavigationBool = !$scope.toggleModuleNavigationBool;
            };

            $scope._toggleEachRecord = function (recordsArr, stateBool) {

                angular.forEach(recordsArr, function(obj) {
                    obj.dfUISelected = stateBool;
                })
            };

            $scope._addSelectedProperty = function (recordObj) {

                recordObj['dfUISelected'] = false;
            };

            $scope._addUnsavedProperty = function (recordObj) {

                recordObj['dfUIUnsaved'] = false;
            };

            $scope._addUIProperties = function (records) {


                if (records instanceof Array) {
                    angular.forEach(records, function (obj) {

                        $scope._addSelectedProperty(obj);
                        $scope._addUnsavedProperty(obj);
                    });
                } else if (records instanceof Object) {

                    $scope._addSelectedProperty(records);
                    $scope._addUnsavedProperty(records);
                }

                return records;
            };

            $scope._makeRequestObj = function (options) {

                // TODO: Extend defaults obj for request

                var defaults = {
                    fields: '*',
                    limit: null,
                    offset: null,
                    related: null
                };


                return {
                    fields: options.fields || '*',
                    limit: options.limit || null,
                    offset: options.offset || null,
                    related: options.related || null
                }
            };

            $scope._getUsersData = function (requestDataObj) {

                return $http.get(DSP_URL + '/rest/system/user', {params: requestDataObj});
            };

            $scope._getRolesData = function (requestDataObj) {

                return $http.get(DSP_URL + '/rest/system/role', {params: requestDataObj});
            };



            // COMPLEX IMPLEMENTATION
            $scope._openUsersMaster = function () {

                $scope._toggleViewUsersMasterActive();
                $scope.toggleModuleNavigationBool = true;
            };

            $scope._openRolesMaster = function () {

                $scope._toggleViewRolesMasterActive();
                $scope.toggleModuleNavigationBool = true;
            };

            $scope._openAssignMaster= function () {

                $scope._toggleViewAssignMasterActive();
                $scope.toggleModuleNavigationBool = true;
            };

            $scope._openConfigMaster = function () {

                $scope._toggleViewConfigMasterActive();
                $scope.toggleModuleNavigationBool = true;
            };




            // HANDLE MESSAGES
            $scope.$on($scope.es.openModuleNavigation, function (e) {

                $scope._toggleModuleNavigation();
            });

            $scope.$on(accessManagementEventsService.assignUserRoleEvents.assignRole, function (e, usersDataArr) {

                $scope.$broadcast(accessManagementEventsService.usersEvents.saveUsers, usersDataArr);
            });

            $scope.$on(accessManagementEventsService.assignUserRoleEvents.unassignRole, function (e, usersDataArr) {

                $scope.$broadcast(accessManagementEventsService.usersEvents.saveUsers, usersDataArr);
            });

            $scope.$on(accessManagementEventsService.assignUserRoleEvents.removeRoleUsers, function (e, usersDataArr) {

                $scope.$broadcast(accessManagementEventsService.usersEvents.removeUsers, usersDataArr);
            });

            $scope.$on('get:users', function(e, pageNum) {

                var options = {
                    limit: $scope.rs.users.recordsLimit,
                    offset: pageNum * $scope.rs.users.recordsLimit
                };

                $scope._getUsersData($scope._makeRequestObj(options)).then(
                    function (result) {
                        $scope.usersDataArr = $scope.__getDataFromResponse(result);
                    },
                    function (reject) {
                        throw {
                            module: 'DreamFactory Access Management Module',
                            type: 'error',
                            provider: 'dreamfactory',
                            exception: reject
                        }
                    });
            });

            $scope.$on('get:roles', function(e, pageNum) {

                var options = {
                    limit: $scope.rs.roles.recordsLimit,
                    offset: pageNum * $scope.rs.roles.recordsLimit
                };

                $scope._getRolesData($scope._makeRequestObj(options)).then(
                    function (result) {
                        $scope.rolesDataArr = $scope.__getDataFromResponse(result);
                    },
                    function (reject) {
                        throw {
                            module: 'DreamFactory Access Management Module',
                            type: 'error',
                            provider: 'dreamfactory',
                            exception: reject
                        }
                    });
            });



        }])
    .directive('accessManagement', ['MODACCESS_ASSET_PATH',
        function (MODACCESS_ASSET_PATH) {

            return {
                restrict: 'E',
                templateUrl: MODACCESS_ASSET_PATH + 'views/access-management.html'
            }
        }])

    .directive('usersMaster', ['DSP_URL', '$q', '$http', 'MODACCESS_ASSET_PATH', 'accessManagementRulesService', 'accessManagementEventsService',
        function (DSP_URL, $q, $http, MODACCESS_ASSET_PATH, accessManagementRulesService, accessManagementEventsService) {

            return {
                restrict: 'E',
                templateUrl: MODACCESS_ASSET_PATH + 'views/users-master.html',
                scope: true,
                link: function (scope, elem, attrs) {


                    // Create a shortname
                    scope.es = accessManagementEventsService.usersEvents;

                    // PUBLIC VARS
                    scope.active = true;

                    scope.viewUsersListActive = true;
                    scope.viewCreateUserActive = false;


                    scope.id = 'users';
                    scope.toggleAllUsersBool = false;
                    scope.limit = accessManagementRulesService.recordsLimit;
                    scope.topLevelNavigation = true;
                    scope.newUser = {};


                    // PUBLIC API
                    scope.openModuleNavigation = function () {

                        scope.$emit(accessManagementEventsService.module.openModuleNavigation);
                    };

                    scope.removeUsers = function () {

                        // @TODO Add Confirm Delete Code
                        scope._removeUsers();
                    };

                    scope.toggleAllUsers = function () {

                        scope._toggleAllUsers();
                    };

                    scope.saveAllUsers = function () {

                        scope._saveUsers();
                    };

                    scope.revertAllUsers = function () {

                        scope._revertAllUsers();
                    };

                    scope.createUser = function () {

                        scope._createUser();
                    };

                    scope.exportUsers = function () {

                        scope._exportUsers();
                    };

                    scope.importUsers = function () {

                        scope._importUsers();
                    };


                    //PRIVATE API
                    scope._getUsersTotalRecords = function () {

                        return scope.usersTotalRecords;
                    };

                    scope._setUsersTotalRecords = function (valueInt) {

                        scope.usersTotalRecords = valueInt;
                    };

                    scope._incrementUsersTotalRecords = function () {

                        var c = scope._getUsersTotalRecords();
                        c++;
                        scope._setUsersTotalRecords(c);
                    };

                    scope._decrementUsersTotalRecords = function () {
                        var c = scope._getUsersTotalRecords();
                        c--;
                        scope._setUsersTotalRecords(c);
                    };


                    scope._toggleViewUsersList = function (stateBool) {

                        scope.viewUsersListActive = stateBool;
                    };

                    scope._toggleViewCreateUser = function (stateBool) {

                        scope.viewCreateUserActive = stateBool;
                    };

                    scope._toggleViewUsersListActive = function () {

                        scope._toggleViewUsersList(true);
                        scope._toggleViewCreateUser(false);
                    };

                    scope._toggleViewCreateUsersActive = function () {

                        scope._toggleViewCreateUser(true);
                        scope._toggleViewUsersList(false);
                    };

                    scope._removeUsersFromSystem = function (usersDataArr) {

                        var idsForRemoval = [],
                            objsForRemoval = [];


                        angular.forEach(usersDataArr, function (value, index) {

                            if (value.dfUISelected) {

                                if (value.is_sys_admin && accessManagementRulesService.allowMassAdminUserDeletion) {

                                    objsForRemoval.push(value);
                                    idsForRemoval.push(value.id);

                                } else if (!value.is_sys_admin) {

                                    objsForRemoval.push(value);
                                    idsForRemoval.push(value.id);

                                }
                            }
                        });


                        // Short Circuit: Nothing to delete.
                        if (idsForRemoval.length === 0) {

                            throw {
                                module: 'DreamFactory Access Management Module',
                                type: 'warning',
                                provider: 'dreamfactory',
                                exception: {
                                    error:[{
                                        message: 'No users selected for removal.'
                                    }]
                                }
                            }
                        }


                        var requestDataObj = {
                            ids: idsForRemoval.join(','),
                            fields: '*',
                            related: null
                        };


                        return $http.delete(DSP_URL + '/rest/system/user', {data: requestDataObj});

                    };

                    scope._removeUsersData = function (userDataObj) {

                        angular.forEach(scope.usersDataArr, function (obj, index) {

                            if (obj.id === userDataObj.id) {
                                delete scope.usersDataArr[index];
                                scope.usersDataArr.splice(index, 1)
                            }
                        });
                    };

                    scope._saveUsersToSystem = function (usersDataArr) {

                        var objsToSave = [];

                        angular.forEach(usersDataArr, function (obj) {

                            if (obj.dfUIUnsaved) {

                                objsToSave.push(obj);
                            }
                        });

                        if (objsToSave.length == 0) {
                            throw {
                                module: 'DreamFactory Access Management Module',
                                type: 'warning',
                                provider: 'dreamfactory',
                                exception: {
                                    error:[{
                                        message: 'No users selected for save.'
                                    }]
                                }
                            }
                        }

                        var requestDataObj = {
                                record:objsToSave
                        };

                        return $http(
                            {
                                method: 'PATCH',
                                url:DSP_URL + '/rest/system/user',
                                data: requestDataObj
                            });

                    };

                    scope._addUser = function (userDataObj) {

                        scope.usersDataArr.unshift(userDataObj);
                    };

                    scope._createUserModel = function () {

                        return {
                            id: null,
                            created_date: null,
                            created_by_id: null,
                            last_modified_date: null,
                            last_modified_by_id: null,
                            display_name: null,
                            first_name: null,
                            last_name: null,
                            email: null,
                            phone: null,
                            confirmed: false,
                            is_active: false,
                            is_sys_admin: false,
                            role_id: null,
                            default_app_id: null,
                            user_source: 0,
                            user_data: []
                        }
                    };

                    scope._resetUserInArray = function (userDataObj) {

                        angular.forEach(scope.usersDataArr, function (obj, index) {
                            if (obj.id === userDataObj.id) {
                                scope.usersDataArr.splice(index, 1);
                            }
                        });

                        scope.usersDataArr.unshift(userDataObj);
                    };

                    // TODO: Fix Export downloading of zip file
                    scope._exportUsersData = function () {

                        $http.get(DSP_URL + '/rest/system/user?app_name=admin&file=jimmy.csv&format=csv&download=true',
                            function (data) {

                            },
                            function (error) {

                            }
                        )


                    };

                    // TODO: Add User Import
                    scope._importUsersData = function () {
                    };


                    // COMPLEX IMPLEMENTATION
                    scope._removeUsers = function (usersDataArr) {

                        usersDataArr = usersDataArr || scope.usersDataArr;

                        scope._removeUsersFromSystem(usersDataArr).then(
                            function (result) {
                                angular.forEach(result.data.record, function (userDataObj) {
                                    scope._removeUsersData(userDataObj)
                                    scope._decrementUsersTotalRecords();
                                });
                                scope.$emit(scope.es.removeUsersSuccess);
                            },
                            function (reject) {
                                throw {
                                    module: 'DreamFactory Access Management Module',
                                    type: 'error',
                                    provider: 'dreamfactory',
                                    exception: reject
                                    }
                                });
                    };

                    scope._toggleAllUsers = function () {

                        scope.toggleAllUsersBool = !scope.toggleAllUsersBool;
                        scope._toggleEachRecord(scope.usersDataArr, scope.toggleAllUsersBool);
                    };

                    scope._saveUsers = function (usersDataArr) {

                        usersDataArr = usersDataArr || scope.usersDataArr;


                        // Save all users to the remote system
                        scope._saveUsersToSystem(usersDataArr).then(
                            function (result) {

                                angular.forEach(result.data.record, function (userDataObj) {
                                    scope._resetUserInArray(userDataObj);
                                })
                            },
                            function (reject) {

                                throw {
                                    module: 'DreamFactory Access Management Module',
                                    type: 'error',
                                    provider: 'dreamfactory',
                                    exception: reject
                                }
                            }
                        );
                    };

                    scope._revertAllUsers = function (usersDataArr) {

                        usersDataArr = usersDataArr || scope.usersDataArr;

                        angular.forEach(usersDataArr, function(obj) {

                            if (obj.dfUIUnsaved && obj.userCopy) {

                                var userCopy = obj.userCopy;

                                for (var key in obj) {
                                    if(obj.hasOwnProperty(key)) {
                                        obj[key] = userCopy[key]
                                    }
                                }
                            }

                            if (obj.dfUIUnsaved) {
                                obj.dfUIUnsaved = false;
                            }

                            delete obj.userCopy;
                        });
                    };

                    scope._createUser = function () {

                        scope._toggleViewCreateUsersActive();
                        scope.newUser = angular.copy(scope._createUserModel());
                        scope.topLevelNavigation = false;
                    };

                    // Part of fix export
                    scope._exportUsers = function () {
                        console.log('Export Users');
                        // scope._exportUsersData()
                    };

                    // Part of user import
                    scope._importUsers = function () {
                        console.log('Import Users');
                        // scope._importUsersData()
                    };


                    // HANDLE EVENTS
                    // handle events broadcasted from parent
                    scope.$on(scope.es.saveUsers, function (e, usersDataObj) {

                        scope._saveUsers(usersDataObj);
                    });

                    scope.$on(scope.es.removeUsers, function(e, usersDataArr) {

                        scope._removeUsers(usersDataArr);
                    });



                    // Handle events emitted from children
                    scope.$on(accessManagementEventsService.userEvents.openUserSuccess, function (e) {

                        scope.topLevelNavigation = false;
                    });

                    scope.$on(accessManagementEventsService.userEvents.closeUserSuccess, function (e) {

                        scope.topLevelNavigation = true;
                    });

                    scope.$on(accessManagementEventsService.userEvents.removeUserSuccess, function (e, userDataObj) {

                        scope._removeUsersData(userDataObj);
                        scope._decrementUsersTotalRecords();
                    });

                    scope.$on(accessManagementEventsService.userEvents.saveUserSuccess, function (e, userDataObj) {

                        scope._resetUserInArray(userDataObj);
                    });

                    scope.$on(accessManagementEventsService.userEvents.revertUserSuccess, function (e, userDataObj) {


                    });

                    scope.$on(accessManagementEventsService.userEvents.closeUserSuccess, function (e) {

                        scope.topLevelNavigation = true;
                        scope._toggleViewUsersListActive();
                    });

                    scope.$on(accessManagementEventsService.userEvents.createUserSuccess, function (e, userDataObj) {

                        scope._addUIProperties(userDataObj);
                        scope._addUser(userDataObj);
                        scope._incrementUsersTotalRecords();
                    });




                    // WATCHERS AND INITIALIZATION


                }
            }
        }])
    .directive('usersList', ['MODACCESS_ASSET_PATH', 'accessManagementEventsService',
        function(MODACCESS_ASSET_PATH, accessManagementEventsService) {

            return {
                restrict: 'E',
                templateUrl: MODACCESS_ASSET_PATH + 'views/users-list.html',
                scope: true,
                link: function(scope, elem, attrs) {

                    scope.usersListActive = true;
                    scope.userDetailActive = false;
                    scope.selectedUser = null;

                    scope.filter = {
                        userViewBy: 'email',
                        userProp: 'email',
                        userValue: null,
                        userOrderBy: 'email',
                        userOrderByReverse: false
                    };



                    //PUBLIC API
                    scope.openUserRecord = function (userDataObj) {

                        scope._openUserRecord(userDataObj);
                    };

                    /**
                     * Interface for selecting a record
                     */
                    scope.selectUser = function (userDataObj) {

                        // Call complex implementation
                        scope._selectUser(userDataObj);
                    };



                    // PRIVATE API

                    /**
                     * Toggle dfUISelected property on scope.user
                     *
                     * @private
                     */
                    scope._setUserSelected = function (userDataObj) {

                        userDataObj.dfUISelected = !userDataObj.dfUISelected;
                    };

                    scope._toggleUsersList = function (stateBool) {

                        scope.usersListActive = stateBool;
                    };

                    scope._toggleUserDetail = function (stateBool) {

                        scope.userDetailActive = stateBool;
                    };

                    scope._toggleListActive = function () {

                        scope._toggleUsersList(true);
                        scope._toggleUserDetail(false);

                    };

                    scope._toggleDetailActive = function () {

                        scope._toggleUserDetail(true);
                        scope._toggleUsersList(false)
                    };

                    scope._setSelectedUser = function (userDataObj) {

                        scope.selectedUser = userDataObj
                    };



                    // COMPLEX IMPLEMENTATION
                    scope._openUserRecord = function (userDataObj) {

                        scope._toggleDetailActive();
                        scope._setSelectedUser(userDataObj);
                    };

                    scope._closeUserRecord = function () {

                        scope._toggleListActive();
                    };

                    /**
                     * Selects record
                     *
                     * @emit selectUserSuccess
                     * @private
                     */
                    scope._selectUser = function (userDataObj) {

                        scope._setUserSelected(userDataObj);
                        scope.$emit(scope.es.selectUserSuccess)
                    };


                    // HANDLE EVENTS
                    scope.$on(accessManagementEventsService.userEvents.closeUserSuccess, function (e) {

                        scope._closeUserRecord();
                    });


                }
            }
        }])
    .directive('userItemDetail', ['DSP_URL', 'MODACCESS_ASSET_PATH', '$http', 'accessManagementEventsService', 'accessManagementRulesService',
        function(DSP_URL, MODACCESS_ASSET_PATH, $http, accessManagementEventsService, accessManagementRulesService) {

            return {
                restrict: 'E',
                templateUrl: MODACCESS_ASSET_PATH + 'views/user-item-detail.html',
                scope: {
                    user: '=',
                    roles: '=',
                    apps: '='

                },
                link: function(scope, elem, attrs) {


                    /**
                     * Short name for accessManagementEventsService.recordEvents
                     * @type {service}
                     */
                    scope.es = accessManagementEventsService.userEvents;

                    /**
                     * Stores a copy of the role for the revert function
                     * @type {object}
                     */
                    scope.userCopy = {};

                    /**
                     * Store the form name
                     * @type {string}
                     */
                    scope.formName = 'user-edit';




                    // PUBLIC API
                    /*
                     The Public Api section is meant to interact with the template.
                     Each function calls it's private complement to actually do the work.
                     It's a little bit more overhead but we get a few things out of it.
                     1. We have a clean interface with an underlying implementation that can be changed easily
                     2. We can setup hooks for pre and post processing if we choose to.
                     */


                    /**
                     * Interface for closing a record
                     */
                    scope.closeUser = function () {

                        // Call complex implementation
                        scope._closeUser();
                    };

                    /**
                     * Interface for saving a record
                     */
                    scope.saveUser = function () {

                        // Call complex implementation
                        scope._saveUser();
                    };

                    /**
                     * Interface for removing a record
                     */
                    scope.removeUser = function () {

                        // Call complex implementation
                        scope._confirmRemoveUser() ? scope._removeUser() : false;
                    };

                    /**
                     * Interface for reverting a record
                     */
                    scope.revertUser = function () {

                        // Call complex implementation
                        scope._revertUser();
                    };



                    // PRIVATE API
                    /*
                     The Private Api is where we create small targeted functions to be used in the Complex
                     Implementations section
                     */

                    /**
                     * Wrapper for DreamFactory SDK updateUser function
                     *
                     * @param userDataObj
                     * @returns {promise|Promise.promise|exports.promise|Q.promise}
                     * @private
                     */
                    scope._saveUserToSystem = function (userDataObj) {

                        return $http(
                            {
                                method: 'PATCH',
                                url: DSP_URL + '/rest/system/user',
                                data: scope.user
                            });
                    };

                    /**
                     * Wrapper for DreamFactory SDK deleteUser function
                     *
                     * @param userDataObj
                     * @returns {promise|Promise.promise|exports.promise|Q.promise}
                     * @private
                     */
                    scope._removeUserFromSystem = function (userDataObj) {

                        return $http.delete(DSP_URL + '/rest/system/user', {data: scope.user});
                    };

                    /**
                     * Get config auto close value
                     *
                     * @returns {boolean}
                     * @private
                     */
                    scope._checkAutoClose = function () {

                        return accessManagementRulesService.autoCloseUserDetail;
                    };

                    /**
                     * Check for unsaved changes.
                     * Sets scope.role.dfUIUnsaved
                     *
                     * @private
                     */
                    scope._checkUnsavedChanges = function () {

                        if (scope[scope.formName].$dirty) {

                            scope.user.dfUIUnsaved = true;
                            scope.user['userCopy'] = scope._copyUser(scope.userCopy);
                        } else {

                            scope.user.dfUIUnsaved = false;
                            if (scope.user['userCopy']) {
                                delete scope.user.userCopy;
                            }
                        }
                    };

                    /**
                     * Create an angular copy
                     *
                     * @param userDataObj
                     * @returns {userDataObj}
                     * @private
                     */
                    scope._copyUser = function (userDataObj) {

                        return angular.copy(userDataObj);
                    };

                    /**
                     * Set the edit user form to a pristine state
                     * @private
                     */
                    scope._setFormPristine = function () {

                        scope[scope.formName].$setPristine();
                    };

                    /**
                     * Set the edit user form to a dirty state
                     * @private
                     */
                    scope._setFormDirty = function () {

                        scope[scope.formName].$setDirty();
                    };

                    /**
                     * Set form state based on user saved status
                     * @param userDataObj
                     * @private
                     */
                    scope._setFormState = function (userDataObj) {

                        userDataObj.dfUIUnsaved ? scope._setFormDirty() : scope._setFormPristine();
                    };

                    /**
                     * Sets the local scope.user and scope.userCopy to null
                     * @private
                     */
                    scope._setLocalUserNull = function () {

                        // Set the current user to null this way if we select the
                        // same user again it will trigger the watcher
                        scope.user = null;

                        // Set the current user copy to null
                        scope.userCopy = null;
                    };

                    /**
                     * Confirm User removal from system
                     * @returns {bool}
                     * @private
                     */
                    scope._confirmRemoveUser = function () {

                        return confirm('Remove ' + scope.user.display_name + '?');
                    };

                    /**
                     * Sets the current user to the most recent copy of itself
                     *
                     * @private
                     */
                    scope._revertUserData = function () {

                        for(var key in scope.userCopy) {
                            if (scope.user.hasOwnProperty(key)) {
                                scope.user[key] = scope.userCopy[key];
                            }
                        }
                    };

                    /**
                     * Determines what user data to use as copy for reversion
                     */
                    scope._setUserCopy = function (userDataObj) {

                        if (userDataObj.userCopy) {
                            scope.userCopy = scope._copyUser(userDataObj.userCopy);
                        }else {
                            scope.userCopy = scope._copyUser(userDataObj);
                        }
                    };




                    // COMPLEX IMPLEMENTATION

                    /**
                     * Some init for the open record
                     *
                     * @emit closeUserSucess
                     * @private
                     */
                    scope._openUser = function (userDataObj) {

                        scope._setFormState(userDataObj);
                        scope._setUserCopy(userDataObj);
                        scope.$emit(scope.es.openUserSuccess);
                    };


                    /**
                     * Closes record
                     *
                     * @emit closeUserSucess
                     * @private
                     */
                    scope._closeUser = function () {

                        // Check for unsaved changes on the model
                        scope._checkUnsavedChanges();

                        // Set the form clean for the next user
                        scope._setFormPristine();

                        // Reset the local user
                        scope._setLocalUserNull();

                        // Alert our parent to the fact that we're done with our
                        // closing routine
                        scope.$emit(scope.es.closeUserSuccess);
                    };

                    /**
                     * Saves the User record
                     *
                     * @throws AccessManagement User Error
                     * @private
                     */
                    scope._saveUser = function () {

                        scope._saveUserToSystem(scope.user).then(
                            function (result) {

                                scope[scope.formName].$setPristine();
                                scope.user = result.data;
                                scope.userCopy = scope._copyUser(result.data);

                                if (scope._checkAutoClose()) {
                                    scope.closeUser();
                                }

                                scope.$emit(scope.es.saveUserSuccess, result.data);
                            },
                            function (reject) {
                                throw {
                                    module: 'DreamFactory Access Management Module',
                                    type: 'error',
                                    provider: 'dreamfactory',
                                    exception: reject
                                }
                            }
                        );
                    };

                    /**
                     * Removes record
                     *
                     * @throws AccessManagement User Error
                     * @private
                     */
                    scope._removeUser = function () {

                        scope._removeUserFromSystem(scope.user).then(
                            function (result) {
                                scope.$emit(scope.es.removeUserSuccess, result.data);
                                scope.closeUser();
                            },
                            function (reject) {

                                throw {
                                    module: 'DreamFactory Access Management Module',
                                    type: 'error',
                                    provider: 'dreamfactory',
                                    exception: reject
                                    }
                                });
                    };

                    /**
                     * Reverts record to first loaded or most recent saved state
                     *
                     * @private
                     */
                    scope._revertUser = function () {

                        scope._revertUserData();
                        scope[scope.formName].$setPristine();
                        scope._checkUnsavedChanges();
                        scope.$emit(scope.es.revertUserSuccess, scope.user);
                    };



                    // WATCHERS AND INIT
                    scope.$watch('user', function(newValue, oldValue) {

                        if (newValue) {
                            scope._openUser(newValue);
                        }
                    });

                }
            }
        }])
    .directive('createUser', ['DSP_URL', '$http', 'MODACCESS_ASSET_PATH', 'accessManagementEventsService',
        function (DSP_URL, $http,  MODACCESS_ASSET_PATH, accessManagementEventsService) {

            return {
                restrict: 'E',
                templateUrl: MODACCESS_ASSET_PATH + 'views/create-user.html',
                scope: {
                    user: '=',
                    roles: '=',
                    apps: '='
                },
                link: function (scope, elem, attrs) {

                    scope.es = accessManagementEventsService.userEvents;


                    // PUBLIC API
                    scope.closeUser = function () {

                        scope._confirmUnsavedClose() ? scope._closeUser() : false;
                    };

                    scope.createUser = function () {

                        scope._createUser();
                    };


                    // PRIVATE API
                    scope._confirmUnsavedClose = function () {

                        if (scope['create-user'].$dirty) {
                            return confirm('Discard unsaved changes?');
                        } else {
                            return true;
                        }
                    };

                    scope._createUserOnSystem = function () {

                        return $http.post(DSP_URL + '/rest/system/user', scope.user)
                    };


                    // COMPLEX IMPLEMENTATION
                    scope._closeUser = function () {

                        scope['create-user'].$setPristine();
                        scope.$emit(scope.es.closeUserSuccess);
                    };

                    scope._createUser = function () {

                        scope._createUserOnSystem().then(
                            function (result) {

                                scope['create-user'].$setPristine();
                                scope.$emit(scope.es.createUserSuccess, result.data);
                                scope.closeUser();
                            },
                            function (reject) {

                                scope.$emit(scope.es.createUserError, error);
                            });
                    };


                    // HANDLE MESSAGES



                    // WATCHERS AND INIT

                }
            }
        }])

    .directive('rolesMaster', ['DSP_URL', '$http', 'MODACCESS_ASSET_PATH', 'accessManagementRulesService', 'accessManagementEventsService',
        function (DSP_URL, $http, MODACCESS_ASSET_PATH, accessManagementRulesService, accessManagementEventsService) {

            return {
                restrict: 'E',
                scope: true,
                templateUrl: MODACCESS_ASSET_PATH + 'views/roles-master.html',
                link: function (scope, elem, attrs) {

                    // Create short names
                    scope.es = accessManagementEventsService.rolesEvents;

                    // PUBLIC VARS

                    scope.viewRolesListActive = true;
                    scope.viewCreateRoleActive = false;

                    scope.active = false;
                    scope.id = 'roles';
                    scope.toggleAllRolesBool = false;
                    scope.limit = accessManagementRulesService.recordsLimit;
                    scope.topLevelNavigation = true;
                    scope.newRole = {};


                    // PUBLIC API
                    scope.openModuleNavigation = function () {

                        scope.$emit(accessManagementEventsService.module.openModuleNavigation);
                    };

                    scope.createRole = function () {

                        scope._createRole();
                    };

                    scope.toggleAllRoles = function () {

                        scope._toggleAllRoles();
                    };

                    scope.saveAllRoles = function () {

                        scope._saveRoles();
                    };

                    scope.revertAllRoles = function () {

                        scope._revertAllRoles();
                    };

                    scope.removeRoles = function () {

                        if (scope._confirmRemoveRoles()) {
                            scope._removeRoles();
                        }

                    };

                    scope.exportRoles = function () {

                        scope._exportRoles();
                    };

                    scope.importRoles = function () {

                        scope._importRoles();
                    };


                    //PRIVATE API
                    scope._getUsersTotalRecords = function () {

                        return scope.rolesTotalRecords;
                    };

                    scope._setUsersTotalRecords = function (valueInt) {

                        scope.rolesTotalRecords = valueInt;
                    };

                    scope._incrementUsersTotalRecords = function () {

                        var c = scope._getUsersTotalRecords();
                        c++;
                        scope._setUsersTotalRecords(c);
                    };

                    scope._decrementUsersTotalRecords = function () {
                        var c = scope._getUsersTotalRecords();
                        c--;
                        scope._setUsersTotalRecords(c);
                    };

                    scope._toggleViewRolesList = function (stateBool) {

                        scope.viewRolesListActive = stateBool;
                    };

                    scope._toggleViewCreateRole = function (stateBool) {

                        scope.viewCreateRoleActive = stateBool;
                    };

                    scope._toggleViewRolesListActive = function () {

                        scope._toggleViewRolesList(true);
                        scope._toggleViewCreateRole(false);
                    };

                    scope._toggleViewCreateRolesActive = function () {

                        scope._toggleViewCreateRole(true);
                        scope._toggleViewRolesList(false);
                    };

                    scope._confirmRemoveRoles = function () {

                        return confirm('Are you sure you want to delete these roles?');
                    }

                    scope._createRoleModel = function () {

                        return {
                            id: null,
                            created_date: null,
                            created_by_id: null,
                            last_modified_date: null,
                            last_modified_by_id: null,
                            name: null,
                            is_active: true,
                            default_app_id: null,
                            newRole: true
                        }
                    };

                    scope._addRole = function (roleDataObj) {

                        scope.rolesDataArr.unshift(roleDataObj);
                    };

                    scope._saveRolesToSystem = function (rolesDataArr) {

                        var objsToSave = [];

                        angular.forEach(rolesDataArr, function (obj) {

                            if (obj.dfUIUnsaved) {

                                objsToSave.push(obj);
                            }
                        });


                        if (objsToSave.length == 0) {
                            throw {
                                module: 'DreamFactory Access Management Module',
                                type: 'warning',
                                provider: 'dreamfactory',
                                exception: {
                                    error:[{
                                        message: 'No roles selected for save.'
                                    }]
                                }
                            }
                        }


                        var requestDataObj = {
                                record: objsToSave
                        };

                        return $http({
                            method: 'PATCH',
                            url: DSP_URL + '/rest/system/role',
                            data: requestDataObj
                        });
                    };

                    scope._resetRoleInArray = function (roleDataObj) {

                        angular.forEach(scope.rolesDataArr, function (obj, index) {
                            if (obj.id === roleDataObj.id) {
                                scope.rolesDataArr.splice(index, 1);
                            }
                        });

                        scope.rolesDataArr.unshift(roleDataObj);
                    };

                    scope._removeRolesFromSystem = function (rolesDataArr) {

                        var idsForRemoval = [];


                        angular.forEach(rolesDataArr, function (value, index) {

                            if (value.dfUISelected) {

                                if (value.is_sys_admin && accessManagementRulesService.allowMassAdminUserDeletion) {

                                    idsForRemoval.push(value.id);

                                } else if (!value.is_sys_admin) {

                                    idsForRemoval.push(value.id);
                                }
                            }
                        });


                        // Short Circuit: Nothing to delete.
                        if (idsForRemoval.length === 0) {
                            throw {
                                module: 'DreamFactory Access Management Module',
                                type: 'warning',
                                provider: 'dreamfactory',
                                exception: {
                                    error:[{
                                        message: 'No roles selected for removal.'
                                    }]
                                }
                            }
                        }

                        var requestDataObj = {
                            ids: idsForRemoval.join(','),
                            fields: '*',
                            related: null
                        };

                        return $http.delete(DSP_URL +'/rest/system/role', {data: requestDataObj});
                    };

                    scope._removeRolesData = function (rolesDataObj) {

                        angular.forEach(scope.rolesDataArr, function (obj, index) {
                            if (obj.id === rolesDataObj.id) {
                                delete scope.rolesDataArr[index];
                                scope.rolesDataArr.splice(index, 1)
                            }
                        });
                    };

                    // TODO: Fix Export downloading of zip file
                    scope._exportRolesData = function () {
                    };

                    // TODO: Add User Import
                    scope._importRolesData = function () {
                    };


                    // COMPLEX IMPLEMENTATION
                    scope._createRole = function () {

                        scope._toggleViewCreateRolesActive();
                        scope.newRole = angular.copy(scope._createRoleModel());
                        scope.topLevelNavigation = false;
                    };

                    scope._toggleAllRoles = function () {

                        scope.toggleAllRolesBool = !scope.toggleAllRolesBool;
                        scope._toggleEachRecord(scope.rolesDataArr, scope.toggleAllRolesBool);
                    };

                    scope._saveRoles = function (rolesDataArr) {

                        rolesDataArr = rolesDataArr || scope.rolesDataArr;

                        // Save all roles to the remote system
                        scope._saveRolesToSystem(rolesDataArr).then(
                            function (result) {

                                angular.forEach(result.data.record, function (roleDataObj) {
                                    scope.$broadcast(scope.es.saveAllRolesSuccess);
                                    scope._resetRoleInArray(roleDataObj);
                                })
                            },
                            function (reject) {

                                throw {
                                    module: 'DreamFactory Access Management Module',
                                    type: 'error',
                                    provider: 'dreamfactory',
                                    exception: reject
                                }
                            }
                        );
                    };

                    scope._revertAllRoles = function (rolesDataArr) {

                        rolesDataArr = rolesDataArr || scope.rolesDataArr;

                        angular.forEach(rolesDataArr, function(obj) {

                            if (obj.dfUIUnsaved && obj.roleCopy) {

                                var roleCopy = obj.roleCopy;

                                for (var key in obj) {
                                    if(obj.hasOwnProperty(key)) {
                                        obj[key] = roleCopy[key]
                                    }
                                }
                            }

                            if (obj.dfUIUnsaved) {
                                obj.dfUIUnsaved = false;
                            }

                            delete obj.roleCopy;
                        });
                    };

                    scope._removeRoles = function (rolesDataArr) {

                        rolesDataArr = rolesDataArr || scope.rolesDataArr;

                        scope._removeRolesFromSystem(rolesDataArr).then(
                            function (result) {

                                angular.forEach(result.data.record, function (roleDataObj) {
                                    scope._removeRolesData(roleDataObj);
                                    scope._decrementUsersTotalRecords();
                                });
                                scope.$emit(scope.es.removeUsersSuccess);
                            },
                            function (reject) {

                                throw {
                                    module: 'DreamFactory Access Management Module',
                                    type: 'error',
                                    provider: 'dreamfactory',
                                    exception: reject
                                }
                            });
                    };

                    // Part of fix export
                    scope._exportRoles = function () {
                        //console.log('Export Roles');
                        // scope._exportUsersData()
                    };

                    // Part of user import
                    scope._importRoles = function () {
                        //console.log('Import Roles');
                        // scope._importUsersData()
                    };


                    // HANDLE MESSAGES

                    scope.$on(accessManagementEventsService.roleEvents.openRoleSuccess, function (e, roleDataObj) {

                        scope.topLevelNavigation = false;
                    });

                    scope.$on(accessManagementEventsService.roleEvents.closeRoleSuccess, function (e) {

                        scope.topLevelNavigation = true;
                        scope._toggleViewRolesListActive();
                    });

                    scope.$on(accessManagementEventsService.roleEvents.removeRoleSuccess, function (e, roleDataObj) {

                        scope._removeRolesData(roleDataObj);
                        scope._decrementUsersTotalRecords();
                    });

                    scope.$on(accessManagementEventsService.roleEvents.createRoleSuccess, function (e, roleDataObj) {

                        scope._addUIProperties(roleDataObj);
                        scope._addRole(roleDataObj);
                        scope._incrementUsersTotalRecords()
                    });

                    scope.$on(accessManagementEventsService.roleEvents.saveRoleSuccess, function (e, roleDataObj) {

                        scope._resetRoleInArray(roleDataObj);
                    });

                    // WATCHERS AND INITIALIZATION


                }
            }
        }])
    .directive('rolesList', ['MODACCESS_ASSET_PATH', 'accessManagementEventsService',
        function(MODACCESS_ASSET_PATH, accessManagementEventsService) {

            return {
                restrict: 'E',
                templateUrl: MODACCESS_ASSET_PATH + 'views/roles-list.html',
                scope: true,
                link: function(scope, elem, attrs) {


                    scope.rolesListActive = true;
                    scope.roleDetailActive = false;
                    scope.selectedRole = null;

                    //PUBLIC API
                    scope.openRoleRecord = function (userDataObj) {

                        scope._openRoleRecord(userDataObj);
                    };

                    /**
                     * Interface for selecting a record
                     */
                    scope.selectRole = function (roleDataObj) {

                        // Call complex implementation
                        scope._selectRole(roleDataObj);
                    };


                    // PRIVATE API
                    scope._toggleRolesList = function (stateBool) {

                        scope.rolesListActive = stateBool;
                    };

                    scope._toggleRoleDetail = function (stateBool) {

                        scope.roleDetailActive = stateBool;
                    };

                    scope._toggleListActive = function () {

                        scope._toggleRolesList(true);
                        scope._toggleRoleDetail(false);
                    };

                    scope._toggleDetailActive = function () {

                        scope._toggleRoleDetail(true);
                        scope._toggleRolesList(false)
                    };

                    scope._setSelectedRole = function (roleDataObj) {

                        scope.selectedRole = roleDataObj;
                    };

                    /**
                     * Toggle dfUISelected property on scope.role
                     *
                     * @private
                     */
                    scope._setRoleSelected = function (roleDataObj) {

                        roleDataObj.dfUISelected = !roleDataObj.dfUISelected;
                    };



                    // COMPLEX IMPLEMENTATION
                    scope._openRoleRecord = function (roleDataObj) {

                        scope._toggleDetailActive();
                        scope._setSelectedRole(roleDataObj);
                    };

                    scope._closeRoleRecord = function () {

                        scope._toggleListActive();
                    };

                    /**
                     * Selects record
                     *
                     * @emit selectRoleSuccess
                     * @private
                     */
                    scope._selectRole = function (roleDataObj) {

                        scope._setRoleSelected(roleDataObj);
                        scope.$emit(scope.es.selectRoleSuccess)
                    };


                    // HANDLE EVENTS
                    scope.$on(accessManagementEventsService.roleEvents.closeRoleSuccess, function (e) {

                        scope._closeRoleRecord();
                    });

                }
            }
        }])
    .directive('roleListItem', ['MODACCESS_ASSET_PATH', function(MODACCESS_ASSET_LIST) {
        return {
            restrict: 'E',
            templateUrl: MODACCESS_ASSET_LIST + 'views/role-list-item.html',
            scope: true,
            link: function(scope, elem, attrs) {


                // PUBLIC API
                /**
                 * Interface for selecting a record
                 */
                scope.selectRole = function () {

                    // Call complex implementation
                    scope._selectRole();
                };


                // PRIVATE API
                /**
                 * Toggle dfUISelected property on scope.role
                 *
                 * @private
                 */
                scope._setRoleSelected = function () {

                    scope.role.dfUISelected = !scope.role.dfUISelected;
                };


                // COMPLEX IMPLEMENTATION
                /**
                 * Selects record
                 *
                 * @emit selectRoleSuccess
                 * @private
                 */
                scope._selectRole = function () {

                    scope._setRoleSelected();
                    scope.$emit(scope.es.selectRoleSuccess)
                };


                // WATCHERS AND INIT


            }
        }
    }])
    .directive('roleItemDetail', ['MODACCESS_ASSET_PATH', 'accessManagementEventsService', 'accessManagementRulesService', '$q', 'DreamFactory',
        function(MODACCESS_ASSET_PATH, accessManagementEventsService, accessManagementRulesService, $q, DreamFactory) {

            return {
                restrict: 'E',
                templateUrl: MODACCESS_ASSET_PATH + 'views/role-item-detail.html',
                scope: {
                    role: '=',
                    users: '=',
                    apps: '=',
                    services: '='
                },
                link: function(scope, elem, attrs) {


                    /**
                     * Short name for accessManagementEventsService.recordEvents
                     * @type {service}
                     */
                    scope.es = accessManagementEventsService.roleEvents;

                    /**
                     * Stores a copy of the role for the revert function
                     * @type {object}
                     */
                    scope.roleCopy = {};

                    /**
                     * Store the form name
                     * @type {string}
                     */
                    scope.formName = 'role-edit';




                    // PUBLIC API
                    /*
                     The Public Api section is meant to interact with the template.
                     Each function calls it's private complement to actually do the work.
                     It's a little bit more overhead but we get a few things out of it.
                     1. We have a clean interface with an underlying implementation that can be changed easily
                     2. We can setup hooks for pre and post processing if we choose to.
                     */


                    /**
                     * Interface for closing a record
                     */
                    scope.closeRole = function () {

                        // Call complex implementation
                        scope._closeRole();
                    };

                    /**
                     * Interface for saving a record
                     */
                    scope.saveRole = function () {

                        // Call complex implementation
                        scope._saveRole();
                    };

                    /**
                     * Interface for removing a record
                     */
                    scope.removeRole = function () {

                        // Call Complex Implementation
                        if (scope._confirmRemoveRole()) {

                            scope._confirmRemoveRoleUsers() ? scope._removeRole(true) : scope._removeRole();
                        }
                    };

                    /**
                     * Interface for reverting a record
                     */
                    scope.revertRole = function () {

                        // Call complex implementation
                        scope._revertRole();
                    };



                    // PRIVATE API
                    /*
                     The Private Api is where we create small targeted functions to be used in the Complex
                     Implementations section
                     */

                    /**
                     * Creates a request object to pass to DreamFactory SDK functions
                     *
                     * @param requestDataObj
                     * @param fieldsDataStr
                     * @param relatedDataStr
                     * @returns {{id: (null|creds.id|test.id|id|internals.credentials.dh37fgj492je.id|locals.id|*), body: *, fields: (fields|*|null), related: (*|null)}}
                     * @private
                     */
                    scope._makeRequest = function (requestDataObj, fieldsDataStr, relatedDataStr) {

                        var fields = fieldsDataStr || null,
                            related = relatedDataStr || null;

                        return {
                            id: requestDataObj.id,
                            body: requestDataObj,
                            fields: fields,
                            related: related
                        }
                    };

                    /**
                     * Wrapper for DreamFactory SDK updateRole function
                     *
                     * @param roleDataObj
                     * @returns {promise|Promise.promise|exports.promise|Q.promise}
                     * @private
                     */
                    scope._saveRoleToSystem = function (roleDataObj) {

                        var defer = $q.defer();

                        DreamFactory.api.system.updateRole(
                            scope._makeRequest(roleDataObj, '*', 'role_service_accesses,role_system_accesses'),
                            function (data) {

                                defer.resolve(data);
                            },
                            function (error) {

                                defer.reject(error);
                            }
                        );

                        return defer.promise;
                    };

                    /**
                     * Wrapper for DreamFactory SDK deleteRole function
                     *
                     * @param roleDataObj
                     * @returns {promise|Promise.promise|exports.promise|Q.promise}
                     * @private
                     */
                    scope._removeRoleFromSystem = function (roleDataObj) {

                        var defer = $q.defer();

                        DreamFactory.api.system.deleteRole(
                            scope._makeRequest(roleDataObj, '*'),
                            function (data) {

                                defer.resolve(data);
                            },
                            function (error) {

                                defer.reject(error);
                            }
                        );

                        return defer.promise;

                    };

                    /**
                     * Get config auto close value
                     *
                     * @returns {boolean}
                     * @private
                     */
                    scope._checkAutoClose = function () {

                        return accessManagementRulesService.autoCloseRoleDetail;
                    };

                    /**
                     * Check for unsaved changes.
                     * Sets scope.role.dfUIUnsaved
                     *
                     * @private
                     */
                    scope._checkUnsavedChanges = function () {

                        // Check if our edit form is dirty
                        if (scope[scope.formName].$dirty) {

                            // it is so set some props
                            scope.role.dfUIUnsaved = true;

                            // and copy our backup to the obj in case we want to
                            // revert later/mass revert
                            scope.role['roleCopy'] = scope._copyRole(scope.roleCopy);
                        } else {

                            // Our form was not dirty
                            // set the dfUIUnsaved prop to relfect that
                            scope.role.dfUIUnsaved = false;

                            // delete any safe copies.
                            // we don't need them b/c the current
                            // state of the model is whats on the server.
                            if (scope.role['roleCopy']) {
                                delete scope.role.roleCopy;
                            }
                        }
                    };

                    /**
                     * Create an angular copy
                     *
                     * @param roleDataObj
                     * @returns {roleDataObj}
                     * @private
                     */
                    scope._copyRole = function (roleDataObj) {

                        return angular.copy(roleDataObj);
                    };

                    /**
                     * Set the edit role form to a pristine state
                     * @private
                     */
                    scope._setFormPristine = function () {

                        scope[scope.formName].$setPristine();
                    };

                    /**
                     * Set the edit role form to a dirty state
                     * @private
                     */
                    scope._setFormDirty = function () {

                        scope[scope.formName].$setDirty();
                    };

                    /**
                     * Set form state based on role saved status
                     * @param roleDataObj
                     * @private
                     */
                    scope._setFormState = function (roleDataObj) {

                        // Sets the form state based on role obj property
                        roleDataObj.dfUIUnsaved ? scope._setFormDirty() : scope._setFormPristine();
                    };

                    /**
                     * Sets the local scope.role and scope.roleCopy to null
                     * @private
                     */
                    scope._setLocalRoleNull = function () {

                        // Set the current role to null this way if we select the
                        // same role again it will trigger the watcher
                        scope.role = null;

                        // Set the current role copy to null
                        scope.roleCopy = null;
                    };

                    /**
                     * Confirm Role removal from system
                     * @returns {bool}
                     * @private
                     */
                    scope._confirmRemoveRole = function () {

                        return confirm('Remove ' + scope.role.name + '?');
                    };

                    /**
                     * Confirm delete all users with this role
                     *
                     * @returns {bool}
                     * @private
                     */
                    scope._confirmRemoveRoleUsers = function () {
                        return confirm('Would you like to remove all users with in this role?')
                    };

                    /**
                     * Sets the current role to the most recent copy of itself
                     *
                     * @private
                     */
                    scope._revertRoleData = function () {

                        // copy props from backup copy obj to working obj
                        for(var key in scope.roleCopy) {
                            if (scope.role.hasOwnProperty(key)) {
                                scope.role[key] = scope.roleCopy[key];
                            }
                        }
                    };

                    /**
                     * Determines what role data to use as copy for reversion
                     */
                    scope._setRoleCopy = function (roleDataObj) {

                        if (roleDataObj.roleCopy) {
                            scope.roleCopy = scope._copyRole(roleDataObj.roleCopy);
                        }else {
                            scope.roleCopy = scope._copyRole(roleDataObj);
                        }
                    };


                    // COMPLEX IMPLEMENTATION

                    /**
                     * Some init for the open record
                     *
                     * @emit closeRoleSucess
                     * @private
                     */
                    scope._openRole = function (roleDataObj) {

                        // Set the form state to dirty or clean based on the
                        // scope.role.dfUIUnsaved property
                        scope._setFormState(roleDataObj);

                        // Decide what to make a copy of..
                        // the original scope obj or use the copy
                        // that resides in the model if previously unsaved
                        scope._setRoleCopy(roleDataObj);

                        // Let the parent know we are successful
                        scope.$emit(scope.es.openRoleSuccess);
                    };


                    /**
                     * Closes record
                     *
                     * @emit closeRoleSucess
                     * @private
                     */
                    scope._closeRole = function () {

                        // Check for unsaved changes on the model
                        scope._checkUnsavedChanges();

                        // Set the form clean for the next role
                        scope._setFormPristine();

                        // Reset the local role
                        scope._setLocalRoleNull();

                        // Alert our parent to the fact that we're done with our
                        // closing routine
                        scope.$emit(scope.es.closeRoleSuccess);
                    };

                    /**
                     * Saves the Role record
                     *
                     * @throws AccessManagement Roles Error
                     * @private
                     */
                    scope._saveRole = function () {

                        // Pass in our role to save to the system
                        // this will return a promise that we have to handle
                        scope._saveRoleToSystem(scope.role).then(

                            // Success
                            function (result) {



                                // Broadcast a message to child directives that we are saving
                                // and they should run their save routines
                                scope.$broadcast(scope.es.saveRole);

                                // Set the form to pristine
                                scope[scope.formName].$setPristine();

                                // check if the form is pristine
                                // if so sets dfUIUnsaved property to false
                                scope._checkUnsavedChanges();

                                // Update the local copies of the record
                                scope.role = result;

                                // use _copyRole so we don;t just get a reference
                                scope.copyRole = scope._copyRole(result);


                                // Should we auto close
                                if (scope._checkAutoClose()) {

                                    // we should
                                    scope.closeRole();
                                }

                                // Let the parents know we were successful and don't pass the user
                                scope.$emit(scope.es.saveRoleSuccess, result);

                            },

                            // Error
                            function (reject) {
                                throw {
                                    module: 'DreamFactory Access Management Module',
                                    type: 'error',
                                    provider: 'dreamfactory',
                                    exception: reject
                                }
                            }
                        );
                    };

                    /**
                     * Removes record
                     *
                     * @throws AccessManagement Roles Error
                     * @private
                     */
                    scope._removeRole = function (deleteUsersBool) {

                        // Create a message obj to pass to any children
                        // with success options for their routines
                        var successMessagesObj = {
                            assignMassUsers: {
                                removeUsers: deleteUsersBool
                            }
                        };

                        // Pass our role to the remove function
                        // and handle the returned promise
                        scope._removeRoleFromSystem(scope.role).then(

                            // Success
                            function (result) {

                                // Let the children know we were successful and pass an object
                                // containing any params on what they should do on success
                                scope.$broadcast(scope.es.removeRoleSuccess, successMessagesObj);

                                // Let the parent know we were successful in removing ourselves
                                scope.$emit(scope.es.removeRoleSuccess, result);

                                // The record no longer exists so it should be closed.
                                scope.closeRole();
                            },

                            // Error
                            function (reject) {
                                throw {
                                    module: 'DreamFactory Access Management Module',
                                    type: 'error',
                                    provider: 'dreamfactory',
                                    exception: reject
                                }
                            });
                    };

                    /**
                     * Reverts record to load or most recent saved state
                     *
                     * @private
                     */
                    scope._revertRole = function () {

                        // set the working scope.role to the backup scope.roleCopy
                        scope._revertRoleData();

                        // Let the children directives know they should run their
                        // revert routines
                        scope.$broadcast(scope.es.revertRole);

                        // set the form to a pristine state
                        scope[scope.formName].$setPristine();

                        // check to make sure the form is pristine
                        // if so set scope.role.dfUIUnsaved to false
                        scope._checkUnsavedChanges();
                    };



                    // WATCHERS AND INIT
                    scope.$watch('role', function(newValue, oldValue) {

                        if (newValue) {
                            scope._openRole(newValue);
                        }
                    });

                }
            }
        }])
    .directive('createRole', ['$q', 'MODACCESS_ASSET_PATH', 'accessManagementEventsService', 'DreamFactory',
        function ($q, MODACCESS_ASSET_PATH, accessManagementEventsService, DreamFactory) {

            return {
                restrict: 'E',
                templateUrl: MODACCESS_ASSET_PATH + 'views/create-role.html',
                scope: {
                    role: '=',
                    apps: '='
                },
                link: function (scope, elem, attrs) {

                    scope.es = accessManagementEventsService.roleEvents;

                    scope.active = false;


                    // PUBLIC API
                    scope.closeRole = function () {

                        scope._confirmUnsavedClose() ? scope._closeRole() : false;
                    };

                    scope.createRole = function () {

                        scope._createRole();
                    };


                    // PRIVATE API
                    scope._confirmUnsavedClose = function () {

                        if (scope['create-role'].$dirty) {
                            return confirm('Discard unsaved changes?');
                        } else {
                            return true;
                        }
                    };

                    scope._createRoleOnSystem = function () {

                        var defer = $q.defer();

                        var requestObj = {
                            body: {
                                record: scope.role
                            },
                            fields: '*',
                            related: null
                        };

                        DreamFactory.api.system.createRoles(
                            requestObj,
                            function (data) {

                                defer.resolve(data);
                            },
                            function (error) {

                                defer.reject(error);
                            }
                        );

                        return defer.promise;
                    };


                    // COMPLEX IMPLEMENTATION
                    scope._closeRole = function () {

                        scope['create-role'].$setPristine();
                        scope.$emit(scope.es.closeRoleSuccess);
                    };

                    scope._createRole = function () {

                        scope._createRoleOnSystem().then(
                            function (result) {

                                scope['create-role'].$setPristine();
                                scope.$emit(scope.es.createRoleSuccess, result.record[0]);
                                scope.closeRole();
                            },
                            function (reject) {

                                console.log(reject);
                                scope.$emit(scope.es.createRoleError, error);
                            });
                    };


                }
            }
        }])

    .directive('assignUserRoleMaster', ['MODACCESS_ASSET_PATH', 'accessManagementEventsService',
        function (MODACCESS_ASSET_PATH, accessManagementEventsService) {

            return {
                restrict: 'E',
                templateUrl: MODACCESS_ASSET_PATH + 'views/assign-user-role-master.html',
                scope: true,
                link: function (scope, elem, attrs) {

                    // Create short names
                    scope.es = accessManagementEventsService.assignUserRoleEvents;


                    // PUBLIC VARS
                    // Stores sorted users that don't have the current role
                    scope.usersWithOutRole = [];

                    // Stores sorted users that do have the current role
                    scope.usersWithRole = [];

                    // Stores the current role
                    scope.currentRole = null;

                    // Stores the current role id
                    scope.currentRoleId = null;

                    // Stores default options for filters
                    // as well as provides a model to bind to
                    // so our filter and our directive that controls
                    // filter/view options can communicate
                    scope.filter = {
                        uaViewBy: 'email',
                        uaUserProp: 'email',
                        uaUserValue: null,
                        uaOrderBy: 'id',
                        uaOrderByReverse: false,
                        aViewBy: 'email',
                        aUserProp: 'email',
                        aUserValue: null,
                        aOrderBy: 'id',
                        aOrderByReverse: false
                    };


                    // PUBLIC API
                    // UI Interface
                    scope.toggleUserSelected = function (userDataObj) {

                        scope._toggleUserSelected(userDataObj);
                    };

                    scope.assignRole = function () {

                        scope._assignRole();
                    };

                    scope.unassignRole = function () {

                        scope._unassignRole();
                    };

                    scope.toggleAllUsers = function (usersDataArr) {

                        if (!scope._isArrayEmpty(usersDataArr)) {
                            scope._toggleAllUsers(usersDataArr);
                        }
                    };




                    // PRIVATE API
                    // Sort the users into two groups.  Users that have this
                    // role and users that don't
                    scope.__sortUsers = function (users) {

                        // Reset our sorted arrays to empty
                        scope.__setSortedEmpty();

                        // Foreach user that was passed in
                        angular.forEach(users, function (obj) {

                            // does the user role id equal the current role id
                            if (obj.role_id != scope.currentRole.id) {

                                // it doesn't
                                obj['role_name'] = scope._getRoleName(obj.role_id);
                                scope.usersWithOutRole.push(obj);
                            } else {

                                // it does
                                obj['role_name'] = scope._getRoleName(obj.role_id);
                                scope.usersWithRole.push(obj);
                            }
                        })
                    };

                    // Reset our sort arrays
                    scope.__setSortedEmpty = function () {

                        scope.usersWithOutRole = [];
                        scope.usersWithRole = [];
                    };

                    // Set the role id to the current role on each selected user
                    // that doesn't have the current role
                    scope._getSelectedUsersWithOutRole = function () {

                        var selectedUsers = [];

                        angular.forEach(scope.usersWithOutRole, function (obj) {

                            if (obj.dfUISelected) {
                                obj.dfUIUnsaved = true;
                                obj.role_id = scope.currentRole.id;
                                selectedUsers.push(obj);
                                scope._toggleUserSelectedData(obj);

                            }
                        });

                        if (selectedUsers.length > 0) {
                            return selectedUsers;
                        } else {

                            throw {
                                module: 'DreamFactory Access Management Module',
                                type: 'warning',
                                provider: 'dreamfactory',
                                exception: {
                                    error:[{
                                        message: 'No users selected for assignment.'
                                    }]
                                }
                            }
                        }
                    };

                    // Set the role id to null/default role on each selected user
                    // that has the current role
                    scope._getSelectedUsersWithRole = function () {

                        var selectedUsers = [];

                        angular.forEach(scope.usersWithRole, function (obj) {

                            if (obj.dfUISelected) {
                                obj.dfUIUnsaved = true;
                                obj.role_id = null;
                                selectedUsers.push(obj);
                                scope._toggleUserSelectedData(obj);
                            }
                        });

                        if (selectedUsers.length > 0) {
                            return selectedUsers;
                        } else {

                            throw {
                                module: 'DreamFactory Access Management Module',
                                type: 'warning',
                                provider: 'dreamfactory',
                                exception: {
                                    error:[{
                                        message: 'No users selected for unassign.'
                                    }]
                                }
                            }
                        }
                    };

                    // Toggle user to be modified
                    scope._toggleUserSelectedData = function (userDataObj) {

                        userDataObj.dfUISelected = !userDataObj.dfUISelected;
                        //userDataObj.dfUISelected ? scope.totalSelectedUsers++ : scope.totalSelectedUsers--;
                    };

                    // Check if we have one or more selected users in array
                    scope._checkForSelectedUsers = function (usersArr) {

                        var haveUsers = false;

                        // Foreach user in array
                        angular.forEach(usersArr, function(obj) {

                            // are they selected
                            if (obj.dfUISelected) {

                                // someone is selected
                                haveUsers =  true;
                            }
                        });

                        return haveUsers;
                    };

                    // Gets current role data
                    scope._getCurrentRoleData = function (roleId) {

                        var selectedRole = null;

                        angular.forEach(scope.rolesDataArr, function (obj) {

                            if (obj.id === roleId) {

                                selectedRole = obj;
                            }
                        });

                        return selectedRole;
                    };

                    // Sets currentRole
                    scope._setCurrentRoleData = function (roleId) {

                        scope.currentRole = scope._getCurrentRoleData(roleId);
                    };

                    scope._isArrayEmpty = function (arr) {

                        return arr.length == 0;
                    };


                    // COMPLEX IMPLEMENTATION
                    // Function to toggle user selected
                    scope._toggleUserSelected = function (userDataObj) {

                        scope._toggleUserSelectedData(userDataObj);
                    };

                    // Function to assign the role
                    scope._assignRole = function () {

                        // check if any users are selected
                        if (scope._checkForSelectedUsers(scope.usersWithOutRole)) {

                            // Tell the main parent Controller to save the selected users with the current role.
                            scope.$emit(scope.es.assignRole, scope._getSelectedUsersWithOutRole());
                        }
                    };

                    // Function to unassign the role
                    scope._unassignRole = function () {

                        // check if any users are selected
                        if (scope._checkForSelectedUsers(scope.usersWithRole)) {

                            // Tell the main parent Controller to save the selected users with the current role removed
                            scope.$emit(scope.es.unassignRole, scope._getSelectedUsersWithRole())
                        }
                    };

                    scope._getRoleName = function (roleId) {

                        var roleName = 'Unassigned';

                        angular.forEach(scope.rolesDataArr, function (obj) {

                            if (obj.id === roleId) {
                                roleName = obj.name
                            }

                        });

                        return roleName;
                    };

                    scope._toggleAllUsers = function (usersDataArr) {

                        angular.forEach(usersDataArr, function (obj) {
                            scope._toggleUserSelected(obj);
                        })
                    };

                    scope.$on('$destroy', function(e) {

                        watchRoleId();
                        watchUsers();
                    });


                    // HANDLE MESSAGES



                    // WATCHERS
                    var watchRoleId = scope.$watch('currentRoleId', function (newValue, oldValue) {

                        // Do we have a role
                        if (newValue !== null) {

                            // set the current role data
                            scope._setCurrentRoleData(newValue);

                            // make a local copy of the users
                            scope.massAssignUsers = angular.copy(scope.usersDataArr);

                            // sort the users into two groups.
                            // Ones that have the current role and ones that don't
                            scope.__sortUsers(scope.massAssignUsers);

                        }
                    });

                    var watchUsers = scope.$watchCollection('usersDataArr', function (newValue, oldValue) {

                        // Do we have a role
                        if (scope.currentRole !== null) {

                            // make a local copy of the users
                            scope.massAssignUsers = angular.copy(newValue);

                            // sort the users into two groups.
                            // Ones that have the current role and ones that don't
                            scope.__sortUsers(scope.massAssignUsers);
                        }
                    });
                }
            }
        }])

    .directive('filterUsers', ['MODACCESS_ASSET_PATH', function(MODACCESS_ASSET_PATH) {

        return {
            restrict: 'E',
            replace: true,
            templateUrl: MODACCESS_ASSET_PATH + 'views/filter-users.html',
            scope: {
                sectionTitle: '@',
                filterViewBy: '=',
                filterProp: '=',
                filterValue: '=',
                orderBy: '=',
                orderByReverse: '=',
                uniqueId: '@'
            }
        }
    }])
    .directive('selectApp', ['MODACCESS_ASSET_PATH', function (MODACCESS_ASSET_PATH) {
        return {
            restrict: 'E',
            templateUrl: MODACCESS_ASSET_PATH + 'views/select-app.html',
            scope: {
                labelText: '@',
                appModel: '=',
                apps: '='
            }
        }
    }])
    .directive('selectRole', ['MODACCESS_ASSET_PATH', function (MODACCESS_ASSET_PATH) {

        return {
            restrict: 'E',
            templateUrl: MODACCESS_ASSET_PATH + 'views/select-role.html',
            scope: {
                labelText: '@',
                roleModel: '=',
                roles: '='
            }
        }
    }])
    .directive('addService', ['MODACCESS_ASSET_PATH', function (MODACCESS_ASSET_PATH) {

        return {
            restrict: 'E',
            templateUrl: MODACCESS_ASSET_PATH + 'views/select-service.html',
            scope: {
                services: '=',
                role: '='
            },
            link: function(scope, elem, attrs) {

                // PUBLIC API
                scope.addServiceAccess = function () {

                    scope._addServiceAccess();
                };


                // PRIVATE API
                scope._createAccessModel = function() {

                    return {
                        access: "No Access",
                        component: '*',
                        created_by_id: null,
                        created_date: null,
                        id: null,
                        filters: [],
                        filter_op: 'AND',
                        last_modified_by_id: null,
                        last_modified_date: null,
                        role_id: scope.role.id,
                        service_id: null
                    }
                };


                scope._addServiceAccessData = function () {

                    scope.role.role_service_accesses.push(scope._createAccessModel());

                };

                scope._removeService = function (index) {

                    scope.role.role_service_accesses.splice(index, 1);
                }

                // TODO: Set event in event service
                scope.$on('remove:access', function (e, o) {

                    scope._removeService(o)
                });



                // COMPLEX IMPLEMENTATION

                scope._addServiceAccess = function () {

                    scope._addServiceAccessData();
                };

                scope.$watch('role', function(newValue, oldValue) {

                    //console.log(newValue.role_services_accesses);

                })

            }
        }
    }])
    .directive('serviceAccessEdit',['MODACCESS_ASSET_PATH', '$compile',  function(MODACCESS_ASSET_PATH, $compile) {

        return {
            restrict: 'A',
            replace: true,
            templateUrl: MODACCESS_ASSET_PATH + 'views/service-access-edit.html',
            scope: {
                access: '=',
                services: '=',
                index: '='
            },
            link: function (scope, elem, attrs) {

                scope.currentServiceComponents = [];
                scope.accessFiltersActive = false;


                // PUBIC API
                scope.removeServiceAccess = function () {

                    scope._confirmRemoveAccess() ? scope._removeServiceAccess() : false;
                };

                scope.toggleAccessFilters = function () {

                    scope._toggleAccessFilters();
                };



                // PRIVATE API
                scope._getServiceData = function (serviceIdInt) {

                    var service = false;

                    angular.forEach(scope.services, function (obj) {

                        if (obj.id === serviceIdInt || obj.id === '' || obj.id === 0) {

                            service = obj;
                        }
                    });

                    return service;
                };

                scope._confirmRemoveAccess = function() {

                    return confirm('Would you like to remove access for ' + scope._getServiceName(scope.access.service_id));
                };

                scope._getServiceName = function(serviceIdInt) {

                    var serviceDataObj = scope._getServiceData(serviceIdInt),
                        name;

                    if (serviceDataObj)  {

                        if (serviceDataObj.name === '*') {
                            name = 'All Services'
                        }else {
                            name = serviceDataObj.name;
                        }

                    }

                    return name
                };

                scope._setAccessServiceId = function () {

                    if (scope.access.service_id == null) {
                        scope.access.service_id = 0
                    }
                };

                scope._setCurrentServiceComponents = function (serviceDataObj) {

                    if (serviceDataObj.components || serviceDataObj.id === 0) {
                        scope.currentServiceComponents = serviceDataObj.components.data.resource;
                    }else {

                        throw {
                            module: 'DreamFactory Access Management Module',
                            type: 'warning',
                            provider: 'dreamfactory',
                            exception: {
                                error:[{
                                    message: 'No service components found for ' + serviceDataObj.name
                                }]
                            }
                        }
                    }
                };

                scope._addAccessFilterTable = function () {

                    var html = '<tr service-access-filters></tr>'
                    $(elem).after($compile(html)(scope));
                };

                scope._removeAccessFilterTable = function () {

                    $(elem).next().remove();
                };

                scope._toggleAccessFiltersActive = function () {

                    scope.accessFiltersActive = !scope.accessFiltersActive;
                }



                //COMPLEX IMPLEMENTATION
                scope._getService = function (serviceIdInt) {

                    scope._setCurrentServiceComponents(scope._getServiceData(serviceIdInt));
                    scope._setAccessServiceId();
                };

                scope._removeServiceAccess = function () {

                    scope.$emit('remove:access', scope.index);
                };

                scope._toggleAccessFilters = function () {

                    scope._toggleAccessFiltersActive();
                    scope.accessFiltersActive ? scope._addAccessFilterTable() : scope._removeAccessFilterTable();
                };


                // WATCHERS AND INIT

                scope.$watchCollection('access', function(newValue, oldValue) {

                    //console.log(scope.access)

                    scope._getService(scope.access.service_id);
                    scope._setAccessServiceId();

                });


            }
        }

    }])
    .directive('serviceAccessFilters', ['MODACCESS_ASSET_PATH', function(MODACCESS_ASSET_PATH) {

        return {
            restrict: 'A',
            replace: true,
            scope: true,
            templateUrl: MODACCESS_ASSET_PATH + 'views/service-access-filters.html',
            link: function(scope, elem, attrs) {

                scope.filterOps = ['AND', 'OR'];

                scope.operators = [
                    "=",
                    "!=",
                    ">",
                    "<",
                    ">=",
                    "<=",
                    "in",
                    "not in",
                    "starts with",
                    "ends with",
                    "contains",
                    "is null",
                    "is not null"
                ];



                // PUBLIC API
                scope.addFilter = function () {

                    scope._addFilter();
                };

                scope.removeFilter = function (index) {

                    scope._confirmRemoveFilter() ? scope._removeFilter(index) : false;
                };



                // PRIVATE API
                scope._createFilterModel = function () {

                    return {
                        name: '',
                        operator: '',
                        value: ''
                    }
                };

                scope._hasFilters = function(accessDataObj) {

                    return !!accessDataObj.filters;
                };

                scope._confirmRemoveFilter = function () {

                    return confirm('Remove Filter?');
                }

                scope._addFilterData = function () {

                    if (scope._hasFilters(scope.access)) {
                        scope.access.filters.push(scope._createFilterModel());
                    }else {
                        scope.access['filters'] = [];
                        scope.access.filters.push(scope._createFilterModel());
                    }
                };

                scope._removeFilterData = function (index) {

                    scope.access.filters.splice(index, 1);
                };



                //COMPLEX IMPLEMENTATION
                scope._addFilter = function () {

                    scope._addFilterData();
                };

                scope._removeFilter = function (index) {

                    scope._removeFilterData(index);
                };




                //WATCHERS AND INIT



            }
        }
    }])

    .directive('paginate', ['MODACCESS_ASSET_PATH', 'accessManagementRulesService', function(MODACCESS_ASSET_PATH, accessManagementRulesService) {

        return {
            restrict: 'E',
            scope: {
                records: '=',
                recordsTotal: '=',
                type: '@'
            },
            templateUrl: MODACCESS_ASSET_PATH + 'views/paginate.html',
            link: function(scope, elem, attrs) {


                // TODO: Update Total Users on delete and create for correct page total numbers


                // CREATE SHORT NAMES
                scope.rs = accessManagementRulesService;


                // PUBLIC VARS
                scope.showPagination = false;
                scope.totalNumPages = 0;
                scope.pageObjs = [];
                scope.currentPage = 0;


                // PUBLIC API
                scope.changePage = function (pageNum) {

                    if (scope._isCurrentPage(pageNum)) {
                        return false
                    }
                    else {
                        scope._changePage(pageNum);
                    }
                };

                scope.nextPage = function () {

                    if (scope._isLastPage()) {
                        return false;
                    }
                    else {
                        scope._nextPage();
                    }
                };

                scope.previousPage = function () {

                    if (scope._isFirstPage()) {
                        return false;
                    }
                    else {
                        scope._previousPage();
                    }
                };


                // PRIVATE API
                scope._getShowPaginationValue = function () {

                    return scope.showPagination;
                };

                scope._setShowPaginationValue = function (valueInt) {

                    scope.showPagination = valueInt;
                };

                scope._getCurrentPage = function () {

                    return scope.currentPage;
                };

                scope._setCurrentPage = function (valueInt) {

                    scope.currentPage = valueInt;
                };

                scope._getTotalNumPages = function () {

                    return scope.totalNumPages;
                }

                scope._setTotalNumPages = function (valueInt) {

                    scope.totalNumPages = valueInt;
                }



                scope._hasPages = function () {

                    return scope._getTotalNumPages() > 1;
                };

                scope._togglePagination = function () {


                    scope._setShowPaginationValue(scope._hasPages());
                };

                scope._calcNumPages = function (recordsTotal, numPerPageInt) {

                    return Math.ceil(recordsTotal / numPerPageInt);
                };

                scope._createPageObj = function (idInt) {

                    return {
                        page: idInt,
                        offset: idInt * scope.rs.userRecordsPerPage
                    }
                };

                scope._addPageObjs = function (totalNumPages) {

                    // reset page objs
                    scope.pageObjs = [];

                    for (var i = 0; i < totalNumPages; i++) {
                        scope.pageObjs.push(scope._createPageObj((i)));
                    }
                };

                scope._incrementCurrentPage = function () {
                    var cp = scope._getCurrentPage();
                    cp++;
                    scope._setCurrentPage(cp);
                };

                scope._decrementCurrentPage = function () {
                    var cp = scope._getCurrentPage();
                    cp--;
                    scope._setCurrentPage(cp);
                };

                scope._isFirstPage = function () {

                    return scope._getCurrentPage() == 0;
                };

                scope._isLastPage = function () {
                    return scope._getCurrentPage() + 1 == scope._getTotalNumPages();
                };

                scope._isCurrentPage = function (pageNum) {

                    return scope._getCurrentPage() == pageNum;
                };




                // COMPLEX IMPLEMENTATION
                scope._changePage = function (pageNum) {

                    scope.$emit('get:' + scope.type, pageNum);
                    scope._setCurrentPage(pageNum);
                };

                scope._nextPage = function () {

                    scope.$emit('get:' + scope.type, scope._getCurrentPage() + 1);
                    scope._incrementCurrentPage();
                };

                scope._previousPage = function () {

                    scope.$emit('get:' + scope.type, scope._getCurrentPage() - 1);
                    scope._decrementCurrentPage();
                };




                // WATCHERS AND INIT
                scope.$watchCollection('records', function(newValue, oldValue) {

                    scope._setTotalNumPages(scope._calcNumPages(scope.recordsTotal, scope.rs[scope.type].recordsLimit));
                    scope._togglePagination();
                });

                scope.$watch('totalNumPages', function(newValue, oldValue) {

                    scope._addPageObjs(newValue);

                    if (newValue < oldValue) {
                        scope._changePage(newValue - 1);
                    }

                    if (newValue > oldValue) {
                        scope._changePage(newValue + 1);
                    }

                });
            }
        }
    }])

    .directive('configMaster', ['MODACCESS_ASSET_PATH', 'accessManagementRulesService', function(MODACCESS_ASSET_PATH, accessManagementRulesService) {

        return {

            restrict: 'E',
            templateUrl: MODACCESS_ASSET_PATH + 'views/config-master.html',
            link: function(scope, elem, attrs) {


                // Create short names
                scope.rs = accessManagementRulesService;

                scope.active = false;
                scope.id = 'config';
                scope.topLevelNavigation = true;



                // HANDLE MESSAGES
                scope.$on('view:change:view', function (e, viewIdStr) {

                    if (viewIdStr === scope.id) {
                        scope.active = true;
                        scope.$emit('view:changed', scope.id);
                    } else {
                        scope.active = false;
                    }
                });
            }
        }
    }])
    .directive('configUsersOptions', ['MODACCESS_ASSET_PATH', 'stringService', function(MODACCESS_ASSET_PATH, stringService) {

        return {

            restrict: 'E',
            scope: true,
            templateUrl: MODACCESS_ASSET_PATH + 'views/config-users-options.html',
            link: function(scope, elem, attrs) {


                // Create Short Name
                // TODO: Add root locale chooser and use that value here
                scope.stringService = stringService.config.usersConfig.en;


                // TODO: Add save function for Users options

            }
        }
    }])
    .directive('configRolesOptions', ['MODACCESS_ASSET_PATH', 'stringService', function(MODACCESS_ASSET_PATH, stringService) {

        return {

            restrict: 'E',
            scope: true,
            templateUrl: MODACCESS_ASSET_PATH + 'views/config-roles-options.html',
            link: function(scope, elem, attrs) {


                // Create Short Name
                // TODO: Add root locale chooser and use that value here
                scope.stringService = stringService.config.rolesConfig.en;


                // TODO: Add save function for Roles options

            }
        }
    }])
    .directive('configGeneralOptions', ['MODACCESS_ASSET_PATH', 'stringService',
        function (MODACCESS_ASSET_PATH, stringService) {


            return {
                restrict: 'E',
                templateUrl: MODACCESS_ASSET_PATH + 'views/config-general-options.html',
                scope: true,
                link: function(scope, elem, attrs) {

                    // Create Short Name
                    scope.stringService = stringService.config.generalConfig.en;







                }
            }
        }])

    .service('accessManagementEventsService', [function () {

        return {
            module: {
                getRoles: 'get:roles',
                getUsers: 'get:users',
                getApps: 'get:apps',
                openModuleNavigation: 'open:modulenav'

            },
            usersEvents: {

                removeUsers: 'remove:users',
                toggleAllUsers: 'select:all',
                saveUsers: 'save:users',
                createUser: 'create:user',
                exportUsers: 'export:users',
                importUsers: 'import:users',
                getUsersSuccess: 'get:users:success',
                getUsersError: 'get:users:error',
                removeUsersSuccess: 'remove:users:success',
                removeUsersError: 'remove:users:error',
                saveAllUsersSuccess: 'save:users:success',
                saveAllUsersError: 'save:users:error',
                createUserSuccess: 'create:user:success',
                createUserError: 'create:user:error'
            },
            rolesEvents: {

                removeRoles: 'remove:roles',
                toggleAllRoles: 'select:all',
                saveRoles: 'save:Roles',
                createRole: 'create:role',
                exportRoles: 'export:roles',
                importRoles: 'import:roles',
                revertAllRoles: 'revert:all:roles',
                getRolesSuccess: 'get:roles:success',
                getRolesError: 'get:roles:error',
                removeRolesSuccess: 'remove:roles:success',
                removeRolesError: 'remove:roles:error',
                saveAllRolesSuccess: 'save:roles:success',
                saveAllRolesError: 'save:roles:error',
                createRoleSuccess: 'create:role:success',
                createRoleError: 'create:role:error'
            },
            userEvents: {

                closeUser: 'close:user',
                openUser: 'open:user',
                removeUser: 'remove:user',
                revertUser: 'revert:user',
                selectUser: 'select:user',
                saveUser: 'save:user',
                createUser: 'create:user',
                openUserSuccess: 'open:user:success',
                closeUserSuccess: 'close:user:success',
                saveUserSuccess: 'save:user:success',
                removeUserSuccess: 'remove:user:success',
                revertUserSuccess: 'revert:user:success',
                selectUserSuccess: 'select:user:success',
                createUserSuccess: 'create:user:success',
                createUserError: 'create:user:error'

            },
            roleEvents: {
                openRoleSingle: 'open:role:single',
                closeRoleSingle: 'close:role:single',
                openRole: 'open:role',
                removeRole: 'remove:role',
                revertRole: 'revert:role',
                selectRole: 'select:role',
                saveRole: 'save:role',
                closeRole: 'close:role',
                createRole: 'create:role',
                openRoleSuccess: 'open:role:success',
                closeRoleSuccess: 'close:role:success',
                saveRoleSuccess: 'save:role:success',
                removeRoleSuccess: 'remove:role:success',
                revertRoleSuccess: 'revert:role:success',
                createRoleSuccess: 'create:role:success',
                createRoleError: 'create:role:error',
                selectRoleSuccess: 'select:role:success'

            },
            assignUserRoleEvents: {
                assignRole: 'assign:role',
                unassignRole: 'unassign:role',
                removeRoleUsers: 'remove:role:users'
            },
            selectRolesEvents: {

            },
            assignMassUsersEvents: {

            }
        }
    }])
    .service('accessManagementRulesService', [function () {

        return {
            general: {
                allowMassAdminUserDeletion: false
            },
            users: {
                recordsLimit: 20,
                // userRecordsPerPage: 5,
                autoCloseUserDetail: true
            },
            roles: {
                recordsLimit: 20,
                // roleRecordsPerPage: 5,
                autoCloseRoleDetail: true
            },
            apps: {
                appRecordsLimit: null
            },
            services: {
                serviceRecordsLimit: null
            }
        }
    }])
    .service('stringService', [function() {

        return {

            config: {
                generalConfig: {
                    en: {
                        sectionTitle: 'General Options',
                        userRecordsLimit: 'Number of User records to retrieve per set',
                        // userRecordsPerPage: 'Number of User records shown per page',
                        roleRecordsLimit: 'Number of Role records to retrieve per set'
                        // roleRecordsPerPage: 'Number of Role records to show per page'
                    }
                },
                usersConfig: {
                    en: {
                        sectionTitle: 'Users Options',
                        allowMassAdminDelete: 'Allow administrators to be mass deleted.',
                        autoCloseUserDetail: 'Auto close user detail on save.',
                        viewUsersAsTable: 'View Users as table.'
                    }
                },

                rolesConfig: {
                    en: {
                        sectionTitle: 'Roles Options',
                        autoCloseRoleDetail: 'Auto close user detail on save.',
                        viewRolesAsTable: 'View Roles as table.'
                    }
                }
            }
        }
    }])
    .filter('orderObjectBy', [function () {
        return function (items, field, reverse) {
            var filtered = [];
            angular.forEach(items, function (item) {
                filtered.push(item);
            });
            filtered.sort(function (a, b) {
                return (a[field] > b[field]);
            });
            if (reverse) filtered.reverse();
            return filtered;
        };
    }])
    .filter('removeField', [function () {
        return function (items, field, reverse) {

            var filtered = {};

            angular.forEach(items, function (value, key) {
                if (key !== field) {
                    filtered[key] = value;
                }
            });
            return filtered;
        }
    }])
    .filter('showOnlyFieldsOrdered', [function () {
        return function (items, fieldList) {

            var filtered = {};
            fieldList = fieldList.split(',');

            angular.forEach(fieldList, function (listValue, listKey) {
                filtered[listKey] = items[listValue];
            });
            return filtered;
        }
    }])
    .filter('dfFilterBy', [function() {
        return function (items, options) {

            var filtered = [];

            // There is nothing to base a filter off of
            if (!options) {return items};

            if (!options.field) {return items};
            if (!options.value) {return items};
            if (!options.regex) {
                options.regex = new RegExp(options.value)
            }

            angular.forEach(items, function(item) {
                if (options.regex.test(item[options.field])) {

                    filtered.push(item)
                }
            });

            return filtered;
        }
    }]);

