const exceljs = require('exceljs');
const CustomError = require('../utils/CustomError');
const Major = require('../models/majorModel');
const { Types } = require('mongoose');

const defaultFieldArray = ['military education'];

const importBC = async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new CustomError('Please choose a file from your device!', 400));
        }

        const { majorId } = req.query;
        if (!majorId) return next(new CustomError('Please provide Major Id', 400));

        const major = await Major.findById(majorId).populate('branchMajor').lean();
        if (!major) return next(new CustomError('This major not found', 400));

        const fileBuffer = req.file.buffer;

        const workbook = new exceljs.Workbook();
        await workbook.xlsx.load(fileBuffer);

        // get data from sheet
        const alloWs =
            workbook.getWorksheet('Sheet1') || workbook.getWorksheet('Allocation');
        const planWs =
            workbook.getWorksheet('Sheet2') || workbook.getWorksheet('Planning');
        const compulWs =
            workbook.getWorksheet('Sheet3') ||
            workbook.getWorksheet('Compulsory Subjects');
        const optionWs =
            workbook.getWorksheet('Sheet4') || workbook.getWorksheet('Elective Subjects');

        if (!alloWs || !planWs || !compulWs || !optionWs)
            return next(
                new CustomError(
                    'Your file is not in correct format, please check again!',
                    400
                )
            );

        let allocateData = [];
        let tempBigField = {};
        let tempSmallField = [];
        let bigFieldList = [];
        let totalCredit = 0;

        // read allocation
        alloWs.eachRow((row, rowNumber) => {
            if (rowNumber > 2) {
                const isMerge = row.getCell(2).isMerged;
                const dataField = {
                    name: row.getCell(1).value,
                    compulsoryCredit: row.getCell(3).value ?? 0,
                    OptionalCredit: isMerge ? 0 : row.getCell(4).value ?? 0,
                };
                if (row.getCell(1).value.toString().toLowerCase().startsWith('total'))
                    totalCredit = row.getCell(2).value;

                const isBigField =
                    row.getCell(1).alignment.horizontal === 'left' ||
                    !row.getCell(1).alignment.horizontal;

                const isDefaultField = defaultFieldArray.includes(
                    row.getCell(1).value.toString().toLowerCase()
                );

                if (isBigField && !isDefaultField) {
                    if (Object.keys(tempBigField).length > 0) {
                        tempBigField.detail = [...tempSmallField];
                        allocateData = [...allocateData, tempBigField];
                        tempBigField = {};
                        tempSmallField = [];
                    }
                    tempBigField = { ...dataField };
                    bigFieldList.push(dataField.name.toString().toLowerCase());
                } else if (
                    !isDefaultField &&
                    !row.getCell(1).value.toString().toLowerCase().startsWith('total')
                ) {
                    const smallField = { ...dataField, _id: new Types.ObjectId() };
                    tempSmallField = [...tempSmallField, smallField];
                } else if (isDefaultField) {
                    tempBigField.detail = [...tempSmallField];
                    allocateData = [...allocateData, tempBigField];
                }
            }
        });

        // read semester
        let branchMajorSemester = null;
        let currentBranch = null;
        let currentSemester = 0;
        let planData = [];
        let tempSubjectList = [];

        let tempElectList = allocateData.map((ele) => {
            return {
                bigField: ele.name.toLowerCase(),
                electSubList: [],
                smallField: ele.detail,
                isElectiveNameBaseOnBigField: false,
            };
        });

        planWs.eachRow((row) => {
            if (row.getCell(2).isMerged && !row.getCell(1).isMerged) {
                if (branchMajorSemester === null) branchMajorSemester = currentSemester;
                currentBranch = major.branchMajor.find(
                    (x) => x.name.toLowerCase() === row.getCell(2).value.toLowerCase()
                );
            }

            const fieldData = {
                name: row.getCell(3).value,
                subjectCode: row.getCell(2).value,
                credit: row.getCell(4).value ?? 0,
                isCompulsory: row.getCell(2).value ? true : false,
                branchMajor: currentBranch ? currentBranch._id : null,
            };

            if (isNaN(Number(row.getCell(1).value))) {
                if (tempSubjectList.length > 0 && row.getCell(1).isMerged) {
                    const semester = {
                        semester: currentSemester,
                        subjectList: [...tempSubjectList],
                    };
                    planData = [...planData, semester];
                    currentSemester++;
                    tempSubjectList = [];
                    currentBranch = null;
                }
            } else if (fieldData.name.toLowerCase().includes('elective')) {
                tempElectList.forEach((ele) => {
                    const bigFieldName = ele.bigField.toLowerCase().trim();
                    const elecName = fieldData.name.toLowerCase().slice(0, -10).trim();
                    if (bigFieldName.includes(elecName)) {
                        const temp = { ...fieldData, semester: currentSemester };

                        ele.electSubList.push(temp);
                    } else {
                        ele.smallField.forEach((smallField) => {
                            const smallFieldName = smallField.name.toLowerCase().trim();
                            if (smallFieldName.includes(elecName)) {
                                ele.isElectiveNameBaseOnBigField = true;
                                const temp = {
                                    ...fieldData,
                                    semester: currentSemester,
                                    allocateChildId: smallField._id,
                                };
                                ele.electSubList.push(temp);
                            }
                        });
                    }
                });
            } else if (row.getCell(1).value) {
                tempSubjectList = [...tempSubjectList, fieldData];
            }
        });

        console.log(tempElectList);

        // read subject list
        let subjectData = [];
        let tempAlloSubjectList = [];
        let currentBigField = '';
        compulWs.eachRow((row) => {
            const fieldData = {
                name: row.getCell(3).value,
                subjectCode: row.getCell(2).value,
                credit: row.getCell(4).value ?? 0,
                isCompulsory: true,
            };

            if (isNaN(Number(row.getCell(1).value))) {
                if (tempAlloSubjectList.length > 0) {
                    subjectData = [...subjectData, tempAlloSubjectList];
                    tempAlloSubjectList = [];
                }
            } else {
                tempAlloSubjectList = [...tempAlloSubjectList, fieldData];
            }
        });
        optionWs.eachRow((row) => {
            const isMerge = row.getCell(1).isMerged;
            if (isMerge && row.getCell(1).value.toString().toLowerCase() !== 'total') {
                currentBigField = row.getCell(1).value.toString().toLowerCase();
            }
            const fieldData = {
                name: row.getCell(3).value,
                subjectCode: row.getCell(2).value,
                credit: row.getCell(4).value ?? 0,
                isCompulsory: false,
            };

            if (isNaN(Number(row.getCell(1).value))) {
                if (tempAlloSubjectList.length > 0) {
                    const index = bigFieldList.indexOf(currentBigField);
                    let subListOfCurrentBigField = subjectData.at(index ?? 0);
                    subListOfCurrentBigField = [
                        ...subListOfCurrentBigField,
                        ...tempAlloSubjectList,
                    ];
                    subjectData[index ?? 0] = subListOfCurrentBigField;
                    tempAlloSubjectList = [];
                    currentBigField++;
                }
            } else {
                tempAlloSubjectList = [...tempAlloSubjectList, fieldData];
            }
        });

        let fullAllo = allocateData.map((ele, index) => {
            return {
                ...ele,
                subjectList: subjectData.at(index),
            };
        });

        fullAllo = fullAllo.map((ele) => {
            let returnEle = ele;
            tempElectList.forEach((ele2) => {
                if (ele2.bigField.trim().includes(ele.name.toLowerCase().trim())) {
                    returnEle = {
                        ...ele,
                        electiveSubjectList: ele2.electSubList,
                        isElectiveNameBaseOnBigField: ele2.isElectiveNameBaseOnBigField,
                    };
                }
            });
            return returnEle;
        });

        const dataFromImportFile = {
            type: 'bootcamp',
            totalCredit,
            allocation: {
                detail: fullAllo,
            },
            detail: planData,
            branchMajorSemester,
            major,
        };

        res.status(200).send({
            status: 'ok',
            allocateData: dataFromImportFile,
        });
        // res.status(200).send(allocateData);
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    importBC,
};
