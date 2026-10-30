import { IErrorComponent } from '@svn/shared-utils-web';
export const LABEL_CANTACT_US = 'Contáctanos';
export const emptyError: IErrorComponent = {
  icon: {
    type: 'illustration',
    name: 'il-send-money-to',
    size: 'xl',
    width: '15rem',
  },
  title: 'Aún no cuentas con productos en <br> nuestras filiales del exterior',
  text: '',
  typeHomeButton: 'primary',
  homeButtonAlwaysVisible: true,
};

export const errorDefault: IErrorComponent = {
  icon: {
    name: 'il-process-mistake',
    size: 'xl',
    width: '15rem',
    type: 'illustration',
  },
  title: 'Algo salió mal',
  text: 'No fue posible cargar la información. Intenta de nuevo',
  btnText: 'Intentar nuevamente',
  errorCode: '',
  typeButton: 'secondary',
};

export const MAXIMUM_RETRIES_ERROR: IErrorComponent = {
  ...errorDefault,
  title: 'El sistema no se encuentra disponible',
  text: 'Nuestro equipo está trabajando para brindarte una pronta solución.<br> Te invitamos a realizar esta transacción a través de nuestra Sucursal Telefónica.',
  btnText: 'Contáctanos',
  typeButton: 'secondary',
  typeHomeButton: 'primary',
  homeButtonAlwaysVisible: true,
};

export const MAXIMUM_RETRIES_ERROR_FILEX: IErrorComponent = {
  icon: {
    name: 'il-process-mistake',
    size: 'xl',
    width: '15rem',
    type: 'illustration',
  },
  title: 'El sistema no se encuentra disponible',
  text: 'Nuestro equipo está trabajando para brindarte una pronta solución.',
  btnText: undefined,
  typeHomeButton: 'primary',
  homeButtonAlwaysVisible: true,
};
