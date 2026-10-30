import { expect, test } from '@playwright/test';
import { ConsolidateBalancesFilexPage } from '../src/pages/ConsolidateBalancesFilexPage';
import { LoginPage } from '../src/pages/LoginPage';
import { getUserInfo } from '../src/utils/constants/keys-constants';
import { ONE, THREE_SECONDS, TWO, ZERO } from '../src/utils/constants/number-constants';

test.describe('Consolidated balances filex', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const consolidateFilexPage = new ConsolidateBalancesFilexPage(page);
    await loginPage.goToLoginPage();
    await loginPage.goToLoginStep();
    await loginPage.completeClientInfo(getUserInfo('DOCUMENTNUMBER', ZERO), getUserInfo('DOCUMENTTYPE', ZERO));
    await loginPage.completeUserInfo(getUserInfo('ALIAS', ZERO), getUserInfo('PASSWORD', ZERO));

    await consolidateFilexPage.goToFilexSection();
    await consolidateFilexPage.goToConsolidatedBalancesFilex();
  });

  test(`Scenario: Success validation of the consolidate balances screen`, async ({ page }) => {
    const consolidateFilexPage = new ConsolidateBalancesFilexPage(page);
    expect(await consolidateFilexPage.ValidateConsolidatedMenu()).toContain('Saldos consolidados');
  });

  test(`Scenario: Success validation of the consolidate balances title`, async ({ page }) => {
    const consolidateFilexPage = new ConsolidateBalancesFilexPage(page);
    expect(await consolidateFilexPage.getConsolidatedBalancesDisplayed()).toEqual('Consolidados por producto');
  });

  test(`Scenario: Success validation of the download file`, async ({ page }) => {
    const consolidateFilexPage = new ConsolidateBalancesFilexPage(page);
    await consolidateFilexPage.downloadConsolidated();
    await consolidateFilexPage.getValidationMessageWaitDownload();
    await consolidateFilexPage.getValidationDownloadButton();
    expect(await consolidateFilexPage.getValidationDownloadButton()).toContain(
      'La descarga se ha realizado correctamente.'
    );
  });

  test(`Scenario: Success validation of the deposits accounts`, async ({ page }) => {
    const consolidateFilexPage = new ConsolidateBalancesFilexPage(page);
    expect(await consolidateFilexPage.getValidationUpdateButton()).toContain('Cuentas depósito');
  });

  test(`Scenario: Success validation of the investmenets screen when we go from the USD option in consolidate balances`, async ({
    page,
  }) => {
    const consolidateFilexPage = new ConsolidateBalancesFilexPage(page);
    await page.waitForTimeout(THREE_SECONDS);
    await consolidateFilexPage.goToServices(TWO, ONE);
    expect(await consolidateFilexPage.validateSubTitles('Inversiones')).toEqual(true);
  });

  test(`Scenario: Success validation of the investments screen when we go from the EUR option in consolidate balances`, async ({
    page,
  }) => {
    const consolidateFilexPage = new ConsolidateBalancesFilexPage(page);
    await page.waitForTimeout(THREE_SECONDS);
    await consolidateFilexPage.goToServices(TWO, TWO);
    expect(await consolidateFilexPage.validateSubTitles('Inversiones')).toEqual(true);
  });
});
