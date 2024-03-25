
export const AutogenAllSubjectCode = (subject,index) => {
    let tempLast = '19'
    let tempSemesterYear = '27'
    return `${subject.shortFormName}${subject.semester ? caculateSemesterYear(subject.semester + 1) : tempSemesterYear}${subject.credits}${subject.indexAutogenSubjectCode ? subject.indexAutogenSubjectCode : index}${tempLast}`
}

export const padZero = (number) => {
    // Chuyển số thành chuỗi
    let numberString = number.toString();

    // Thêm số 0 nếu chuỗi chỉ có 1 ký tự
    let paddedNumber = numberString.length === 1 ? '0' + numberString : numberString;

    return paddedNumber;
}

function caculateSemesterYear(semester) {
    // Số học kì trong 1 năm đại học
    let numberSemeseterInYear = 2;
  
    // Tính toán năm đại học
    let year = Math.ceil(semester / numberSemeseterInYear);
    return year;
}

export const getFirstAutogenSubjectIndex = (fieldIndex,subjectIndex,allocateFields) => {
    let count = 0;
    let firstIndex = 0;
    while (count < fieldIndex){
        firstIndex += allocateFields[count].subjectList.length 
        count++
    }
    return padZero(firstIndex + subjectIndex + 1)
}