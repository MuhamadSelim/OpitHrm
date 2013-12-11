$form = $('#searchTravelForm')
$('#searchButton').click ->
  event.preventDefault()
  return if not $form.formIsEmpty()

  $.ajax
      method: 'POST'
      url: Routing.generate 'OpitNotesTravelBundle_travel_search'
      data: $form.serialize()
  .done (response) ->
    $('#list-table').html response
    return
  return

$('#resetButton').click ->
  $.ajax
      method: 'POST'
      url: Routing.generate 'OpitNotesTravelBundle_travel_search'
      data: 'resetForm': true
  .done (response) ->
    $('#list-table').html response
    return
  return

$('#searchFormTitle').click ->
    if not $(@).next().is(':animated')
        $(@).children('i').toggleClass 'fa-chevron-down'
        $(@).next().slideToggle()