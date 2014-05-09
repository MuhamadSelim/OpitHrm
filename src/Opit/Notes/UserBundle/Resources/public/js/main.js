// Generated by CoffeeScript 1.7.1
(function() {
  var $subMenuClone, cloneSubmenu, getAllNotifications, getUnreadNotifications, subMenuCloneClass;

  $(document).data('OpitNotesUserBundle', {});

  $.extend(true, $(document).data('OpitNotesUserBundle'), {
    funcs: {
      userEdit: function(userId, successCallback) {
        return $.ajax({
          method: 'GET',
          url: Routing.generate('OpitNotesUserBundle_user_show', {
            id: userId
          })
        }).done(function(data) {
          $('<div id="dialog-edititem"></div>').html(data).dialog({
            title: '<i class="fa fa-list-alt"></i> Edit User',
            modal: true,
            width: 710,
            open: function() {
              return $(document).data('notes').funcs.initDateInputs($(this));
            },
            buttons: {
              Save: function() {
                return $.ajax({
                  type: 'POST',
                  global: false,
                  url: Routing.generate('OpitNotesUserBundle_user_add', {
                    id: userId
                  }),
                  data: $('#adduser_frm').serialize()
                }).done(function(data, textStatus, jqXHR) {
                  var offset, response, url;
                  url = Routing.generate('OpitNotesUserBundle_user_list');
                  offset = $('.selected-page').data('offset');
                  if (url === window.location.pathname && jqXHR.getResponseHeader("content-type").indexOf('html')) {
                    response = data;
                    $.ajax({
                      type: 'POST',
                      url: url,
                      data: {
                        'offset': offset - 1,
                        'incrementOffset': false
                      }
                    }).done(function(data) {
                      var postActions;
                      $('#user-list').html(data);
                      $(document).data('notes').funcs.initListPageListeners();
                      $(document).data('notes').funcs.initPager();
                      $('.selected-page').each(function() {
                        return $(this).removeClass('selected-page');
                      });
                      $('[data-offset="' + offset + '"]').addClass('selected-page');
                      if (successCallback != null) {
                        postActions = successCallback(response, "update", "User modified successfully");
                      }
                      if (postActions || postActions === void 0) {
                        return $('#dialog-edititem').dialog('destroy');
                      }
                    });
                  } else {
                    $('#dialog-edititem').dialog('destroy');
                  }
                }).fail(function(data) {
                  return successCallback($.parseJSON(data.responseText), "update", "Error");
                });
              },
              Close: function() {
                $('#dialog-edititem').dialog("destroy");
              }
            }
          });
          return;
        });
      },
      isLdapUser: function(userId) {
        var df;
        df = $.Deferred();
        $.ajax({
          type: 'POST',
          url: Routing.generate('OpitNotesUserBundle_user_ldap_enabled'),
          data: {
            'id': userId
          }
        }).done(function(data) {
          if (data.ldap_enabled === true) {
            $('<div id="ldap-password-dialog"></div>').html("This feature is not supported for LDAP users. Please, kindly turn to your system administrator for help.").dialog({
              width: 500,
              title: '<i class="fa fa-exclamation-triangle"></i> Unsupported feature',
              close: function() {
                $(this).dialog('destroy');
              }
            });
            df.fail();
          } else {
            df.resolve();
          }
        });
        return df;
      }
    }
  });

  $subMenuClone = {};

  subMenuCloneClass = '.subMenuClone';

  cloneSubmenu = function() {
    if ($('body').children(subMenuCloneClass).length) {
      $('body').find(subMenuCloneClass).remove();
    }
    $subMenuClone = $('.active').children('.subMenu').clone();
    $subMenuClone.addClass('subMenuClone');
    return $('body').append($subMenuClone);
  };

  getAllNotifications = function($notificationsContent) {
    var changeStatus;
    changeStatus = function(el, callback) {
      if (el.closest('.notification').hasClass('unread')) {
        $.ajax({
          method: 'POST',
          url: Routing.generate('OpitNotesTravelBundle_notifications_state_change'),
          data: {
            "id": el.data('id')
          }
        }).complete(function() {
          el.closest('.notification').removeClass('unread');
          if (callback != null) {
            callback();
          }
        });
      } else {
        if (callback != null) {
          callback();
        }
      }
    };
    return $.ajax({
      method: 'POST',
      url: Routing.generate('OpitNotesTravelBundle_notifications_all')
    }).done(function(data) {
      $notificationsContent.html(data);
      $('.notification-header-delete i').on('click', function() {
        var $self;
        $self = $(this);
        return $.ajax({
          method: 'POST',
          url: Routing.generate('OpitNotesTravelBundle_notification_delete'),
          data: {
            "id": $self.data('id')
          }
        }).done(function(data) {
          return $self.closest('.notification').remove();
        });
      });
      $('.notification-message').on('click', function(event) {
        event.stopPropagation();
        changeStatus($(this));
      });
      $('.notification-details').on('click.notifications', function(event) {
        var $self;
        event.preventDefault();
        event.stopPropagation();
        $self = $(this);
        changeStatus($self.parent(), function() {
          window.location.href = $self.attr('href');
        });
      });
      $notificationsContent.removeClass('display-none');
      $('#notifications').removeClass('right-m312-important');
      return $('#notifications-wrapper').mCustomScrollbar('update');
    });
  };

  getUnreadNotifications = function() {
    return $.ajax({
      method: 'POST',
      url: Routing.generate('OpitNotesTravelBundle_notifications_unread_count'),
      global: false
    }).done(function(data) {
      var $notificationsIcon, $unreadNotificationsCount;
      $unreadNotificationsCount = $('#unread-notifications-count');
      $notificationsIcon = $('#notifications i');
      if ($('#unread-notifications').html() !== data) {
        if ('0' !== data) {
          $unreadNotificationsCount.removeClass('display-none');
          $notificationsIcon.addClass('color-light-green');
          $unreadNotificationsCount.html(data);
          $('#notifications').addClass('right-m312-important');
        }
      }
      if ('0' === $unreadNotificationsCount.html()) {
        $unreadNotificationsCount.addClass('display-none');
        $notificationsIcon.removeClass('color-light-green');
        $('#notifications').removeClass('right-m312-important');
      }
      return setTimeout(getUnreadNotifications, 10000);
    });
  };

  $.fn.extend({
    formIsEmpty: function(element) {
      var $el, exists;
      $el = element ? $(element) : $(this);
      exists = false;
      $el.find(':input').each(function() {
        if ($(this).attr('type') !== 'hidden') {
          if ($(this).val()) {
            return exists = true;
          }
        }
      });
      return exists;
    },
    checkAll: function(selector) {
      var $el, checkAll;
      $el = selector ? $(selector) : $(this);
      checkAll = $el.filter(':checked').length === $el.length ? false : true;
      $el.each(function() {
        return $(this).prop('checked', checkAll);
      });
      return $(document).data('notes').funcs.changeDeleteButton();
    }
  });

  $(document).ready(function() {
    $(document).data('notes').funcs.initDeleteMultipleListener();
    $(document).data('notes').funcs.initListPageListeners();
    $(document).data('notes').funcs.initPager();
    $('#notifications-wrapper').mCustomScrollbar();
    $('#notifications > i.fa-bell-o').on('click.notifications', function(event) {
      var $container;
      event.stopPropagation();
      $container = $(this).parent();
      if (!$container.hasClass('right-m15-important')) {
        $container.addClass('right-m15-important');
        $(this).removeClass('color-light-green');
        $('#unread-notifications-count').addClass('display-none');
        getAllNotifications($('#notifications-content'));
        $('#notifications-wrapper').on('click.notifications', function(event) {
          return event.stopPropagation();
        });
        return $('body').on('click.notifications', function(event) {
          if ($('#notifications').hasClass('right-m15-important')) {
            $('#notifications').removeClass('right-m15-important');
            return $('body, #notifications-wrapper').off('click.notifications');
          }
        });
      } else {
        $container.removeClass('right-m15-important');
        return $('body, #notifications-wrapper').off('click.notifications');
      }
    });
    if ($('#notifications').length > 0) {
      getUnreadNotifications();
    }
    $('#loggedInUser').click(function() {
      var _ref;
      return $(document).data('OpitNotesUserBundle').funcs.userEdit($(this).children('span').data('user-id'), (_ref = $(document).data('notes').funcs) != null ? _ref.showAlert : void 0);
    });
    $(document).on('click', '.ui-button-text', function() {
      var buttonText;
      buttonText = $(this).html();
      if (buttonText === 'Yes' || buttonText === 'Continue') {
        return $(document).data('notes').funcs.changeDeleteButton(true);
      }
    });
    cloneSubmenu();
    $('.menu .mainMenu').click(function() {
      $('.menu .mainMenu').removeClass('active');
      $(this).addClass("active");
      return cloneSubmenu();
    });
    $(window).scroll(function() {
      var $menuWrapperActive;
      $menuWrapperActive = $('#menuWrapper .active');
      if ($menuWrapperActive.length > 0) {
        if ($menuWrapperActive.children('.subMenu').offset().top < $(window).scrollTop()) {
          if ($('body').has(subMenuCloneClass).length) {
            $subMenuClone.css({
              display: 'block'
            });
          }
        }
        if ($menuWrapperActive.children('.subMenu').offset().top > $(window).scrollTop()) {
          if ($('body').has(subMenuCloneClass).length) {
            return $subMenuClone.css({
              display: 'none'
            });
          }
        }
      }
    });
    return $('#changePassword').on('click', function() {
      var id;
      id = $(this).attr("data-user-id");
      $(document).data('OpitNotesUserBundle').funcs.isLdapUser(id).done(function() {
        $.ajax({
          method: 'GET',
          url: Routing.generate('OpitNotesUserBundle_user_show_password', {
            id: id
          })
        }).done(function(data) {
          return $('<div id="password-dialog"></div>').html(data).dialog({
            title: '<i class="fa fa-list-alt"></i> Reset Password',
            open: function() {
              return $(this).html(data);
            },
            width: 600,
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
                  $('#password-dialog').dialog('destroy');
                  return $(document).data('notes').funcs.showAlert(data, 'update', 'Password successfully changed');
                }).fail(function(data) {
                  data = $.parseJSON(data.responseText);
                  return $(document).data('notes').funcs.showAlert(data, 'update', 'Password reset successfully');
                });
              },
              Close: function() {
                $('#password-dialog').dialog('destroy');
              }
            }
          });
        });
      });
    });
  });

}).call(this);
