import { Locator, Page } from 'playwright';
import { FIVE_SECONDS, THREE_SECONDS, TWO_SECONDS } from '../utils/constants/number-constants';

export class ConsolidateBalancesFilexPage {
  readonly page: Page;
  public readonly productsMenuOption: Locator;
  public readonly consolidatedBalancesMenuItemOption: Locator;
  public readonly switchGroupFilex: Locator;
  public readonly homeBreadCrumb: Locator;
  public readonly backArrow: Locator;
  public readonly welcomeFilex: Locator;
  public readonly initButton: Locator;
  public readonly buttonFilex: Locator;
  titleDetailAccount: Locator;
  titleDetailCredit: Locator;

  constructor(page: Page) {
    this.page = page;
    this.switchGroupFilex = page.locator('//label//span[text()="Filex"]');
    this.productsMenuOption = page.locator('//li[@title="Productos"]');
    this.consolidatedBalancesMenuItemOption = page.locator(
      "//a[contains(@class, 'bc-link') and .//span[text()='Consolidados por producto']]"
    );
    this.homeBreadCrumb = page.locator('//li/a/span[text()="Inicio"]');
    this.backArrow = page.getByLabel('Regresar a la pagina anterior');
    this.welcomeFilex = page.locator('//h3[contains(text(),"Te damos la bienvenida a Filex")]');
    this.initButton = page.locator('(//span[contains(text(),"Inicio")])[1]');
    this.buttonFilex = page.locator('//button[contains(text(),"Filex")]');
    this.titleDetailAccount = page.locator('//h3[contains(text(), "Cuentas depósito")]');
    this.titleDetailCredit = page.locator('//h3[contains(text(), "Créditos")]');
  }

  shouldSkip = process.env['SKIP_TESTS'] === 'true';

  public async goToFilexSection() {
    await this.initButton.waitFor();
    const element = this.switchGroupFilex.isVisible();
    if (await element) {
      this.switchGroupFilex.click();
      await this.welcomeFilex.waitFor();
    } else {
      this.buttonFilex.click();
      await this.welcomeFilex.waitFor();
    }
  }

  public async goToConsolidatedBalancesFilex() {
    await this.productsMenuOption.click();
    await this.consolidatedBalancesMenuItemOption.click();
  }

  async ValidateConsolidatedMenu() {
    return await this.page.textContent('//span[contains(text(),"Saldos consolidados")]');
  }

  async getConsolidatedBalancesDisplayed() {
    return await this.page.textContent("//h3[text()='Consolidados por producto']");
  }

  async goToValidateSwitch() {
    await this.page.locator('//li/span[contains(text(),"Colombia")]');
    await this.page.click('//li/span[contains(text(),"Filiales")]');
    return await this.page.textContent('//li/span[contains(text(),"Filiales")]');
  }

  async goToInternacionales() {
    await this.page.click('//li/span[contains(text(),"Filiales")]');
  }

  async goToValidateInternationalOptions() {
    await this.page.locator('//span[contains(text(),"Cuentas en dólares")]');
    return await this.page.textContent('//span[contains(text(),"Cuentas en euros")]');
  }

  async downloadConsolidated() {
    await this.page.click('//span[contains(text(),"Descargar consolidados")]');
  }

  async getValidationMessageWaitDownload() {
    return await this.page.textContent('//*[contains(text(),"Estamos generando tu descarga.")]');
  }

  async getValidationDownloadButton() {
    const successXpath = '//h3[contains(text(),"La descarga se ha realizado correctamente.")]';
    await this.page.waitForSelector(successXpath, {
      state: 'visible',
      timeout: FIVE_SECONDS,
    });
    return await this.page.textContent(successXpath);
  }

  async getValidationUpdateButton() {
    await this.page.click('//button/i[contains(text(),"refresh")]');
    return await this.page.textContent('//h5[contains(text(),"Cuentas depósito")]');
  }

  async getDepositsOptions() {
    await this.page.waitForSelector('//h5[contains(text(),"Cuentas depósito")]');
    await this.page.waitForTimeout(THREE_SECONDS);
    await this.page.waitForSelector('//span[contains(text(),"Cuentas en euros")]');
    await this.page.waitForSelector('//span[contains(text(),"Cuentas en dólares")]');
    await this.page.waitForSelector('//*[contains(text(),"EUR €")]');
    return await this.page.textContent('(//div[@id="col-0-2"])[2]');
  }

