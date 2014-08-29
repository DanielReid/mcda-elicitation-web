'use strict';
define(['underscore', 'angular'], function(_) {
  var dependencies = [];
  var IntervalHull = function() {
    return {
      intervalHull: function(scaleRanges) {
        if (!scaleRanges) return [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY];
        return [
          Math.min.apply(null, _.map(_.values(scaleRanges), function(alt) {
            return alt['2.5%'];
          })),
          Math.max.apply(null, _.map(_.values(scaleRanges), function(alt) {
            return alt['97.5%'];
          }))
        ];
      }
    };
  };
  return dependencies.concat(IntervalHull);
});
