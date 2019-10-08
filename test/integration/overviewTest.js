'use strict';

const loginService = require('./util/loginService');
const workspaceService = require('./util/workspaceService');
const errorService = require('./util/errorService');

const testUrl = 'http://localhost:3002';
const title = 'Thrombolytics - single study B/R analysis';
const proximalDVTCriterionTitle = '#criterion-title-cae083fa-c1e7-427f-8039-c46479392344';
const proximalDVTCriterionDescription = '#criterion-description-cae083fa-c1e7-427f-8039-c46479392344';
const heparinAlternative = '#alternative-title-cfcdf6df-f231-4c3d-be83-64aa28d8d5f1';

function loadTestWorkspace(browser, title) {
  workspaceService.addExample(browser, title);
  browser
    .click('a[id="' + title + '"]')
    .waitForElementVisible('#workspace-title');

  errorService.isErrorBarHidden(browser);
}

module.exports = {
  'The overview tab': function(browser) {
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    loadTestWorkspace(browser, title);

    const firstDistalDVTValue = '//div[1]/div[2]/criterion-card//table//td[3]//*';

    browser
      .assert.containsText('#therapeutic-context', 'No description given.')
      .assert.containsText(proximalDVTCriterionTitle, 'Proximal DVT')
      .assert.containsText(heparinAlternative, 'Heparin')
      .assert.containsText(proximalDVTCriterionDescription, 'Proximal deep vein thrombolytic events, often associated with serious complications.')
      .useXpath()
      .assert.containsText(firstDistalDVTValue, '40 / 136')
      .useCss()
      ;

    browser.click('#logo');
    workspaceService.deleteFromList(browser, title);
    browser.end();
  },

  'Editing the therapeutic context': function(browser) {
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    loadTestWorkspace(browser, title);

    browser
      .assert.containsText('#therapeutic-context', 'No description given.')
      .click('#edit-therapeutic-context-button')
      .waitForElementVisible('#therapeutic-context-header')
      .setValue('#therapeutic-context-input', 'new context')
      .click('#save-button')
      .assert.containsText('#therapeutic-context', 'new context')
      ;

    browser.click('#logo');
    workspaceService.deleteFromList(browser, title);
    browser.end();
  },

  'Editing a criterion': function(browser) {
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    loadTestWorkspace(browser, title);

    const newTitle = 'new title';
    const newDescription = 'new description';

    const editProximalDVTbutton = '#edit-criterion-cae083fa-c1e7-427f-8039-c46479392344';

    browser
      .click(editProximalDVTbutton)
      .waitForElementVisible('#criterion-title-input')
      .clearValue('#criterion-title-input')
      .setValue('#criterion-title-input', newTitle)
      .clearValue('#criterion-description-input')
      .setValue('#criterion-description-input', newDescription)
      .click('#add-criterion-confirm-button')
      .assert.containsText(proximalDVTCriterionTitle, newTitle)
      .assert.containsText(proximalDVTCriterionDescription, newDescription)
      ;

    browser.click('#logo');
    workspaceService.deleteFromList(browser, title);
    browser.end();
  },

  'Editing a data source': function(browser) {
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    const zynbrita = 'Zinbryta - initial regulatory review';
    loadTestWorkspace(browser, zynbrita);

    const newUnit = 'new unit';
    const newReference = 'newReference';
    const newUrl = 'www.google.com';
    const newStrength = 'new strength';
    const newUncertainties = 'very uncertain';
    const originalReference = 'Study 205MS301';

    const dataSourceReference = '#data-source-reference-f09b3e30-be30-4cad-93ac-9567c2a3a3da-d7dff15e-44a3-4246-b80a-6fc3955464f6';
    const editDataSourceButton = '#edit-data-source-f09b3e30-be30-4cad-93ac-9567c2a3a3da-d7dff15e-44a3-4246-b80a-6fc3955464f6';
    const dataSourceReferenceWithLink = '#linked-data-source-reference-f09b3e30-be30-4cad-93ac-9567c2a3a3da-d7dff15e-44a3-4246-b80a-6fc3955464f6';
    const soeUnc = '#soe-unc-f09b3e30-be30-4cad-93ac-9567c2a3a3da-d7dff15e-44a3-4246-b80a-6fc3955464f6';
    const unitOfMeasurement = '#unit-of-measurement-f09b3e30-be30-4cad-93ac-9567c2a3a3da-d7dff15e-44a3-4246-b80a-6fc3955464f6';

    browser
      .assert.containsText(dataSourceReference, originalReference)
      .assert.containsText(unitOfMeasurement, 'Annual rate')
      .click(editDataSourceButton)
      .waitForElementVisible('#unit-of-measurement-input')
      .clearValue('#unit-of-measurement-input')
      .setValue('#unit-of-measurement-input', newUnit)

      .clearValue('#reference-input')
      .setValue('#reference-input', newReference)
      .setValue('#reference-link-input', newUrl)

      .clearValue('#strength-of-evidence-input')
      .setValue('#strength-of-evidence-input', newStrength)
      .setValue('#uncertainties-input', newUncertainties)

      .click('#edit-data-source-button')
      .assert.containsText(dataSourceReferenceWithLink, newReference)
      .assert.containsText(soeUnc, 'SoE: ' + newStrength + '\nUnc: ' + newUncertainties)
      .assert.containsText(unitOfMeasurement, newUnit)
      ;

    browser.click('#logo');
    workspaceService.deleteFromList(browser, zynbrita);
    browser.end();
  },

  'Editing an alternative': function(browser) {
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    loadTestWorkspace(browser, title);
    const editHeparinButton = '#alternative-edit-button-cfcdf6df-f231-4c3d-be83-64aa28d8d5f1';
    const newTitle = 'new alternative';

    browser
      .click(editHeparinButton)
      .waitForElementVisible('#alternative-title')
      .clearValue('#alternative-title')
      .setValue('#alternative-title', newTitle)
      .click('#save-alternative-button')
      .assert.containsText(heparinAlternative, newTitle)
      ;

    browser.click('#logo');
    workspaceService.deleteFromList(browser, title);
    browser.end();
  },

  'Editing the workspace title': function(browser) {
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    loadTestWorkspace(browser, title);
    const newTitle = 'new workspace title';

    browser
      .click('#edit-workspace-title-button')
      .clearValue('#workspace-title-input')
      .setValue('#workspace-title-input', newTitle)
      .click('#save-workspace-title-button')
      ;
    browser.click('#logo');
    workspaceService.deleteFromList(browser, newTitle);
    browser.end();
  },

  'Reordering criteria': function(browser) {
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    loadTestWorkspace(browser, title);

    const firstCriterionTitle = '/html/body/div[2]/div/div[3]/div/div/div/div/div[1]/div/div/div/div[5]/criterion-list/div/div[1]/criterion-card/div/div[2]/div/div[1]/h5';
    const proximalDown = '#move-down-criterion-cae083fa-c1e7-427f-8039-c46479392344';
    const proximalUp = '#move-up-criterion-cae083fa-c1e7-427f-8039-c46479392344';

    browser
      .click(proximalDown)
      .useXpath()
      .assert.containsText(firstCriterionTitle, 'Distal DVT')
      .useCss()

      .click(proximalUp)
      .useXpath()
      .assert.containsText(firstCriterionTitle, 'Proximal DVT')
      .useCss()
      ;
    browser.click('#logo');
    workspaceService.deleteFromList(browser, title);
    browser.end();
  },

  'Reordering alternatives': function(browser) {
    loginService.login(browser, testUrl, loginService.username, loginService.correctPassword);
    loadTestWorkspace(browser, title);

    const firstAlternativeTitle = '/html/body/div[2]/div/div[3]/div/div/div/div/div[1]/div/div/div/div[7]/table/tbody/tr[1]/td[2]';
    const heparinDown = '#move-down-alternative-cfcdf6df-f231-4c3d-be83-64aa28d8d5f1';
    const heparinUp = '#move-up-alternative-cfcdf6df-f231-4c3d-be83-64aa28d8d5f1';

    browser
      .getLocationInView(heparinDown)
      .waitForElementVisible(heparinDown)
      .click(heparinDown)
      .useXpath()
      .assert.containsText(firstAlternativeTitle, 'Enoxaparin')
      .useCss()

      .click(heparinUp)
      .useXpath()
      .assert.containsText(firstAlternativeTitle, 'Heparin')
      .useCss()
      ;
    browser.click('#logo');
    workspaceService.deleteFromList(browser, title);
    browser.end();
  }

};