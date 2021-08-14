/* eslint-disable class-methods-use-this */

export class Impressao {
  constructor(dadosParaImpressao, valor) {
    this.dadosParaImpressao = dadosParaImpressao;
    this.valor = valor;
  }

  async PreparaDocumento() {
    const corpoDocumento = this.CriaCorpoDocumento();
    const documento = this.GerarDocumento(corpoDocumento);
    return documento;
  }

  CriaCorpoDocumento() {
    const header = [
      { text: 'Data', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
      { text: 'Descrição', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
      { text: 'Movimentação', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
      { text: 'Investimento', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
      {
        text: 'Valor',
        bold: true,
        fontSize: 9,
        margin: [0, 4, 0, 0],
      },
    ];
    const body = this.dadosParaImpressao.map((dado) => {
      return [
        { text: dado.dataOp, fontSize: 8 },
        { text: dado.descricao, fontSize: 8 },
        { text: dado.tipo, fontSize: 8 },
        { text: dado.investimento, fontSize: 8 },
        { text: dado.valor, fontSize: 8 },
      ];
    });

    const lineHeader = [
      {
        text:
          '__________________________________________________________________________________________________________________________________________________________________________________________________________________________________',
        alignment: 'center',
        fontSize: 5,
        colSpan: 5,
      },
      {},
      {},
    ];
    const valorTotal = [
      {
        text: `Valor Total: ${this.valor}`,
        fontSize: 8,
        colSpan: 5,
        bold: true,
      },
      {},
      {},
    ];

    let content = [header, lineHeader];
    content = [...content, ...body, valorTotal];
    return content;
  }

  GerarDocumento(corpoDocumento) {
    const { valor } = this;
    const documento = {
      pageSize: 'A4',
      pageMargins: [14, 53, 14, 48],
      header() {
        return {
          margin: [14, 12, 14, 0],
          layout: 'noBorders',
          table: {
            widths: ['*'],
            body: [[{ text: 'RELATÓRIO DE VENDAS', style: 'reportName' }]],
          },
        };
      },
      content: [
        {
          layout: 'noBorders',
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*'],

            body: corpoDocumento,
          },
        },
      ],
      footer(currentPage, pageCount) {
        return {
          layout: 'noBorders',
          margin: [14, 0, 14, 22],
          table: {
            widths: ['auto'],
            body: [
              [
                {
                  text:
                    '_________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________',
                  alignment: 'center',
                  fontSize: 5,
                },
              ],
              [
                [
                  {
                    text: `Página ${currentPage.toString()} de ${pageCount} valor total${valor}`,
                    fontSize: 7,
                    alignment: 'right',
                    /* horizontal, vertical */
                    margin: [3, 0],
                  },
                  {
                    text: '© Lojinha de TI',
                    fontSize: 7,
                    alignment: 'center',
                  },
                ],
              ],
            ],
          },
        };
      },
      styles: {
        reportName: {
          fontSize: 9,
          bold: true,
          alignment: 'center',
          margin: [0, 4, 0, 0],
        },
      },
    };
    return documento;
  }
}
