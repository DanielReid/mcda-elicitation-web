'use strict';
define(['lodash'], function(_) {
  var ESC = 27;
  var ENTER = 13;

  var dependencies = ['$timeout', 'mcdaRootPath'];

  var SensitivityInputDirective = function($timeout, mcdaRootPath) {
    return {
      restrict: 'E',
      scope: {
        'criterion': '=',
        'alternative': '=',
        'originalValue': '=',
        'currentValue': '=',
        'changeCallback': '='
      },
      templateUrl: mcdaRootPath + 'js/results/sensitivityInputDirective.html',
      link: function(scope) {
        // functions
        scope.keyCheck = keyCheck;
        scope.checkInput = checkInput;
        scope.showSlider = showSlider;

        // init
        var isEscPressed = false;
        scope.newValue = scope.currentValue;
        scope.slider = initSlider();

        scope.$on('open.af.dropdownToggle', function() {
          isEscPressed = false;
        });

        scope.$on('close.af.dropdownToggle', function() {
          if (!isEscPressed) {
            closeAndSave();
          }
        });

        scope.$watch('currentValue', function() {
          scope.newValue = scope.currentValue; //needed for reset button
        });

        function showSlider() {
          scope.slider = initSlider();
          $timeout(function() {
            scope.$broadcast('rzSliderForceRender');
            scope.$broadcast('reCalcViewDimensions');
          });
        }

        function initSlider() {
          return {
            value: scope.currentValue,
            options: {
              floor: scope.criterion.pvf.range[0],
              ceil: scope.criterion.pvf.range[1],
              step: 0.0001,
              precision: 10
            }
          };
        }

        function checkInput() {
          if (scope.slider.value > scope.slider.options.ceil) {
            scope.slider.value = scope.slider.options.ceil;
          } else if (scope.slider.value < scope.slider.options.floor) {
            scope.slider.value = scope.slider.options.floor;
          }
        }

        function closeAndSave() {
          $timeout(function() {
            if (!isNaN(scope.slider.value)) {
              scope.newValue = scope.slider.value;
              scope.changeCallback(scope.newValue, scope.criterion, scope.alternative);
            }
          });
        }

        function keyCheck(event) {
          if (event.keyCode === ESC) {
            isEscPressed = true;
            scope.$broadcast('doClose.af.dropdownToggle');
          } else if (event.keyCode === ENTER) {
            scope.$broadcast('doClose.af.dropdownToggle');
          }
        }
      }
    };
  };
  return dependencies.concat(SensitivityInputDirective);
});