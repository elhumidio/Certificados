 /* @author Damián Esteban Blanc Perez - damian.blanc@t-systems.es
 /* @version 1.0 -09/03/2018
 */ 

function copyToClipboard()
{
	data = prepareDataForCsvOrClipboard();
 
 	alert(JSON.stringify(data));	
	/*var pasteData ="";
 	
 	var dummy = document.createElement("input");
    document.body.appendChild(dummy);
    $(dummy).css('display','none');
    dummy.setAttribute("id", "dummy_id");
    console.log(JSON.stringify(CERT.values.datatable));
    document.getElementById("dummy_id").value= JSON.stringify(data);
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);*/

    /*var text = "Example text to appear on clipboard";
navigator.clipboard.writeText(text).then(function() {
  console.log('Async: Copying to clipboard was successful!');
}, function(err) {
//  console.error('Async: Could not copy text: ', err);*/
//});*/

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
                                        console.log();
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

    //  console.log(JSON.parse(values));
    console.log(est);


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