$(document).ready(function() {
    $("#delete-btn").click(function(event) {
        if( !confirm('Are you sure?') )
            event.preventDefault();
    });

    $(".delete-list-link").click(function(event) {
        if( !confirm('Are you sure?') )
            event.preventDefault();
    });
});
