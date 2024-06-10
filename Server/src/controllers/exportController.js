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
        // count total for big field
        let compul = 0;
        let option = 0;
        item.detail.forEach((smallItem) => {
            compul += smallItem.compulsoryCredit;
            option += smallItem.OptionalCredit;
        });

        alloWS.getRow(curRow).font = { bold: true };
        alloWS.getCell(curRow, 1).value = item.name;
        alloWS.getCell(curRow, 1).alignment = { horizontal: 'left' };
        // alloWS.getCell(curRow, 2).value = item.compulsoryCredit + item.OptionalCredit;
        // alloWS.getCell(curRow, 3).value = item.compulsoryCredit;
        // alloWS.getCell(curRow, 4).value = item.OptionalCredit;
        alloWS.getCell(curRow, 2).value = compul + option;
        alloWS.getCell(curRow, 3).value = compul;
        alloWS.getCell(curRow, 4).value = option;

        curRow++;

        item.detail.forEach((smallItem) => {
            alloWS.getCell(curRow, 1).value = smallItem.name;
            alloWS.getCell(curRow, 1).alignment = {
                horizontal: 'right',
            };
            alloWS.getCell(curRow, 2).value =
                smallItem.compulsoryCredit + smallItem.OptionalCredit;
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

const createPlanSheet = (planWS, semesterList, electList, major) => {
    planWS.getColumn(1).width = 5;

    planWS.getColumn(2).width = 16;
    planWS.getColumn(3).width = 55;
    planWS.getColumn(4).width = 9;
    planWS.getColumn(5).width = 18;

    let curRow = 1;
    semesterList.forEach((semester) => {
        let startRow = curRow;
        let currentSemester = semester.semester;

        planWS.mergeCells(`A${startRow}:E${startRow}`);
        planWS.getCell(curRow, 1).value = currentSemester;
        planWS.getCell(curRow, 1).alignment = {
            ...planWS.getCell(curRow, 1).alignment,
            horizontal: 'center',
        };
        planWS.getCell(curRow, 1).font = {
            ...planWS.getCell(curRow, 1).font,
            bold: true,
        };
        planWS.getRow(curRow).height = 40;
        curRow++;

        planWS.getRow(curRow).alignment = {
            ...planWS.getRow(curRow).alignment,
            horizontal: 'center',
        };
        planWS.getRow(curRow).font = { bold: true };

        planWS.getCell(curRow, 1).value = 'No.';
        planWS.getCell(curRow, 2).value = 'Course ID';
        planWS.getCell(curRow, 3).value = 'Course Title';
        planWS.getCell(curRow, 4).value = 'Credits';
        planWS.getCell(curRow, 5).value = 'Prerequisite';
        curRow++;

        let index = 1;
        let sumCredit = 0;
        const branchMajorSubjectList = {};
        semester.subjectList.forEach((subject) => {
            // get specialize subject list: is subject that has branchMajor field
            if (subject.branchMajor) {
                const temp = subject.branchMajor.toString();
                if (!(temp in branchMajorSubjectList)) branchMajorSubjectList[temp] = [];
                branchMajorSubjectList[temp].push(subject);
            } else {
                planWS.getCell(curRow, 1).value = index;
                planWS.getCell(curRow, 2).value = subject.subjectCode;
                planWS.getCell(curRow, 3).value = subject.name;
                planWS.getCell(curRow, 4).value = subject.credit;
                curRow++;
                index++;
                sumCredit += subject.credit;
            }
        });

        // write elective subject to semester
        const semesterIndex = currentSemester.trim().split(' ')[1];
        if (electList[semesterIndex - 1].length > 0) {
            electList[semesterIndex - 1].forEach((subject) => {
                planWS.getCell(curRow, 1).value = index;
                planWS.getCell(curRow, 2).value = '';
                planWS.getCell(curRow, 3).value = subject.name;
                planWS.getCell(curRow, 4).value = subject.credit;
                curRow++;
                index++;
                sumCredit += subject.credit;
            });
        }

        // write branch major section
        for (let key in branchMajorSubjectList) {
            planWS.mergeCells(`B${curRow}:C${curRow}`);
            const branch = major.branchMajor.find((x) => x._id.toString() === key);
            planWS.getCell(curRow, 2).value = branch.name;
            planWS.getRow(curRow).font = {
                bold: true,
            };

            curRow++;
            branchMajorSubjectList[key].forEach((x) => {
                planWS.getCell(curRow, 1).value = index;
                planWS.getCell(curRow, 2).value = x.subjectCode;
                planWS.getCell(curRow, 3).value = x.name;
                planWS.getCell(curRow, 4).value = x.credit;
                curRow++;
                index++;
                sumCredit += x.credit;
            });
        }

        planWS.mergeCells(`A${curRow}:C${curRow}`);
        planWS.getCell(curRow, 1).value = 'Total';
        planWS.getRow(curRow).font = { bold: true };
        planWS.getRow(curRow).alignment = {
            ...planWS.getRow(curRow).alignment,
            horizontal: 'center',
        };
        planWS.getRow(curRow).height = 30;
        planWS.getCell(curRow, 4).value = sumCredit;

        for (let row = startRow; row <= curRow; row++) {
            for (let col = 1; col <= 5; col++) {
                planWS.getCell(row, col).border = {
                    top: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                    left: { style: 'thin' },
                };

                if (col === 1) {
                    const border = planWS.getCell(row, col).border;
                    planWS.getCell(row, col).border = {
                        ...border,
                        left: { style: 'thick' },
                    };
                }
                let border = planWS.getCell(startRow, col).border;
                planWS.getCell(startRow, col).border = {
                    ...border,
                    top: { style: 'thick' },
                };

                border = planWS.getCell(curRow, col).border;
                planWS.getCell(curRow, col).border = {
                    ...border,
                    bottom: { style: 'thick' },
                };
            }
            let thisCellBorder = planWS.getCell(row, 5).border;
            planWS.getCell(row, 5).border = {
                ...thisCellBorder,
                right: { style: 'thick' },
            };

            thisCellBorder = planWS.getCell(row, 1).border;
            planWS.getCell(row, 1).border = {
                ...thisCellBorder,
                left: { style: 'thick' },
            };
        }

        curRow += 3;

        // config
        planWS.getRows(1, curRow).forEach((row) => {
            row.height = 28;
            row.font = {
                ...row.font,
                size: 13,
                name: 'Times New Roman',
            };
            row.alignment = {
                ...row.alignment,
                vertical: 'middle',
                wrapText: true,
            };
        });
        planWS.getColumn(1).alignment = {
            vertical: 'middle',
            horizontal: 'center',
        };
        planWS.getColumn(2).alignment = {
            vertical: 'middle',
            horizontal: 'center',
        };
        planWS.getColumn(4).alignment = {
            vertical: 'middle',
            wrapText: true,
            horizontal: 'center',
        };
    });
};

const createSubjectList = (subjectWS, allocation) => {
    subjectWS.getColumn(1).width = 5;
    subjectWS.getColumn(1).alignment = { horizontal: 'center' };
    subjectWS.getColumn(2).width = 16;
    subjectWS.getColumn(3).width = 40;
    subjectWS.getColumn(4).width = 9;
    subjectWS.getColumn(4).alignment = { horizontal: 'center' };
    subjectWS.getColumn(5).width = 18;

    let curRow = 1;
    allocation.forEach((bigField) => {
        let startRow = curRow;

        subjectWS.mergeCells(`A${startRow}:E${startRow}`);
        subjectWS.getCell(curRow, 1).value = bigField.name;
        subjectWS.getCell(curRow, 1).alignment = {
            horizontal: 'center',
            vertical: 'middle',
        };
        subjectWS.getCell(curRow, 1).font = { bold: true };
        subjectWS.getRow(curRow).height = 40;
        curRow++;

        subjectWS.getRow(curRow).alignment = { horizontal: 'center' };
        subjectWS.getRow(curRow).font = { bold: true };

        subjectWS.getCell(curRow, 1).value = 'No.';
        subjectWS.getCell(curRow, 2).value = 'Course ID';
        subjectWS.getCell(curRow, 3).value = 'Course Title';
        subjectWS.getCell(curRow, 4).value = 'Credits';
        subjectWS.getCell(curRow, 5).value = 'Notes';
        curRow++;

        let index = 1;
        let sumCredit = 0;
        bigField.subjectList.forEach((subject) => {
            subjectWS.getCell(curRow, 1).value = index;
            subjectWS.getCell(curRow, 2).value = subject.subjectCode;
            subjectWS.getCell(curRow, 3).value = subject.name;
            subjectWS.getCell(curRow, 4).value = subject.credit;
            curRow++;
            index++;
            sumCredit += subject.credit;
        });

        subjectWS.mergeCells(`A${curRow}:C${curRow}`);
        subjectWS.getCell(curRow, 1).value = 'Total';
        subjectWS.getRow(curRow).font = { bold: true };
        subjectWS.getRow(curRow).alignment = { horizontal: 'center', vertical: 'middle' };
        subjectWS.getRow(curRow).height = 30;
        subjectWS.getCell(curRow, 4).value = sumCredit;

        // border format
        for (let row = startRow; row <= curRow; row++) {
            for (let col = 1; col <= 5; col++) {
                subjectWS.getCell(row, col).border = {
                    top: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                    left: { style: 'thin' },
                };

                if (col === 1) {
                    const border = subjectWS.getCell(row, col).border;
                    subjectWS.getCell(row, col).border = {
                        ...border,
                        left: { style: 'thick' },
                    };
                }
                let border = subjectWS.getCell(startRow, col).border;
                subjectWS.getCell(startRow, col).border = {
                    ...border,
                    top: { style: 'thick' },
                };

                border = subjectWS.getCell(curRow, col).border;
                subjectWS.getCell(curRow, col).border = {
                    ...border,
                    bottom: { style: 'thick' },
                };
            }
            let thisCellBorder = subjectWS.getCell(row, 5).border;
            subjectWS.getCell(row, 5).border = {
                ...thisCellBorder,
                right: { style: 'thick' },
            };

            thisCellBorder = subjectWS.getCell(row, 1).border;
            subjectWS.getCell(row, 1).border = {
                ...thisCellBorder,
                left: { style: 'thick' },
            };
        }
        curRow += 3;
    });
};

const exportFileExcel = async (req, res, next) => {
    try {
        // const bootcamp = await Bootcamp.findById(req.params.id)
        //     .select('allocation detail')
        //     .populate([
        //         { path: 'detail.subjectList' },
        //         {
        //             path: 'allocation',
        //             populate: {
        //                 path: 'detail.subjectList',
        //                 populate: { path: 'branchMajor' },
        //             },
        //         },
        //     ]);
        const doc = await Bootcamp.findById(req.params.id)
            .lean()
            .populate([
                { path: 'major' },
                {
                    path: 'major',
                    populate: { path: 'branchMajor' },
                },
                {
                    path: 'allocation',
                },
            ]);

        if (!doc) {
            return next(new CustomError('No document with this Id', 404));
        }

        // fill and replace id in subject list by subject info in allocation
        let alloSubList = [];
        doc.allocation.detail.map((big) => {
            alloSubList = [...alloSubList, ...big.subjectList];
        });

        const populateDetail = doc.detail.map((semester) => {
            const populateSemester = semester.subjectList
                .map((subjectId) => {
                    return (
                        alloSubList.find(
                            (ele) => ele._id.toString() === subjectId.toString()
                        ) ?? ''
                    );
                })
                .filter((x) => x != '');
            semester.subjectList = populateSemester;
            return semester;
        });
        doc.detail = populateDetail;

        const bootcamp = doc;

        const allocation = bootcamp.allocation.detail;
        const semesterList = bootcamp.detail;
        const major = bootcamp.major;

        // handle excel
        const workbook = new ExcelJS.Workbook();

        const alloWS = workbook.addWorksheet('Allocation');
        const planWS = workbook.addWorksheet('Planning');
        const compulsoryWS = workbook.addWorksheet('Compulsory Subjects');
        const electiveWS = workbook.addWorksheet('Elective Subjects');
        // const alloWS = workbook.addWorksheet('Sheet1');
        // const planWS = workbook.addWorksheet('Sheet2');
        // const compulsoryWS = workbook.addWorksheet('Sheet3');
        // const electiveWS = workbook.addWorksheet('Sheet4');

        // filter allocation into two allocation, one include compul, one include elective
        let allocationWithCompulsory = JSON.parse(JSON.stringify(allocation));
        let allocationWithElective = JSON.parse(JSON.stringify(allocation));

        allocationWithCompulsory.forEach((big) => {
            big.subjectList = big.subjectList.filter(
                (subject) => subject.isCompulsory === true
            );
        });
        allocationWithCompulsory = allocationWithCompulsory.filter(
            (big) => big.subjectList.length > 0
        );

        allocationWithElective.forEach((big) => {
            big.subjectList = big.subjectList.filter(
                (subject) => subject.isCompulsory === false
            );
        });
        allocationWithElective = allocationWithElective.filter(
            (big) => big.subjectList.length > 0
        );

        // get elective subject list from allocation
        const electiveSubjectList = new Array(20).fill([]);

        allocation.forEach((ele) => {
            const isNameBaseSmallField = ele.isElectiveNameBaseOnBigField;
            const smallFieldIndex = {};
            ele.electiveSubjectList.forEach((sub, index) => {
                let subject = sub;
                let subjectName;
                if (isNameBaseSmallField) {
                    let currentIndexOfSmallField;
                    if (smallFieldIndex?.[sub.allocateChildId.toString()] !== undefined) {
                        smallFieldIndex[sub.allocateChildId.toString()] += 1;
                        currentIndexOfSmallField =
                            smallFieldIndex[sub.allocateChildId.toString()];
                    } else {
                        currentIndexOfSmallField = 0;
                        smallFieldIndex[sub.allocateChildId.toString()] = 0;
                    }
                    let smallField = ele.detail.find(
                        (x) => x._id.toString() === sub.allocateChildId.toString()
                    );
                    subjectName = `${smallField.name.trim()} Elective ${
                        currentIndexOfSmallField + 1
                    }`;
                } else {
                    subjectName = `${ele.name.split('(')[0].trim()} Elective ${
                        index + 1
                    }`;
                }
                subject = {
                    ...subject,
                    name: subjectName,
                };

                const temp = electiveSubjectList[sub.semester];
                electiveSubjectList[sub.semester] = [...temp, subject];
            });
        });

        // create excel sheet for each domain we need
        createAlloSheet(alloWS, allocation);
        createPlanSheet(planWS, semesterList, electiveSubjectList, major);
        createSubjectList(compulsoryWS, allocationWithCompulsory);
        createSubjectList(electiveWS, allocationWithElective);

        // //1. Đặt header cho response để trình duyệt hiểu định dạng file Excel
        // //2. Gửi file Excel trực tiếp cho client
        // //3. Kết thúc response with res.end()
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader('Content-Disposition', 'attachment; filename=BootcampExport.xlsx');
        await workbook.xlsx.write(res);
        res.end();

        // res.status(200).send(electiveSubjectList);
    } catch (error) {
        console.log(error);
        next(new CustomError(error));
    }
};

module.exports = {
    exportFileExcel,
};
