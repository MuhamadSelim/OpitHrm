// Generated by CoffeeScript 1.7.1
(function() {
  $(document).ready(function() {
    var $travelList;
    $('#main-wrapper').on('click', '.status-history', function(event) {
      event.preventDefault();
      return $.ajax({
        method: 'POST',
        url: Routing.generate('OpitNotesTravelBundle_travel_states_history'),
        data: {
          'id': $(this).find('.fa-book').data('id')
        }
      }).done(function(data) {
        var dialogWidth;
        dialogWidth = 550;
        $('<div id="dialog-show-details-tr"></div>').html(data).dialog({
          open: function() {
            return $('.ui-dialog-title').append('<i class="fa fa-book"></i> Status history');
          },
          width: dialogWidth,
          maxHeight: $(window).outerHeight() - 100,
          modal: true,
          buttons: {
            Close: function() {
              $('#dialog-show-details-tr').dialog('destroy');
            }
          }
        });
      });
    });
    $('#main-wrapper').on('click', '#travel_list #list-table .clickable', function() {
      var $changeState, firstStatusId, travelRequestId;
      $changeState = $(this).closest('tr').find('.changeState');
      travelRequestId = $(this).attr('data-tr-id');
      firstStatusId = $(this).parent().find('option:first-child').val();
      $.ajax({
        method: 'POST',
        url: Routing.generate('OpitNotesTravelBundle_travel_show_details'),
        data: {
          'id': travelRequestId
        }
      }).done(function(data) {
        var dialogWidth;
        dialogWidth = 550;
        $('<div id="dialog-show-details-tr"></div>').html(data).dialog({
          open: function() {
            return $('.ui-dialog-title').append('<i class="fa fa-list-alt"></i> Details');
          },
          width: dialogWidth,
          maxHeight: $(window).outerHeight() - 100,
          modal: true
        }, firstStatusId === '1' || firstStatusId === '3' ? {
          buttons: {
            'Send for approval': function() {
              $(document).data('notes').funcs.changeTravelRequestStatus(2, travelRequestId);
              return $('#dialog-show-details-tr').dialog('destroy');
            },
            Close: function() {
              $('#dialog-show-details-tr').dialog('destroy');
            }
          }
        } : {
          buttons: {
            Close: function() {
              $('#dialog-show-details-tr').dialog('destroy');
            }
          }
        });
      });
    });
    $('#main-wrapper').on('click', '.print-view', function(event) {
      var win;
      event.preventDefault();
      win = window.open($(this).attr('href'), '_blank');
      return win.focus();
    });
    $travelList = $('#travel_list');
    $travelList.on('change.tr_status', '.changeState', function() {
      var travelRequestId;
      travelRequestId = $(this).closest('tr').find('.clickable').data('tr-id');
      return $(document).data('notes').funcs.changeStateDialog($(this), $(document).data('notes').funcs.changeTravelRequestStatus, travelRequestId);
    });
    $travelList.on('click', '.order-text', function() {
      return $(document).data('notes').funcs.serverSideListOrdering($(this), $(this).parent().find('i').attr('data-field'), 'OpitNotesTravelBundle_travel_list', 'travel_list');
    });
    $travelList.on('click', '.fa-sort', function() {
      return $(document).data('notes').funcs.serverSideListOrdering($(this), $(this).data('field'), 'OpitNotesTravelBundle_travel_list', 'travel_list');
    });
    return $travelList.on('click', '.trip-purpose', function() {
      return $(this).toggleClass('text-show-all');
    });
  });

}).call(this);
