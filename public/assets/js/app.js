$(document).on('click', '.template > .container .close', function(e) {
  
  $(this).parents('.template').remove();

});


function myFunction() {


  let tpl = $('body > .template');

  tpl.each(function(el) {
    //const pattern = new RegExp('{{', 'g');
    //$(this).html($(this).html().replace('/a/g', '{{'));



    let htm = $(this).html();
    
    $(this).html(htm);


  })

  /*


  var x = document.body.innerHTML;  

  const pattern = new RegExp("{/{", "gm");
  x = x.replace(pattern, "{{");

  document.body.innerHTML = x;
*/
}

myFunction();
