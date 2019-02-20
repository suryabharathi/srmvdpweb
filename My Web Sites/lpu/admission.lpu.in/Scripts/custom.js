/*Pattern Matcher*/
var specialKeys = [
    8,  //Backspace
    9,  //Tab
    46, //Delete
    37, //Left
    38, //Up
    39, //Right
    40  //Down
];
var regexDigit = /^[0-9]{1}$/;
var regexFirstName = /^[a-zA-Z]{1}$/;
var regexOtherName = /^[a-zA-Z\s.]{1}$/;
var regexAlphaMinSpecial = /^[0-9a-zA-Z\s.'#,_+():\/-]{1}$/;
function fun_KeyFilter(control, event, pattern) {
    var keyCode = event.which ? event.which : event.keyCode
    var char = String.fromCharCode(keyCode)
    var testResult = false;
    switch (pattern) {
        case 'digit': testResult = regexDigit.test(char);
            break;
        case 'fname': testResult = regexFirstName.test(char);
            break;
        case 'oname': testResult = regexOtherName.test(char);
            break;
        case 'alphanumeric-special': testResult = regexAlphaMinSpecial.test(char);
            break;
        case 'disable': testResult = false;
            break;
    }

    if (specialKeys.indexOf(keyCode) != -1) {
        return true;
    } else if (!testResult) {
        event.preventDefault();
        return false;
    }
}

$(function () {
    $.validator.addMethod("customEmail", function (value, element) {
        var reg = /^[a-zA-Z0-9]([._-]?[a-zA-Z0-9]+)*\@(?:(?=[a-zA-Z0-9-]{1,63}\.)[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*\.){1,8}[a-zA-Z]{2,63}$/;
        return this.optional(element) || reg.test(value);
    }, "Provided email address is not valid.");
});
