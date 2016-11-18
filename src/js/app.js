// Style
require('normalize.css');
require('../css/app.scss');

// Requires
var angular = require('angular');
var _ = require('lodash');

// App
var app = angular.module('test', []);
app.controller('SeminarRegistrationController', function ($scope, RegistrationService) {
    var defaultScope = {
        people: {
            attending: "0",
            attendees: [],
            onChange: function () {
                var difference = $scope.people.attending - $scope.people.attendees.length;

                if (difference > 0) {
                    $scope.people.attendees = $scope.people.attendees.concat(_.fill(new Array(difference), ""));
                } else {
                    $scope.people.attendees = $scope.people.attendees.slice(0, $scope.people.attending);
                }
            }
        },
        badge: {
            enabled: null,
            text: ""
        },
        accomodations: {
            enabled: null,
            text: ""
        },
        seminar: {
            isReadyToRock: false
        }
    };

    $scope.reset = function () {
        // Replace scope data with deep copied defaults
        angular.extend($scope, angular.copy(defaultScope));
    };

    $scope.submit = function () {
        var data = _($scope).pick(['people', 'badge', 'accomodations']).value();
        RegistrationService.send(data);

        $scope.reset();
    };

    $scope.isStepReady = {
        one: function () {
            var isReady = $scope.people.attendees.length > 0;
            _($scope.people.attendees).each(function checkEmptyString(attendee) {
                isReady = attendee.length > 0

                // If empty attendee string is found, ready flag is marked false and checkEmptyString is interrupted  
                return isReady;
            });

            return isReady;
        },
        two: function () {
            function checkOptionalTextReady(target) {
                return target.enabled != null && (target.enabled === 'false' || target.text.length > 0);
            };

            return $scope.isStepReady.one() && checkOptionalTextReady($scope.accomodations) && checkOptionalTextReady($scope.badge);
        },
        three: function () {
            return $scope.isStepReady.two() && $scope.seminar.isReadyToRock === true;
        }
    };

    // Init
    $scope.reset();
});

app.service('RegistrationService', function ($q) {
    this.send = function (data) {
        var deferred = $q.defer();

        // Mocked registration service
        setTimeout(function () {
            console.log("Data sent:", data);
        }, 100);

        return deferred.promise;
    };
});

app.directive('ngExpand', function () {
    function link(scope, element, attrs) {
        element.addClass("expandable");

        // Separating watch expression and condition expression allows to "reexpand" on any value change 
        var expandWatch = attrs.ngExpandWatch ? attrs.ngExpandWatch : attrs.ngExpand;

        // Expand on value change
        scope.$watch(expandWatch, function (value) {
            element.removeClass("expand");
            if (scope.$eval(attrs.ngExpand) === true) {
                setTimeout(function () {
                    element.addClass("expand");
                }, 100);
            }
        });
    };

    return {
        restrict: 'A',
        link: link
    }
});

module.exports = app;