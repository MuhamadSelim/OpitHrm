// Generated by CoffeeScript 1.6.3
(function() {
  var deleteUser;

  $("#add").click(function() {
    return $.ajax({
      method: 'GET',
      url: Routing.generate('OpitNotesUserBundle_user_show', {
        id: 0
      })
    }).done(function(data) {
      $('<div id="dialog-edititem"></div>').html(data).dialog({
        open: function() {
          return $('.ui-dialog-title').append('<i class="fa fa-list-alt"></i> Create User');
        },
        dialogClass: 'popup-dialog',
        width: 750,
        modal: true,
        buttons: {
          Create: function() {
            return $.ajax({
              type: 'POST',
              global: false,
              url: Routing.generate('OpitNotesUserBundle_user_add', {
                id: 0
              }),
              data: $('#adduser_frm').serialize()
            }).done(function(data) {
              var response;
              response = data;
              return $.ajax({
                type: 'POST',
                global: false,
                url: Routing.generate('OpitNotesUserBundle_user_list'),
                data: {
                  "showList": 1
                }
              }).done(function(data) {
                $('#list-table').html(data);
                return $(document).data('notes').funcs.showAlert(response, "create", "User created successfully");
              });
            });
          },
          Close: function() {
            $('#dialog-edititem').dialog("destroy");
          }
        }
      });
      return;
    });
  });

  $("#list-table").on("click", ".list-username", function() {
    var id;
    id = $(this).attr("data-user-id");
    $(document).data('OpitNotesUserBundle').funcs.userEdit(id, $(document).data('notes').funcs.showAlert);
  });

  $("#list-table").on("click", ".list-change-password", function() {
    var id;
    id = $(this).attr("data-user-id");
    return $.ajax({
      method: 'GET',
      url: Routing.generate('OpitNotesUserBundle_user_show_password', {
        id: id
      })
    }).done(function(data) {
      $('<div id="dialog-edititem"></div>').html(data).dialog({
        open: function() {
          $('.ui-dialog-title').append('<i class="fa fa-list-alt"></i> Reset Password');
          return $(this).html(data);
        },
        width: 750,
        modal: true,
        buttons: {
          Save: function() {
            return $.ajax({
              type: 'POST',
              global: false,
              url: Routing.generate('OpitNotesUserBundle_user_update_password', {
                id: id
              }),
              data: $('#changePassword_frm').serialize()
            }).done(function(data) {
              var response;
              response = data;
              return $(document).data('notes').funcs.showAlert(response, "update", "Password reset successfully");
            });
          },
          Close: function() {
            $('#dialog-edititem').dialog("destroy");
          }
        }
      });
      return;
    });
  });

  $('#delete').click(function() {
    return deleteUser();
  });

  $('#list-table').on("click", ".delete-single-user", function() {
    var $checkbox;
    $checkbox = $(this).closest('tr').find(':checkbox');
    $checkbox.prop('checked', true);
    return deleteUser();
  });

  deleteUser = function() {
    var message, title, url;
    title = 'User delete';
    message = 'user(s)';
    url = Routing.generate('OpitNotesUserBundle_user_delete');
    return $(document).data('notes').funcs.deleteAction(title, message, url, '.list-delete-user');
  };

  $('#list-table').on("click", "th i", function() {
    return $('.list-delete-user').checkAll();
  });

  $('#list').on("click", "#list-reply-message", function() {
    return $(this).hide();
  });

}).call(this);
