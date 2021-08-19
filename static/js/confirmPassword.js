$('#passwordForm').submit(function() {
    let pwd1 = $("#pwd1").val();
    let pwd2 = $("#pwd2").val();
    if (pwd1 === pwd2)
        return true
    else {
        $("#form").append("<p>Indtast venlist samme kodeord</p>");
        return false
    }
});