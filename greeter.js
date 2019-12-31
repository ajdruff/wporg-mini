var Student = /** @class */ (function () {
    function Student(firstName, middleName, lastName) {
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.fullName = firstName + ' ' + middleName + ' ' + lastName;
    }
    Student.prototype.BigPrint = function () {
        return ('hello ' + this.fullName);
    };
    return Student;
}());
var myStudent = new Student("a", "b", "c");
console.log(myStudent.BigPrint());
