 /* @author Damián Esteban Blanc Perez - damian.blanc@t-systems.es
 /* @version 1.0 -06/02/2018
 */ 




var urlBase=  '/cert';
var CERT = {};
CERT.values = {
		table:                          '',
		queryid: 						'', 
		queryname:                      '',
		editquery:                      false,
		union:                          '',
		unix:                           '',
		win:                            '',                                                                                                                                                                                                                                                                                                                                                                                                                   
		andOr:                          '',
		softVersionsRecovery:           '',
		softVersionsArray:              '',
		softvalues:                     '',
		idSavedQuery:                   '',
		queriesretrieved:               '', 
		globalAttack: 					'false', 
		queryretrieved: 					'', 
		successquery: 					'false',
		serializedValues:					'',
		lastQuery: 							'',
		parsedDataSoft:						'',
		arrayParsedData: {
							uniqueid:		'',
							critically: 	'',
							cvs5bs:			'',
							timestamp:		'',
							cvs5vector:		'',
							textoparseado:	'',
							query:			''
								
		},
		queryResult:		'',
		datatable:			'',
		datatableReports:    '',
		checkedSoft:         []
};




/**
 * Usada por los cuadros de dialogo para solo permitir introducir numeros
 * @param evt
 */
function onlyNumbers(evt) {
	evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : event.keyCode;        

    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;

    return true;

}
/*Extents replace function, replacing all instances*/
String.prototype.replaceAll = function(str1, str2, ignore) 
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
} 




	/**
 * Envia los datos parseados a la vista
 * @param rawdata
 */
function gotoSecondStep(table)
{	
 	fnResetAllFilters(table);
 	window.location.href= urlBase;
	
}

	function dataParser(){
	    $.ajax({
			timeout: 48000,
			url : urlBase + '/index/parseddata',
			async:false,
			type: "POST",
			dataType : "text",
			
			success:function(dataret){
				$('.rawcontainer').html('');
				$('.content').html('');
				$('.tblButtons').hide();
				$('.content').html(dataret);
			},
			error:function(dataret) {
				console.log(dataret);
				//$.notify('failed' + dataret);
			 		},
								
			});	
		
	}


/// <summary>Updates Query</summary>
/// <param name="si">si</param>
/// <returns>function</returns>
function updateQuery(si){
var andor= $('#andOr').val();
 var filters = {
        slct_SO:$('#slct_SO').val().split("|")[1],slct_GrpoProp:$('#slct_GrpoProp').val().split("|")[1],slct_Cliente:$('#slct_Cliente').val().split("|")[1],slct_Entorno:$('#slct_Entorno').val().split("|")[1]
    };


var queryName = $('#divDynamicTableLabel').text();
var privacy = $( '#chkprivacy' ).prop( "checked" ) ==  true ? 1 : 0;

        			    $.ajax({
								timeout: 48000,
								url : urlBase + '/ajax/updatequery',
								async:false,
								type: "POST",
								dataType : "json",

								data:{id:CERT.values.queryid,serializedvalues:CERT.values.serializedValues,softversions:CERT.values.softVersionsArray,union:CERT.values.union,si:si,andor:andor,name:queryName,filters,filters,privacy:privacy},
								success:function(dataret){
									
									if(dataret == "KO")
									{
										$('.buttondivparsed').notify(dataret,{position:'top center',className:'error'});
										
										
									}
									else if(dataret == "0"){
										$('.buttondivparsed').notify('Query - ' + queryName + ' - Not modified',{position:'top center',className:'warning'});

									}
									else{
										$('.buttondivparsed').notify('Query - ' + queryName + ' - updated successfully',{position:'top center',className:'success'});
										$('#divDynamicTableLabel').attr('contenteditable',false);
										$('#divDynamicTableLabel').css('cursor','pointer');
									}
								},
								error:function(dataret) { $.notify('failed' + dataret);
								 
										console.log(dataret);
								 },
													
								});	
}



/**
 * Muestra los datos generados por la query 
 */
function gotoThirdStep(union,id)
{
	
	var idAdvice = id;
  	contcrit = 0;
  	contprot = 0;
 
  $('[name="ENTORNOCRITICALITY"]:checked').each(function(){
         
         contcrit ++;
  });
  var nocriticality = contcrit > 0 ? "true" : "false";
  
  $('[name="ENTORNOPROTECTIONCLASS"]:checked').each(function(){
         
         contprot ++;
  });
	 var noprotclass = contprot > 0 ? "true" : "false";

	var salidaInternet =  $('#SALIDA_INTERNET').prop('checked');
	var andorSelect = $('#andOr').val();

			var sint =  $('#SALIDA_INTERNET').prop('checked');
			var nosint = $('#NOSALIDA_INTERNET').prop('checked');
			var siinternet = sint == true && nosint == false ? "sint" : sint == false && nosint == true ? "nosint" : sint == true && nosint == true ? "siboth" : "sierror";
			var queryname = $('#divDynamicTableLabel').text();
console.log("Salida a Internet: " + siinternet);
	   var filters = {
        slct_SO:$('#slct_SO').val().split("|")[1],slct_GrpoProp:$('#slct_GrpoProp').val().split("|")[1],slct_Cliente:$('#slct_Cliente').val().split("|")[1],slct_Entorno:$('#slct_Entorno').val().split("|")[1]
    };	
			    	
		
		$('<div id="processingDatav" style="position:absolute;margin-left:33%;margin-top:11%;opacity:0.7;z-index:999999;"><img width="80" height="80" src="/img/loading1.gif"></div>').prependTo('.content');

		$('processingDatav').show();

		
		$.ajax({
		timeout: 48000,
		url : urlBase + '/index/queryexecuted',
		type: "POST",
		async:true,
		data:{queryname : queryname,values:CERT.values.serializedValues,
				newValues:JSON.stringify(CERT.values.softVersionsArray),
				andor:andorSelect,
				si:siinternet,
				union:union,
				nocriticality:nocriticality,
				noprotclass:noprotclass,
				softversionsrecover:CERT.values.softVersionsRecovery,
				id:idAdvice,
				filters:filters}, 
		success:function(d){

			
			$('#resultsCI').html('').append(d);
			$('#processingDatav').hide();
  		 },
  		 error:function(jqxhr, settings, ex) { alert('failed, ' + ex);
  		$('#processingDatav').hide();
  		 },
  		complete: function(data) {
            // end of ajax call
  			$('#processingDatav').hide();     
        }
	       	
	});
		
}



