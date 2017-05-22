$(document).ready(function() {
    $("#delete-btn").click(function(event) {
        if( !confirm('Are you sure?') )
            event.preventDefault();
    });
});
