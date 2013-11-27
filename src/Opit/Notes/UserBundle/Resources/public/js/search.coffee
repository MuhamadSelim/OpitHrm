$form = $('#searchForm')
url = $form.attr 'action'
$('#searchButton').click ->
  event.preventDefault()
  return if not $form.formIsEmpty()
  
  $.ajax
      method: 'POST'
      url: url
      data: $form.serialize()
  .done (response) ->
    $('#userlistWrapper').html response
    return
  return
  
$('#resetButton').click ->
  $.ajax
      method: 'POST'
      url: url
      data: 'resetForm': true
  .done (response) ->
    $('#userlistWrapper').html response
    return
  return

$('#searchFormTitle').click ->
  $(@).children('i').toggleClass 'fa-chevron-down'
  $(@).next().slideToggle()