'use strict';
define(['angular', 'angular-mocks', 'mcda/benefitRisk/benefitRisk'], function(angular) {

  var generateUuidMock = function() {
    return 'uuid';
  };
  var currentSchemaVersion = '1.3.4';
  var schemaService;

  describe('The SchemaService', function() {
    beforeEach(angular.mock.module('elicit.benefitRisk', function($provide) {
      $provide.value('generateUuid', generateUuidMock);
      $provide.value('currentSchemaVersion', currentSchemaVersion);
    }));

    beforeEach(inject(function(SchemaService) {
      schemaService = SchemaService;
    }));

    var normalPerformance = {
      type: 'dnorm',
      parameters: {
        mu: 1,
        sigma: 0.5
      }
    };

    describe('updateWorkspaceToCurrentSchema (includes updateProblemToCurrentSchema)', function() {
      it('should do nothing to a workspace of the current version', function() {
        var workspace = {
          problem: exampleProblem()
        };
        var result = schemaService.updateWorkspaceToCurrentSchema(workspace);
        expect(result).toEqual(workspace);
      });

      it('should update a workspace without schemaversion to the current version', function() {
        var workspace = {
          problem: {
            title: 'problem title',
            criteria: {
              crit1: {
                title: 'criterion 1',
                description: 'desc',
                isFavorable: undefined,
                unitOfMeasurement: 'ms',
                uncertainties: 'unc',
                source: 'source1'
              },
              crit2: {
                title: 'criterion 2',
                description: 'desc',
                isFavorable: null,
                unitOfMeasurement: 'ms',
                uncertainties: 'unc',
                source: 'source2'
              }
            },
            alternatives: {
              alt1: {
                title: 'alt1'
              },
              alt2: {
                title: 'alt2'
              }
            },
            performanceTable: [{
              criterion: 'crit1',
              alternative: 'alt1',
              performance: normalPerformance
            }, {
              criterionUri: 'crit2',
              alternative: 'alt1',
              performance: normalPerformance
            },
            {
              criterion: 'crit1',
              alternative: 'alt2',
              performance: normalPerformance
            }, {
              criterionUri: 'crit2',
              alternative: 'alt2',
              performance: normalPerformance
            }]
          }
        };
        var result = schemaService.updateWorkspaceToCurrentSchema(workspace);
        var expectedResult = {
          problem: {
            title: 'problem title',
            criteria: {
              crit1: {
                title: 'criterion 1',
                description: 'desc',
                dataSources: [{
                  id: 'uuid',
                  unitOfMeasurement: 'ms',
                  uncertainties: 'unc',
                  source: 'source1'
                }]
              },
              crit2: {
                title: 'criterion 2',
                description: 'desc',
                dataSources: [{
                  id: 'uuid',
                  unitOfMeasurement: 'ms',
                  uncertainties: 'unc',
                  source: 'source2'
                }]
              }
            },
            alternatives: {
              alt1: {
                title: 'alt1'
              },
              alt2: {
                title: 'alt2'
              }
            },
            performanceTable: [{
              criterion: 'crit1',
              alternative: 'alt1',
              dataSource: 'uuid',
              performance: {
                distribution: normalPerformance
              }
            }, {
              criterion: 'crit2',
              alternative: 'alt1',
              dataSource: 'uuid',
              performance: {
                distribution: normalPerformance
              }
            }, {
              criterion: 'crit1',
              alternative: 'alt2',
              dataSource: 'uuid',
              performance: {
                distribution: normalPerformance
              }
            }, {
              criterion: 'crit2',
              alternative: 'alt2',
              dataSource: 'uuid',
              performance: {
                distribution: normalPerformance
              }
            }],
            schemaVersion: currentSchemaVersion
          },
        };
        expect(result).toEqual(expectedResult);
      });

      it('should update a workspace of version 1.0.0 to the current version', function() {
        var workspace = {
          problem: {
            title: 'problem title',
            criteria: {
              crit1: {
                title: 'criterion 1',
                description: 'desc',
                unitOfMeasurement: 'ms',
                uncertainties: 'unc',
                source: 'source'
              },
              crit2: {
                title: 'criterion 2',
                description: 'desc',
                unitOfMeasurement: 'ms',
                uncertainties: 'unc',
                source: 'source'
              }
            },
            alternatives: {
              alt1: {
                title: 'alt1'
              },
              alt2: {
                title: 'alt2'
              }
            },
            performanceTable: [{
              criterion: 'crit1',
              alternative: 'alt1',
              performance: normalPerformance
            }, {
              criterion: 'crit2',
              alternative: 'alt1',
              performance: normalPerformance
            }, {
              criterion: 'crit1',
              alternative: 'alt2',
              performance: normalPerformance
            }, {
              criterion: 'crit2',
              alternative: 'alt2',
              performance: normalPerformance
            }],
            valueTree: {
              children: [{
                children: {
                  criteria: ['crit1', 'crit2']
                }
              }, {
                criteria: []
              }]
            }
          }
        };
        var result = schemaService.updateWorkspaceToCurrentSchema(workspace);
        var expectedResult = {
          problem: {
            title: 'problem title',
            criteria: {
              crit1: {
                title: 'criterion 1',
                description: 'desc',
                isFavorable: true,
                dataSources: [{
                  id: 'uuid',
                  unitOfMeasurement: 'ms',
                  uncertainties: 'unc',
                  source: 'source'
                }]
              },
              crit2: {
                title: 'criterion 2',
                description: 'desc',
                isFavorable: true,
                dataSources: [{
                  id: 'uuid',
                  unitOfMeasurement: 'ms',
                  uncertainties: 'unc',
                  source: 'source'
                }]
              }
            },
            alternatives: {
              alt1: {
                title: 'alt1'
              },
              alt2: {
                title: 'alt2'
              }
            },
            performanceTable: [{
              criterion: 'crit1',
              alternative: 'alt1',
              dataSource: 'uuid',
              performance: {
                distribution: normalPerformance
              }
            }, {
              criterion: 'crit2',
              alternative: 'alt1',
              dataSource: 'uuid',
              performance: {
                distribution: normalPerformance
              }
            }, {
              criterion: 'crit1',
              alternative: 'alt2',
              dataSource: 'uuid',
              performance: {
                distribution: normalPerformance
              }
            }, {
              criterion: 'crit2',
              alternative: 'alt2',
              dataSource: 'uuid',
              performance: {
                distribution: normalPerformance
              }
            }],
            schemaVersion: currentSchemaVersion
          },
        };
        expect(result).toEqual(expectedResult);
      });

      it('should update a problem of schema version 1.1.0 to the current version', function() {
        var workspace = {
          problem: exampleProblem110()
        };
        var result = schemaService.updateWorkspaceToCurrentSchema(workspace);
        var expectedResult = {
          problem: exampleProblem()
        };
        expect(result).toEqual(expectedResult);
      });

      it('should update a problem of schema version 1.2.2 to the current version', function(){
        var workspace = {
          problem: exampleProblem122()
        };
        var result = schemaService.updateWorkspaceToCurrentSchema(workspace);
        var expectedResult = {
          problem: exampleProblem()
        };
        expect(result).toEqual(expectedResult);
      });
    });

    describe('isInvalidSchema', function() {
      it('should return false if the JSON file passed to the function is valid according to the schema', function() {
        var inputJSON = require('./test.json');
        var result = schemaService.updateProblemToCurrentSchema(inputJSON);
        expect(result.isValid).toBeTruthy();
      });

      it('should return false if the JSON file passed to the function contains relative data', function() {
        var inputJSON = require('./hansen-updated.json');
        var result = schemaService.updateProblemToCurrentSchema(inputJSON);
        expect(result.isValid).toBeTruthy();
      });

      it('should return true if the JSON file passed to the function is not valid according to the schema', function() {
        var inputJSON = require('./test-false.json');
        var result = schemaService.updateProblemToCurrentSchema(inputJSON);
        expect(result.isValid).toBeFalsy();
      });
    });
  });
});
