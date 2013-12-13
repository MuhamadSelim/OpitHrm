// Generated by CoffeeScript 1.6.3
(function() {
  var __picker;

  $(document).data('notes', {});

  $.extend(true, $(document).data('notes'), {
    funcs: {
      deleteAction: function(title, message, url, identifier) {
        if ($(identifier).find(':checked').length > 0) {
          return $('<div></div>').html('Are you sure you want to delete the ' + message + '?').dialog({
            title: title,
            buttons: {
              Yes: function() {
                $.ajax({
                  method: 'POST',
                  url: url,
                  data: $(identifier).serialize()
                }).done(function(data) {
                  $(identifier).find(':checked').parent().parent().parent().remove();
                }).fail(function() {
                  return $('<div></div>').html('The ' + message + ' could not be deleted due to an error.').dialog({
                    title: 'Error'
                  });
                });
                $(this).dialog('close');
              },
              No: function() {
                $(identifier + ' input:checkbox').attr('checked', false);
                $(this).dialog('close');
              }
            },
            close: function() {
              $(this).dialog('destroy');
            }
          });
        }
      }
    }
  });

  /*
   * jQuery datepicker extension
   * Datepicker extended by custom rendering possibility
   *
   * @author Sven Henneböle <henneboele@opit.hu>
   * @version 1.0
   * @depends jQuery
   * 
   * @param object  options List of options
  */


  __picker = $.fn.datepicker;

  $.fn.datepicker = function(options) {
    var $self, defaultOptions;
    __picker.apply(this, [options]);
    $self = this;
    options = options || {};
    defaultOptions = {
      wrapper: '<span class="relative"></span>',
      indicatorIcon: $('<i>')
    };
    $.extend(true, defaultOptions, options);
    if (options.showOn !== 'button') {
      $self.attr({
        type: 'text',
        readonly: 'readonly'
      }).addClass('icon-prefix-indent');
      defaultOptions.indicatorIcon.addClass('fa fa-calendar absolute input-prefix-position pointer');
      defaultOptions.indicatorIcon.click(function() {
        return $(this).parent().parent().children('input').focus();
      });
      $self.before(defaultOptions.wrapper);
      $self.prev().append(defaultOptions.indicatorIcon);
    }
    return $self;
  };

  if (!Modernizr.inputtypes.date) {
    $('input[type=date]').each(function() {
      var id, name;
      name = $(this).attr('name');
      id = $(this).attr('id');
      $(this).after('<input type="hidden" name="' + name + '" id="altDate' + id + '" />');
      $(this);
      return $(this).datepicker({
        altField: '#altDate' + id,
        altFormat: 'yy-mm-dd'
      });
    });
  }

}).call(this);
