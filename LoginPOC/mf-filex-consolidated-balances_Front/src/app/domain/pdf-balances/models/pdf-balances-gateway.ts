export abstract class PdfBalancesGateway {
  abstract downloadBalancesFilexPDF(detailBalances: object): Promise<void>;
}
