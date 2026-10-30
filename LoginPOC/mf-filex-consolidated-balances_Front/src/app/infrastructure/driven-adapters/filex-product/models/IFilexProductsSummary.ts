export interface ISummaryFilex {
  data?: Data;
}

export interface Data {
  products?: Products;
}

export interface Products {
  deposits?: [Deposits];
  loans?: [Loans];
  investments?: [Investments];
}

export interface Deposits {
  USD?: DepositsUSD;
  EUR?: DepositsEUR;
  error?: any;
}

export interface DepositsUSD {
  totalBalance?: number | any;
}
export interface DepositsEUR {
  totalBalance?: number | any;
}
export interface Investments {
  USD?: InvestmentsUSD | any;
  EUR?: InvestmentsEUR | any;
  error?: any;
}

export interface InvestmentsUSD {
  stock?: number;
}
export interface InvestmentsEUR {
  stock?: number;
}

export interface Loans {
  USD?: LoansUSD | any;
  EUR?: LoansEUR | any;
  error?: any;
}

export interface LoansUSD {
  currentCapital?: number;
}
export interface LoansEUR {
  currentCapital?: number;
}
