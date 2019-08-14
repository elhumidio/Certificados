 /* @author Damián Esteban Blanc Perez - damian.blanc@t-systems.es
 /* @version 1.0 -04/04/2018
 */ 


 /***********************************************************************************
	Clean CI filters
 */



$('div#divso').click(function(){

	alert("LOW");
});

function verifyChecksSI()
{
	var si = $('#SALIDA_INTERNET').is(":checked");
	var no = $('#NOSALIDA_INTERNET').is(":checked");

	if(!si && !no)
		$('#divOpciones').notify("Must check at least one checkbox",{position:'top left',className:'warning'});

}

function discriminateClickInOut()
{

	//this method discriminates between click on container or nested element
$('#iddivgeneral').on('click', function (event) {
  if (event.target == this) { 
    
    $('#divDynamicTableLabel').attr('contenteditable',false);
	$('#divDynamicTableLabel').css('cursor','pointer');
	$('#divDynamicTableLabel').css('background-color','#D6D6C2');
  }
  else 
  {
    // Si quisieramos que actue cuando clickamos en otro contenedor
  }
});	
}

function cleantxtFieldsSoft(){

		$('.txtFieldsSoft').css('background-color','white');
}






