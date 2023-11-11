import {
  MISSING_FIELD_INFO,
  NO_ALLOWCATION_CREDITS_DATA,
} from "../constants/errorMessage";

export const validateBootcampData = (
  bootcampName,
  totalCredits,
  allowcateFields,
  semesterList,
  semesterSubjectList,
  completeTotalCredits
) => {
  const tempErrorMessage = {
    bootcampName: false,
    totalCredits: false,
    completeTotalCredits: false,
    allowcate: [],
    compulsory: [],
    elective: [],
    electiveGroup: [],
    planning: [],
    remainning: false,
  };
  if (bootcampName === "") tempErrorMessage.bootcampName = true;
  if (totalCredits <= 0) {
    tempErrorMessage.totalCredits = true;
  } else {
    if (completeTotalCredits !== totalCredits)
      tempErrorMessage.completeTotalCredits = true;
  }
  if (allowcateFields.length === 0) {
    tempErrorMessage.allowcate.push({
      message: NO_ALLOWCATION_CREDITS_DATA,
      data: null,
    });
  } else {
    let errorFieldIndex = [];
    let errorField = [];
    let allowcateTotalCredits = 0;
    errorField = allowcateFields.map((field, index) => {
      const error = {
        missFieldName: false,
        missSmallField: false,
        smallFieldError: [],
      };

      if (field.fieldName === "") {
        error.missFieldName = true;
        !errorFieldIndex.includes(index) && errorFieldIndex.push(index);
      }
      if (field.smallField.length === 0) {
        error.missSmallField = true;
        !errorFieldIndex.includes(index) && errorFieldIndex.push(index);
      } else {
        field.smallField.forEach((smallField, smallIndex) => {
          if (smallField.fieldName === "") {
            error.smallFieldError.push(smallIndex);
            !errorFieldIndex.includes(index) && errorFieldIndex.push(index);
          }
        });
      }
      allowcateTotalCredits += field.compulsoryCredits;
      allowcateTotalCredits += field.electiveCredits;

      let totalCompulsorySubjectCredits = 0;
      let totalElectiveSubjectCredits = 0;
      let totalElectiveGroupCredits = 0;
      field.electiveSubjectList.forEach((group) => {
        totalElectiveGroupCredits += group.credit;
      });
      field.subjectList.forEach((subject) => {
        if (subject.isCompulsory) {
          totalCompulsorySubjectCredits += subject.credits;
        } else totalElectiveSubjectCredits += subject.credits;
      });
      if (totalCompulsorySubjectCredits !== field.compulsoryCredits)
        tempErrorMessage.compulsory.push(index);
      if (totalElectiveSubjectCredits < field.electiveCredits)
        tempErrorMessage.elective.push(index);
      if (totalElectiveGroupCredits !== field.electiveCredits)
        tempErrorMessage.electiveGroup.push(index);
      return error;
    });
    if (errorFieldIndex.length > 0 || allowcateTotalCredits !== totalCredits) {
      tempErrorMessage.allowcate.push({
        message: MISSING_FIELD_INFO,
        data: {
          errorFieldIndex,
          errorField,
          isEqualTotalCredits:
            allowcateTotalCredits === totalCredits ? true : false,
        },
      });
    }
  }
  let tempRemainWithNormalSubject;
  let tempRemainWithGroupElective;
  semesterList.forEach((semester, index) => {
    if (semester.length === 0) tempErrorMessage.planning.push(index);
  });
  tempRemainWithNormalSubject = semesterSubjectList.some(
    (subject) =>
      subject.semester === null &&
      allowcateFields[subject.fieldIndex].subjectList[subject.subjectIndex]
        .isCompulsory === true
  );
  tempRemainWithGroupElective = allowcateFields.some(field => 
    field.electiveSubjectList.some((group) => 
      (group.semester === null && group.branchMajor === null) 
    )
  )
  if(tempRemainWithNormalSubject || tempRemainWithGroupElective){
    tempErrorMessage.remainning = true
  }else tempErrorMessage.remainning = false
  return tempErrorMessage;
};
