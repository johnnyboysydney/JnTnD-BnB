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

  $(document).on('submit', 'form[data-action]', function(event) {  
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    alert('etst');

    if ($('.active.popup-box').length) {
      $('.active.popup-box').remove();
    }

    const subData = Object.fromEntries(
      Object.entries(event.target)
      .filter(d => 
        {
          if (d[1].type === 'text' 
          || d[1].type === 'email'
          || d[1].type === 'tel'
          || d[1].type === 'time'
          || d[1].type === 'hidden') {
                
            return d;
          }
        }
      )
      .map(d => 
        {
          return [ d[1].name, d[1].value ]
        }
      )
    );

    $.ajax(event.target.action, {
      type: "POST",
      data: subData
    })
    .then((data) => {

      $(event.target).trigger("reset");

      const hbTpl = $(event.target).attr('data-template');
          
      let templateData = data.data;

      let html = $('.template.' + hbTpl).html();
      let template = Handlebars.compile(html);
      let compliedHtml = template(templateData);
      let popBox = $(compliedHtml);
      $('body').append(popBox);

      popBox.removeClass('inactive');
      popBox.addClass('active');
      

    });
  });
    
}

onStart();
