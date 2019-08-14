 /* @author Damián Esteban Blanc Perez - damian.blanc@t-systems.es
 /* @version 1.0 -09/03/2018
 */ 
 var urlBase=  '/cert';

function copyToClipboard()
{
	data = prepareDataForCsvOrClipboard();
 
 	//alert(JSON.stringify(data));	
	  var dummy = document.createElement("input");

  // Add it to the document
  document.body.appendChild(dummy);

  // Set its ID
  dummy.setAttribute("id", "dummy_id");

  // Output the array into it
  document.getElementById("dummy_id").value = "\ufeff"+convertArrayOfObjectsToCSV({ data:CERT.values.datatable});
    
  // Select it
  dummy.select();

  // Copy its contents
  document.execCommand("copy");

  // Remove it as its not needed anymore
  document.body.removeChild(dummy);

}

function  initFiltersValues()
{

    $.ajax({
                            type: 'POST',
                            async:true,
                            timeout:88800,
                            url: urlBase + '/ajax/getfilters', 
                            success:function(d){
                               
                               setTimeout(function(){ loadFilterSelects(d); }, 2000);

                            },
                            error:function(){
                            },
                            complete:function(){

                              
                            }
                        });
    


}

function loadFilterSelects(d)
{
  //console.log(d);
    var parsedData = JSON.parse(d);
    $("#slct_SO").find('option').not(':first').remove();    
    $("#slct_GrpoProp").find('option').not(':first').remove();    
    $("#slct_Cliente").find('option').not(':first').remove();    
    $("#slct_Entorno").find('option').not(':first').remove();    

       for (var i = 0; i < parsedData.CLIENTES.length; i++) {
        if(!! parsedData.CLIENTES[i] && !! parsedData.CLIENTES[i].CLIENTE ){


            $("#slct_Cliente").append('<option value="cli|' + parsedData.CLIENTES[i].CLIENTE + '">' + parsedData.CLIENTES[i].CLIENTE + '</option>');
        }
          
        }

        for (var i = 0; i < parsedData.ENTORNO.length; i++) {
            if(!! parsedData.ENTORNO[i] && parsedData.ENTORNO[i].ENTORNO)
                $("#slct_Entorno").append('<option value="ent|' + parsedData.ENTORNO[i].ENTORNO + '">' + parsedData.ENTORNO[i].ENTORNO + '</option>');
        }

        for (var i = 0; i < parsedData.GrupoPropietario.length; i++) {
            if(!! parsedData.GrupoPropietario[i] && parsedData.GrupoPropietario[i].GRUPO_PROPIETARIO)
                $("#slct_GrpoProp").append('<option value="gp|' + parsedData.GrupoPropietario[i].GRUPO_PROPIETARIO + '">' + parsedData.GrupoPropietario[i].GRUPO_PROPIETARIO + '</option>');
        }
        if(!! parsedData.SO)
        for (var i = 0; i < parsedData.SO.length; i++) {
          
            if(!! parsedData.SO[i] && parsedData.SO[i].SO)
                $("#slct_SO").append('<option value="so|' + parsedData.SO[i].SO + '">' + parsedData.SO[i].SO + '</option>');
        }

}


  function saveQueryFromResults(){

    var parsedSession       = JSON.parse($('#idsession').val());
    var diversevalues       = parsedSession.andor + "|" + parsedSession.union + "|" + parsedSession.si;
    var serializedvalues    = parsedSession.values;
    var softversions        = parsedSession.softversionsrecover;
    var filters = {
        slct_SO:$('#slct_SO').val().split("|")[1],slct_GrpoProp:$('#slct_GrpoProp').val().split("|")[1],slct_Cliente:$('#slct_Cliente').val().split("|")[1],slct_Entorno:$('#slct_Entorno').val().split("|")[1]
    };
    var queryid             = parsedSession.queryid;

        $('#divdialogsavequery').dialog(
            {
                                    autoOpen: true,
                                    title:"Save query",
                                    modal: true, 
                                    minWidth:400,
                                    minHeight:200,
                                    open:function(){
                                    },
                                    close:function(){
                                     
                                    },  
                                    buttons:{
                                       "Save":function(){
                                        var public = $('#chkpublic').prop('checked') ? 1 : 0;
                                        
                                        if(!!parsedSession.queryid){
                                           var conf =  confirm("Esta búsqueda ya está guardada, desea enviarla por mail?");
                                           if(conf)
                                           {
                                                var link   = parsedSession.queryid; 
                                                sendMail(link);
                                                $('#divdialogsavequery').dialog('close');
                                           }
                                            return false;
                                        }
                                                var queryname   = $('#txtqueryname').val(); 
                                                ajaxSaveQuery(diversevalues,serializedvalues,softversions,queryname,public,filters,false);
                                                $('#divdialogsavequery').dialog('close');

                                       },
                                       "Save and send mail":function(){
                                           var public = $('#chkpublic').prop('checked') ? 1 : 0;
                                           var solomail = false;
                                           var conf = false;
                                           if(!!parsedSession.queryid)
                                           {
                                             conf = confirm("Esta búsqueda ya está guardada, desea enviarla por mail?");
                                             if(conf){

                                                        var link   = parsedSession.queryid; 
                                                        sendMail(link);
                                                        $('#divdialogsavequery').dialog('close');
                                             }
                                             else{
                                                $('#divdialogsavequery').dialog('close');
                                                return false;
                                             }

                                           } 
                                           var queryname   = $('#txtqueryname').val(); 
                                         
                                           ajaxSaveQuery(diversevalues,serializedvalues,softversions,queryname,public,filters,true);
                               
                                       } 

                                    }    

                                }

            );

    }

    function sendMail(id)
    {
                        $.ajax({
                            type: 'POST',
                            async:false,
                            timeout:88800,
                            data:{link:id},
                            url: urlBase + '/ajax/sendmail', 
                            success:function(d){
                                $('#divdialogsavequery').dialog('close');
                            },
                            error:function(){
                            }
                        });


    }


    function ajaxSaveQuery(diversevalues,serializedvalues,softversions,queryname,public,filters,send)
    {
            $.ajax({
            type: 'POST',
            async:false,
            timeout:88800,
            data:{diversevalues:diversevalues,serializedvalues:serializedvalues,softversions:softversions,namequery:queryname,public:public,filters:filters},
            url: urlBase + '/ajax/savequeryfromresults', 
            success:function(d){
                queryid = d;
                CERT.values.editquery = true;
                if(send)
                {
                   sendMail(queryid) 
                }
                
            },
            error:function(){
               
           
            }

             
        });
    }


        /*MUESTRA EL SOFTWARE INTEGRADO A UN SERVIDOR*/
     function infoServer(est){

    var servidor = $(est).map(function(){
        return $(est).attr('id');
    }).get();

                    
            $('#divTablaSoftQuery').html(preloader).dialog({
                                    autoOpen: true,
                                    title:"Software integrated to server " + servidor,
                                    modal: true, 
                                    minWidth:600,
                                    minHeight:400,
                                    open:function(){
                                        loadDialogInfoServer(servidor);
                                    },
                                    close:function(){

                                        //$("#divTablaSoftQuery").remove();    
                                        //$("#tblSoftServer").remove();                                    
                                    }
                                            

                                });

        
    
    }




    function loadDialogInfoServer(servidor)
    {

        $.ajax({
        timeout: 48000,
        url : urlBase + '/index/vistasoft',
        async:true,
        type: "POST",
        
        data:{servidor:servidor[0]},
        success:function(d){
            $("#divTablaSoftQuery").html('').append(d);
        },
        error:function(jqxhr, settings, ex) { alert('failed, ' + ex);},
            
        });
    }