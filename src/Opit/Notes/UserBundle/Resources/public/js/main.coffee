$(document).data 'OpitNotesUserBundle', {}

# Declare any generic user bundle functions here
$.extend true, $(document).data('OpitNotesUserBundle'),
    funcs:
        userEdit: (userId, successCallback) ->
          $.ajax
            method: 'GET'
            url: Routing.generate 'OpitNotesUserBundle_user_show', id: userId
          .done (data) ->
            $('<div id="dialog-edititem"></div>').html(data)
              .dialog
                  open: ->
                    $('.ui-dialog-title').append ('<i class="fa fa-list-alt"></i> Edit User')
                  width: 750
                  modal: on
                  buttons:
                    Save: ->
                      $.ajax
                        type: 'POST'
                        url: Routing.generate 'OpitNotesUserBundle_user_add', id: userId
                        data: $('#adduser_frm').serialize()
                      .done (data)->
                          url = Routing.generate 'OpitNotesUserBundle_user_list'
                          if url is window.location.pathname
                            response = data
                            $.ajax
                              type: 'POST'
                              url: url
                              data: "showList" : 1
                            .done (data)->
                              $('#user-list').html data
                              postActions = successCallback response, "update","User modified successfully" if successCallback?
                              $('#dialog-edititem').dialog 'destroy' if postActions or postActions is undefined
                          else
                            $('#dialog-edititem').dialog 'destroy'
                          return
                      .fail (data) ->
                        successCallback $.parseJSON(data.responseText), "update","Error"
                    Close: ->
                       $('#dialog-edititem').dialog "destroy"
                       return
              return
            return

$subMenuClone = {}
subMenuCloneClass = '.subMenuClone'

cloneSubmenu = ->
    # if header submenu exists in body delete it
    if $('body').children(subMenuCloneClass).length
        $('body').find(subMenuCloneClass).remove()
    # create clone of submenu
    $subMenuClone = $('.active').children('.subMenu').clone()
    $subMenuClone.addClass 'subMenuClone'
    $('body').append $subMenuClone

changeDeleteButton = (disableInputCheck = false) ->
    $deleteButton = $('#delete')
    $deleteButton.attr 'disabled', 'disabled'
    $deleteButton.addClass 'button-disabled'
    if disableInputCheck is false
        $('#list-table tr td input[type=checkbox]').each ->
            if $(@).prop 'checked'
                $deleteButton.removeClass 'button-disabled'
                $deleteButton.removeAttr 'disabled'
                return false
               
getAllNotifications = ($notificationsWrapper) ->
    # post an AJAX request to get all notifications
    $.ajax
        method: 'POST'
        url: Routing.generate 'OpitNotesTravelBundle_notifications_all'
    .done (data) ->
        # fill up wrapper with AJAX result
        $notificationsWrapper.html data
        # add listener to trash icon
        $('.notification-header-delete i').on 'click', ->
            self = $(@)
            notificationId = $(self).data 'id'
            # if delete icon clicked send an AJAX request to delete notification
            $.ajax
                method: 'GET'
                url: Routing.generate 'OpitNotesTravelBundle_notification_delete', id: notificationId
            .done (data) ->
                # if item was deleted remove row from wrapper
                self.closest('.notification').remove()
        # add listener to details buton
        $('.notification-details').on 'click', (event) ->
            # if clicked prevent default event
            event.preventDefault()
            self = $(@)
            notificationId = self.data 'id'
            # set an AJAX request to change the read state of the notification
            $.ajax
                method: 'POST'
                url: Routing.generate 'OpitNotesTravelBundle_notifications_state_change'
                data: "id" : notificationId
            .complete ->
                # if ajax request is completed redirect user
                window.location.href = self.attr 'href'
        # show notifications wrapper
        $notificationsWrapper.removeClass 'display-none'
               
# check for new notifications
getUnreadNotifications = () ->
    # send an AJAX request to get the number of unread notifications
    $.ajax
        method: 'POST'
        url: Routing.generate 'OpitNotesTravelBundle_notifications_unread_count'
    .done (data) ->
        $unreadNotificationsCount = $('#unread-notifications-count')
        $notificationsGlobe = $('#notifications i')
        unreadNotificationCount = $('#unread-notifications').html()
        # if number of unread notifications and data returned from the server are not the same
        if unreadNotificationCount !=  data
            # if returned number of notifications is not zero
            if '0' != data
                # show number of unread notifications indicator
                $unreadNotificationsCount.removeClass 'display-none'
                # set globe to active
                $notificationsGlobe.addClass 'active-text'
                # replace the number in the indicator
                $unreadNotificationsCount.html data
            
        if '0' == $unreadNotificationsCount.html()
            $unreadNotificationsCount.addClass 'display-none'
            $notificationsGlobe.removeClass 'active-text'
            
        # check for new notifications every 10 seconds
        setTimeout getUnreadNotifications, 10000

# Place any jQuery/helper plugins in here.

$.fn.extend
    formIsEmpty: (element) ->
        $el = if element then $(element) else $(@)
        exists = no
        $el.find(':input').each ->
            exists = yes if($(@).val())
        return exists
  
    checkAll: (selector) ->
        $el = if selector then $(selector) else $(@)
        checkAll = if $el.filter(':checked').length is $el.length then false else true
        $el.each ->
            $(@).prop 'checked', checkAll
        changeDeleteButton()

$(document)
    .ready ->
    
        $(document).on 'click', ->
            $('#notifications-wrapper').addClass 'display-none'
    
        $notificationsWrapper = $('#notifications-wrapper')
        $('#notifications').on 'click', (event) ->
            #stop event bubbling
            event.stopPropagation()
            # remove classes that make the notifications tab active
            $('#notifications i').removeClass 'active-text'
            $('#unread-notifications-count').addClass 'display-none'
            #call get all notifications function
            getAllNotifications($notificationsWrapper)
        # start checking for new notifications
        getUnreadNotifications()
    
        $('#loggedInUser').click ->
            $(document).data('OpitNotesUserBundle').funcs.userEdit $(@).children('span').data('user-id'), $(document).data('OpitNotesUserBundle').funcs?.showAlert
            
        $deleteButton = $('#delete')
        $deleteButton.attr 'disabled', 'disabled'
        $deleteButton.addClass 'button-disabled'
        $deleteButton.removeClass 'delete'
        $('#list-table tr td').on 'change', 'input[type=checkbox]', ->
            changeDeleteButton()
            
        $(document).on 'click', '.ui-button-text', ->
            buttonText = $(@).html()
            if buttonText == 'Yes' or buttonText == 'Continue'
                changeDeleteButton(true)
            
    
        cloneSubmenu()
        # function to make header menu tabs selectable
        $('.menu .mainMenu')
            .click ->
                $('.menu .mainMenu').removeClass 'active'
                $(@).addClass "active"
                cloneSubmenu()
        # scroll method for sticky header
        $(window).scroll ->
            $menuWrapperActive = $('#menuWrapper .active')
            # if page scroll is below submenu top show submenu clone
            if $menuWrapperActive.length > 0
                if $menuWrapperActive.children('.subMenu').offset().top < $(window).scrollTop()
                    if $('body').has(subMenuCloneClass).length
                        $subMenuClone.css({display: 'block'})
                # if page scroll is above submenu top hide submenu clone
                if $menuWrapperActive.children('.subMenu').offset().top > $(window).scrollTop()
                    if $('body').has(subMenuCloneClass).length
                        $subMenuClone.css({display: 'none'})
                


