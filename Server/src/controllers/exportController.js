const Bootcamp = require('../models/bootcampModel');
const CustomError = require('../utils/CustomError');
const ExcelJS = require('exceljs');

const createAlloSheet = (alloWS, allocation) => {
    alloWS.mergeCells('A1:A2');
    alloWS.mergeCells('B1:D1');

    // set align and justify
    for (let row = 1; row <= 50; row++) {
        for (let col = 1; col <= 4; col++) {
            alloWS.getCell(row, col).alignment = {
                vertical: 'middle',
                horizontal: 'center',
            };
        }
    }

    // set headers
    alloWS.getRow(1).height = 16;
    alloWS.getRow(2).height = 23;
    alloWS.getColumn('A').width = 35;
    alloWS.getColumn('B').width = 11;
    alloWS.getColumn('C').width = 11;
    alloWS.getColumn('D').width = 11;

    alloWS.getCell('A1').value = 'Name';
    alloWS.getCell('B1').value = 'Credit';
    alloWS.getCell('B2').value = 'Total';
    alloWS.getCell('C2').value = 'Compulsory';
    alloWS.getCell('D2').value = 'Elective';

    // set content of table
    let curRow = 3;
    allocation.forEach((item) => {
        alloWS.getRow(curRow).font = { bold: true };
        alloWS.getCell(curRow, 1).value = item.name;
        alloWS.getCell(curRow, 1).alignment = { horizontal: 'left' };
        alloWS.getCell(curRow, 2).value = item.compulsoryCredit + item.OptionalCredit;
        alloWS.getCell(curRow, 3).value = item.compulsoryCredit;
        alloWS.getCell(curRow, 4).value = item.OptionalCredit;

        curRow++;

        item.detail.forEach((smallItem) => {
            alloWS.getCell(curRow, 1).value = smallItem.name;
            alloWS.getCell(curRow, 1).alignment = {
                horizontal: 'right',
            };
            alloWS.getCell(curRow, 2).value = smallItem.compulsoryCredit + smallItem.OptionalCredit;
            alloWS.getCell(curRow, 3).value = smallItem.compulsoryCredit;
            alloWS.getCell(curRow, 4).value = smallItem.OptionalCredit;

            curRow++;
        });
    });

    alloWS.mergeCells(`B${curRow}:D${curRow}`);
    alloWS.getCell(curRow, 1).value = 'Military Education';
    alloWS.getCell(curRow, 1).alignment = { horizontal: 'left' };
    alloWS.getRow(curRow).font = { bold: true };
    alloWS.getCell(curRow, 2).value = 165;

    // set border
    for (let row = 1; row <= curRow; row++) {
        for (let col = 1; col <= 4; col++) {
            alloWS.getCell(row, col).border = {
                top: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
                left: { style: 'thin' },
            };
        }
    }
};

const createSubjectSheet = (subWS, subjects) => {};

const exportFileExcel = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id)
            .select('allocation detail')
            .populate({ path: 'allocation' });

        const allocation = bootcamp.allocation.detail;

        // handle excel
        const workbook = new ExcelJS.Workbook();
        const alloWS = workbook.addWorksheet('Allocation');
        const subWS = workbook.addWorksheet('Subjects');

        createAlloSheet(alloWS, allocation);
        // createSubjectSheet(subWS, null);

        // Đặt header cho response để trình duyệt hiểu định dạng file Excel
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader('Content-Disposition', 'attachment; filename=BootcampExport.xlsx');

        // Gửi file Excel trực tiếp cho client
        await workbook.xlsx.write(res);

        // Kết thúc response
        res.end();
        // res.status(200).send(bootcamp);
    } catch (error) {
        console.log(error);
        next(new CustomError(error));
    }
};

module.exports = {
    exportFileExcel,
};
