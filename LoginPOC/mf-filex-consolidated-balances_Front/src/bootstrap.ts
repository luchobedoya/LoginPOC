import { setupMicroFrontend } from '@bancolombia/ngx-microfront-toolkit';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { environment } from './environments/environment';

export const app = setupMicroFrontend(AppComponent, {
  rootSelector: 'svn-mf-filex-consolidated-balances',
  styles: {
    version: environment.BDS_VERSION,
    light: { href: environment.DESIGN_SYSTEM_CSS_URL, id: 'svnThemeCSS' },
    dark: { href: environment.DESIGN_SYSTEM_CSS_URL, id: 'svnThemeDarkCSS' },
  },
  parentNode: () => document.getElementById('svn-mf-container'),
  isStandalone: true,
  appConfig,
});
