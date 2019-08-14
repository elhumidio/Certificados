 /* @author Damián Esteban Blanc Perez - damian.blanc@t-systems.es
 /* @version 1.0 -09/03/2018
 */ 
 var urlBase=  '/cert';
    so = [];
    gp = [];
    cliente = [];
    entorno = [];
    searchMultifields = [];
 function initLoadArrayHeadFilters(data)
{

    /*LOAD SELECT HEADERS FILTERS*/
    so.length       = 0;
    gp.length       = 0;
    cliente.length  = 0;
    entorno.length  = 0;
    
    for (var i = 0; i < data.length; i++) {
        //console.log(data[i]);
        if(so.indexOf(data[i]["Sistema Operativo"]) == -1)
            so.push(data[i]["Sistema Operativo"]);
        if(gp.indexOf(data[i]["Grupo Propietario"]) == -1)
            gp.push(data[i]["Grupo Propietario"]);
        if(cliente.indexOf(data[i].Cliente) == -1)
            cliente.push(data[i].Cliente);
        if(entorno.indexOf(data[i].Entorno) == -1)
            entorno.push(data[i].Entorno);

    }
}




function initLoadHeadFilters()
{
        /*CARGA DE SELECTS FILTROS*/
    $("#slct_SO").find('option').not(':first').remove();    
    $("#slct_GrpoProp").find('option').not(':first').remove();    
    $("#slct_Cliente").find('option').not(':first').remove();    
    $("#slct_Entorno").find('option').not(':first').remove();    

    for (var i = 0; i < so.length; i++) {
        if(!! so[i])
            $("#slct_SO").append('<option value="so|' + so[i] + '">' + so[i] + '</option>');
    }

    for (var i = 0; i < gp.length; i++) {
        if(!! gp[i])
            $("#slct_GrpoProp").append('<option value="gp|' + gp[i] + '">' + gp[i] + '</option>');
    }
    
    for (var i = 0; i < cliente.length; i++) {
        if(!! cliente[i])
            $("#slct_Cliente").append('<option value="cli|' + cliente[i] + '">' + cliente[i] + '</option>');
    }

    for (var i = 0; i < entorno.length; i++) {
        if(!! entorno[i])
            $("#slct_Entorno").append('<option value="ent|' + entorno[i] + '">' + entorno[i] + '</option>');
    }
 console.log("DATOS DE SESSION");
    
    var parsedsession = JSON.parse($("#idsession").val());
    var parsedfilters = JSON.parse(parsedsession.filters);
    var prefijocli = "";
    if(!!parsedfilters)
    {

        //set selects with values from session
            for (var key in parsedfilters) {
                console.log("value " + parsedfilters[key] + " is #" + key); // "User john is #234"
                if(key == "slct_Cliente")   
                //$("#" + key).val(parsedfilters[key]).find("option[text=' + parsedfilters[key] + ']").attr("selected", true);
                    $('#' + key ).val("cli|" + parsedfilters[key]).trigger('change');
                if(key == "slct_SO")
                    $('#' + key ).val("so|" + parsedfilters[key]).trigger('change');
                if(key == "slct_GrpoProp")
                    $('#' + key ).val("gp|" + parsedfilters[key]).trigger('change');
                if(key == "slct_Entorno")
                    $('#' + key ).val("ent|" + parsedfilters[key]).trigger('change');
            }

    }
    
}


    function hasFilter(searchMultifields,obj)
    {
        var compare = false;
        for (var i = 0; i < searchMultifields.length; i++) {
            
            if(searchMultifields[i].name == obj.name){
                //$('.info').notify('Already exist a/n ' + obj.name + ' filter type',{position:'top center',className:'warning'});

                return true;
            }
                
        }
        
        return false;
    }



    function replaceValueFilter(searchMultifields,obj)
    {
        for (var i = 0; i < searchMultifields.length; i++) {
            
            if(searchMultifields[i].name == obj.name){
                //$('.info').notify('Already exist a/n ' + obj.name + ' filter type',{position:'top center',className:'warning'});
                searchMultifields[i].val = obj.val.trim();
                return searchMultifields;
            
            }
                
        }
    }

