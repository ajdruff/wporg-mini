class Student {



    constructor(public firstName: string, public middleName: string, public lastName: string) {
        this.fullName = firstName + ' ' + middleName + ' ' + lastName;

    }
    public fullName: string;
    public BigPrint(): string {


        return ('hello ' + this.fullName)
    }




}

var myStudent = new Student("a", "b", "c")
console.log(myStudent.BigPrint());