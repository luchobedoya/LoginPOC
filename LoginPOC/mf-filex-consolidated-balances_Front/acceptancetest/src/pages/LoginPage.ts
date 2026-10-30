import { Locator, Page } from 'playwright';
import { NUMBERS } from '../utils/constants/number-constants';

export class LoginPage {
  readonly page: Page;
  public readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginButton = this.page.locator('//button[text()=" Iniciar sesión "]');
  }
  async goToLoginPage() {
    await this.page.goto('/ingreso/empresa');
  }

  async goToLoginStep() {
    await this.loginButton.click();
  }

  async getBalancesWelcome() {
    return await this.page.textContent("//div[@class='bc-page-header-content-left-title']/h6");
  }

  async completeClientInfo(doc: string, type: string) {
    await this.page.waitForTimeout(NUMBERS.THOUSAND);
    await this.page.evaluate(() => localStorage.setItem('DASHBOARD_COACHMARK', 'true'));
    await this.page
      .locator('//div[contains(@label,"Tipo de documento")]')
      .evaluate((element) => element.scrollIntoView());
    await this.page.click('//div[contains(@label,"Tipo de documento")]');
    await this.page.click("//*[contains(@class, 'bc-float-menu-option') and @data-value='" + type + "']");
    await this.page.click('//*[contains(@id,"input-document_number")]');
    await this.page.fill('//*[contains(@id,"input-document_number")]', doc);
  }

  async completeUserInfo(user: string, password: string) {
    await this.page.click("//input[contains(@id,'bc_input-user')]");
    await this.page.fill("//input[contains(@id,'bc_input-user')]", user);
    await this.page.waitForTimeout(NUMBERS.THOUSAND);
    await this.page.click("//input[contains(@id,'bc_input-password')]");
    await this.page.fill("//input[contains(@id,'bc_input-password')]", password);
    await this.page.waitForTimeout(NUMBERS.TWOTHOUSAND);
    await this.loginButton.click();
  }
}

