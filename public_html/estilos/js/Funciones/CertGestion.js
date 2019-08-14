 /* @author Damián Esteban Blanc Perez - damian.blanc@t-systems.es
 /* @version 1.0 - 22/05/2018
 */ 
var GESTION = {};
GESTION.values = {
		checkedclients:			[],
		current_messageid:		"",
		queriesContent:         [] 
		
		
};
var urlBase=  '/cert';
function openTecnicoDialog()
{
	$('#divTecnico').dialog({
		autoOpen: true,
		title:"Técnico",
		hide: {effect: "fade", duration: 500},
		modal: true, 
		minWidth:550,
		minHeight:300,
		open:function(){
		    /*
		     * Initialse DataTables, with no sorting on the 'details' column
		     */
		    var ooTable = $('#tecnicosTable').dataTable( {
				"bStateSave": false,
				"aaSorting": [[ 1, "desc" ]],
				"sPaginationType": "full_numbers",
				"lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
				"iDisplayLength":0,
		        "bServerSide": false,
		        "bDestroy": true,
		        "dom": 'T<"clear">lfrtip',
		        "ajax": {
		        "dataSrc": function(json){
		        	return json;
		        },
		        "type": "POST",
		        "url": urlBase + "/index/vistatecnicos",
		        "contentType": "application/json; charset=utf-8",
		        "dataType": "json",
		        "processData": true
		          
		        },
	           
		        "aoColumns": [ 
								{ "bSortable": false,"sWidth": "7%","bVisible":true,"title":"ID"} , //ID ->0
					        	{"title":"username"}, //'USERNAME' ->1s
					        	{ "sWidth": "10%","title":"display_name" },  //'display_name'  ->2
					        	{"title":"OU_ID" },  //'OU_ID' ->3
					        	{"title":"email"} //'email' ->4
								
			          	     ],
			          	     
			          	   "columnDefs": [
			          		
			          	   	{"targets":[0],"data":"ID","bVisible":true},
			          	   	{"targets":[1],"data":"username"},
			          	   	{"targets":[2],"data":"display_name"},
			          	   	{"targets":[3],"data":"OU_ID"},
			          	   	{"targets":[4],"data":"email"},
			           	   ],
				"fnInitComplete": function () {
		
					$('.dataTables_filter input').attr("placeholder", "Search");
					//$("#tecnicosTable tbody tr").css('cursor', 'pointer');
					
				}
			
			});
			
			
			
		},
	
		buttons:{
			"Relacionar":function(){
				
				alert("Relacionado");
			}
			
			
		}
		
	});
}


/*Open dialog tecnico*/
	$('#tecnicosTable tr').live('click',function(){
		console.log($(this).children('td:eq(1)').text());
		console.log($(this).children('td:eq(2)').text());
		console.log($(this).children('td:eq(3)').text());
		$('#txtTecnico').val($(this).children('td:eq(1)').text());
		$('#txtTecnico').attr("name",$(this).children('td:eq(2)').text());
		$('#txtTecnico').attr("idtec",$(this).children('td:eq(0)').text());
		$('#divTecnico').dialog('close');
	});


/**
 * 
 * @param d
 */
