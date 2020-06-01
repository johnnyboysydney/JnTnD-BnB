$(document).on('click', '.template > .container .close', function(e) {
  
  $(this).parents('.template').remove();

});


function onStart() {

  let tpl = $('body > .template');

  tpl.each(function(el) {

    let htm = $(this).html();
    htm = htm.replace(/{\[/g,'{{');
    htm = htm.replace(/\]}/g,'}}');   
    $(this).html(htm);
    
  });

  $.ajax({
    url: '/api/weather',
    method: "GET"
  })
  .then(function(resp) {
    $('#weather .weather-temp').html(resp.temp);
  });
}

onStart();