/// <summary>Saves a query</summary>
/// <returns>function</returns>
function saveQuery()
{
	unix = $("#chkunix").attr("checked") ? 1 : 0;
	win = $("#chkwintel").attr("checked") ? 1 : 0;	
	union = win == 1 && unix == 1 ? "both" : win == 1 && unix == 0  ? "win" : "unix";
	CERT.values.union = union;
			
	if(unix == 0 && win == 0)
	{
		$('#divOpciones').notify("At least one soft checkbox should be checked (Wintel - Unix)",{position:"top center",className:"info"});
		return false;
	}


var inputstext = $('.txtFieldsSoft');
var alertt = false;

for (var i = 1; i < inputstext.length; i++) {
//console.log("VALOR texto: " + $('#' + inputstext[i].id).val());
	if($('#' + inputstext[i].id).val() == "")
		{
			$('#' + inputstext[i].id).css('background-color','#ff9999');
			$('#' + inputstext[i].id).attr('placeholder','This field is required');
			alert('#' + inputstext[i].id);
			alertt = true;
		}
}
	if(alertt) {
		
		$('.inputtable').notify('Some mandatory fields are empty. \nPlease fill it with some software name or part of it.',{position:'top center',className:'error'});
		return false;
	}

	
	var filas = document.getElementById("dynamicTable").rows;
		
		
	var softVersionsArray = new Array();
	var softVersionRecoverQuery = new Array();

	for (var i = 1; i < filas.length; i++) {
	var cells = filas[i].getElementsByTagName('td');

			for (var m = 0; m < cells.length;m++) {
				if(m==0){
					var input = cells[m].getElementsByTagName('input');	
					var element = {software:input[0].value};
				}
				
				if(m==2){
					var checks = cells[m].getElementsByTagName('input');
					element.versions = 	new Array();
					element.versionsRecover = new Array();
					for(var l = 0; l < checks.length; l++)
					{
					    if(checks[l].checked){
					    	element.versions.push(checks[l].value);	
				
						}
					    element.versionsRecover.push(checks[l].value);

					}

				}
			}

	 
		     softVersionsArray.push(element);
		     
	  

	}

	CERT.values.serializedValues = $('#iddivgeneral *').serializeArray();

	var i = CERT.values.serializedValues.length;

	while(i--)
	{
		if(CERT.values.serializedValues[i].name.includes("chk_"))
		{
			CERT.values.serializedValues.splice(i,1);		
		}
	}
	
	
	CERT.values.softVersionsArray = softVersionsArray;
	
}

/// <summary>Searches for servers with the conditions determined by form</summary>
/// <returns>function</returns>
function searchServers(id){

countrows = $('#divDynamicTable tr').length;

if(countrows == 2){
	$('#divDynamicTable').notify("At least one software has to be informed",{position:"top center",className:"error"});
	return false;
}

		unix = $("#chkunix").attr("checked") ? 1 : 0;
		win = $("#chkwintel").attr("checked") ? 1 : 0;	
		union = win == 1 && unix == 1 ? "both" : win == 1 && unix == 0  ? "win" : "unix";
			
		if(unix == 0 && win == 0)
		{
			$('#divOpciones').notify("At least one soft checkbox should be checked (Wintel - Unix)",{position:"top center",className:"info"});
			return false;
		}

		var inputstext = $('.txtFieldsSoft');
		var alertt = false;

		for (var i = 1; i < inputstext.length; i++) {
			
			if($('#' + inputstext[i].id).val() == "")
			{
				$('#' + inputstext[i].id).css('background-color','#ff9999');
				$('#' + inputstext[i].id).attr('placeholder','This field is required');
				//alert('#' + inputstext[i].id);
				alertt = true;
			}
		}
	
	if(alertt) {
		
		$('.inputtable').notify('Some mandatory fields are empty. \nPlease fill it with some software name or part of it.',{position:'top center',className:'error'});
		return false;
	}


	

	
		var filas = document.getElementById("dynamicTable").rows;
		
		
		var softVersionsArray = new Array();
		var softVersionsRecover = new Array;

		for (var i = 0; i < filas.length; i++) 
		{
		
				var cells = filas[i].getElementsByTagName('td');
			
			for (var m = 0; m < cells.length;m++) 
			{
				if(m==0)
				{
					var input = cells[m].getElementsByTagName('input');	
					var element = {software:input[0].value};
				}
				
				if(m==2)
				{
					var checks = cells[m].getElementsByTagName('input');
					element.versions = 	new Array();
					element.checkedId = new Array();
					
					for(var l = 0; l < checks.length; l++)
					{
				
				
					    if(checks[l].checked)
					    {
						   	element.versions.push(checks[l].value);
						   	element.checkedId.push(checks[l].id);
					    }
					    
					}
		
				}
			}
						softVersionsArray.push(element);
		}
		
		for (var i = 0; i < filas.length; i++) 
		{
		
				var cells = filas[i].getElementsByTagName('td');
			
			for (var m = 0; m < cells.length;m++) 
			{
				if(m==0)
				{
					var input = cells[m].getElementsByTagName('input');	
					var element = {software:input[0].value};
				}
				
				if(m==2)
				{
					var checks = cells[m].getElementsByTagName('input');
					element.versions = 	new Array();
					
					
					for(var l = 0; l < checks.length; l++)
					{
				
				
					    //if(checks[l].checked)
					   // {
						   	element.versions.push(checks[l].value);
						   	
						   	
					    //}
					    
					}
		
				}
			}
			 softVersionsRecover.push(element);
		}

	CERT.values.serializedValues = $('#iddivgeneral *').serializeArray();
	CERT.values.softVersionsArray = softVersionsArray;
	CERT.values.softVersionsRecovery = softVersionsRecover;
	//verify checks criticality and protection class
	
	
	gotoThirdStep(union,id);
}



/**
 * Redirige a los reportes
 */
function gotoReports(data)
{
	
	CERT.values.datatableReports = data;
	var queryfield = $('#query').val();
	$.ajax({
		timeout: 48000,
		url : urlBase + '/index/reports',
		type: "POST",
		data:{arraydata:data},
		success:function(d){
			
			//window.location.href= urlBase +'/index/parseddata';
			$('.colRight').html('').append(d);
		
  		 },
  		 error:function(jqxhr, settings, ex) { alert('failed, ' + ex);},
  		complete: function(data) {
            // end of ajax call
             
        }
	       	
	});
}


/**
 * Generates a report with current data (in datatable)
 * @param data
 */