function showClientsAdvice(d)
{
	
	$('#divClientesAdvice').dialog({
		open:function(event){
			event.preventDefault();
			var clientsArray = d.split("||"); 
			console.log(d);
			console.log(clientsArray);
			$('#clientsAdviceTable').html('');
			if(clientsArray.length > 0)
			for(var a = 0; a < clientsArray.length; a++)
			{
				$('#clientsAdviceTable').append('<tr><td>' + clientsArray[a] + '</td></tr>');
				
			}
			return false;
			}
		


		});
}
var ooTableClientes ="";
	/**
	 * 
	 */
	function asociarClientes()
	{
		
	
		$('#divClientesAsociate').dialog({
			
			autoOpen: true,
			title:"Asociar Cliente",
			hide: {effect: "fade", duration:500},
			modal: true, 
			minWidth:550,
			minHeight:300,
			open:function(){
			    ooTableClientes = $('#clientesTable').dataTable( {
					"bStateSave": false,
					"aaSorting": [[ 1, "desc" ]],
					"sPaginationType": "full_numbers",
					"lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
					"iDisplayLength":0,
			        "bServerSide": false,
			        "bDestroy": true,
			        "dom": 'T<"clear">lfrtip',
			        "ajax": {
			        "dataSrc": function(json){
			        	return json;
			        },
			        "type": "POST",
			        "url": urlBase + "/index/vistaclientes",
			        "contentType": "application/json; charset=utf-8",
			        "dataType": "json",
			        "processData": true
			          
			        },
		           
			        "aoColumns": [ 
									{"sWidth": "10%","title":"Select"},
									{ "bSortable": false,"sWidth": "60%","title":"Cliente"} , //ID ->0
						        	{"sWidth": "30%","title":"Cod Cli."}, //'Codcli' ->1s
						        	
									
				          	     ],
				          	     
				          	   "columnDefs": [
				          	    {"targets":[0],"data":"checkbox"},
				          	   	{"targets":[1],"data":"cliente"},
				          	   	{"targets":[2],"data":"codcli"},
				          	   	
				           	   ],
					"fnInitComplete": function () {
			
						$('.dataTables_filter input').attr("placeholder", "Search");
						//$("#tecnicosTable tbody tr").css('cursor', 'pointer');
						
					}
				
				});
				
			},
			buttons:{
				"Relate selected clients":function(){
					messageid = GESTION.values.current_messageid;
					//ajax call to save relationship
					console.log("VALUES asociar clientes:");
					console.log(GESTION.values.checkedclients);
					console.log(messageid);
					AssociateCertClient(GESTION.values.checkedclients,messageid);
					GESTION.values.checkedclients = [];
					GESTION.values.checkedclients.length = 0;
					//TODO refresh table associ
					GetCertClientesView(messageid);
					$('#divClientesAsociate').dialog('close');
					
				}
					
			}
			
		});
	}
	
	/**
	 * Select client check
	 * @param d
	 */
	function selectClient(d)
	{
		//Get codcliente
		var codcli = d.split("|||")[0];
		var cli = d.split("|||")[1];
		var checked = $('#check_' + codcli).is(":checked");
		console.log("id: " + "#check_" + codcli);
		console.log(checked);
		el = {"codcli":codcli,"cli":cli};
		
		if(checked)
			{
				if(GESTION.values.checkedclients.indexOf(el) == -1)
					GESTION.values.checkedclients.push(el);
			}
		else{
			//if(GESTION.values.checkedclients.indexOf(el) != -1)
				//{
					var index = GESTION.values.checkedclients.indexOf(el);
					GESTION.values.checkedclients.splice(index,1);
				//}
		}
		console.log(GESTION.values.checkedclients);
	}
	
function autoAsignarme()
{
	$('#txtTecnico').val($("#hiUserName").val());
}


