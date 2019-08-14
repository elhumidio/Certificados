 /* @author Damián Esteban Blanc Perez - damian.blanc@t-systems.es
 /* @version 1.0 -09/03/2018
 */ 

var nose="";
  var msgInfo="";
  var mails={};
  var email = "";
  var urlBase=  '/cert';
  var MAILS = {};
	var obj = [];
	var objMail = {};
  
  MAILS.values ={
		  softversions:"",
		  relatingci:false,
		  id:"",
		  checkboxChecked:  [],
		  grupos:           '',
		  clientes:         [],
		  estados:          '',
		  software:         [],
		  correos:			[],
		  queries: 			[],
		  clientes_cert:	[],
		  formermails: 		[]
  };
	  /**
	   * Verifies whether Api is supported
	   * @returns {Boolean}
	   */	
	  function isSupportedFileAPI() {
	    //return window.File && window.FileReader && window.FileList && window.Blob;
	    return true;
	  }

	  function formatEmail(data) {
	    return data.name ? data.name + " [" + data.email + "]" : data.email;
	  }

	  function parseHeaders(headers) {
	    var parsedHeaders = {};
	    if (!headers) {
	      return parsedHeaders;
	    }
	    var headerRegEx = /(.*)\: (.*)/g;
	    while (m = headerRegEx.exec(headers)) {
	      // todo: Pay attention! Header can be presented many times (e.g. Received). Handle it, if needed!
	      parsedHeaders[m[1]] = m[2];
	    }
	    return parsedHeaders;
	  }
	  
	  /**
	   * Gets mail's date
	   * @param rawHeaders
	   * @returns
	   */
	  function getMsgDate(rawHeaders) {
	    // Example for the Date header
	    var headers = parseHeaders(rawHeaders);
	    if (!headers['Date']){
	      return '-';
	    }
	    return new Date(headers['Date']);
	  }
	   

	  /**
	   * MAIN FUNCTION
	   */
	  $(function () {
		 
	    if (isSupportedFileAPI()) {
	      
		  $('#src-file').live('change',function () {
			    
			  $('#frmDrop').toggle();
			  let arrayGeneral=[]; 
		//	console.log("files: ");
			 console.log(this.files);
			
			for(var file=0; file < this.files.length; file ++){
			
			
				
				let objGeneral = {};
				let softwareArray = [];
				let referencesArray = [];
				let threatArray=[];
				let remediationArray=[];
				let bodyArray = [];
				let messageId = "";
				let date = "";
				let references="";
				let row="";
				let cvssBaseScore = "";
				let cvssVector = "";
				let title = "";
				let changeLogArray=[];
			
				 if (!this.files[file]) {
				  $('.msg-info, .incorrect-type').hide();
				  return;
				}
				
					if (this.files[file].name.indexOf('.msg') == -1) {
						$('.msg-info').hide();
						$('.incorrect-type').show();
						return;
					}
					
					$('.msg-example .msg-file-name').append(this.files[file].name);
					$('.incorrect-type').hide();
					
					 // read file...
				
			var fileReader = new FileReader();		
			 fileReader.onloadend = function (evt) {

	          var buffer = evt.target.result;
	          var msgReader = new MSGReader(buffer);
	          var fileData = msgReader.getFileData();
	          if (!fileData.error) {
	        	  
	        	  //info to make a table with basic info about parsed mails
					 let mailFrom = 	 formatEmail({name: fileData.senderName, email: fileData.senderEmail});
					 let mailTo = jQuery.map(fileData.recipients, function (recipient, i) {
		              return formatEmail(recipient);
					 	});
					 let mailDate = getMsgDate(fileData.headers);
					 let Subject = fileData.subject;
					
					// console.log("**************************************************************");
					 //console.log(mailFrom + " - " + mailTo + " - " + mailDate + " - " + Subject );
	        	     date = getMsgDate(fileData.headers);
					var dataImportante = fileData.body.substring(0, Math.min(160000, fileData.body.length));
	              
					bodyArray = dataImportante.split('\n');
					//console.log(bodyArray);
			//TODO dentro de dataImportante esta Software afectado, messageid, cvss vector (ojo, está con un link),  y solucion
				//extraer software de body
				startSoft = 0;
				endSoft = 0;
				startReferences=0;
				endReferences = 0;
				startThreat = 0;
				endThreat = 0;
				startRemediation = 0;
				endRemediation = 0;
				startChangeLog=0;
				endChangeLog = 0;
				startCriticality = 0;
				console.log(bodyArray);
				for(var i = 0; i < bodyArray.length; i++)
				{
					if(bodyArray[i].indexOf("Software:") != -1)
						startSoft = i+1;
					
					if(bodyArray[i].indexOf("Title:") != -1){
						console.log("title: ");
						console.log(bodyArray[i]);
						title = bodyArray[i].split(":")[1].trim() + bodyArray[i].split(":")[2].trim();
					}
						
					
					if(bodyArray[i].indexOf("CVSS Base Score:") != -1){
						let array = bodyArray[i].split(":");
						array = array.splice(0,1);
						cvssBaseScore = bodyArray[i].split(":")[1].trim();
					}
					if(bodyArray[i].indexOf("Criticality:") != -1)
						{
							criticality = bodyArray[i].split(":")[1].trim();
						}
						
					if(bodyArray[i].indexOf("CVSS Vector:") != -1){
						let array = bodyArray[i].split(":");
						array = array.splice(0,1);
						cvssVector = bodyArray[i];
					}
						
					if(bodyArray[i].indexOf("Threat scenario")!= -1)
						endSoft = i-2;
					if(bodyArray[i].indexOf("Message ID:")!= -1)
						messageId = bodyArray[i].split(":")[1].trim();
					if(bodyArray[i].indexOf("References") != -1){
						startReferences = i+2;
						endRemediation = i-1;
					}
						
					if(bodyArray[i].indexOf("Changelog") != -1){
						startChangeLog = i;
						endReferences = i-2;
					}
					if(bodyArray[i].indexOf("Further Subscription Service Information") != -1){
						endChangeLog = i-1;
					}
						
					if(bodyArray[i].indexOf("Threat scenario")!= -1)
						startThreat = i+2;
					if(bodyArray[i].indexOf("Remediation")!= -1)
					{
						endThreat = i-2;
						startRemediation = i+1;
					}
						
				}
				
				 
				//Remediation
				
				let remediationRearrange = [];
				for(var y=startRemediation; y< endRemediation; y++)
				{
					var el ={};
					
					if(bodyArray[y].trim() != ""){
						el = bodyArray[y].trim();
					}
					remediationArray.push(el);
					
				}
				//ChangeLog
				var el ={};
				for(var j=startChangeLog +2; j < endChangeLog ;j++)
				{
					//console.log(j + " - "+ bodyArray[j].trim());
					
					if(bodyArray[j].trim() != "")
					{
						if(j == startChangeLog +2){
							arr = bodyArray[j].split(":");
							el.version = arr[1].trim();
						}
							
						if(j == startChangeLog + 3){
							arr = bodyArray[j].split(":");
							el.author = arr[1].trim();
						}
							
						if(j == startChangeLog + 4)
							{
								if(!!bodyArray[j]){
									arr = bodyArray[j].split(":");
									el.Created =  arr[1].trim();
								}
							}
							
						if(j == startChangeLog + 5){
							if(!!bodyArray[j]){
								arr = bodyArray[j].split(":");
								el.Updated = arr[1].trim();
							}
							
						}
							
					}
					
				}
				changeLogArray.push(el);
				//console.log(changeLogArray); 

				
				//Software
				for(var m = startSoft; m < endSoft; m++)
				{
					softwareArray.push(bodyArray[m].trim());
				}		
				
				
				//References
				for(var n = startReferences; n < endReferences; n+=2)
				{
					var element = {};
					element.title = bodyArray[n].trim();
					element.url = bodyArray[n+1].trim();
					referencesArray.push(element);
				}
				var flag= false;
				
				
				
				//console.log('threats: ');
				//console.log(arrayThreats);
				for(var p =startThreat;p< endThreat;p++){
					threatArray.push(bodyArray[p])
					
				}
				//console.log(threatArray);	
				var positionsThreats = searchCVEPos(threatArray);
				//console.log(positionsThreats);
				var arrayThreatsGrouped = [];
				var threat="";
			
				for(var i = 0; i < positionsThreats.length -1; i++)
				{
		
					for(var a = positionsThreats[i];a < positionsThreats[i + 1]; a++)
					{
						//console.log(threatArray[a]);
						threat += threatArray[a];
					}
					
					arrayThreatsGrouped.push(parseStringThreath(threat));
					threat="";
				}
				
				var end = positionsThreats[positionsThreats.length -1];
				threat += threatArray[end];
				threat += threatArray[end+1];
				threat += threatArray[end+2];
				threat += threatArray[end+3];
				threat += threatArray[end+4];
				arrayThreatsGrouped.push(parseStringThreath(threat));
				
				
				objGeneral.threats = arrayThreatsGrouped;
				
				objGeneral.mailFrom = mailFrom;
				objGeneral.mailTo = mailTo;
				var d = new Date(mailDate);
				var curr_date = d.getDate();
				var curr_month = d.getMonth();
				var curr_year = d.getFullYear();
				var fecha = curr_year + "-" +  curr_month +  "-"  + curr_date + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

				objGeneral.mailDate = fecha;
				//console.log("Fecha: " + fecha);
				objGeneral.Subject = Subject;
				objGeneral.software = softwareArray;
			
				objGeneral.messageId = messageId;
				objGeneral.title = title;
				objGeneral.cvssBaseScore = cvssBaseScore;
				objGeneral.cvssVector = cvssVector;
				objGeneral.date = date;
				objGeneral.remediation = remediationArray;
				objGeneral.references = referencesArray;
				objGeneral.changelog = changeLogArray;
				objGeneral.criticality = criticality;
				arrayGeneral.push(objGeneral);
					
	          } else {
	            
	            $('.incorrect-type').show();
	          }
	        };
	       
				fileReader.readAsArrayBuffer(this.files[file]);
				// console.log("despues: " + fileReader.readyState);
					
					if(file == this.files.length -1){
						nose = arrayGeneral;
						setTimeout(function(){ makeTable(nose);
						
						}, 1000);
						//makeTable(nose);
					}
						
			    
				      
			}
		
	      });
		  
		  
		  //makeTable(arrayGeneral);  
	    } else {
	      $('.msg-example').hide();
	      //$('#frmDrop').notify('Sorry, your browser isn't supported',{position:'top center',className:'error'});
	      $('.file-api-not-available').show();
	    }
	  
	    
	  });
	  
	  /**
	   * Searches for CVE inside Threaths
	   * @param nuevoArrayThreaths
	   * @returns {Array}
	   */
	  function searchCVEPos(nuevoArrayThreaths)
	  {
		var arrayPosiciones =[];
		
		for(var a =0 ; a < nuevoArrayThreaths.length; a++)
		{
			if(nuevoArrayThreaths[a].indexOf('CVE:') != -1)
			{
				arrayPosiciones.push(a);
			}
			
		}
		
		return arrayPosiciones;
	  }
	  

	
	/**
	 * Parse threath data 
	 * @param t
	 * @returns
	 */
	function parseStringThreath(t)
	{
		var arrayObj =  t.split('\t\r');
		obj={};
		for(var a =0; a < arrayObj.length; a++)
		{
		valor = arrayObj[a].split(':')[0].trim();
		//console.log("valor: " + valor);
		
			switch(valor)
			{
				case 'CVE':
				obj.cve = arrayObj[a].split(':')[1].trim();
				break;
				case 'Release date':
				obj.releaseDate = arrayObj[a].split(':')[1].trim();
				break;
				case 'Exploit':
				obj.exploit = arrayObj[a].split(':')[1].trim();
				break;
				case 'Description':
				obj.description = arrayObj[a].split(':')[1].trim();
				break;
			}
		}
		
		return obj;
	  
	}  
	$('#close').click(function(){
	
		$('#rawdatadiv').toggle('slow');
	});

	/**
	 * Makes table
	 * @param arrayGeneral
	 * @returns {Boolean}
	 */
	function makeTable(nose)
	{
		
		var table= "<br><br><br><table class='tblInfo' id='tblBasicInfo'><thead><tr><th width='15'>Id</th><th width='15'>From</th><th width='15'>To</th><th width='10'>Date</th><th width='40'>Subject</th>" +
				/*"<th width='5'>Delete</th>" */+
				"</tr></thead>";
		
		for(var i = 0; i < nose.length; i++)
		{
			table += "<tr><td class='messageid'>" + nose[i].messageId 
			+ "</td><td>" + nose[i].mailFrom 
			+ "</td><td>" + nose[i].mailTo 
			+ "</td><td>" + nose[i].mailDate 
			+ "</td><td>" + nose[i].Subject 
			+ "</td>" +
					/*"<td onclick='deleteRowObj(this)' style='text-align: center;cursor:pointer'>" + "<img width='15' height='15' src='img/icons/delete.png'>" */+
							"</td>"
			+ "</tr>";
			
		}
		table += "</table>";
	
		$('.msg-example').html(table);
		$('.msg-info').toggle();
		var predata = $('.footer').html();
	
	}
	
	/**
	 * Remove current row
	 * @param d
	 */
	function deleteRowObj(d)
	{
		// get the current row
	    var currentRow=$(d).closest("tr"); 
	    var id=currentRow.find("td:eq(0)").text(); // get current row 1st TD value
	     //console.log(id);
	   //Remove from object
	     for(var a = 0; a < nose.length; a++ ){
	    	 
	    	 console.log(nose[a].messageId);
	    	 if(nose[a].messageId == id)
	    		 {
	    		 	var index = nose.indexOf(nose[a]);
	    		 	nose.splice(index,1);
	    		 }
	     }
	     console.log(nose);
	     $(d).parent().remove();
	}
	
	
	/**
	 * Refreshes advices table after parse mails
	 */
	function refreshAdvicesTable()
	{
		
		   $.ajax({
				timeout: 48000,
				url : urlBase + '/index/getcerts',
				async:true,
				type: "POST",
				dataType : "html",
							
				success:function(data){
					$('#rawdatadiv').toggle('slow');
				 
					var table = $('#tblcerts').DataTable();
			    	console.log(data);
					$('#rawdatadiv').toggle('slow');
					$('#tblcerts').dataTable().fnClearTable();
					$('#tblcerts').fnAddData(data);
			    	
					
				 	},
			    	error:function(data) { $.notify('failed' + data);
				 },
			
			
				});	
	}
	
	
	/**
	 * Saves advices (mails)
	 */
	function saveAdvices()
	{
		console.log(nose);
		   $.ajax({
				timeout: 48000,
				url : urlBase + '/index/savecertinitial',
				async:true,
				type: "POST",
				dataType : "json",
				data:{data:nose},
			
				success:function(d){
					$('#rawdatadiv').toggle('slow');
					var mjeKO = "";
					var mjeOK = "";
					console.log(d);
					for(var i = 0; i < d.KO.length; i++)
						{
							mjeKO += d.KO[i] + "\n"; 
						}
					
						loadCerts(d);
						if(mjeKO != "")
							$.notify('Certs with message id: \n' + mjeKO + "\n already exists in DB");
				 	},
			    	error:function(d) { $.notify('failed' + d);
			    	console.log(d);
				 },
			
			
				});	
		
	}
	
	
	function loadCerts()
	{
		   $.ajax({
				timeout: 48000,
				url : urlBase + '/index/getcerts',
				async:true,
				type: "POST",
				dataType : "text",
				success:function(data){
				$( this ).dialog( "close" );
				//$('.colRight').html('');
				//console.log(data);
				$('.content').html('').append(data);
							
				},
			    	error:function(data) { $.notify('failed' + data);
				 },
				});
		
	}
	
	function showoriginalEmail()
	{
		
		table = $('#tblcerts').DataTable();
    	var todo="";
    	var software ="";
    	var references = "";
    	var remediation = "";
    	var threats = "";
    	var title = "";
    	var subject = "";
    	var mailDate = "";
    	var messageId = "";
		$('#tblcerts tbody').on('click', 'tr', function () {
	        
			email = JSON.parse(table.fnGetData(this)[10]);
			todo = JSON.parse(table.fnGetData(this)[10]);
			software = email.software;
			references = email.references;
			remediation = email.remediation;
			threats = email.threats;
			title= email.title;
			subject = email.subject;
			mailDate = email.mailDate; 
			messageId = email.messageId;
	    
		});
		
	}
	
	function getInfoAdviceRow()
	{
		
    	table = $('#tblcerts').DataTable();
    	var todo="";
    	var software ="";
    	var references = "";
    	var remediation = "";
    	var threats = "";
    	var title = "";
    	var subject = "";
    	var mailDate = "";
    	var messageId = "";
    	objArray = [];
    	var objMail = {};
		$('#tblcerts tbody').on('click', 'tr', function () {
	        
			email = JSON.parse(table.fnGetData(this)[10]);
			
			objMail.software = email.software;
			objMail.references = email.references;
			objMail.remediation = email.remediation;
			objMail.threats = email.threats;
			objMail.title= email.title;
			objMail.subject = email.subject;
			objMail.mailDate = email.mailDate; 
			objMail.messageId = email.messageId;
	    
		});
		objArray.push(objMail);
		return objArray;
	}
	
	
    
    /**
     * Clear fields update cert form
     */
    function clearFieldsUpdateCert()
    {
    	
    	$("#slctClientes").val($("#target option:first").val());
    	$("#slctEstado").val($("#target option:first").val());
    	$("#slctGrupos").val($("#target option:first").val());
    	$('#txtComentarios').val('');
    	$('#dateFin').val('');
    }
    
    
    function grabarDataManualCert()
    {
    	
    	
    }
    
    
    /**
     * Loads Grupos select-option
     */
    function loadGrupos()
    {
    	//console.log("loadGrupos");
    	$.ajax({
			timeout: 48000,
			url : urlBase + '/index/loadgrupos',
			async:true,
			type: "POST",
			dataType : "json",
			data:{data:nose},
		
			success:function(data){
			
				//console.log(data);
				var $select = $('#slctGroups');
				//$select.html('');
				$.each(data,function(key, value) 
						{
						    $select.append('<option value=' + value.id + '>' + value.Nombre + '</option>');
				});
			
			 	},
		    	error:function(data) { $.notify('failed' + data);
			 },
		
		
			});	
    }
    
    /**
     * Loads queries
     */
   /* function loadQueries()
    {
    	$.ajax({
			timeout: 48000,
			url : urlBase + '/index/loadqueries',
			async:false,
			type: "POST",
			dataType : "json",
			data:{data:nose},
			success:function(data){
				var $select = $('#slctQueries');
				console.log(data);
				$.each(data,function(key, value) 
						{
					    $select.append('<option value=' + value.id + '>' + value.QUERY_NAME + '</option>');
				});
			
			 	},
		    	error:function(data) { $.notify('failed' + data);
			 },
		
		
			});
    	
    }*/
    
    /**
     * Loads Estados select-option
     */
    function loadEstados()
    {
    
    	$.ajax({
			timeout: 48000,
			url : urlBase + '/index/loadestados',
			async:true,
			type: "POST",
			dataType : "json",
			data:{data:nose},
			success:function(data){
				var $select = $('#slctEstado');
			
				$.each(data,function(key, value) 
						{
					    $select.append('<option value=' + value.id + '>' + value.Nombre + '</option>');
				});
			
			 	},
		    	error:function(data) { $.notify('failed' + data);
			 },
		
		
			});	
    }
    
    
    /**
     * Loads clients select-option
     */
    function loadClientes()
    {
		   $.ajax({
				timeout: 48000,
				url : urlBase + '/index/loadclientes',
				async:true,
				type: "POST",
				dataType : "json",
				data:{data:nose},
			
				success:function(data){
					MAILS.values.clientes = data;
					var $select = $('#slctClientes');
					//$select.html('');
					$.each(data,function(key, value) 
							{
							    $select.append('<option value=' + value.ID + '>' + value.Nombre + '</option>');
					});
				
				 	},
			    	error:function(data) { $.notify('failed' + data);
				 },
			
			
				});	
    }
    var certsAdvices="";

    
    /**
     * Relates Cert/Advice with CI
     * @param d
     */
	function relateCi(d)
	{
		//console.log("d");
		//console.log(d);
		//TODO Conseguir correo del elemento datatable...
		table = $('#tblcerts').DataTable();
		
		$('#tblcerts tbody').on('click', 'tr', function () {
	    
			id = table.fnGetData(this)[1];
			//getsoftversions
			gotoSoftView(id);

			
			
	    });
		
		
	}
	
	/**
	 * Navigates to soft view from cert
	 * @param id
	 */
	function gotoSoftView(idpar)
	{
		var id = "noparam";
		if(!!id)
			id = idpar;
	    $.ajax({
			timeout: 48000,
			url : urlBase + '/index/parseddata',
			async:true,
			dataType:"text",
			type: "POST",
			data:{id:idpar},
			success:function(parseddata){
			
				$('.rawcontainer').html('');
				$('.content').html('');
				$('.tblButtons').hide();
				$('body').html(parseddata);
				MAILS.values.id = id;
				//console.log(MAILS.values.softversions);
				//console.log(MAILS.values.relatingci);
				
		 	},
		    	error:function(data) { $.notify('failed' +JSON.stringify(data) );
			 },
		
		
			});	 

		}
	
	function getSoftVersions(id)
	{
		$('<div id="processingDatav" style="position:absolute;margin-left:45%;margin-top:10%;opacity:0.5;z-index:999999;"><img width="100" height="100" src="/img/loading1.gif"></div>').prependTo('.contenido');
		   $.ajax({
			timeout: 48000,
			url : urlBase + '/index/getsoftversions',
			async:false,
			dataType:"json",
			type: "POST",
			data:{id:id},
			success:function(parseddata){
			MAILS.values.softversions = parseddata;
		//console.log(parseddata);
		
				//draw elements in parsed data software and versions
				
		 	},
		    	error:function(data) { $.notify('failed' +JSON.stringify(data) );
			 },
			 complete: function(parseddata){
					
					
			 }
		
			});	
		
		
	}
	
	/**
	 * Draws dynamic table with soft and versions
	 */
	function drawSoftVersions()
	{
		var data = MAILS.values.softversions;
		var cont = 0;
		for(key in data){
			console.log(JSON.stringify(data[key]) + " - " + key);
			if(cont  == 0)
				{
				    $('#inputsoft_1').val(key);
				   /* for(i=0; i < data[key].length;i++)
				    {
				    	var label = document.createElement('label');
						var br = document.createElement('br');
						label.htmlFor = 'chk_' + "1" + '_' + i;
			           	label.id= 'label_'  + "1" + '_' + i;
			           	label.appendChild(Createcheckbox('chk_' + "1" + '_' + i,false,data[key][i].version));
			           	label.appendChild(document.createTextNode(data[key][i].version));
			           	label.appendChild(br);
						$('#txtversions_' + "1").append(label);
				    }*/
				    cont++;
					
					
				}
			else{
				addRow();
				$('#inputsoft_' + (cont +1)).val(key);
			   /* for(i=0; i < data[key].length;i++)
			    {
			    	
			    	var label = document.createElement('label');
					var br = document.createElement('br');
					label.htmlFor = 'chk_' + (cont +1) + '_' + i;
		           	label.id= 'label_'  + (cont +1) + '_' + i;
		           	label.appendChild(Createcheckbox('chk_' + (cont +1) + '_' + i,false,data[key][i].version));
		           	label.appendChild(document.createTextNode(data[key][i].version));
		           	label.appendChild(br);
					$('#txtversions_' + (cont +1)).append(label);
			    }*/
			    cont++;
			}
			
		}
$('#processingDatav').hide();
		
	}
	function addRow(text)
	{
	        var $tableBody = $('#dynamicTable').find("tbody"),
	                $trLast = $tableBody.find("tr:last"),
	                $trNew = $trLast.clone().show();
	                	
	              	$trNew.attr('class','nofirstrow');
	                // Find by attribute 'id'
	                $trNew.find('[id]').each(function () {
	                    var num = this.id.replace(/\D/g, '');
	                    if (!num) {
	                        num = 0;
	                    }
	                    sufix = this.id.split("_")[1];
	                    

	                    // Remove numbers by first regexp
	                    this.id = this.id.replace(/\d/g, '') 
	                        // increment number
	                        + (1 + parseInt(num, 10));
	                       // console.log(this.type);
	              
	                         
	                });
	                $trNew.find('div').html('');
	                if(!!text)
	                    $trNew.find('input').val(text);
	                    else 
	                    	$trNew.find('input').val('');
	                
	                $trLast.after($trNew); 

	             // $('#' + remove).remove();
	             // $('#label_' + remove.split("_")[0] + "_" + remove.split("_")[1]).remove();


	}
	
	  
	
	    
	    jQuery.fn.selectOptionWithText = function selectOptionWithText(targetText) {
	        return this.each(function () {
	            var $selectElement, $options, $targetOption;

	            $selectElement = jQuery(this);
	            $options = $selectElement.find('option');
	            $targetOption = $options.filter(
	                function () {return jQuery(this).text() == targetText}
	            );

	            // We use `.prop` if it's available (which it should be for any jQuery
	            // versions above and including 1.6), and fall back on `.attr` (which
	            // was used for changing DOM properties in pre-1.6) otherwise.
	            if ($targetOption.prop) {
	                $targetOption.prop('selected', true);
	            } 
	            else {
	                $targetOption.attr('selected', 'true');
	            }
	        });
	    }
	    
	    /**
	     * Shows mail replica
	     * @param id
	     */
	    function getEmail(data)
	    {
	    	//show dialog with info id fila and message_ids
	    	
	    	var id 			= data.split("_")[0];
	    	var messageid 	= data.split("_")[1];
	    	
	    	//open dialog
	    	$('#divDialogCerts').dialog({
	    		autoOpen: true,
				title:"Original mail data",
				modal: true, 
				minWidth:700,
				height:300,
				buttons: {
		    	    "Close":function(){
		    	    	$('#divDialogCerts').dialog( "Close" );
		    	    }
					},
	    		open:function(){
	    			   $.ajax({
	   					timeout: 48000,
	   					url : urlBase + '/index/getallcertsbyid',
	   					async:true,
	   					type: "POST",
	   					dataType : "json",
	   					data:{messageid:messageid},
	   					success:function(data){
	   						MAILS.values.correos = data;
	   						
	   						var mailsinfo 				= "<table>";
	   						MAILS.values.formermails    = "";
	   						MAILS.values.formermails 	= "<table>";
	   						for(var i = 0; i < data.length; i++)
	   						{
	   							if(i == 0){
	   								mailsinfo += "<tr><td><a style='cursor:pointer;color:red' onclick='drawCertMail(" + data[i].id + ");'>View</a></td><td width='25%'>Version " + data[i].Version 
		   							+ ": [" + data[i].Tipo + "] </td><td width='75%'>" + data[i].Release_date
		   							+ " [CVSS " + data[i].CVE + "] - " + data[i].Titulo + "</td></tr>";
	   							}
	   							else{
	   								MAILS.values.formermails += "<tr><td><a style='cursor:pointer;color:red' onclick='drawCertMail(" + data[i].id + ");'>View</a></td><td width='25%'>Version " + data[i].Version 
		   							+ ": [" + data[i].Tipo + "] </td><td width='75%'>" + data[i].Release_date
		   							+ " [CVSS " + data[i].CVE	 + "] - " + data[i].Titulo + "</td></tr>";
	   							}
	   							 
	   						}
	   						mailsinfo 	+= "</table>";
	   						
	   						MAILS.values.formermails +="</table>";
	   						$('#divtableCerts').html('');
	   						$('#divtableCerts').append(mailsinfo);
	   						console.log(MAILS.values.formermails);
	   						
	   					},
	   				    	error:function(data) { $.notify('failed' + data);
	   					 },
	   					});
	    			}
	    		});
	    	    }
	    
	    /**
	     * Draw a cert (Cert mail replica)
	     * @param id
	     */
	    function drawCertMail(id)
	    {
	    	
	    	console.log("draw mail loco: " + id);
	    	console.log(MAILS.values.correos);
	    	console.log(MAILS.values.correos.length);
	    	for(var a = 0; a < MAILS.values.correos.length; a++)
	    	{
	    		if(MAILS.values.correos[a].id == id)
	    			{
	    			console.log("a ver coincidencia de ids");
	    			console.log(MAILS.values.correos[a].Correo);
	    				fillMailDataDialog(JSON.parse(MAILS.values.correos[a].Correo));
	    			}
	    	}
	    	
	    }
	    
	    /**
	     * Fills mail Data Dialog
	     * @param data
	     */
	    function fillMailDataDialog(data)
	    {
	    	$('#divShowMail').dialog('close');
	    //	$('#divShowMail').dialog('destroy').remove()
	    	
	    	$('#divShowMail').dialog({
	    		autoOpen: true,
				title:"Original mail data",
				modal: false, 
				minWidth:700,
				height:500,
				open:function(){
	    			fillMailData(data);
	    		},
	    		close:function(){
	    			
	    			$('#dataMailDetails').html('');
	    			$('#dataMailThreatScenario').html('');
	    			$('#dataMailRemediation').html('');
	    			$('#dataMailReferences').html('');
	    			$('#dataMailChangelog').html('');
	    			$('#dataMailFormerMails').html('');
	    			
	    			
	    		},
	    		buttons: {
			    	    "Close":function(){
			    	    	$( this ).dialog( "Close" );
			    	    }
	    		}
	    		
	    		
	    	});
	    }
	    
	    
	    /**
	     * Fills mail view
	     * @param data
	     */
	    function fillMailData(data)
	    {
	    	var changelog = false;
	    	style="";
	    	if(data['messageId'] == "dCert2016-0465")
    		{
	    		style="color:red;font-weight:bold";
    		}
	    	//Advisory Details
	    	$('#dataMailDetails').html('');
	    	$('#dataMailDetails').append("<tr><td class='titletd' colspan='2'>Advisory Details</td></tr>");
	    	$('#dataMailDetails').append("<tr><td class='titletdsub'>Title</td><td class='titletdcont'>" + data['title'] + "</td></tr>");
	    	$('#dataMailDetails').append("<tr><td class='titletdsub'>Message Id</td><td class='titletdcont'>" + data['messageId'] + "</td></tr>");
	    	$('#dataMailDetails').append("<tr><td class='titletdsub'>CVSS Base Score</td><td class='titletdcont'>" + data['cvssBaseScore'] + "</td></tr>");
	    	$('#dataMailDetails').append("<tr><td class='titletdsub'>CVSS Vector</td><td class='titletdcont'>" + data['cvssVector'] + "</td></tr>");
	    	$('#dataMailDetails').append("<tr><td class='titletdsub'>Software</td><td class='titletdcont'>" + data['software'].join("<br />") + "</td></tr>");
	    	$('#dataMailDetails').append("<tr style='height:30px;background-color:whitesmoke !important'><td></td><td></td></tr>");
	    	//Theath Scenario
	    	$('#dataMailThreatScenario').html('');
	    	$('#dataMailThreatScenario').append("<tr><td class='titletd' colspan='2'>Threath Scenario</td></tr>");
	    	for(var a = 0; a < data.threats.length; a++){
	    		if(a == 0)
	    			{
	    			style="color:red;font-weight:bold";
	    			}
	    		else{
	    			style="color:black;font-weight:normal";
	    		}
	    		$('#dataMailThreatScenario').append("<tr><td style='" + style + "'><span class='titletdsub'>CVE: </span>" + data.threats[a].cve + "</td></tr>");
	    		$('#dataMailThreatScenario').append("<tr><td style='" + style + "'><span class='titletdsub'>Release date: </span>" + data.threats[a].releaseDate + "</td></tr>");
	    		$('#dataMailThreatScenario').append("<tr><td class='titletdsub' colspan='2'>Description</td></tr>");
	    		$('#dataMailThreatScenario').append("<tr><td class='titletdcont' colspan='2' style='" + style + "'>" + data.threats[a].description + "</td></tr>");
	    		$('#dataMailThreatScenario').append("<tr style='height:30px;background-color:whitesmoke !important ;" + style + "'><td></td><td></td></tr>");
	    	}
	    	
	    	//Remediation
	    	$('#dataMailRemediation').html('');
	    	$('#dataMailRemediation').append("<tr><td class='titletd' colspan='2'>Remediation</td></tr>");
	    	for(var b = 0; b < data.remediation.length; b++){
	    		console.log("ESTA ES LA DATA");
		    	console.log(data.remediation[b]);
	    		style="";
		    	if(data['messageId'] == "dCert2016-0465")
	    		{
		    		style="color:red;font-weight:bold";
	    		}
	    		if(data.remediation[b].indexOf("Type:")!=-1){
	    			if(b == 1)
	    			{
	    			style="color:red !important;font-weight:bold !important";
	    			}
	    		else{
	    			//style="color:black;font-weight:normal";
	    		}
	    			$('#dataMailRemediation').append("<tr style='height:25px;" + style + "'><td colspan='2'></td></tr>");
	    			$('#dataMailRemediation').append("<tr><td class='titletdsub'>Type: <span style='" + style + "'>" + data.remediation[b].split(":")[1] + "</span></td></tr>");
	    		}
		    		
		    		else {
		    			if(b == 1)
		    			{
		    			style="color:red;font-weight:bold";
		    			}
		    		else{
		    			style="color:black;font-weight:normal";
		    		}
		    			if(data.remediation[b].indexOf("http") != -1)
		    			$('#dataMailRemediation').append("<tr><td style='" + style + "' class='linkInfo' colspan='2'><a href='" + data.remediation[b] +  "'>" + data.remediation[b] + "</a></td></tr>");
		    			else $('#dataMailRemediation').append("<tr><td style='" + style + "' class='titletdsub noborder' colspan='2'>" + data.remediation[b] +  "</td></tr>");
		    			
		    		} 
	    		
	    		
	    	}
	    	$('#dataMailRemediation').append("<tr style='height:30px;background-color:whitesmoke !important'><td></td><td></td></tr>");
	    	
	    	//References
	    	$('#dataMailReferences').html('');
	    	$('#dataMailReferences').append("<tr><td class='titletd' colspan='2'>References</td></tr>");
	    	for(var c = 0; c < data.references.length; c++)
	    	{
	    		console.log(data.references[c]);
	    		$('#dataMailReferences').append("<tr><td colspan='2'>" + data.references[c].title +  "</td></tr>");
	    		$('#dataMailReferences').append("<tr><td class='linkInfo' colspan='2'><a href='" + data.references[c].url +  "' >" + data.references[c].url +  "</a></td></tr>");
	    		$('#dataMailReferences').append("<tr style='height:25px'><td colspan='2'></td></tr>");
	    		
	    	}
	    	
	    	//Changelog
	    	$('#dataMailChangelog').html('');
	    	if(changelog == false){
	    		$('#dataMailChangelog').append("<tr><td class='titletd' colspan='2'>Changelog</td></tr>");
	    		changelog = true;
	    	}
	    		
	    	
	    	$('#dataMailChangelog').append("<tr><td><span class='titletdsub'>Version: </span>" + data.changelog[0].version +  "</td></tr>");
	    	$('#dataMailChangelog').append("<tr><td><span class='titletdsub'>Author: </span>" + data.changelog[0].author +  "</td></tr>");
	    	$('#dataMailChangelog').append("<tr><td><span class='titletdsub'>Created: </span>" + data.changelog[0].Created +  "</td></tr>");
	    	$('#dataMailChangelog').append("<tr><td style='" + style + "'><span class='titletdsub'>Updated: </span>" + data.changelog[0].Updated +  "</td></tr>");
	    	$('#dataMailFormerMails').html('');
	    	$('#dataMailFormerMails').append(MAILS.values.formermails);
	    	
	    			
	    }
	    
	    
	    var checks=[];
	
	    
	    
	    /**
	     * Checks checked checkboxes :)
	     * @param sessiondata
	     */
	   function checkchkVersions(sessiondata)
	    {
	    	console.log('checkchkVersions');
	    	var datasession =JSON.parse(sessiondata);
	    	var objsofVersions = JSON.parse(datasession.newValues);
	    
		    	for(key in objsofVersions)
				{
					for(k in objsofVersions[key].checkedId)
						{
							console.log(objsofVersions[key].checkedId[k]);
							$('#' + objsofVersions[key].checkedId[k]).prop('checked',true);
						}
					
				}
	    }
	   var datamail;
	   function getDataMail(id)
	   {
		   $.ajax({
				timeout: 48000,
				url : urlBase + '/index/getemail',
				async:false,
				type: "POST",
				dataType : "json",
				data:{id:id},
				success:function(data){
					
					
					console.log(JSON.parse(data[0].Correo).software);
					datamail = JSON.parse(data[0].Correo).software;
				},
			    	error:function(data) { console.log(data[0].Correo);
				 },
				});
	   }
	   
	  
	   function relateCiToSoft(data)
	   {
		   //get field correo
		   
		   
		  getDataMail(data);
		   console.log(datamail);
		  
		   
		   $.ajax({
				timeout: 48000,
				url : urlBase + '/index/index',
				async:true,
				type: "POST",
				dataType : "html",
				data:{tipo:"soft",software:datamail},			
				success:function(data){
					$('body').html('');
					$('body').append(data);
				},
			    	error:function(data) { $.notify('failed' + data);
				 },
			
			
				});	
	   }
	    
	   
	   /**
	    * Refresh mail parser area
	    */
		function refreshSpin(){
			$("#spinrefresh").click(function(){

				 
			       //ajax rawdata
				    $.ajax({
						timeout: 48000,
						url : urlBase + '/index/rawdata',
						async:false,
						type: "POST",
						dataType : "text",

						
						success:function(rawdata){
							//console.log(dataret);
							//console.log(rawdata);
							$('#rawdatadiv').html(rawdata);
							//$('#rawdatadiv').toggle('slow');
					
					 	},
						error:function(data) { $.notify('failed' + data);
						 },
					
						});	 	
			 
					});
			}
		
		
	    function gotoRawData()
	    {
	        console.log("gotoRawData");
	       //ajax rawdata
		    $.ajax({
				timeout: 48000,
				url : urlBase + '/index/rawdata',
				async:false,
				type: "POST",
				dataType : "text",

				
				success:function(rawdata){
					
					$('#rawdatadiv').html(rawdata);
					$('#rawdatadiv').toggle('slow');
					$('input[aria-controls="tblcerts"]').css('height','10px !important');
			
			 	},
			    	error:function(data) { $.notify('failed' + data);
				 },
			
			
				});	 	
	    }