  async getLoansOptions() {
    await this.page.locator('//small[contains(text(),"Valor inicial")]').isVisible();
    await this.page.locator('//small[contains(text(),"Deuda a la fecha")]').isVisible();
    await this.page.locator('//span[contains(text(),"Créditos en dólares")]').isVisible();
    await this.page.locator('//div[@id="col-1-1"]').last().isVisible();
    return await this.page.locator('//div[@id="col-1-2"]').last().textContent();
  }

  async getInvestmentOptions() {
    const productTitle = this.page
      .locator('span.font-maincontent1', {
        hasText: 'Inversiones en dólares',
      })
      .last();
    const amountLocator = this.page
      .locator('div#col-1-2 p')
      .filter({
        has: productTitle.locator('xpath=./ancestor::div[contains(@class, "bc-row")]'),
      })
      .last();
    const fallbackLocator = this.page.locator('div#col-1-2 p').last();
    try {
      await fallbackLocator.waitFor({ state: 'attached', timeout: 15000 });
      const rawText = await fallbackLocator.textContent();
      return rawText ? rawText.replace(/\s+/g, ' ').trim() : '';
    } catch (error) {
      throw new Error(
        'No se pudo localizar el monto USD. El selector falló al encontrar el valor en la tabla de productos.'
      );
    }
  }

  async goToProfilePage() {
    await this.page.waitForTimeout(THREE_SECONDS);
    await this.page.click('//bc-header-list/section/ul[1]/li[3]');
    await this.page.waitForSelector('//*[contains(text(),"Preferencias y accesibilidad")]');
    await this.page.click("(//li[@class='bc-float-menu-option'])[8]");
    await this.page.click('(//input[@name="black-label"])[2]');
  }

  async backGroundThema() {
    await this.page.waitForTimeout(TWO_SECONDS);
    return this.page.locator("//section[@class='bc-menu-v2-content bc-bg-light']");
  }

  async goToValidateCoachmark() {
    await this.page.click("//section[@class='bc-coach-mark-close']/button");
    await this.page.click('//bc-button-group[@value="Filex"]');
    await this.page.click('//a[@class="bc-menu-item" and @for="productsContent"]', { delay: 1000 });
    await this.page.click('//a/li[contains(text(),"Consolidado")]');
    await this.page.waitForTimeout(TWO_SECONDS);
    await this.page.waitForSelector('//h4[contains(text(),"Selecciona entre Colombia y filiales")]');
    await this.page.waitForSelector(
      '//p[contains(text(),"En Colombia encontrarás los productos de este país y en filiales los productos Bancolombia de Panamá y Puerto Rico.")]'
    );
    await this.page.waitForSelector('//div[contains(text(),"1/3")]');
    await this.page.click('//button[contains(text(),"Siguiente")]');
    await this.page.waitForSelector('//h4[contains(text(),"Descarga los consolidados")]');
    await this.page.waitForSelector(
      '//p[contains(text(),"Descarga los consolidados de tus productos tanto de Colombia como en filiales.")]'
    );
    await this.page.waitForSelector('//div[contains(text(),"2/3")]');
    await this.page.waitForSelector('//button[contains(text(),"Volver")]');
    await this.page.click('//button[contains(text(),"Siguiente")]');
    await this.page.waitForSelector('//h4[contains(text(),"Saldos consolidados de todos los productos")]');
    await this.page.waitForSelector(
      '//p[contains(text(),"Encuentra la suma total de todos los productos que tienes asignados por categoría.")]'
    );
    await this.page.waitForSelector('//div[contains(text(),"3/3")]');
    await this.page.waitForSelector('//button[contains(text(),"Volver")]');
    return this.page.textContent('//button[contains(text(),"Entendido")]');
  }

  public async goToHomeWithBreadCrumb() {
    this.homeBreadCrumb.click();
  }

  public async goToHomeWithBackArrow() {
    this.backArrow.click();
  }

  public async validateTitles(text: string) {
    await this.page.waitForSelector('//h3[contains(text(),"' + text + '")]');
    return await this.page.locator('//h3[contains(text(),"' + text + '")]').isVisible();
  }

  public async validateSubTitles(text: string) {
    await this.page.waitForSelector('//h5[contains(text(),"' + text + '")]');
    return await this.page.locator('//h5[contains(text(),"' + text + '")]').isVisible();
  }

  public async validateMinusTitles(text: string) {
    await this.page.waitForSelector('//h6[contains(text(),"' + text + '")]');
    return await this.page.locator('//h6[contains(text(),"' + text + '")]').isVisible();
  }

  public async goToServices(positionList: number, positionValue: number) {
    this.page.locator('(//*[@id="lista-' + positionList + '"])[' + positionValue + ']').click();
  }
}