function sendMailQuery(link)
{

    

         $.ajax({
            type: 'POST',
            timeout:88800,
            data:{link:link},
            url: urlBase + '/ajax/sendmail', 
            success:function(d){
                $('#divprov').hide();
                
            },
            error:function(){
                  $('#divprov').hide();
           alert("Error sending mail");
            }

             
        });


}


 var dataFiltered = [];
function refreshFiltersFilteredData()
{
    dataFiltered.length = 0;
        
        var filteredrows = $("#tblQuery").dataTable().$('tr', {"filter": "applied"});
   // console.log("filteredrows");
   // console.log(filteredrows);
        
        item = {};
        for(var i = 0; i < filteredrows.length; i++)
        {
            
                
                for(var c = 0; c < filteredrows[i].cells.length; c++)
                {
                 //   console.log(filteredrows[i].cells[c].innerHTML);
                    
                    switch(c){

                            case 1:
                            item['Sistema Operativo'] = filteredrows[i].cells[c].innerHTML;
                            break;
                            case 2:
                            item['Sala'] = filteredrows[i].cells[c].innerHTML;
                            break;
                            case 3:
                            item['Servidor'] = filteredrows[i].cells[c].innerHTML;
                            break;
                            case 4:
                            item['Tipo'] = filteredrows[i].cells[c].innerHTML;
                            break;
                            case 5:
                            item['Tec. Virtualización'] = filteredrows[i].cells[c].innerHTML;
                            break;
                            case 6:
                            item['Cliente'] = filteredrows[i].cells[c].innerHTML;
                            break;
                            case 7:
                            item['Servicio'] = filteredrows[i].cells[c].innerHTML;
                            break;
                            case 8:
                            item['SubServicio'] = filteredrows[i].cells[c].innerHTML;
                            break;
                            case 9:
                            item['State'] = filteredrows[i].cells[c].innerHTML;
                            break;
                            case 10:
                            item['Entorno'] = filteredrows[i].cells[c].innerHTML;
                            break;
                            case 11:
                            item['Propietario'] = filteredrows[i].cells[c].innerHTML;
                            break;
                            case 12:
                            item['Grupo Propietario'] = filteredrows[i].cells[c].innerHTML;
                            break;
                            case 13:
                            item['Software'] = filteredrows[i].cells[c].innerHTML;
                            break;
                            case 14:
                            item['Version'] = filteredrows[i].cells[c].innerHTML;
                            break;
                        case 17:
                        item['SI'] = filteredrows[i].cells[c].innerHTML;

                    }


                }

                dataFiltered.push(item);
            

            
        }
    //initLoadArrayHeadFilters(dataFiltered);
    //initLoadHeadFilters();
//console.log(dataFiltered);
}

 function clearfilter(data){
     var options = {};
     $( "#" + data.id ).effect( "bounce", options, 200);
   // console.log("id DIV: "+ data.id);
    var idselect = "slct" + data.id.split('_')[1];

    //console.log("idselect: " + idselect);
    //console.log($("#" + idselect).val());
    //alert(data); searchMultifields
    var index = -1;
    for(var a = 0; a < searchMultifields.length; a++)
    {
        if(searchMultifields[a].name == $("#" + idselect).val().split('_')[0])
            index = a;
    }
    searchMultifields.splice(index,1);

    var searchValue = "";
        for(var a = 0; a < searchMultifields.length; a++)
        {
            searchValue += searchMultifields[a].val + " ";
        }

        CERT.values.queryResult.fnFilter(searchValue);


        
        $("#" + idselect).prop('selectedIndex', 0);
}

 function clearfilterFromSelect(data){
     var options = {};
     //$( "#" + data.id ).effect( "bounce", options, 200);
 //   console.log("this: "+$(data).attr('id'));
    var idselect = $(data).attr('id');
    
   // console.log("idselect: " + idselect);
   // console.log($("#" + idselect).val());
    //alert(data); searchMultifields
    var index = -1;
    for(var a = 0; a < searchMultifields.length; a++)
    {
        if(searchMultifields[a].name == $("#" + idselect).val().split('_')[0])
            index = a;
    }
    searchMultifields.splice(index,1);

    var searchValue = "";
        for(var a = 0; a < searchMultifields.length; a++)
        {
            searchValue += searchMultifields[a].val + " ";
        }

        CERT.values.queryResult.fnFilter(searchValue);


        
        $("#" + idselect).prop('selectedIndex', 0);
}


	/**
	 * Relates and persist data from servers and advices
	 */
	function relateCIAdviceVista(id)
	{
		idAdvice = $('#idAdvice').val();
		//get data from datatable
		
		
		var table = $('#tblQuery').DataTable();
		
		var data = Array();
		var table = $('#tblQuery').dataTable();
			$(table.fnGetNodes()).each(function(i, v){
        //$("#tablapreJournal tr").each(function(i, v){
            data[i] = Array();
            $(this).children('td').each(function(ii, vv){
                if($(this).children().hasClass('ellipsis'))
                {
                    data[i][ii] = $(this).children('span').attr("title") 
                } else {
                    data[i][ii] = $(this).text();
                }
            }); // #>DBLANC solo recoge los de la primera pagina 
        })
       
					
        $.ajax({
            type: 'POST',
            timeout:88800,
            url: urlBase + '/index/relateciadvice', 
            data: { data: data,id:id}})
            .done(function( data1 ) {
             
        });
		
	}


    function saveQueryPow()
    {

            var sint =  $('#SALIDA_INTERNET').prop('checked');
            var nosint = $('#NOSALIDA_INTERNET').prop('checked');
            var si = sint == true && nosint == false ? "sint" : sint == false && nosint == true ? "nosint" : sint == true && nosint == true ? "siboth" : "sierror";
        
            if(si == "sierror")
            {
                $('#divOpciones').notify("Must check at least one checkbox",{position:'top left',className:'warning'});

            
            }
            var queryname = $('#txtQueryName').val();
            //if(!CERT.values.editquery)
            saveQuery();
            //console.log(CERT.values.editquery)
            if(CERT.values.editquery)
            {
                //console.log("EDIT");
                updateQuery(si);
                
                //CERT.values.editquery = false;
                return false;

            }

            if($('.txtSofVers').val() != "")
            {               
                                    $('#divSaveQuery').dialog({
                                    autoOpen: true,
                                    title:"Save Query",
                                    modal: true, 
                                    width:460,
                                    height:230,
                                      buttons: [
                                                {
                                                    text: "Save",
                                                    click: function() {
                                                            var queryname = $('#txtQueryName').val();
                                                            public = $('#chkpublic').prop('checked') ? 1 : 0;
                                                    
                                                    
                                                                $.ajax({
                                                                    timeout: 48000,
                                                                    url : urlBase + '/ajax/savequery',
                                                                    async:false,
                                                                    type: "POST",
                                                                    dataType : "json",

                                                                    data:{queryname:queryname,serializedvalues:CERT.values.serializedValues,softversions:CERT.values.softVersionsArray,union:CERT.values.union,si:si,andor:CERT.values.andOr,publicpar:public},
                                                                    success:function(dataret){
                                                                        //console.log(dataret);
                                                                    if(dataret.split("_")[0] == "KONAME"){
                                                                        
                                                                        $('#btnSaveQuery').notify('The name ' + dataret.split("_")[1] + ' is already in use\nPlease choose a different name',{position:'top center',className:'error'});

                                                                    }
                                                                    else {
                                                                        $('#btnSaveQuery').notify('Query successfully saved',{position:'top center',className:'success'});
                                                                        $('.divDynamicTable').css('background-color','white');
                                                                        
                                                                    }
                                                                    },
                                                                    error:function(dataret) { $.notify('failed' + dataret);
                                                                     },
                                                                
                                                                    }); 


                                                        $( this ).dialog( "close" );
                                                        $('#txtQueryName').val('');

                                                    }
                                                }
                                                ]
                                            

                                })

                                }
                            else{
                                    $('.txtSofVers').css('background-color','#ff9999');
                                    $('.txtSofVers').attr('placeholder','This field is required');

                            }

            
        

    }

  