function printReport(data) {
var content = "";
	//console.log("contenido datatable: " + CERT.values.datatable);
    content +="<html><head><title style='font-size:24px !important;font-family:arial;'>Resultado de búsqueda de Servidores</title><link rel='stylesheet' media='print' type='text/css' href='estilos/css/print.css' /></head><body>";
    content +="<table class='tbljournal' style='margin-left:1% !important;margin-top:10%;background-color: whitesmoke;border-collapse: collapse;'>";
    content += 

    		"<th style='background-color:#0077b3;color:white;border-radius:3px;-moz-border-radius:3px; font-family:arial;font-weight:normal;'>SO</th>" +
    		"<th style='background-color:#0077b3;color:white;border-radius:3px;-moz-border-radius:3px; font-family:arial;font-weight:normal;'>Sala</th>" +
    		"<th style='background-color:#0077b3;color:white;border-radius:3px;-moz-border-radius:3px; font-family:arial;font-weight:normal;'>Servidor</th>" +
    		"<th style='background-color:#0077b3;color:white;border-radius:3px;-moz-border-radius:3px; font-family:arial;font-weight:normal;'>Tipo</th>" +
    		"<th style='background-color:#0077b3;color:white;border-radius:3px;-moz-border-radius:3px; font-family:arial;font-weight:normal;'>Tec. Virtualización</th>" +
    		"<th style='background-color:#0077b3;color:white;border-radius:3px;-moz-border-radius:3px; font-family:arial;font-weight:normal;'>Cliente</th>" +
    		"<th style='background-color:#0077b3;color:white;border-radius:3px;-moz-border-radius:3px; font-family:arial;font-weight:normal;'>Servicio</th>" +
    		"<th style='background-color:#0077b3;color:white;border-radius:3px;-moz-border-radius:3px; font-family:arial;font-weight:normal;'>Sub Servicio</th>" +
    		"<th style='background-color:#0077b3;color:white;border-radius:3px;-moz-border-radius:3px; font-family:arial;font-weight:normal;'>State</th>" +
    		"<th style='background-color:#0077b3;color:white;border-radius:3px;-moz-border-radius:3px; font-family:arial;font-weight:normal;'>Entorno</th>" +
    		"<th style='background-color:#0077b3;color:white;border-radius:3px;-moz-border-radius:3px; font-family:arial;font-weight:normal;'>Propietario</th>" +
    		"<th style='background-color:#0077b3;color:white;border-radius:3px;-moz-border-radius:3px; font-family:arial;font-weight:normal;'>Grupo Propietario</th>"+
    		"<th style='background-color:#0077b3;color:white;border-radius:3px;-moz-border-radius:3px; font-family:arial;font-weight:normal;'>Software</th>"+
    		"<th style='background-color:#0077b3;color:white;border-radius:3px;-moz-border-radius:3px; font-family:arial;font-weight:normal;'>Versión</th>";
    		
    console.log("CERT.values.datatable * * *************************************************");
    console.log(CERT.values.datatable);
    for(var r = 0; r < CERT.values.datatable.length; r++){
    	
    	content += "<tr style='font-family:arial;font-weight:normal;font-size:0.7em;'>"
    	
    	content +="<td style='border:solid #e6e6e6 1px'>"  
    	+ CERT.values.datatable[r]["Sistema Operativo"] + "</td><td style='border:solid #e6e6e6 1px'>" 
    	+ CERT.values.datatable[r].Sala + "</td><td style='border:solid #e6e6e6 1px'>" 
    	+ CERT.values.datatable[r].Servidor + "</td><td style='border:solid #e6e6e6 1px'>" 
    	+ CERT.values.datatable[r].Tipo + "</td><td style='border:solid #e6e6e6 1px'>" 
    	+ CERT.values.datatable[r]["Tec. Virtualización"] + "</td><td style='border:solid #e6e6e6 1px'>" 
    	+ CERT.values.datatable[r].Cliente + "</td><td style='border:solid #e6e6e6 1px'>" 
    	+ CERT.values.datatable[r].Servicio + "</td><td style='border:solid #e6e6e6 1px'>"
    	+ CERT.values.datatable[r].SubServicio +"</td><td style='border:solid #e6e6e6 1px'>"
    	+ CERT.values.datatable[r].State  +"</td><td style='border:solid #e6e6e6 1px'>"
    	+ CERT.values.datatable[r].Entorno +"</td><td style='border:solid #e6e6e6 1px'>" 
    	+ CERT.values.datatable[r].Propietario + "</td><td style='border:solid #e6e6e6 1px'>"
    	+ CERT.values.datatable[r]["Grupo Propietario"] + "</td><td style='border:solid #e6e6e6 1px'>"
    	+ CERT.values.datatable[r].Software + "</td><td style='border:solid #e6e6e6 1px'>"
    	+ CERT.values.datatable[r].Version + "</td>"; 
    	    content +="</tr>";

    		
    }
    content += "</table></body></html>";	
	$('#' + data).html('').append(content.replace('[object Window]',''));
	
	var DocumentContainer = document.getElementById(data);
    var WindowObject = window.open('', "PrintWindow", "width=800,height=750,top=50,left=350,toolbars=yes,scrollbars=yes,status=yes,resizable=yes");
    WindowObject.document.writeln(DocumentContainer.innerHTML);
    WindowObject.document.close();
    WindowObject.focus();
    WindowObject.print();
    WindowObject.close();
}

/**
 * Export to excel results on table
 */
function exportToExcel()
{
	//alert("Herai");
	$.ajax({
		timeout: 48000,
		url : urlBase + '/index/reporting',
		type: "POST",
		//dataType : "json",
		data:{data:CERT.values.datatable},
		success:function(d){
			
			//downloadFile(d);
			//console.log(d);
	
			downloadFile('download.php?file=' + d);
		
  		 },
  		 error:function(jqxhr, settings, ex) { alert('failed, ' + ex +  "\nsettings: " + settings);},
  		complete: function(data) {
            // end of ajax call
             
        }
	       	
	});

}


/**
 * Download a file
 * @param url
 */
function downloadFile(url)
{
	
	window.open(url);
    /*var iframe;
    iframe = document.getElementById("download-container");
    if (iframe === null)
    {
    	
        iframe = document.createElement('iframe');  
        iframe.id = "download-container";
        iframe.style.visibility = 'none';
        iframe.style.width = '500';
        iframe.style.height = '500';
        
        document.body.appendChild(iframe);
        iframe.src = url;  
    }*/
  
}

//Gestión de adjuntos del plugin blueimp-jQuery-File-Upload
function gestorFicherosAdjuntos(){

	window.locale = {
		    "fileupload": {
		        "errors": {
		            "maxFileSize": "Fichero demasiado grande",
		            "minFileSize": "Fichero demasiado pequeño",
		            "acceptFileTypes": "Tipo de fichero no permitido",
		            "maxNumberOfFiles": "Excedido en numero de ficheros permitidos",
		            "uploadedBytes": "Uploaded bytes exceed file size",
		            "emptyResult": "Empty file upload result"
		        },
		        "error": "Error",
		        "start": "Start",
		        "cancel": "Cancel",
		        "destroy": "Delete"
		    }
	};
	
	
	//Adjuntos 
	if($( "#id_adjuntos" ).length)
	{
	      var id_adjuntos = $('#id_adjuntos').val();
	      var base_url = $('#base_url').val();

	      
//	    $('#fileupload').fileupload();
	    $('#fileupload').fileupload({
	    	maxFileSize: 100000000,
	    	minFileSize: undefined,	    	
//	    	maxNumberOfFiles: 2,
//	    	acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
		    messages: {
	            maxNumberOfFiles: 'Maximum number of files exceeded',
	            acceptFileTypes: 'File type not allowed',
	            maxFileSize: 'File is too large',
	            minFileSize: 'File is too small'
	        }
	    });

	    // Enable iframe cross-domain access via redirect option:
	    $('#fileupload').fileupload(
	        'option',
	        'redirect',
	        '/estilos/blueimp-jQuery-File-Upload-02efca0/cors/result.html?%s'
	    );

	     
	     $('#fileupload').each(function () {
	         var that = this;
	         $.getJSON(base_url+'/uploads/index.php/?id_adjuntos='+id_adjuntos, function (result) {
	             if (result && result.length) {
	                 $(that).fileupload('option', 'done')
	                     .call(that, null, {result: result});
	             }
	         });
	     });
	     
	   
	}
	//FIN Adjuntos 
	
}