function CreateOrder()
{
	$("#divCommentTaskOrder").dialog("close");
}


	var idCert="";
	var MessageID;
	/**
	 * Edits an advice, previous relate CI
	 */
    function editAdvice(dato)
	{
    	var obj = [];
    	var todo="";
    	var software ="";
    	var references = "";
    	var remediation = "";
    	var threats = "";
    	var title = "";
    	var subject = "";
    	var mailDate = "";
    	var messageId = $(dato).closest('tr').children('td:eq(2)').text();
    	GESTION.values.current_messageid = $(dato).closest('tr').children('td:eq(2)').text();
    	var MessageID = $(dato).closest('tr').children('td:eq(2)').text();
    	GetCommentsByDcert(MessageID);
		$('#divEditAdvice').dialog({
			
			autoOpen: true,
			modal: true, 
			width:850,
		
			open:function(){
				
				setTimeout(function(){
					$('#slctEstado').selectOptionWithText(objMail.estado);
					$('#slctGroups').selectOptionWithText(objMail.nombregrupo);
					$('#dateNotif').val(objMail.fecha_notificacion);
					if(!!objMail.tecnico)
						$('#txtTecnico').val(objMail.tecnico);
					//else
					//	$('#txtTecnico').val($("#hiDisplayName").val());
					
					$('#dateFin').val(objMail.fecha_finalizacion);
				}, 2500);
			
				contado = 1;
				GetCertClientesView(MessageID);
				$('#tblcertsg tbody').on('click', 'tr', function () {
					MessageID = $(tablecerts.fnGetData(this)[2]).text();
					//GESTION.values.current_messageid 				= MessageID; 
					idCert 						= tablecerts.fnGetData(this)[1];
					objMail.id 					= tablecerts.fnGetData(this)[1];
					objMail.messageid 			= $(tablecerts.fnGetData(this)[2]).text();
					$( "#divEditAdvice" ).dialog({ title: "Edit advisory " + MessageID });
					objMail.estado 				= tablecerts.fnGetData(this)[3];
					objMail.grupo 				= tablecerts.fnGetData(this)[5];
					objMail.afectacion 			= tablecerts.fnGetData(this)[6];
					objMail.comentarios 		= tablecerts.fnGetData(this)[8];
					objMail.tecnico_displayname = tablecerts.fnGetData(this)[12];
					objMail.tecnico 			= tablecerts.fnGetData(this)[13];
					objMail.fecha_notificacion 	= tablecerts.fnGetData(this)[14];
					objMail.fecha_finalizacion 	= tablecerts.fnGetData(this)[15];
					objMail.nombregrupo 		= tablecerts.fnGetData(this)[16];
					console.log("ejecuto: " + cont);
					contado++;
					GetAllQueries(MessageID);
					
				
				
					});
				obj.push(objMail);
				//asignacion valores
				
				var clientes = "";
			
			
				for(var a = 0; a < MAILS.values.clientes_cert.length; a++)
					{
						for(var i =0 ; i < MAILS.values.clientes.length; i++)
							{
								if(MAILS.values.clientes[i].ID == MAILS.values.clientes_cert[a].cliente_id)
									clientes += " ," + MAILS.values.clientes[i].Nombre; 	
							}
						
					}
				
				$('textarea#txtClientes').html(clientes);
				$('#lblId').text(obj[0].messageid);
				
			},
		      buttons: {
		    	  "Create Task Order":function(){
		    		  $("#divCommentTaskOrder").dialog({
							autoOpen: true,
	    		    		title:"Comments",
	    		    		hide: {effect: "fade", duration: 500},
	    		    		modal: true, 
	    		    		width:450,
	    		    		minHeight:400 
		    		  });
		    		  
		    	  },
		    	  	"Create query":function(){
		    	  		window.open('/cert', '_blank');
		    	  	},
			        "Cancelate": function() {
			        	clearFieldsUpdateCert();
			        	
			        	$( this ).dialog( "close" );
			        },
			        "Save": function() {
			        	data = {};
			        	
			        	
			        	/*GET CLIENTS DATA*/
			        	datac = [];
			            $("#tblcertclients tr").not(':first').each(function(i, v){
			            	 datac[i] = [];
	                          cont = 0;
	                          $(this).children('td').each(function(ii, vv){                  
	                        	  if(cont < 2)
	                                    datac[i][ii] = $(this).text();
	                                    if(cont == 2)
	  	                        	  {
	  	                        	  //console.log($(this).find('checkbox'));	
	  	                        	  datac[i][ii] = $(this).find('input:checkbox').is(':checked') ? 1 : 0;
	  	                        	  }
	  	                          if(cont == 3)
	  	                        	  {
	  	                        	  	datac[i][ii] = $(this).find('option:selected').val();
	  	                        	  }
	  	                        cont ++;
	                                
	                          }); 
	                          
	                          
	                      })
			        	
			        	data.Clientes 				= datac;
			        	data.Grupo_ID 				= $('#slctGroups').val();
			        	data.Estado_ID 				= $('#slctEstado').val();
			        	data.Comentarios 			= $('#txtComentarios').val();
			        	data.fecha_finalizacion 	= $('#dateFin').val();
			        	data.fechaNotif 			= $('#dateNotif').val();
			        	data.afectacion 			= $('input[name=gender]:checked').val();
			        	data.id 					= idCert;
			        	data.messageid 				= GESTION.values.current_messageid;
			        	data.tecnico_username 		= !!$('#txtTecnico').val() ? $('#txtTecnico').val() : "";
			        	data.tecnico_display_name 	= !!$('#txtTecnico').attr('name') ? $('#txtTecnico').attr('name') : "";
			        	data.tecnico_userid			= !!$('#txtTecnico').attr('idtec') ? $('#txtTecnico').attr('idtec') :"";
			        	data.queries 				= $('#slctQueries').val();
			        	console.log("MESSAGE ID: ");
			        	console.log(GESTION.values.current_messageid);
			        	$.ajax({
			    			timeout: 48000,
			    			url : urlBase + '/index/updateadvice',
			    			//url : urlBase + '/ajax/updateadvice',
			    			async:false,
			    			type: "POST",
			    			dataType : "json",
			    			data:{data:data},
			    			complete:function(){
			    				gotoGestion();
			    			},
			    			success:function(data){
			    				clearFieldsUpdateCert();
			    					$( this ).dialog( "close" );
			    			 	},
			    		    	error:function(data) { $.notify('failed' + data);
			    		    	$( this ).dialog( "close" );
			    			 },
			    			
			    			});	
			        	
			        	$( this ).dialog( "close" );
			        }
			      }
					
		});
		 
	}
    
    /**
     * Updates wheteher a cert is in gestion or not
     * @param d (checkbox value)
     */
    function updateGestion(d)
    {
    	console.log($(d).closest('tr').find('td:eq(1)').text());
    	console.log(d.value);
    	messageid = $(d).closest('tr').find('td:eq(1)').text();
    	gestion = d.value ;
    	//console.log(gestion);
    	UpdateGestionCert(messageid,gestion);
    	refreshAdvices();
    	
    }
    
    /**
     * 
     */
    function comments()
    {
    	$('#divComments').dialog({
    		autoOpen: true,
    		title:"Comments",
    		hide: {effect: "fade", duration: 500},
    		modal: true, 
    		width:650,
    		minHeight:400,
    		open:function(){
    			GetCommentsByDcert(GESTION.values.current_messageid);
    			//TODO add comments
    		}
    		
    	});
    	
    }
    
    /**
     * Add a manual CI
     */
    function AddManualCI()
    {
    	$('#formNewCis').dialog({
    		autoOpen: true,
    		title:"Add manual CI",
    		hide: {effect: "fade", duration: 500},
    		modal: true, 
    		minWidth:750,
    		minHeight:470,
    		open:function(){
    			//GetCommentsByDcert(GESTION.values.current_messageid);
    			$("#txtMessageId").val(GESTION.values.current_messageid);
    			//TODO add comments
    		},
    		buttons:{
    			"Grabar CI":function(){
    				var arrayData =  $('#formNewCis *').serializeArray();
    				console.log(arrayData);
    				var conf = confirm("Are you sure to add this new CI?");
    				if(conf)
    					{
    						if(validaCiManual()){
    							$( this ).dialog( "close" );
    							AddNewManualCI(arrayData);
    							
    						}
    						else{
    							$('#formNewCis').notify('Error -  empty mandatory fields',{position:'bottom center',className:'warning'});
    						}
    						
    					
    					}
    			}
    			
    			
    		}
    		
    	});
    }
    
    /**
     * Validates new Ci
     * @returns
     */
    function validaCiManual(){

    	resultado = true;

    	$('.error').remove();
    	
    	// Message ID es obligatorio
    	if ($('#txtMessageId').val() == ''){
    		setError('Message ID is mandatory', '#txtMessageId');
    		$("#txtMessageId").css("background-color","#ffe6e6");
    		resultado = false;
    	}

    	// Cliente es obligatorio
    	if ($('#txtCLIENTE').val() == ''){
    		setError('Cliente is mandatory', '#txtCLIENTE');
    		$("#txtCLIENTE").css("background-color","#ffe6e6");
    		resultado = false;
    	}

    	// Hostname es obligatorio
    	if ($('#txtHOSTNAME').val() == ''){
    		setError('Servicio is mandatory', '#txtHOSTNAME');
    		$("#txtHOSTNAME").css("background-color","#ffe6e6");
    		resultado = false;
    	}	

    	// Entorno es obligatorio
    	if ($('#txtENTORNO').val() == ''){
    		setError('Entorno is mandatory', '#txtENTORNO');
    		$("#txtENTORNO").css("background-color","#ffe6e6");
    		resultado = false;
    	}	
    	return resultado;

    }
  
    
    /**
     * Add error message under input
     * @param texto
     * @param campo
     */
    function setError(texto, campo){
    	$("<div class='error' style='bold;color:red;'>"+texto+"</div>").insertAfter($(campo));
    }
    
    
    function LoadQueries(dialog)
    {
    	console.log(dialog);
    	var dialogo = false;
    	if(!!dialog)
    		dialogo=dialog;
    		
      	var queries = $("#slctQueries").val();
    	//console.log(queries);
    	$('#divDiffPhotos').dialog({
    		autoOpen: true,
    		title:"Showing differences",
    		hide: {effect: "fade", duration: 500},
    		modal: true, 
    		minWidth:950,
    		minHeight:300,
    		open:function(){
    			TEMPInsertDiffGestion();
    			
    			
    		},
    		buttons:{
    			"Accept diff":function(){
    				
    				conf = confirm("Are you sure to save all differences?");
    				if(conf)
    					{
    						conf2 = confirm("Back to cert? (If cancel it will shows scope)");
    						if(conf2)
    							{
    								$('#divDiffPhotos').dialog('close');
    							}
    						else{
    							$('#divDiffPhotos').dialog('close');
    		    				
    		    				gotoGestionCis(dialogo);
    						}
    					}
    			
    			},
    			"Check all":function(){
    				
    				
    			}
    			
    			
    		}
    		
    	});
    
    			
    	
    }
    
    

    
    function CheckStatesCis(id,classcheck)
    {
    	state = $("#" + id).val();
    	checks = $("." + classcheck);
    	console.log("checks: ");
    	console.log(checks);
    	console.log("selected state");
    	console.log(state);
    	for(var i = 0; i < checks.length; i++){
    		if(state == "all")
    			$(checks[i]).prop("checked",true);
    		if(state == "none")
    			$(checks[i]).prop("checked",false);
    		if(state == "invert")
    			{
    				if($(checks[i]).is(":checked"))
    					$(checks[i]).prop("checked",false);
    				else
    					$(checks[i]).prop("checked",true);
    			}
    	}
    	
    }
    
    function changesApplied(id,message)
    {
    	$('.' + id).notify(message,{position:'bottom center',className:'success'});
    }
    
    
    function SaveFastComment(e)
    {
    	
    		if(e.keyCode == 13 || e.which == 13){
    			AddFastComment();
    			e.preventDefault();
    			return false;
    		}else{
    			return true;
    		}
    			
    		
    	
    }
    
    $("#tblSoft").live('click',function(){
    	
    	alert(this);
    });
    


