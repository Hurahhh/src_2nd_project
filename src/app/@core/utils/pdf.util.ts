import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { times } from '../constants/times_font.constant';
import { timesi } from '../constants/timesi_font.constant';
import { timesbd } from '../constants/timesbd_font.constant';
import { timesbi } from '../constants/timesbi_font.constant';
import { PaymentPdfDto } from '../dtos/payment.dto';

export class PdfUtil {
  static TOP_MARGIN = 36;
  static BOTTOM_MARGIN = 36;
  static LEFT_MARGIN = 36;
  static RIGHT_MARGIN = 36;

  static PAGE_WIDTH = 596;
  static PAGE_HEIGHT = 842;

  static initDoc(paperSize: string = 'a4') {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: paperSize,
    });
    doc.addFileToVFS('times.ttf', times);
    doc.addFileToVFS('timesi.ttf', timesi);
    doc.addFileToVFS('timesbd.ttf', timesbd);
    doc.addFileToVFS('timesbi.ttf', timesbi);
    doc.addFont('times.ttf', 'gmm_times', 'normal');
    doc.addFont('timesi.ttf', 'gmm_timesi', 'normal');
    doc.addFont('timesbd.ttf', 'gmm_timesbd', 'normal');
    doc.addFont('timesbi.ttf', 'gmm_timesbi', 'normal');

    return doc;
  }

  /**
   * @returns DataUri
   */
  static makePaymentPdf(payment: PaymentPdfDto): string {
    const doc = PdfUtil.initDoc();

    // left header
    doc.setFont('gmm_times');
    doc.setFontSize(12);
    doc.text(payment.groupName, PdfUtil.LEFT_MARGIN, PdfUtil.TOP_MARGIN);

    // right header
    doc.text(
      'Group Money Management System - GMMS',
      PdfUtil.PAGE_WIDTH - PdfUtil.RIGHT_MARGIN,
      PdfUtil.TOP_MARGIN,
      {
        align: 'right',
      }
    );

    // center
    doc.setFont('gmm_timesbd');
    doc.setFontSize(16);
    doc.text(
      'PHIẾU CHI',
      PdfUtil.PAGE_WIDTH / 2 - doc.getTextWidth('PHIẾU CHI') / 2,
      PdfUtil.TOP_MARGIN + 48,
      {
        align: 'left',
      }
    );

    const paymentAt = new Date(payment.paymentAt.seconds * 1000);
    const paymentAtString = PdfUtil.ToDateViStr(paymentAt);
    doc.setFont('gmm_timesi');
    doc.setFontSize(12);
    doc.text(
      paymentAtString,
      PdfUtil.PAGE_WIDTH / 2 - doc.getTextWidth(paymentAtString) / 2,
      PdfUtil.TOP_MARGIN + 64,
      {
        align: 'left',
      }
    );

    // a side
    doc.setFont('gmm_timesbd');
    doc.setFontSize(12);
    doc.text('Bên A:', PdfUtil.LEFT_MARGIN, PdfUtil.TOP_MARGIN + 96, {
      align: 'left',
    });
    doc.setFont('gmm_times');
    doc.text(
      'Danh sách chủ chi bao gồm:',
      PdfUtil.LEFT_MARGIN + doc.getTextWidth('Bên A:') + 6,
      PdfUtil.TOP_MARGIN + 96,
      {
        align: 'left',
      }
    );

    const asideRows = payment.aSide.map((a) => {
      return [a.userName, a.amount, a.description];
    });

    autoTable(doc, {
      head: [
        [
          {
            content: 'Tên',
            styles: { halign: 'left', font: 'gmm_timesbd' },
          },
          {
            content: 'Số tiền',
            styles: { halign: 'center', font: 'gmm_timesbd' },
          },
          {
            content: 'Lý do',
            styles: { halign: 'left', font: 'gmm_timesbd' },
          },
        ],
      ],
      body: asideRows,
      startY: 144,
      theme: 'grid',
      headStyles: { halign: 'center' },
      columnStyles: {
        0: { cellWidth: 125 },
        1: { halign: 'center', cellWidth: 75 },
      },
      styles: {
        font: 'gmm_times',
        lineWidth: 0.5,
        lineColor: '#00000',
        fillColor: '#ffffff',
        textColor: '#00000',
      },
    });

    // b side
    // @ts-ignore
    let finalY = doc.lastAutoTable.finalY;
    doc.setFont('gmm_timesbd');
    doc.text('Bên B:', PdfUtil.LEFT_MARGIN, finalY + 32);
    doc.setFont('gmm_times');
    doc.text(
      'Danh sách thụ hưởng bao gồm:',
      PdfUtil.LEFT_MARGIN + doc.getTextWidth('Bên B:') + 6,
      finalY + 32
    );

    const bsideRows = payment.bSide.map((b) => {
      return ['- ' + b.userName];
    });

    autoTable(doc, {
      body: bsideRows,
      startY: finalY + 40,
      theme: 'grid',
      showHead: 'never',
      styles: {
        font: 'gmm_times',
        fontSize: 13,
        lineWidth: 0,
        lineColor: '#00000',
        fillColor: '#ffffff',
        textColor: '#00000',
      },
    });

    // signature
    // @ts-ignore
    finalY = doc.lastAutoTable.finalY;
    const nowString = PdfUtil.ToDateViStr(new Date());

    doc.setFont('gmm_timesi');
    doc.text(
      nowString,
      PdfUtil.PAGE_WIDTH - PdfUtil.RIGHT_MARGIN,
      finalY + 32,
      {
        align: 'right',
      }
    );

    const centerY =
      PdfUtil.PAGE_WIDTH -
      PdfUtil.RIGHT_MARGIN -
      doc.getTextWidth(nowString) / 2;
    doc.setFont('gmm_timesbd');
    doc.text('Người lập phiếu', centerY, finalY + 48, {
      align: 'center',
    });

    doc.setFont('gmm_timesi');
    doc.text('(Ký, họ tên)', centerY, finalY + 64, {
      align: 'center',
    });

    // doc.setFont('gmm_times');
    // doc.text(payment.creatorName, centerY, finalY + 150, {
    //   align: 'center',
    // });

    return doc.output('datauristring');
  }

  static ToDateViStr(date: Date) {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return 'Ngày ' + day + ' tháng ' + month + ' năm ' + year;
  }
}