function getSoloFecha(data){

	if (data == '0000-00-00 00:00:00' || data == null){
		return '';
	} else {
		
		return '<center>'+data.substring(8,10)+'-'+data.substring(5,7)+'-'+data.substring(0,4)+'</center>';
	}

}

function getSoloFechaIngles(data){

	if (data == '0000-00-00 00:00:00' || data == null){
		return '';
	} else {
		return '<center>'+data.substring(0,10)+'</center>';
	}

}


function guardarDesdeAdjuntos(mensaje){

	if (!mensaje){
		mensaje = 'ATENCION!\n\nPara adjuntar documentacion es necesario que guarde el Form.\n\nDesea guardar la incidencia y adjuntar documentacion?';
	}
	
	if(confirm(mensaje)){
		return enviarForm('form_incidencia','upload');
	}
	
	return false;
	
}

function upperCase(e) {
    $(this).val($(this).val().toUpperCase());
}

function entradaEntero(e) {
		
    var evento = window.event || e;
    var code;

    if (evento.charCode == undefined) {
        code = evento.keyCode;
    } else {
        code = evento.charCode;
    }

    if (code == 0) {
        //OK
    } else if (code < 48 || code > 57) {
        e.preventDefault();
    }
}

function getWhere(rawtext,field)
{
	
	arrayWords = rawtext.split(" ");
	//console.log(arrayWords); 
	for (var i = 0; i < arrayWords.length; i++) {
		
		if(arrayWords[i] != "and" && arrayWords[i] != "or" && arrayWords[i] != "not")
		{
			
			cleanString = arrayWords[i].trim();
			lenght = cleanString.length;
			parenthesisStartIndex = cleanString.indexOf("(");
			parenthesisEndIndex = cleanString.indexOf(")");
				
				if(parenthesisStartIndex != -1 )
				{
				
					//TODO tiene parentesis, insertar despues del mismo
				
					var insertA = " " + field  + " like $%";
					var insertB = "%$ ";
					if(field != "version")
						arrayWords[i] = 	cleanString.substr(0, parenthesisStartIndex +1) + insertA + cleanString.substr(parenthesisStartIndex +1) + "%$ ";    
					else
						arrayWords[i] = 	"( " + cleanString.substr(0, parenthesisStartIndex +1) + insertA + cleanString.substr(parenthesisStartIndex +1) + "%$ or version is null ) "  ;    

				}
				else if (parenthesisStartIndex == -1 && parenthesisEndIndex != -1)
				{
					if(field != "version")
						arrayWords[i] = insertA + 	cleanString.substr(0,  parenthesisEndIndex)   + cleanString.substr(parenthesisEndIndex+1) + "%$ )"; 
					else
						arrayWords[i] = "( " + insertA + 	cleanString.substr(0,  parenthesisEndIndex)   + cleanString.substr(parenthesisEndIndex+1) + "%$ or version is null) ";   
				}
				else{
				
					//TODO no tiene parentesis, es un caso mas raro
					if(field != "version")	
						arrayWords[i] = " " + field  + " like $%" + arrayWords[i] + "%$ ";
					else
						arrayWords[i] = " ( " + field  + " like $%" + arrayWords[i] + "%$ or version is null) ";

					
				}
			
		}
		
	}
	query = arrayWords.join(" ");
	console.log("query: " + query);
	return query;
}

function clearForm(loadingQuery)
{
	
	$('#txtversion').val('');
	$('#txtsoftware').val('');

	
	
	$('#chkcri3').removeAttr('checked');
	$('#chkcri4').removeAttr('checked');
	$('#chkcri5').removeAttr('checked');

	//$('#privclassConfid').removeAttr('checked');
	//$('#privclassEstrictConf').removeAttr('checked');
	$('#privclassIntern').removeAttr('checked');
	$('#privclassPub').removeAttr('checked');
	//$('#SALIDA_INTERNET').removeAttr('checked');
	$('.txtFieldsSoft').val('');
	$('div[id^="txtversions"]').html('');
	$('#dynamicTable tr').not(':first').remove();
	$('.divDynamicTable').css('background-color','white');
	$('.contenido').remove('#divTablaSoft');

	if(!loadingQuery){
		$('.tdErase').hide();
		CERT.values.editquery = false;

	}
	else{
		$('.tdErase').show();


	}


	
	

	
	


}


	function clearFormExtra()
	{
		$('#txtversion').val('');
	$('#txtsoftware').val('');
	//$('#chkcri1').removeAttr('checked');
	//$('#chkcri2').removeAttr('checked');
	$('#chkcri3').removeAttr('checked');
	$('#chkcri4').removeAttr('checked');
	$('#chkcri5').removeAttr('checked');

	//$('#privclassConfid').removeAttr('checked');
	//$('#privclassEstrictConf').removeAttr('checked');
	$('#privclassIntern').removeAttr('checked');
	$('#privclassPub').removeAttr('checked');
	//$('#SALIDA_INTERNET').removeAttr('checked');
	$('.txtSofVers').val('');
	$('div[id^="txtversions"]').html('');
	$('#dynamicTable tr').not(':first').remove();
	$('.divDynamicTable').css('background-color','white');
	$('.tdErase').hide();
	CERT.values.editquery = false;
	$('.lblqueryname').remove();
	$('#chkwintel').prop('checked',true);
	$('#chkunix').prop('checked',true);
	//$('#resultsCI').html('');
	addRow();
	loadCITable();
	initFiltersValues();

	

	}

