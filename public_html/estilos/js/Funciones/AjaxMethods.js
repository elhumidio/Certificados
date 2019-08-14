var urlBase=  '/cert';

function TEMPInsertDiffGestion()
{
	$.ajax({
		timeout: 48000,
		url : urlBase + '/index/cisgestion',
		async:false,
		type: "POST",
		dataType : "html",
		success:function(data){
			console.log(data);
			$("#divDiffPhotos").html('');     

			
			$('#divDiffPhotos').append("<br><span class='labelsCisEdition'>Added Cis</span><br>");
			$('#divDiffPhotos').append(data);
			$('#divDiffPhotos').append("<br><span class='labelsCisEdition'>Deleted Cis</span><br>");
			$('#divDiffPhotos').append(data);
			$('#divDiffPhotos').append("<br><span class='labelsCisEdition''>Modified Cis</span>");
			$('#divDiffPhotos').append(data);
			
		},
	    	error:function(data) { 
		},
		});
}

function GetCisGestionView(dialog)
{
	var param 		= false;
	var messageid 	= "";
	if(!!dialog)
		param = dialog;
	else param = false;
	if(dialog == "left")
		{
			param = false;
			//messageid = prompt("Type messageid");
		}
	$.ajax({
		timeout: 48000,
		url : urlBase + '/index/cisgestion',
		async:false,
		type: "POST",
		dataType : "html",
		data:{dialog:param},
		success:function(data){
			
			$("#divEditAdvice").remove();     
			$('.content').html('');
			$('.content').append(data);
		},
	    	error:function(data) { 
		},
		});
}

function InsertCisGestionView()
{
	$.ajax({
		timeout: 48000,
		url : urlBase + '/index/cisgestionshort',
		async:false,
		type: "POST",
		dataType : "html",
		success:function(data){
			
			$("#divTblCisClients").html('');     
			$('#divTblCisClients').append(data);
		},
	    	error:function(data) { 
		},
		});
}


/**
 * 
 */
function GetClientesByCert(messageid)
{
	
	$.ajax({
			timeout: 48000,
			url : urlBase + '/index/getclientsbycert',
			async:false,
			type: "POST",
			dataType : "json",
			data:{messageid:messageid},
			success:function(data){
				console.log("ddatatata: " + data);
				MAILS.values.clientes_cert = data;
			},
		    	error:function(data) { 
			},
			});
}

/**
 * 
 */
function GetCertGestionView()
{
	 $.ajax({
			timeout: 48000,
			url : urlBase + '/index/certgestion',
			async:false,
			type: "POST",
			dataType : "html",
			
			success:function(data){
				$("#divEditAdvice").remove();     
				$('.content').html('');
				$('.content').append(data);
			},
		    	error:function(data) { 
			},
			});
}

/**
 * Add a new manual CI 
 * @param data
 */
function AddNewManualCI(data)
{
	$.ajax({
		timeout: 48000,
		url : urlBase + '/index/addmanualci',
		async:false,
		type: "POST",
		dataType : "json",
		data:{data:data},
		success:function(data){
			InsertCisGestionView();
			//gotoGestionCis();
		},
	    	error:function(data) { 
	    		alert("error");
		},
		});	

}


var queriesrelated = [];
function GetAllQueries(messageid)
{
	
	if(messageid == "not")
		messageid = GESTION.values.current_messageid;
	 $.ajax({
			timeout: 48000,
			url : urlBase + '/index/getallqueries',
			async:false,
			type: "POST",
			dataType : "json",
			
			success:function(data){
				var pdata = JSON.parse(data);
				var selected = "";
				
				GetRelatedQueries(messageid)
				
				$('#slctQueries').html('');
				 	for(var i = 0; i < pdata.length; i++)
				 	{
				 		if(isInArray(queriesrelated,pdata[i].id))
				 			{
				 				selected = " selected "
				 			}
				 		$("#slctQueries").append('<option' + selected + ' value="' +  pdata[i].id + '">' + pdata[i].QUERY_NAME + '</option>');
				 		selected = "";
				 	}
			
			
			},
		    	error:function(data) { 
			},
			});
}

function isInArray(array,id)
{
	for(var i = 0; i < array.length; i++)
	{
		
		if(array[i].query_id == id)
			return true;
	}
	return false;
}

/**
 * Gets all queries related
 * @param messageid
 */
function GetRelatedQueries(messageid)
{
	 $.ajax({
			timeout: 48000,
			url : urlBase + '/index/getrelatedqueries',
			async:false,
			type: "POST",
			dataType : "json",
			data:{messageid:messageid},
			success:function(data){
				
				queriesrelated 					= data;
				GESTION.values.queriesRelatedContent 	= data; 
			
			},
		    	error:function(data) { 
			},
			});
}

/**
 * 
 */
function goToIndex()
{
	 $.ajax({
			timeout: 48000,
			url : urlBase + '/index',
			async:false,
			type: "POST",
			dataType : "html",
			data:{fase:2},
			success:function(data){
				$('body').html('');
				$('body').append(data);
			},
		    	error:function(data) { 
			},
			});
}

/**
 * 
 */
function GetCertClientesView(messageid)
{
	
	 $.ajax({
			timeout: 48000,
			url : urlBase + '/index/certclients',
			async:false,
			type: "POST",
			dataType : "html",
			data:{messageid:messageid},
			success:function(data){
			//	alert(data);
				$('#divClientesAsoc').html('');
				$('#divClientesAsoc').append(data);
			},
		    	error:function(data) { 
			},
			});
}

