'use strict';

const _ = require('lodash');

const loginService = require('./util/loginService.js');
const workspaceService = require('./util/workspaceService.js');

const testUrl = 'http://localhost:3002';

function clickElement(browser, element) {
  const elementValue = element.value;
  const elementKey = _.keys(elementValue)[0];
  browser.elementIdClick(elementValue[elementKey]).pause(500);
}

function clickCheckBox(browser, elementId) {
  const path = '//*[@id="' + elementId + '"]';
  browser.waitForElementVisible
  browser.element('xpath', path, _.partial(clickElement, browser));
}

module.exports = {
  '??': function(browser) {
    const title = 'Test workspace';
    const workspacePath = '/create_subproblem.json';
    const subproblem1 = {
      title: 'subproblem1'
    };

    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    workspaceService.uploadTestWorkspace(browser, workspacePath);

    browser
      .waitForElementVisible('#workspace-title')
      .click('#problem-definition-tab')
      .waitForElementVisible('#effects-table-header')
      .click('#create-subproblem-button')
      .waitForElementVisible('#create-subproblem-header')
      .assert.containsText('#no-title-warning', 'No title entered')
      .assert.containsText('#missing-values-warning', 'Effects table may not contain missing values')
      .assert.containsText('#multiple-data-sources-warning', 'Effects table may not contain multiple data sources per criterion')
      .setValue('#subproblem-title', subproblem1.title)
      // .assert.hidden('#no-title-warning')
      // .click('#reset-subproblem-button')
      // .assert.containsText('#no-title-warning', 'No title entered')
      // .setValue('#subproblem-title', subproblem1.title)
      .click('#deselectionAlternativeId')
      .click('#deselectionDataSourceId')
      .click('#deselectionCriterionId')
      ;

    workspaceService.deleteFromList(browser, title);
    browser.waitForElementVisible('#empty-workspace-message');
    browser.end();
  },
};