var orderrowclicked ="";
var preloader = '<div  class="preloader" style="height:25px !important;font-size:16px !important;"><img height="35" width="35" class="" src="/img/preloader_bg.gif" alt="" /><br /><br /></div>';
	
	function getAllSoft(cell){
		
		console.log("getAllSoft");
	var preloader = '<div  class="preloader" style="height:25px !important;font-size:16px !important;"><img height="30" width="30" class="" src="/img/preloader_bg.gif" alt="" /><br /><br /> Getting data, please wait...\n\n(This process could be slow...)</div>'
	
	orderrowclicked = cell.id.split("_")[1];
	
	unix = $("#chkunix").attr("checked") ? 1 : 0;
	win = $("#chkwintel").attr("checked") ? 1 : 0;
	union = win == 1 && unix == 1 ? "both" : win == 1 && unix == 0  ? "win" : "unix";
	
	input = $('#inputsoft_' + orderrowclicked).val();

	 if(input == "")
	 {
	 	$('#inputsoft_' + orderrowclicked).notify("Please,Fill this field with a searchable value","info");
	 	$('#inputsoft_' + orderrowclicked).css('background-color','#ffcccc');
	 	return false;
	 }	
	 else{
	 	$('#inputsoft_' + orderrowclicked).css('background-color','white');
	 }


		var dialogName = '#divTablaSoft';
			//$('.content').remove('#divTablaSoft');		
			//$('.content').append('<div id="divTablaSoft" style="display: none; width: 800px;height: 500px;"></div>');		
			var preload = '<div  class="preloader" style="height:25px !important;font-size:16px !important;"><img height="35" width="35" class="" src="/img/preloader_bg.gif" alt="" /><br /><br />Loading data...</div>';
			$('#divTablaSoft').html(preloader).dialog({
									autoOpen: true,
									title:"Software query",
									modal: true, 
									minWidth:600,
									minHeight:400,
									close:function(){

										//$("#divTablaSoft").remove();
									},
									open:function(){

											loadDialogSoft();	
											var filteredchecked = [];
			           						var filteredrows = $("#tblSoftServerAll").dataTable()._('tr', {"filter": "applied"});
							
									},
									buttons:{
									"Load selected rows":function(){
											var filteredchecked = [];	
											var filteredrows = $("#tblSoftServerAll").dataTable()._('tr', {"filter": "applied"});		
									
										//console.log("filteredrows : ");
										//console.log(filteredrows);	
										for (var i = 0; i < filteredrows.length; i++) {
												text = filteredrows[i][1];
												checkid= $(filteredrows[i][0]).attr('id');
												console.log("CHECK ID: ");
												console.log(checkid);	
												checked = $('#' + checkid).is(':checked');
												if(checked)
												{
													filteredchecked.push(filteredrows[i]);
												}	
										}	
										console.log("filteredchecked: ");
										console.log(filteredchecked);
										
										//calculate rows of dynamicTable
										var $tableBody = $('#dynamicTable').find("tbody"),
                						countRows = $tableBody.find("tr").length;
                						//CERT.values.checkedSoft
										//for(var i = 0; i < filteredchecked.length; i++)
											for(var i = 0; i < CERT.values.checkedSoft.length; i++)
										{
											var id 		= CERT.values.checkedSoft[i].split("||")[0];
											var text 	= CERT.values.checkedSoft[i].split("||")[1];
											console.log("EN EL LOOP: ");
											console.log(id);
											console.log(text);
											
											if(i==0)
												{
													//text = filteredchecked[i][1];
													
													//recuperar ID de la celda 0
													checkID = id;
													//checkID = CERT.values.checkedSoft[i];
													checked = $("#" + checkID).is(":checked");
													$('#inputsoft_' + orderrowclicked).val(text);
													var orc = parseInt(orderrowclicked) ;
													selectSoftVersionsText(text,orc);
													
												}
											else if(i>0)
												{
													//text = filteredchecked[i][1];
													//checked = $("#checksft_" + i).is(":checked");
													addRow(text);
													$('#inputsoft_' + (orderrowclicked + i)).val(text);
													var orc = parseInt(orderrowclicked) +i;
													selectSoftVersionsText(text,orc);
												
												}
											
										}
										
										$('#divTablaSoft').dialog('close');
										
									},
									"Check all":function(){
											var filteredrows = $("#tblSoftServerAll").dataTable()._('tr', {"filter": "applied"});
											console.log(filteredrows);
											for (var i = 0; i < filteredrows.length; i++) {
												checkID = $(filteredrows[i][0]).attr('id');
												console.log("ID??");
												console.log(checkID);
												text = checkID;
												
												$('#' + text).prop('checked',true);
										}	

									},
									"Uncheck all":function(){
											var filteredrows = $("#tblSoftServerAll").dataTable()._('tr', {"filter": "applied"});
											console.log(filteredrows);
											for (var i = 0; i < filteredrows.length; i++) {
												console.log("ID??");
												console.log(checkID);
												checkID = $(filteredrows[i][0]).attr('id');
												text = checkID;
												$('#' + text).prop('checked',false);
											
											}	

									}	
										
									}		

								});


	
	}

	function loadDialogSoft()
	{

		$.ajax({
		timeout: 48000,
		url : urlBase + '/index/vistaallsoft',
		async:true,
		type: "POST",
		
		data:{union:union,input:input},
		success:function(d){
			//console.log(d);
			$("#divTablaSoft").html('').append(d);
			//$("#divTablaSoft").remove();
		},
		error:function(jqxhr, settings, ex) { alert('failed, ' + ex);},
	       	
		});
	}

