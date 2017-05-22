$(document).ready(function() {
    $("#delete-btn").submit(function() {
        if ($("input[type='submit']").val() == "text 1") {
            alert("Are you sure?");
            $("input[type='submit']").val("text 2");
            return false;
        }
    });
});
