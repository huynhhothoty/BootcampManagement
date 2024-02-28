const exceljs = require('exceljs');
const CustomError = require('../utils/CustomError');

const defaultFieldArray = ['military education'];

const importBC = async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new CustomError('Please choose a file from your device!', 400));
        }

        const fileBuffer = req.file.buffer;

        const workbook = new exceljs.Workbook();
        await workbook.xlsx.load(fileBuffer);

        // get data from sheet
        const alloWs = workbook.getWorksheet('Sheet1');
        const planWs = workbook.getWorksheet('Sheet2');
        const compulWs = workbook.getWorksheet('Sheet3');
        const optionWs = workbook.getWorksheet('Sheet4');

        if (!alloWs || !planWs || !compulWs || !optionWs)
            return next(
                new CustomError('Your file is not in correct format, please check again!', 400)
            );

        let data = [];
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
                        data = [...data, tempBigField];
                        tempBigField = {};
                        tempSmallField = [];
                    }
                    tempBigField = { ...dataField };
                    bigFieldList.push(dataField.name.toString().toLowerCase());
                } else if (
                    !isDefaultField &&
                    !row.getCell(1).value.toString().toLowerCase().startsWith('total')
                ) {
                    const smallField = { ...dataField };
                    tempSmallField = [...tempSmallField, smallField];
                } else if (isDefaultField){
                    tempBigField.detail = [...tempSmallField];
                    data = [...data, tempBigField];
                }
            }
        });


        // read semester
        let currentSemester = 1;
        let planData = [];
        let tempSubjectList = [];
        let tempElectList = bigFieldList.map(ele=>{
            return {
                bigField: ele,
                electSubList: []
            }
        });
        planWs.eachRow((row) => {
            const fieldData = {
                name: row.getCell(3).value,
                subjectCode: row.getCell(2).value,
                credit: row.getCell(4).value ?? 0,
                isCompulsory: true,
            };

            if (isNaN(Number(row.getCell(1).value))) {
                if (tempSubjectList.length > 0) {
                    const semester = {
                        semester: currentSemester,
                        subjectList: [...tempSubjectList],
                    };
                    planData = [...planData, semester];
                    currentSemester++;
                    tempSubjectList = [];
                }
            } else if (fieldData.name.toLowerCase().includes('elective')) {
                tempElectList = tempElectList.map(ele=>{
                    if (ele.bigField.toLowerCase().includes(fieldData.name.toLowerCase().slice(0, 10).trim())) return {
                        bigField: ele.bigField,
                        electSubList: [...ele.electSubList, {...fieldData, semester: currentSemester}]
                    }
                    return ele
                })
            } else {
                tempSubjectList = [...tempSubjectList, fieldData];
            }
        });

        console.log(tempElectList)

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

        let fullAllo = data.map((ele, index) => {
            return {
                ...ele,
                subjectList: subjectData.at(index),
            };
        });

        fullAllo = fullAllo.map(ele=>{
            tempElectList.forEach(ele2=>{
                if (ele2.bigField.toString().toLowerCase().includes(ele.name.toString().toLowerCase())) {
                    return {...ele, electiveSubjectList: ele2}
                }
            })
            return ele
        })

        const dataFromImportFile = {
            type: 'bootcamp',
            totalCredit,
            allocation: {
                detail: fullAllo,
            },
            detail: planData,
        };

        res.status(200).send({
            status: 'ok',
            data: dataFromImportFile,
        });
        // res.status(200).send(data);
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    importBC,
};