/**
 * Associate Cert to client
 */
function AssociateCertClient(data,messageid)
{
	 $.ajax({
			timeout: 48000,
			url : urlBase + '/index/associatecertclient',
			//url : urlBase + '/ajax/associatecertclient',
			async:false,
			type: "POST",
			dataType : "json",
			data:{data:data,messageid:messageid},
			success:function(data){
				//TODO refresh client -  cert table		
				if(data == "OK")
					$('#divClientesAsoc').notify('All selected clientes\n has been related to CERT ' + messageid,{position:'top center',className:'success'});
				else{
					var alreadyrelated = "";
					for(var i = 0; i < data.length; i++)
					{
						alreadyrelated += '* ' + data[i]+'\n';
					}
					$('#divClientesAsoc').notify('The client/s: \n\n' + alreadyrelated + '\n were already related to this CERT',{position:'top center',className:'warning'});
				}			
			},
		    	error:function(data) { 
			},
			});
}
/**
 * Set a CERT Gestion
 * @param messageid
 * @param gestion
 */
function UpdateGestionCert(messageid,gestion)
{
	 $.ajax({
			timeout: 48000,
			url : urlBase + '/index/setcertgestion',
			//url : urlBase + '/ajax/setcertgestion',
			async:false,
			type: "POST",
			dataType : "json",
			data:{gestion:gestion,messageid:messageid},
			success:function(data){
				//TODO refresh client -  cert table			
							
			},
		    	error:function(data) { 
			},
			});
}

/**
 * Refreshes advices table after parse mails
 */
function refreshAdvices()
{
	
	   $.ajax({
			timeout: 48000,
			url : urlBase + '/index/getcerts',
			async:true,
			type: "POST",
			dataType : "html",
						
			success:function(data){
				
			 $('.content').html('').append(data);
				
			 	},
		    	error:function(data) { $.notify('failed' + data);
			 },
		
		
			});	
}
/**
 * Gets comment of a dCert
 * @param messageid
 */
function GetCommentsByDcert(messageid)
{
	   $.ajax({
			timeout: 48000,
			url : urlBase + '/index/getcommentsbydcert',
			async:true,
			type: "POST",
			dataType : "json",
			data:{messageid:messageid},			
			success:function(data){
				
				$('#textareaComments').html('');
				for(var i = 0; i < JSON.parse(data).length; i++)
				{
					
		
					var precontent = $('#textareaComments').html();
				//	var j = $(JSON.parse(JSON.parse(data)[i].comment).comment).('span').html();
					var shorttext  = JSON.parse(data)[i].short_comment;
					var fulltext   = JSON.parse(JSON.parse(data)[i].comment).comment;
					console.log(JSON.parse(JSON.parse(data)[i].comment));
					
					
			
				
				
					$('#textareaComments').append("<br><b>" 
							+ JSON.parse(JSON.parse(data)[i].comment).display_name + "</b>" 
							+ "<i> [" +  JSON.parse(JSON.parse(data)[i].comment).date + "]</i> <br>"
							
							
							/*"<div class='readmore'>" + shorttext 	
						    + "<span class='ellipsis'>...</span> <span class='moreText'>"
						    + fulltext + "</span> <a class='more' href='#'>show more</a>"
						    + "</div><br><br>"*/
						    
							 + '<article id="less-1">'
							 
							+ '<p>' + shorttext+ '</p>'

							 + '<div class="fulltext" id="more-1">'
							+	'<a class="more" href="#more-1">Show More<span class="visually-hidden"></span></a>'

							+	'<p>'+ fulltext + '</p>'

							+	'<a class="less" href="#less-1">Show less <span class="visually-hidden"></span></a>'

							+ '</div></article>'
						    
					);
							
							//JSON.parse(JSON.parse(data)[i].comment).comment + "<br><br>");
				}
				
			},
		    error:function(data) { $.notify('failed' + data);
			 },
		
		
			});
}


function addComment()
{
	var messageid 	= GESTION.values.current_messageid;
	var comment 	= $("#txtNewComment").val();
	var cleantext 	= $(comment).text();
	var short_comment = cleantext == "" ?  comment.substring(0,15) : cleantext.substring(0,15); ;
	
	   $.ajax({
			timeout: 48000,
			url : urlBase + '/index/addcomment',
			async:true,
			type: "POST",
			dataType : "json",
			data:{messageid:messageid,comment:comment,short_comment:short_comment},			
			success:function(data){
				//refresh data
				GetCommentsByDcert(messageid);
				$('#txtNewComment').val('');
				
			},
		    error:function(data) { $.notify('failed' + data);
			 },
		
		
			});
}


function AddFastComment()
{
	var messageid 	= GESTION.values.current_messageid;
	var comment 	= $("#txtComentarios").val();
	
	   $.ajax({
			timeout: 48000,
			url : urlBase + '/index/addcomment',
			async:true,
			type: "POST",
			dataType : "json",
			data:{messageid:messageid,comment:comment},			
			success:function(data){
				//refresh data
				//GetCommentsByDcert(messageid);
				$('#txtComentarios').val('');
				
			},
		    error:function(data) { $.notify('failed' + data);
			 },
		
		
			});
}