function Createcheckbox(chkboxid,igual,value) {
           var checkbox = document.createElement('input');
           checkbox.type = "checkbox";
           if(igual)
           	checkbox.checked = true;
           checkbox.value = value;
       
           checkbox.id = chkboxid;
           
           return checkbox;
       }


    function saveCheckedSoft(d,text)
    {
    	var checked = $('#' + d).is(":checked");
    	el = d + "||" + text;
    	if(checked)
    	{

    		if(CERT.values.checkedSoft.indexOf(el) == -1)
    		{
    			CERT.values.checkedSoft.push(el);	
    		}
    	}
    	else{
	    		if(CERT.values.checkedSoft.indexOf(el) != -1)
	    		{
	    			var index = CERT.values.checkedSoft.indexOf(el);
	    			CERT.values.checkedSoft.splice(index, 1);
	    		}
    		
    	}


    	console.log("ARRAY soft CHEQUEADO: ");
    	console.log(CERT.values.checkedSoft);
    }   

	/*INSERT soft and get versions*/
	function selectSoftVersions(cell)
	{
	$('#processingImgtiny').show();
	$('#txtversions_' + orderrowclicked).html('');	
		soft = cell.innerHTML;
		$('#inputsoft_'+ orderrowclicked).val(soft);
		$('#divTablaSoft').dialog('close');
		//Get versions of this software
				$.ajax({
		timeout: 48000,
		//url : urlBase + '/ajax/getversions',
		url : urlBase + '/index/getversions',
		async:false,
		type: "POST",
		dataType : "json",
		data:{soft:soft},
		success:function(d){
		console.log(d);
		$('#processingImgtiny').hide();
			for(var i = 0; i< JSON.parse(d).length;i++){
			
					var label = document.createElement('label');
	               	var br = document.createElement('br');
	               
	               	label.htmlFor = 'chk_' + orderrowclicked + '_' + i;
	               	label.id= 'label_'  + orderrowclicked + '_' + i;
	               	label.appendChild(Createcheckbox('chk_' + orderrowclicked + '_' + i,false,JSON.parse(d)[i].version));
	               	label.appendChild(document.createTextNode(JSON.parse(d)[i].version));
	               	label.appendChild(br);
					$('#txtversions_' + orderrowclicked).append(label);
		
				}	

		},
		error:function(jqxhr, settings, ex) { alert('failed, ' + ex);},
	       	
		});

	}
	/*INSERT soft and get versions*/
	function selectSoftVersionsText(softtxt,orderrowclickedlcl)
	{
		
		$('#processingImgtiny').show();
		
		$('#txtversions_' + orderrowclickedlcl).html('');	
		console.log("nombre del soft:" +  softtxt);
		soft = softtxt;
	
		//Get versions of this software
		$.ajax({
			timeout: 48000,
			url : urlBase + '/index/getversions',
			async:true,
			type: "POST",
			dataType : "json",
			data:{soft:soft},
			success:function(d){
		
			$('#processingImgtiny').hide();
			
				for(var i = 0; i< JSON.parse(d).length;i++)
				{
				
						var label = document.createElement('label');
		               	var br = document.createElement('br');
		               	label.htmlFor = 'chk_' + orderrowclickedlcl + '_' + i;
		               	label.id= 'label_'  + orderrowclickedlcl + '_' + i;
		               	label.appendChild(Createcheckbox('chk_' + orderrowclickedlcl + '_' + i,false,JSON.parse(d)[i].version));
		               	label.appendChild(document.createTextNode(JSON.parse(d)[i].version));
		               	label.appendChild(br);
						$('#txtversions_' + orderrowclickedlcl).append(label);
			
				}	

		},
		error:function(jqxhr, settings, ex) { alert('failed, ' + ex);},
	       	
		});

	}

	

	/*
	* Create checkbox of versions dinamically when a query is recovered
	*/
	function dinamicallyInsertSoftVersions(soft,orderrowclicked,versions)
	{

	
	$('#txtversions_' + orderrowclicked).html('');	
	
	 
		soft = soft;
		$('#inputsoft_'+ orderrowclicked).val(soft);
		$('#divTablaSoft').dialog('close');
	
		//Get versions of this software
				$.ajax({
		timeout: 48000,
		url : urlBase + '/ajax/getversions',
		async:false,
		type: "POST",
		dataType : "json",
		data:{soft:soft},
		success:function(d){

		if(!!JSON.parse(d))
		for(var i =0; i < JSON.parse(d).length; i++ )
		{
		
			    var label = document.createElement('label');
              	label.htmlFor = 'chk_' + orderrowclicked + '_' + i;
               	label.id= 'label_'  + orderrowclicked + '_' + i;
               
				var input ="";
		
				var igual = false;	
				if(!!versions)	
					for(var l=0;l< versions.length;l++)
					{
						//console.log(JSON.parse(d)[i].version);
						if(versions[l] == JSON.parse(d)[i].version)
						{
							//console.log("igual: " + l + " " + versions[l]);
							igual = true;
							
						}
						
					}
			
			
				label.appendChild(Createcheckbox('chk_' + orderrowclicked + '_' + i,igual,JSON.parse(d)[i].version));
               	label.appendChild(document.createTextNode(JSON.parse(d)[i].version));
        	
			$('#txtversions_' + orderrowclicked).append(label);
			$('#txtversions_' + orderrowclicked).append("<br>");
		
			}	
			
		},
		error:function(jqxhr, settings, ex) { alert('failed, ' + ex);},
	       	
		});


	}



function addRow()
{
console.log('aca');
var idnewrow="";
        var $tableBody = $('#dynamicTable').find("tbody"),
                 $trLast = $tableBody.find("tr:last"),
                $trNew = $trLast.clone();
                	
              	$trNew.attr('class','nofirstrow');
                // Find by attribute 'id'
                $trNew.find('[id]').each(function () {
                    var num = this.id.replace(/\D/g, '');
                    if (!num) {
                        num = 0;
                    }
                    sufix = this.id.split("_")[1];
                    

                    // Remove numbers by first regexp
                    this.id = this.id.replace(/\d/g, '')  + (1 + parseInt(num, 10));
                    idnewrow = this.id;
                       // console.log(this.type);
              
               		
                });
               
                $trNew.find('div').html('');
                $trNew.find('input').val('');
                $trNew.show();
                $trLast.after($trNew); 

}

	var queryCurrentEditingQueryName = "";
	var id = "";
	/// <summary>regenerateQueryView</summary>
	/// <param name="fila">fila</param>
	/// <returns>function</returns>
	function regenerateQueryView(fila)
	{
		//clearFormExtra();

		$('.contenido').remove('#divTablaSoftQueries');
		$('#divTablaSoftQueries').dialog('close');
		//mark flag
		$('#processingImgtiny').show();
		
		queryCurrentEditingQueryName = fila.cells[1].innerHTML;
		
		
		CERT.values.editquery = true;
		id = fila.id;
		$.ajax({
		timeout: 48000,
		url : urlBase + '/ajax/getquerybyid',
		async:true,
		dataType : "json",
		type: "POST",
		data:{id:id},
		success:function(d){
			
			$('.tdErase').show();
			$('.lblqueryname').remove();
			$('#txtQueryName').val(queryCurrentEditingQueryName);
			$('#txtQueryName').css("background-color","whitesmoke");
			redrawValues(JSON.parse(d));
			$('#processingImgtiny').hide();

		},
		error:function(jqxhr, settings, ex) { alert('failed, ' + ex);	$('#processingImgtiny').hide(); },
			      	
		});
		
		
	}

	/// <summary>toggleEditLabel</summary>
	/// <param name="label">label</param>
	/// <returns>function</returns>
	function toggleEditLabel(label)
	{
		$('#divDynamicTableLabel').attr('contenteditable',true);
		$('#divDynamicTableLabel').css('cursor','text');
		$('#divDynamicTableLabel').focus();
		$('#divDynamicTableLabel').css('background-color','whitesmoke');
	}


	

	/// <summary>Redraw values of a saved query</summary>
	/// <param name="parsedData">parsedData</param>
	/// <returns>function</returns>
	function redrawValues(parsedData)
	{
			$('select#slct_Cliente').val("clear").trigger('change');
			$('select#slct_SO').val("clear").trigger('change');
			$('select#slct_GrpoProp').val("clear").trigger('change');
			$('select#slct_Entorno').val("clear").trigger('change');
		// 1-Erase checks
	
		var loadingQuery = true;
		clearForm(loadingQuery);
		

		// remove all rows except first table soft
  
  		$('#dynamicTable tr').not(':first').remove();

		// 2-Mark checks according query
		
		var id 					=	parsedData[0].id;
		var softVersions 		= 	JSON.parse(parsedData[0].SOFTVERSIONS);
		var checks 				=	parsedData[0].SERIALIZED_VALUES;
		var diversevalues 		=   parsedData[0].DIVERSEVALUES;
		var queryName 			= 	parsedData[0].QUERY_NAME + " - Creada por: " + parsedData[0].USER;
		var filters 			=	JSON.parse(parsedData[0].FILTERS);
		CERT.values.queryname 	=   queryName + " - Creada por: " + parsedData[0].USER;
		CERT.values.queryid 	=   id;
		var privacy 			= 	parsedData[0].PUBLICA;	
		if(privacy == 1) $('#chkprivacy').prop("checked",true);
		else $('#chkprivacy').prop("checked",false);
		
		// 3-Fill first row of table soft-versiones
		
		for (var i = 0; i < softVersions.length; i++) {
			
			addRow();	
			
			dinamicallyInsertSoftVersions(softVersions[i].software,i+1,softVersions[i].versions);
			dinamicallyCheckValues(checks,diversevalues,softVersions);
		
		}
		
			for (var key in filters) {
               
                if(key == "slct_Cliente")   {
                	$('#' + key ).val("cli|" + filters[key]).trigger('change');
                	console.log('#' + key  + ' valor: ' + "cli|" + filters[key]);
                }
                    
                if(key == "slct_SO")
                    $('#' + key ).val("so|" + filters[key]).trigger('change');
                if(key == "slct_GrpoProp")
                    $('#' + key ).val("gp|" + filters[key]).trigger('change');
                if(key == "slct_Entorno")
                    $('#' + key ).val("ent|" + filters[key]).trigger('change');
            }
	contwarning = 1;
	}

