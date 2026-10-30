import { expect, Page, test } from '@playwright/test';
import { ConsolidateBalancesFilexPage } from '../src/pages/ConsolidateBalancesFilexPage';
import { LoginPage } from '../src/pages/LoginPage';
import { getUserInfo } from '../src/utils/constants/keys-constants';
import { FIVE_SECONDS, ONE, THREE, THREE_SECONDS, TWO, ZERO } from '../src/utils/constants/number-constants';

test.describe('Feature: Consolidated balances filex', () => {
  const userIndices = [ZERO, ONE, TWO, THREE];

  async function performLogin(page: Page, index: number) {
    const loginPage = new LoginPage(page);
    const consolidateFilexPage = new ConsolidateBalancesFilexPage(page);

    await loginPage.goToLoginPage();
    await loginPage.goToLoginStep();

    await loginPage.completeClientInfo(getUserInfo('DOCUMENTNUMBER', index), getUserInfo('DOCUMENTTYPE', index));
    await loginPage.completeUserInfo(getUserInfo('ALIAS', index), getUserInfo('PASSWORD', index));

    await consolidateFilexPage.goToFilexSection();
    await consolidateFilexPage.goToConsolidatedBalancesFilex();
  }

  test(`Scenario: Success validation of the consolidate balances screen`, async ({ page }) => {
    await performLogin(page, ZERO);
    const consolidateFilexPage = new ConsolidateBalancesFilexPage(page);
    expect(await consolidateFilexPage.ValidateConsolidatedMenu()).toContain('Saldos consolidados');
  });

  test(`Scenario: Success validation of the consolidate balances title`, async ({ page }) => {
    await performLogin(page, ZERO);
    const consolidateFilexPage = new ConsolidateBalancesFilexPage(page);
    expect(await consolidateFilexPage.getConsolidatedBalancesDisplayed()).toEqual('Consolidados por producto');
  });

  for (const index of userIndices.slice(ONE)) {
    const typeUser = getUserInfo('TYPEUSER', index);

    test(`Scenario: Success validation of the consolidate balances screen - User ${typeUser}`, async ({ page }) => {
      await performLogin(page, index);
      const consolidateFilexPage = new ConsolidateBalancesFilexPage(page);
      expect(await consolidateFilexPage.ValidateConsolidatedMenu()).toContain('Saldos consolidados');
    });

    test(`Scenario: Success validation of the consolidate balances title - User ${typeUser}`, async ({ page }) => {
      await performLogin(page, index);
      const consolidateFilexPage = new ConsolidateBalancesFilexPage(page);
      expect(await consolidateFilexPage.getConsolidatedBalancesDisplayed()).toEqual('Consolidados por producto');
    });
  }
  test(`Scenario: Success validation of the EUR accounts`, async ({ page }) => {
    await performLogin(page, ZERO);
    const consolidateFilexPage = new ConsolidateBalancesFilexPage(page);
    expect(await consolidateFilexPage.goToValidateInternationalOptions()).toContain('Cuentas en euros');
  });

  test(`Scenario: Success validation of the download file`, async ({ page }) => {
    await performLogin(page, ZERO);
    const consolidateFilexPage = new ConsolidateBalancesFilexPage(page);
    await consolidateFilexPage.downloadConsolidated();
    await consolidateFilexPage.getValidationMessageWaitDownload();
    await consolidateFilexPage.getValidationDownloadButton();
    expect(await consolidateFilexPage.getValidationDownloadButton()).toContain(
      'La descarga se ha realizado correctamente.'
    );
  });

  test(`Scenario: Success validation of the deposits accounts`, async ({ page }) => {
    await performLogin(page, ZERO);
    const consolidateFilexPage = new ConsolidateBalancesFilexPage(page);
    expect(await consolidateFilexPage.getValidationUpdateButton()).toContain('Cuentas depósito');
  });

  test(`Scenario: Success validation of the USD deposits option`, async ({ page }) => {
    await performLogin(page, ZERO);
    const consolidateFilexPage = new ConsolidateBalancesFilexPage(page);
    await page.waitForTimeout(FIVE_SECONDS);
    expect(await consolidateFilexPage.getDepositsOptions()).toContain('USD $');
  });

  test(`Scenario: Success validation of the USD loans option`, async ({ page }) => {
    await performLogin(page, ZERO);
    const consolidateFilexPage = new ConsolidateBalancesFilexPage(page);
    expect(await consolidateFilexPage.getLoansOptions()).toContain('USD $');
  });

  test(`Scenario: Success validation of the USD investments option`, async ({ page }) => {
    await performLogin(page, ZERO);
    const consolidateFilexPage = new ConsolidateBalancesFilexPage(page);
    const investmentValue = await consolidateFilexPage.getInvestmentOptions();
    expect(investmentValue).toContain('USD $');
  });

  test.skip(`Scenario: Success validation of the coachmark`, async ({ page }) => {
    await performLogin(page, ZERO);
    const consolidateFilexPage = new ConsolidateBalancesFilexPage(page);
    if (consolidateFilexPage.shouldSkip) {
      test.skip();
    }
    expect(await consolidateFilexPage.goToValidateCoachmark()).toContain('Entendido');
  });

  test(`Scenario: Success validation of the redirection when we go to home from consolidate balances breadcrumb`, async ({
    page,
  }) => {
    await performLogin(page, ZERO);
    const consolidateFilexPage = new ConsolidateBalancesFilexPage(page);
    await consolidateFilexPage.homeBreadCrumb.waitFor({ state: 'visible' });
    await consolidateFilexPage.goToHomeWithBreadCrumb();
    await consolidateFilexPage.homeBreadCrumb.waitFor({ state: 'visible' });
    expect(await consolidateFilexPage.validateMinusTitles('Hola')).toEqual(true);
  });

  test(`Scenario: Success validation of the redirection when we go to home from consolidate balances arrow`, async ({
    page,
  }) => {
    await performLogin(page, ZERO);
    const consolidateFilexPage = new ConsolidateBalancesFilexPage(page);
    await consolidateFilexPage.goToHomeWithBackArrow();
    await consolidateFilexPage.backArrow.waitFor({ state: 'visible' });
    await page.waitForTimeout(THREE_SECONDS);
    expect(await consolidateFilexPage.validateMinusTitles('Hola')).toEqual(true);
  });

  test(`Scenario: Success validation of the deposits screen when we go from the EUR option in consolidate balances`, async ({
    page,
  }) => {
    await performLogin(page, ZERO);
    const consolidateFilexPage = new ConsolidateBalancesFilexPage(page);
    await page.waitForTimeout(THREE_SECONDS);
    await consolidateFilexPage.goToServices(ZERO, ONE);
    await page.waitForTimeout(THREE_SECONDS);
    expect(await consolidateFilexPage.validateTitles('Cuentas depósito')).toEqual(true);
  });

  test(`Scenario: Success validation of the deposits screen when we go from the USD option in consolidate balances`, async ({
    page,
  }) => {
    await performLogin(page, ZERO);
    const consolidateFilexPage = new ConsolidateBalancesFilexPage(page);
    await page.waitForTimeout(THREE_SECONDS);
    await consolidateFilexPage.goToServices(ZERO, TWO);
    await page.waitForTimeout(FIVE_SECONDS);
    expect(await consolidateFilexPage.validateTitles('Cuentas depósito')).toEqual(true);
  });

  test(`Scenario: Success validation of the loans screen when we go from the USD option in consolidate balances`, async ({
    page,
  }) => {
    await performLogin(page, ZERO);
    const consolidateFilexPage = new ConsolidateBalancesFilexPage(page);
    await page.waitForTimeout(THREE_SECONDS);
    await consolidateFilexPage.goToServices(ONE, ONE);
    await page.waitForTimeout(FIVE_SECONDS);
    expect(await consolidateFilexPage.validateTitles('Créditos')).toEqual(true);
  });

  test(`Scenario: Success validation of the investmenets screen when we go from the USD option in consolidate balances`, async ({
    page,
  }) => {
    await performLogin(page, ZERO);
    const consolidateFilexPage = new ConsolidateBalancesFilexPage(page);
    await page.waitForTimeout(THREE_SECONDS);
    await consolidateFilexPage.goToServices(TWO, ONE);
    await page.waitForTimeout(FIVE_SECONDS);
    expect(await consolidateFilexPage.validateTitles('Inversiones')).toEqual(true);
  });

  test(`Scenario: Success validation of the investments screen when we go from the EUR option in consolidate balances`, async ({
    page,
  }) => {
    await performLogin(page, ZERO);
    const consolidateFilexPage = new ConsolidateBalancesFilexPage(page);
    await page.waitForTimeout(THREE_SECONDS);
    await consolidateFilexPage.goToServices(TWO, TWO);
    expect(await consolidateFilexPage.validateTitles('Inversiones')).toEqual(true);
  });
});
