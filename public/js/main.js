$(document).ready(function() {
    $("#delete-btn").click(function(event) {
        if( !confirm('Are you sure?') )
            event.preventDefault();
    });

    $(".delete-list-link").click(function(event) {
        if( !confirm('Are you sure?') )
            event.preventDefault();
    });

    $(".pick-toggle").click(function(event) {
      $(this).toggleClass( "not-got-it" );
    });
});