/*Put title in field */
	function putTitle(inp)
	{
		$('#' + inp.id).prop('title',$('#' + inp.id).val());
	}



	  /**
	     * Redraws view with session data after linked query
	     * @param sessiondata
	     */
	    function redrawParsedDataViewAfterLinkedQuery(sessiondata)
	    {
	    	CERT.values.editquery = true;
	    	$('#divDynamicTableLabel').remove();

			
	    	console.log("redrawParsedDataViewAfterLinkedQuery !!! ->");
	    	var data = JSON.parse(sessiondata);
	    	console.log("DATA DE QUERY MAIL")
	    	console.log(data.user);
	    	var queryname = data.queryname;
	    	CERT.values.queryid = data.queryid;
	    	
	    	var softversions = data.softversionsrecover;
	    	var softversionschecked = JSON.parse(data.newValues);
	    	
	    	//ADDING QUERY NAME LABEL
			$('<span id="mongo"><input type="text" title="Query Name - Click to Edit" onclick="toggleEditLabel(this);" '
				+ 'style="cursor:pointer;padding:5px;margin-left:1.2%;font-size:1.1em;color:#006080;z-index:9999999;"'
				+ 'id="divDynamicTableLabel" value=">' + queryname + '">'
				+ '</span><span readonly disabled style="font-size:0.9em;">' + " - Created by: " + data.user + '</span>').prependTo('#buttondivparsed');

	    	/*AND / OR */
	    	$('#andOr').val(data.andor);
	    	var si = data.si;
	    	
	    	/*SALIDA INTERNET*/
	    	if(si == "siboth"){
	    		$('#SALIDA_INTERNET').prop('checked',true);
	    		$('#NOSALIDA_INTERNET').prop('checked',true)
	    		
	    	}
	    	if(si == "sint")
	    		{
	    			$('#SALIDA_INTERNET').prop('checked',true);
	    			$('#NOSALIDA_INTERNET').prop('checked',false);
	    		}
	    	if(si == "nosint")
	    		{
	    			$('#SALIDA_INTERNET').prop('checked',false);
	    			$('#NOSALIDA_INTERNET').prop('checked',true);
	    		}
	    		
	    	/*UNION*/
	    	if(data.union == "win"){
	    		$('#chkwintel').prop('checked',true);
	    		$('#chkunix').prop('checked',false);
	    	}
	    	else if(data.union == "unix"){
	    		$('#chkwintel').prop('checked',false);
	    		$('#chkunix').prop('checked',true);
	    	}
	    	else{
	    		$('#chkwintel').prop('checked',true);
	    		$('#chkunix').prop('checked',true);
	    	}
	    			
	    	
	    	
	    	for(var a =0; a < data.values.length; a++ )
	    		{
	    		
	    			if(data.values[a].name == "ENTORNOCRITICALITY")
	    				{
	    					switch(data.values[a].value)
	    					{
	    						case 'critical':
	    							$('#chkcri1').prop('checked',true);
	    							break;
	    						case 'high':
	    							$('#chkcri2').prop('checked',true);
	    							break;
	    						case 'medium':
	    							$('#chkcri3').prop('checked',true);
	    							break;
	    						case 'low':
	    							$('#chkcri4').prop('checked',true);
	    							break;
	    						case 'none':
	    							$('#chkcri5').prop('checked',true);
	    							break;
	    						
	    					}
	    				
	    				}
	    			
	    			if(data.values[a].name == "ENTORNOPROTECTIONCLASS")
	    				{
	    					switch(data.values[a].value)
	    					{
	    						case 'Confidencial':
	    							$('#privclassConfid').prop('checked',true);
	    							break;
	    						case 'Estrictamente Confidencial':
	    							$('#privclassEstrictConf').prop('checked',true);
	    							break;
	    						case 'Interno':
	    							$('#privclassIntern').prop('checked',true);
	    							break;
	    						case 'Público':
	    							$('#privclassPub').prop('checked',true);
	    							break;
	    							
	    						
	    					}
	    				
	    				}
	    		}
	    	
	    	/***** softversions, iterate through software and versions ******/
	    	softVersions = JSON.parse(softversions);
	    	diversevalues = data.diverse;
	    
	    
		for (var i = 0; i < softVersions.length; i++) {
		
			
			//If first row, I have the ID, assign values manually
			if(i==0)
			{
				$('#inputsoft_1').val(softVersions[i].software);
				//Create checks


				dinamicallyInsertSoftVersions(softVersions[i].software,1,softVersions[i].versions);
				//dinamicallyCheckValues(checks,diversevalues,softVersions);
			}
			else{
				addRow();	
				dinamicallyInsertSoftVersions(softVersions[i].software,i+1,softVersions[i].versions);
				//dinamicallyCheckValues(checks,diversevalues,softVersions);
			}

		}

	    
	    }

	
	/*
	* This function is in charge of check all chekboxes according db stored values
	* @param checks
	* @param diversevalues
	* @param softVersions
	*/
	function dinamicallyCheckValues(checks,diversevalues,softVersions)
	{
		    //1- Start by fixed values
			var parsedChecks = JSON.parse(checks);
			for (var i = 0; i < parsedChecks.length; i++) {
								
				if(parsedChecks[i].name == "ENTORNOCRITICALITY" && parsedChecks[i].value == "critical")
					$('#chkcri1').prop('checked',true);
				if(parsedChecks[i].name == "ENTORNOCRITICALITY" && parsedChecks[i].value == "high")
					$('#chkcri2').prop('checked',true);
				if(parsedChecks[i].name == "ENTORNOCRITICALITY" && parsedChecks[i].value == "medium")
					$('#chkcri3').prop('checked',true);
				if(parsedChecks[i].name == "ENTORNOCRITICALITY" && parsedChecks[i].value == "low")
					$('#chkcri4').prop('checked',true);
				if(parsedChecks[i].name == "ENTORNOCRITICALITY" && parsedChecks[i].value == "none")
					$('#chkcri5').prop('checked',true);

				if(parsedChecks[i].name == "ENTORNOPROTECTIONCLASS" && parsedChecks[i].value == "Confidencial")
					$('#privclassConfid').prop('checked',true);
				if(parsedChecks[i].name == "ENTORNOPROTECTIONCLASS" && parsedChecks[i].value == "Estrictamente Confidencial")
					$('#privclassEstrictConf').prop('checked',true);
				if(parsedChecks[i].name == "ENTORNOPROTECTIONCLASS" && parsedChecks[i].value == "Interno")
					$('#privclassIntern').prop('checked',true);	
				if(parsedChecks[i].name == "ENTORNOPROTECTIONCLASS" && parsedChecks[i].value == "Público")
					$('#privclassPub').prop('checked',true);	
    		    	
			}

			//2- Check versions 

			var selectAndOr = diversevalues.split("|")[0];
			var winUnix = diversevalues.split("|")[1];
			var salidaInternet = diversevalues.split("|")[2];
			
			if(selectAndOr == "and")
				$('#andOr').val('and');
			else $('#andOr').val('or');

			if(winUnix == "win"){
				$('#chkwintel').prop('checked',true);
				$('#chkunix').prop('checked',false);
			}
			else if(winUnix =="unix"){
				$('#chkunix').prop('checked',true);
				$('#chkwintel').prop('checked',false);
			}
			else{
				$('#chkwintel').prop('checked',true);
				$('#chkunix').prop('checked',true);

			}
			if(salidaInternet == "true")
				$('#SALIDA_INTERNET').prop('checked',true);
			else $('#SALIDA_INTERNET').prop('checked',false);

			if(salidaInternet == "sint")
				$('#SALIDA_INTERNET').prop('checked',true);
			else if(salidaInternet == "nosint")
				$('#NOSALIDA_INTERNET').prop('checked',true);
			else
			{
				$('#SALIDA_INTERNET').prop('checked',true);
				$('#NOSALIDA_INTERNET').prop('checked',true);
			}

	}



	/// <summary>Shows saved queries</summary>
	/// <returns>function</returns>
	function showQueries()
	{

		if(!!contwarning) contwarning = 0;
		
		$('#divTablaSoftQueries').html(preloader).dialog({
									autoOpen: true,
									title:"Saved Queries",
									modal: true, 
									minWidth:600,
									minHeight:400,
									open:function(){
										
										loadQueries();
									},
									close:function(){
										$('.contenido').remove('#divTablaSoftQueries');		

									},		

								})

			$('.contenido').remove('#divTablaSoftQueries');

	}

	 /**
     * Load Queries
     * 
     */
	function loadQueries()
	{

		$.ajax({
		timeout: 48000,
		url: urlBase + '/index/vistaqueries',
		
		async:false,
		type: "POST",
		success:function(d){
			console.log(d);
			$("#divTablaSoftQueries").html('').append(d);
		},
		error:function(jqxhr, settings, ex) { alert('failed, ' + ex);
			console.log(jqxhr);
		},
	       	
		});
	}

	/**
     * Load filtered queries
     * 
     */
	function loadFilteredQueries(param)
	{
	
		
		$.ajax({
			timeout: 48000,
			url: urlBase + '/index/vistaqueries',
			data:{filter:param},
			async:true,
			type: "POST",
			success:function(d){
				//console.log("SUCCESS ****");
				//console.log(d);
				$("#divTablaSoftQueries").html('').append(d);
			},
			error:function(jqxhr, settings, ex) { alert('failed, ' + ex);
				//console.log(jqxhr);
			},
	       	
		});	

	}


