'use strict';
define(['angular'], function() {
  var dependencies = [];
  var PerformanceService = function() {
    function buildExactPerformance(value, input) {
      return {
        type: 'exact',
        value: value,
        input: input
      };
    }

    function buildExactSEPerformance(firstParameter, secondParameter) {
      return buildExactPerformance(firstParameter, {
        value: firstParameter,
        stdErr: secondParameter
      });
    }

    function buildExactPercentSEPerformance(firstParameter, secondParameter) {
      return buildExactPerformance(firstParameter / 100, {
        value: firstParameter,
        stdErr: secondParameter,
        scale: 'percentage'
      });
    }

    function buildExactConfidencePerformance(cell) {
      return buildExactPerformance(cell.firstParameter, {
        value: cell.firstParameter,
        lowerBound: cell.lowerBoundNE ? 'NE' : cell.secondParameter,
        upperBound: cell.upperBoundNE ? 'NE' : cell.thirdParameter
      });
    }

    function buildExactPercentConfidencePerformance(cell) {
      return buildExactPerformance((cell.firstParameter / 100), {
        value: cell.firstParameter,
        lowerBound: cell.lowerBoundNE ? 'NE' : cell.secondParameter,
        upperBound: cell.upperBoundNE ? 'NE' : cell.thirdParameter,
        scale: 'percentage'
      });
    }

    function buildNormalPerformance(mu, sigma, input) {
      return {
        type: 'dnorm',
        parameters: {
          mu: mu,
          sigma: sigma
        },
        input: input
      };
    }

    function buildBetaPerformance(alpha, beta, input) {
      return buildAlphaBetaPerformance('dbeta', alpha, beta, input);
    }

    function buildGammaPerformance(alpha, beta, input) {
      return buildAlphaBetaPerformance('dgamma', alpha, beta, input);
    }

    function buildEmptyPerformance() {
      return {
        type: 'empty'
      };
    }

    function buildAlphaBetaPerformance(type, alpha, beta, input) {
      return {
        type: type,
        parameters: {
          alpha: alpha,
          beta: beta
        },
        input: input
      };
    }

    return {
      buildExactPerformance: buildExactPerformance,
      buildExactConfidencePerformance: buildExactConfidencePerformance,
      buildExactPercentConfidencePerformance: buildExactPercentConfidencePerformance,
      buildNormalPerformance: buildNormalPerformance,
      buildBetaPerformance: buildBetaPerformance,
      buildGammaPerformance: buildGammaPerformance,
      buildEmptyPerformance: buildEmptyPerformance,
      buildExactSEPerformance: buildExactSEPerformance,
      buildExactPercentSEPerformance: buildExactPercentSEPerformance
    };
  };
  return dependencies.concat(PerformanceService);
});
