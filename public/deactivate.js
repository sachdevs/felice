$(document).ready(function() {
    $('#deactivate').click(function() {
        userId = localStorage.getItem("userId");
        $.ajax(root + '/api/users/' + userId, {
            dataType: 'json',
            method: "DELETE",
            headers: {
                'x-access-token': localStorage.getItem('local_token')
            },
            success: function(r) {
                localStorage.clear();
                window.location = root + '/#login';
            },
            error: function(r) {}
        });
    });
});