/// <summary>Reset all filters at result table (servers)</summary>
/// <param name="table">table</param>
/// <returns>function</returns>
function fnResetAllFilters(table) {
  var oSettings = table.fnSettings();
  
  if(!!oSettings)
  for(iCol = 0; iCol < oSettings.aoPreSearchCols.length; iCol++) {
    oSettings.aoPreSearchCols[ iCol ].sSearch = '';
  }
  table.fnDraw();
}

function seeInstructions()
{
	console.log("seeInstructions");
	$('#divInstructions').toggle();
		$.ajax({
			timeout: 48000,
			url : urlBase + '/index/especifications',
			async:true,
			
			type: "POST",
			success:function(d){
					console.log(d);
					$('#divInstructions').html('');
				$(d).appendTo('#divInstructions');
			},
			error:function(jqxhr, settings, ex) { alert('failed, ' + ex); },
			      	
		});

}


/// <summary>Erase current query</summary>
/// <returns>function</returns>
function eraseCurrentQuery()
{
	//deletequery
var r = confirm("You are just about to eliminate the current query");
if(r){
$.ajax({
			timeout: 48000,
			url : urlBase + '/ajax/deletequery',
			async:true,
			data:{id:id},
			type: "POST",
			success:function(d){
					$('#eraseQueryIsmg').notify('Query successfully eliminated',{position:'top center',className:'success'});
					clearForm();
					$('#divDynamicTableLabel').remove();
				
			},
			error:function(jqxhr, settings, ex) { alert('failed, ' + ex); 
			$('#eraseQueryIsmg').notify('Action cancelled by the user',{position:'top center',className:'info'});},
			      	
		});	
}
else{

}
	
	
}

function eraseQueryFromDialog(id)
{

	
	var r = confirm("You are just about to eliminate the current query");
	if(r){
	$.ajax({
				timeout: 48000,
				url : urlBase + '/ajax/deletequery',
				async:true,
				data:{id:id},
				type: "POST",
				success:function(d){
					if(d=="0")
						alert("Couldn't eliminate query created by another user");
					else $('#tblQueriesServer_wrapper').notify('Query successfully eliminated',{position:'top center',className:'success'});
					
					$('#queriesdiv').dialog('close');
					
				},
				error:function(jqxhr, settings, ex) { alert('failed, ' + ex); 
					$('#tblQueriesServer').notify('Action cancelled by the user',{position:'top center',className:'info'});
					$('#queriesdiv').dialog('close');
				},
				      	
			});	
	}

}




