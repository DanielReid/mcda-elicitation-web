'use strict';

module.exports = {
  beforeEach: beforeEach,
  afterEach: afterEach,
  'Setting the weights through ranking': ranking,
  'Ranking previous button': rankingGoBack,
  'Setting the weights through matching': matching,
  // 'Setting the weights through matching with a piecewise-linear pvf': matchingPiecewiseLinear,
  //FIXME
  'Matching previous button': matchingGoBack,
  'Setting the weights through precise swing weighting': preciseSwing,
  'Precise swing previous button': preciseSwingGoBack,
  'Setting the weights through imprecise swing weighting': impreciseSwing,
  'Imprecise swing previous button': impreciseSwingGoBack
};

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');
const errorService = require('./util/errorService');

function loadTestWorkspace(browser) {
  workspaceService
    .addExample(browser, 'GetReal course LU 4, activity 4.4')
    .click('#workspace-0')
    .waitForElementVisible('#workspace-title');

  errorService
    .isErrorBarNotPresent(browser)
    .click('#preferences-tab')
    .waitForElementVisible('#partial-value-functions-block');
}

function resetWeights(browser) {
  browser
    .click('#reset-button')
    .assert.containsText('#elicitation-method', 'None')
    .assert.containsText('#importance-criterion-OS', '?')
    .assert.containsText('#importance-criterion-severe', '?')
    .assert.containsText('#importance-criterion-moderate', '?');
}

function matchImportanceColumnContents(
  browser,
  method,
  value1,
  value2,
  value3
) {
  browser
    .waitForElementVisible('#perferences-weights-table')
    .assert.containsText('#elicitation-method', method)
    .assert.containsText('#importance-criterion-OS', value1)
    .assert.containsText('#importance-criterion-severe', value2)
    .assert.containsText('#importance-criterion-moderate', value3);
}

function beforeEach(browser) {
  loginService.login(browser);
  workspaceService.cleanList(browser);
  loadTestWorkspace(browser);
  browser.pause(1000);
}

function afterEach(browser) {
  browser.click('#logo');
  workspaceService.deleteFromList(browser, 0).end();
}

function ranking(browser) {
  browser
    .click('#ranking-button')
    .waitForElementVisible('#ranking-title-header')
    .click('#criterion-option-OS')
    .click('#next-button')
    .click('#criterion-option-severe')
    .click('#save-button');

  matchImportanceColumnContents(browser, 'Ranking', 1, 2, 3);
  resetWeights(browser);
}

function rankingGoBack(browser) {
  browser
    .click('#ranking-button')
    .waitForElementVisible('#ranking-title-header')
    .assert.containsText('#step-counter', 'Step 1 of 2')
    .click('#criterion-option-OS')
    .click('#next-button')
    .assert.containsText('#step-counter', 'Step 2 of 2')
    .click('#previous-button')
    .assert.containsText('#step-counter', 'Step 1 of 2');
}

function matching(browser, expectedOsImportance) {
  const sliderValue = '//*[@id="matching-slider"]/span[3]';

  browser
    .click('#matching-button')
    .waitForElementVisible('#matching-title-header')
    .click('#criterion-option-severe')
    .click('#next-button')
    .useXpath()
    .click(sliderValue)
    .sendKeys(sliderValue, [
      browser.Keys.ARROW_RIGHT,
      browser.Keys.ARROW_RIGHT,
      browser.Keys.ARROW_RIGHT
    ])
    .useCss()
    .assert.containsText('#matching-cell', '3')
    .click('#next-button')
    .click('#save-button');

  matchImportanceColumnContents(
    browser,
    'Matching',
    expectedOsImportance ? expectedOsImportance : '96%',
    '100%',
    '100%'
  );
  resetWeights(browser);
}

function matchingPiecewiseLinear(browser) {
  browser
    .click('#advanced-pvf-button-severe')
    .click('#decreasing-pvf-option')
    .click('span.MuiSlider-mark:nth-child(14)') // 11 on slider
    .click('span.MuiSlider-mark:nth-child(37)') // 34 on slider
    .click('span.MuiSlider-mark:nth-child(79)') // 76 on slider
    .pause(1000)
    .click('#save-button')
    .waitForElementVisible('#partial-value-functions-block');
  matching(browser, '93%');
}

function matchingGoBack(browser) {
  browser
    .click('#matching-button')
    .waitForElementVisible('#matching-title-header')
    .assert.containsText('#step-counter', 'Step 1 of 3')
    .click('#criterion-option-OS')
    .click('#next-button')
    .assert.containsText('#step-counter', 'Step 2 of 3')
    .click('#previous-button')
    .assert.containsText('#step-counter', 'Step 1 of 3');
}

function preciseSwing(browser) {
  browser
    .click('#precise-swing-button')
    .waitForElementVisible('#swing-weighting-title-header')
    .click('#criterion-option-OS')
    .click('#next-button')
    .click('#save-button');

  matchImportanceColumnContents(
    browser,
    'Precise Swing Weighting',
    '100%',
    '100%',
    '100%'
  );
  resetWeights(browser);
}

function preciseSwingGoBack(browser) {
  browser
    .click('#precise-swing-button')
    .waitForElementVisible('#swing-weighting-title-header')
    .assert.containsText('#step-counter', 'Step 1 of 2')
    .click('#criterion-option-OS')
    .click('#next-button')
    .assert.containsText('#step-counter', 'Step 2 of 2')
    .click('#previous-button')
    .assert.containsText('#step-counter', 'Step 1 of 2');
}

function impreciseSwing(browser) {
  browser
    .click('#imprecise-swing-button')
    .waitForElementVisible('#swing-weighting-title-header')
    .click('#criterion-option-OS')
    .click('#next-button')
    .click('#save-button');

  matchImportanceColumnContents(
    browser,
    'Imprecise Swing Weighting',
    '100%',
    '1-100%',
    '1-100%'
  );
  resetWeights(browser);
}

function impreciseSwingGoBack(browser) {
  browser
    .click('#imprecise-swing-button')
    .waitForElementVisible('#swing-weighting-title-header')
    .assert.containsText('#step-counter', 'Step 1 of 2')
    .click('#criterion-option-OS')
    .click('#next-button')
    .assert.containsText('#step-counter', 'Step 2 of 2')
    .click('#previous-button')
    .assert.containsText('#step-counter', 'Step 1 of 2');
}
