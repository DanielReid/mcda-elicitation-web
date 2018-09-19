'use strict';
define(['lodash', 'd3'], function(_, d3) {
  var dependencies = [
    'PataviResultsService',
    'WorkspaceSettingsService'
  ];
  var TradeOffService = function(
    PataviResultsService,
    WorkspaceSettingsService
  ) {

    function getIndifferenceCurve(problem, criteria, coordinates) {
      var newProblem = _.merge({}, problem, {
        method: 'indifferenceCurve',
        indifferenceCurve: {
          criterionX: criteria.firstCriterion.id,
          criterionY: criteria.secondCriterion.id,
          x: coordinates.x,
          y: coordinates.y
        }
      });
      newProblem.criteria = _.mapValues(newProblem.criteria, mergeCriterionAndDataSource);
      return PataviResultsService.postAndHandleResults(newProblem);
    }

    function mergeCriterionAndDataSource(criterion) {
      return _.merge({}, _.omit(criterion, ['dataSources']), criterion.dataSources[0]);
    }

    function getInitialSettings(root, data, sliderOptions, settings, minY, maxY) {
      return {
        bindto: root,
        point: {
          r: getRadius
        },
        data: data,
        legend: { item: { onclick: function() { } } },
        axis: {
          x: {
            tick: {
              fit: false,
              format: _.partial(formatAxis, settings.firstCriterion.dataSources[0].scale)
            },
            min: sliderOptions.floor,
            max: sliderOptions.ceil,
            label: getTitle(settings.firstCriterion),
            padding: {
              left: 0,
              right: 0
            }
          },
          y: {
            min: minY,
            max: maxY,
            default: [minY, maxY],
            tick: {
              format: _.partial(formatAxis, settings.secondCriterion.dataSources[0].scale)
            },
            label: getTitle(settings.secondCriterion),
            padding: {
              top: 0,
              bottom: 0
            }
          }
        }
      };
    }

    function getRadius(point) {
      return point.id === 'line' ? 0 : 8;
    }

    function formatAxis(scale, value) {
      var numberFormatter = d3.format('.2f');
      if (usePercentage(scale)) {
        return numberFormatter(value) * 100;
      }
      return numberFormatter(value);
    }

    function usePercentage(scale) {
      return _.isEqual([0, 1], scale) && WorkspaceSettingsService.usePercentage();
    }

    function getYValue(x, xValues, yValues) {
      var value;
      var idx = _.indexOf(xValues, x);
      if (isEqualToBreakpoint()) {
        value = yValues[idx];
      } else {
        var xCoordinates = _.cloneDeep(xValues);
        xCoordinates.push(x);
        xCoordinates = _.sortBy(xCoordinates);
        idx = _.indexOf(xCoordinates, x);
        if (isPointInFrontOfLine(idx)) {
          x = xValues[1];
          value = yValues[1];
        } else if (isPointAfterEndOfLine(idx,xCoordinates.length)) {
          x = xValues[idx - 1];
          value = yValues[idx - 1];
        } else {
          value = calculateYValue(xValues, yValues, idx, x);
        }
      }
      return {
        y: significantDigits(value),
        x: x
      };
    }
    
    function isPointInFrontOfLine(idx) {
      return idx === 1;
    }

    function isPointAfterEndOfLine(idx, arrayLength){
      return idx === arrayLength -1;
    }

    function isEqualToBreakpoint(idx) {
      return idx >= 0;
    }

    function calculateYValue(xValues, yValues, idx, x) {
      var xdiff = xValues[idx] - xValues[idx - 1];
      var ydiff = yValues[idx] - yValues[idx - 1];
      var slope = ydiff / xdiff;
      var c = -slope * xValues[idx] + yValues[idx];
      return slope * x + c;
    }

    function significantDigits(value) {
      if (value === 0) {
        return value;
      }
      var posOrNeg = value < 0 ? -1 : 1;
      var multiplier = Math.pow(10, 4 - Math.floor(Math.log(posOrNeg * value) / Math.LN10) - 1);
      return Math.round(value * multiplier) / multiplier;
    }

    function getTitle(criterion) {
      return criterion.unitOfMeasurement ? criterion.title + ' (' + criterion.unitOfMeasurement + ')' : criterion.title;
    }

    function areCoordinatesSet(coordinates) {
      return coordinates.x > -Infinity && coordinates.y > -Infinity && coordinates.x !== null && coordinates.y !== null;
    }

    return {
      getIndifferenceCurve: getIndifferenceCurve,
      getInitialSettings: getInitialSettings,
      getYValue: getYValue,
      significantDigits: significantDigits,
      areCoordinatesSet: areCoordinatesSet
    };
  };
  return dependencies.concat(TradeOffService);
});
