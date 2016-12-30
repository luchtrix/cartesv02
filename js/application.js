var app = angular.module('secreto', []);
var url_server = 'http://192.168.0.104:3001/';
//var url_server = 'http://192.168.0.32:3001/';
var socket = io.connect(url_server);

$(document).ready(function (){
    //Esconder el buscador
    $("#buscador").hide();

	$("#new").hide();
	$("#editar").hide();
	$("#cancelar").hide();
    $("#sup").hide();
    $("#confirmInvit").hide();
    $("#oneAcuerdo").hide();
    $("#eliminarAcuerdo").hide();
    $("#acordar").hide();
    $("#cerrar").hide();
    $("#editOrden").hide();
    $("#eliminarOrden").hide();
	//$('select').material_select();
    $('.mdh-toggle-search').click(function() {
    // No search bar is currently shown
        if ($(this).find('i').text() == 'search') {
            $("#buscador").show();
            $("#hdrbtn").hide();
            $(this).find('i').text('cancel');
            $(this).removeClass('mdl-cell--hide-tablet mdl-cell--hide-desktop'); // Ensures the close button doesn't disappear if the screen is resized.
            $('.mdl-layout__drawer-button, .mdl-layout-title, .mdl-badge, .mdl-layout-spacer').hide();
            $('.mdl-layout__header-row').css('padding-left', '16px'); // Remove margin that used to hold the menu button
            $('.mdh-expandable-search').removeClass('mdl-cell--hide-phone').css('margin', '0 16px 0 0');
        }// Search bar is currently showing
        else 
        {
            $("#buscador").hide();
            $("#hdrbtn").show();
            $(this).find('i').text('search');
            //$(this).addClass('mdl-cell--hide-tablet mdl-cell--hide-desktop');
            $('.mdl-layout__drawer-button, .mdl-layout-title, .mdl-badge, .mdl-layout-spacer').show();
            $('.mdl-layout__header-row').css('padding-left', '');
            $('.mdh-expandable-search').addClass('mdl-cell--hide-phone').css('margin', '0 50px');
        }
    });
});

app.controller('secretarioCtrl', ['$scope', '$http', function($scope, $http){
    $('.collapsible').collapsible();
	//alert("controlador principal "+$location.path())
	//----------------------------------------------------
    var usuario = localStorage.getItem("usuario")///----------------------------------nuevo|
    $scope.usuario = JSON.parse(usuario);// toda la informacion acerca del usuario
    var empresa = $scope.usuario.EMPIDC;//id de la empresa a la que esta relacionado       |
    $scope.bloqueado = false;
    $scope.diasR = 0;
    // ------------------------------------------------------------------------------------
    $scope.oneAcuerdo = [];
    //algunas acciones antes de hacer peticiones a nuestro servidor
    $("#hideForm").click(function(){
        //alert("1");
        $("#new").hide();
        $("#main").show(); 
    });
    $("#showForm").click(function(){
        //alert("2.1");
        $("#new").show();
        $("#main").hide(); 
        //$("#content").val("");
    });

    /*$("#showEdit").click(function(){
        //alert("2.1");
        $("#editar").show();
        $("#main").hide(); 
        //$("#content").val("");
    });*/
    $("#hideEdit").click(function(){
        //alert("1");
        $("#editar").hide();
        $("#main").show(); 
    });
    
    /*$("#showCancel").click(function(){
        //alert("2.1");
        $("#cancelar").show();
        $("#main").hide(); 
        //$("#content").val("");
    });*/
    $("#hideCancel").click(function(){
        //alert("1");
        $("#cancelar").hide();
        $("#main").show(); 
    });

    $("#hideSup").click(function(){
        //alert("1");
        //$scope.invitados = [];
        $("#sup").hide();
        $("#main").show(); 
    });

    $("#hideConfirm").click(function(){
        //alert("1");
        //$scope.invitados = [];
        $("#confirmInvit").hide(); 
        $("#sup").show();
    });

    $("#hideOneAcuerdo").click(function(){
        $scope.oneAcuerdo = [];
        $("#oneAcuerdo").hide(); 
        $("#main").show();
    });

    $("#hideEliminarAc").click(function(){
        $("#eliminarAcuerdo").hide(); 
        $("#oneAcuerdo").show();
    });

    $("#hideAcordar").click(function(){
        $("#acordar").hide(); 
        $("#main").show();
    });

    $("#hideCerrar").click(function(){
        $("#cerrar").hide(); 
        $("#main").show();
    });

    $("#hideEditO").click(function(){
        $scope.oneOrden = [];
        $("#editOrden").hide(); 
        $("#main").show();
    });

    $("#hideEliminarO").click(function(){
        $scope.oneOrden = [];
        $("#eliminarOrden").hide(); 
        $("#main").show();
    });

    // -------
    getJuntas();

    function getJuntas() {
    	$scope.juntas = [];
        $http.get(url_server+"junta/listar/"+empresa).success(function(response) {
            if(response.status == "OK") {
                //$scope.juntas = response.data;
                for (var i = 0 ; i < response.data.length ; i++) {
                	if(response.data[i].JUNIDE == $scope.usuario._id){
                		$scope.juntas.push(response.data[i]);
                	}
                }
            }
        })
	}

	//nueva junta
	$scope.nuevaJunta = function() {
        $("#msjError").empty();
        if($("#fecha").val() == ""){
            $("#msjError").append('<div class="alert alert-danger"><i class="fa fa-calendar"></i> Seleccione una Fecha para la junta</div>');
            return;
        }

        $scope.juntaN.JUNFEC = $("#fecha").val();
        /*$scope.juntaN.JUTHOR = getHora();*/
        //agregar tambien la fecha (en el momento exacto) en la que se registro la junta
        var hoy = "";
        var datos = [];

        hoy = getToday();
        datos = hoy.split("/");
        //var day = datos[1] - 1;
        //var fecha_register = new Date(datos[2],day,datos[0]).toISOString();//mes 
        var fRegistro = new Date(datos[2],(datos[1]-1),datos[0]).toISOString();//mes 
        $scope.juntaN.JUNCRE = fRegistro;
        //NUEVAs LINEAs----------------------------
        $scope.juntaN.JUNIDE = $scope.usuario._id;        
        //$scope.juntaN.JUNCAN = '';
        //------------------------------------------
        datos = [];
        //la fecha del acuerdo se transforma asi, esto para poder hacer los reportes, buscando mas facil la info. en un rango de datos
        //var fecha = $scope.juntaN.JUNFEC;
        datos = $scope.juntaN.JUNFEC.split("/");
        //var dia = datII[1] - 1;
        //var fechaISO = new Date(datII[2],dia,datII[0]).toISOString();//mes 
        var fechaISO = new Date(datos[2],(datos[1]-1),datos[0]).toISOString();//mes 
        
        $scope.juntaN.JUNRANF = fechaISO;
        $scope.juntaN.JUNIDC = empresa;

        // Hacemos un POST a la API para dar de alta nuestro nuevo ToDo
        $http.post(url_server+"junta/crear", $scope.juntaN).success(function(response) {
            if(response.status === "OK") { // Si nos devuelve un OK la API...
                Materialize.toast("Junta creada exitosamente!", 3500);
                $scope.juntaN = {}; // Limpiamos el scope
                getJuntas();
            	$("#new").hide();
        		$("#main").show();  
            }
        });
    }

    $scope.viewForm = function(){
        $("#new").show();
        $("#main").hide();                    
    }

    $scope.viewEdit = function(){
        $("#editar").show();
        $("#main").hide(); 
    }

    $scope.viewCancel = function(){
        $("#cancelar").show();
        $("#main").hide(); 
    }

    $scope.invitSup = function(){
        getInvitados();
        $("#sup").show();
        $("#main").hide(); 
    }

    $scope.confirm = function(){
        $("#confirmInvit").show();
        $("#sup").hide(); 
    }

    $scope.viewOneAcuerdo = function(agreement){
        $scope.oneAcuerdo = agreement;
        $("#oneAcuerdo").show();
        $("#main").hide();    
    }

    $scope.viewEliminarAc = function(){
        $("#eliminarAcuerdo").show();
        $("#oneAcuerdo").hide();       
    }

    $scope.viewAcordar = function(){
        $("#acordar").show();
        $("#main").hide();          
    }

    $scope.viewCerrar = function(){
        $("#cerrar").show();
        $("#main").hide();          
    }

    $scope.viewEditarOrden = function(data){
        //$scope.oneOrden = [];
        $scope.oneOrden = data;
        $scope.totalP = 0;
        for (var i = 0 ; i < $scope.allAcuerdosByEmpresa.length ; i++) {
            if($scope.allAcuerdosByEmpresa[i].ACUPUN == $scope.oneOrden._id){
                $scope.totalP++;
            }
        }
        $("#editOrden").show();
        $("#main").hide();             
    }

    $scope.viewEliminarOrden = function(data){
        //$scope.oneOrden = [];
        $scope.oneOrden = data;
        $scope.totalP = 0;
        for (var i = 0 ; i < $scope.allAcuerdosByEmpresa.length ; i++) {
            if($scope.allAcuerdosByEmpresa[i].ACUPUN == $scope.oneOrden._id){
                $scope.totalP++;
            }
        }
        $("#eliminarOrden").show();
        $("#main").hide();             
    }

    $scope.updateJunta = function(j) {

        var dat = j.JUNFEC;
        var datII = dat.split("/");
        var dia = datII[1] - 1;
        var fechaISO = new Date(datII[2],dia,datII[0]).toISOString();//mes 
        //$scope.junta.fechaJ = fechaISO;
        j.JUNRANF = fechaISO;

        var junta = j;
        junta.id = junta._id; // Pasamos la _id a id para mayor comodidad del lado del servidor a manejar el dato.
        delete junta._id; // Lo borramos para evitar posibles intentos de modificación de un ID en la base de datos

        // Hacemos una petición PUT para hacer el update a un documento de la base de datos.
        $http.put(url_server+"junta/actualizar", junta).success(function(response) {
            if(response.status === "OK") {
            	Materialize.toast("Junta modificada exitosamente!", 3500);
                getJuntaUnica(); // Actualizamos la lista de ToDo's
                $("#editar").hide();
        		$("#main").show(); 
            }
        });
	}

	//Cancelar una junta
	$scope.cancelJunta = function(id){
		//var idCancel = "#"+id+"-Cancel";
        /*$http.get(url_server+"junta/find/"+id).success(function(response) {
            if(response.type) { // Si nos devuelve un OK la API...
                var jnt = response.data;
                $http.get(url_server+"invit/findByJunta/"+id).success(function(response) {
                    if(response.status == "OK") { // Si nos devuelve un OK la API...
                        for (var i = 0; i < response.data.length; i++){
                            socket.emit("cancel_junta", id, response.data[i].INVEMP, jnt[0].JUNNUM);
                        }
                    }
                });
                total_juntas()
            }
        });*/

        $http.get(url_server+'junta/actualizarStatus', { params : {junta: id, status:'F'}}).success(function(datos){//A ---> Acordado --- cafe
            if(datos.type){
            	Materialize.toast("Junta cancelada exitosamente!", 3500);
                //getJuntas(); // Actualizamos la lista de ToDo's
                getJuntaUnica()
                $("#cancelar").hide();
        		$("#main").show(); 
            }
        });
        //getJuntas();
	}

    
    //funcion que obtiene el parametro que esta en la url...si existe
    function getUrlParameter(sParam) {
        //alert("sParam "+sParam)
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };
	
    var id = getUrlParameter('id');//capturando id de la materia en la url
    var datos = [];
    var idj = "";
    var ido = "";
    
    if(id != undefined){
        datos = id.split("/");
        idj = datos[0];
        ido = datos[1];
    }

    //alert("idj = "+idj+" ---> ido = "+ido);

    $scope.invitados = [];

    if (idj != "") {
    //if (idj != undefined || idj != "") {
    	getJuntaUnica();
        getOrdenByJunta();
        getDirectivos();
        getAcuerdoByJunta();
    }

    if(ido != ""){
        //alert("Vamos a ver un punto de la orden específico")
        getOrdenUnica();
        getAcuerdoByOrden();
    }


	// Método para obtener información de una junta específica
	function getJuntaUnica() {
        $scope.consecutivoOrden = 0;
		$http.get(url_server+"junta/find/"+idj).success(function(response) {
			if(response.type) { // Si nos devuelve un OK la API...
            	$scope.junta = response.data[0];
                $scope.diasR = restaFechas(getToday(),$scope.junta.JUNFEC);
                //alert("diasRestantes "+diasRestantes);
                if($scope.diasR <= 0){//Esto significar que la junta es hoy, y que a partir de hoy se pueden tomar los acuerdos que se tienen o llegaron a la junta en su debido momento
                    $scope.bloqueado = true;
                }
                //para obtener el consecutivo para los puntos de la orden del dia
                $http.get(url_server+"orden/allOrden", { params : {identificador: response.data[0]._id}}).success(function(resp){
                    //var indice = resp.data;
                    //nuevaClave = 0;
                    if (resp.data.length == 0) {
                    //if (indice == 0) {
                        $scope.consecutivoOrden = 1;
                        //nuevaClave = 1;
                    }else{
                        $scope.consecutivoOrden = conteoPuntos(resp.data);
                        //nuevaClave = conteoPuntos(resp.data);
                        //nuevaClave = getNewIndice(resp.data);
                    }
                    //alert("nuevaClave "+$scope.consecutivoOrden);
                    //$scope.consecutivoOrden = nuevaClave;
                });
			}
		});
	}

    // ******** Orden del dia ******************
    $scope.nuevaOrden = function() {
        //alert("aaa");
        $scope.ordenN.ORDSTA = "C";
        //$scope.ordenN.ORDSTA = "En Proceso";
        //$scope.ordenN.ORDEMP = empresa;
        $scope.ordenN.ORDIDC = empresa;
        //$scope.ordenN.CLVJUT = document.getElementById('id').value;
        $scope.ordenN.ORDJUN = idj;
        //$scope.ordenN.ORDCON = nuevaClave;
        //$scope.ordenN.ORDCON = 1;
        $scope.ordenN.ORDCON = $scope.consecutivoOrden;
        // Hacemos un POST a la API para dar de alta nuestro nuevo ToDo
        $http.post(url_server+"orden/crear", $scope.ordenN).success(function(response) {
            if(response.status === "OK") { // Si nos devuelve un OK la API...
                //alert("Ok");
                //alert("response "+response.data._id);
                if($scope.junta.STATORD == 0){//Si es la primera vez actualizamos
                    var idNuevo = {
                        id:idj,
                        bandera:0
                    }
                    //var idNuevo.id = response.data._id;
                    $http.put(url_server+"junta/actualizarEstado",idNuevo).success(function(response){
                        if(response.status == "OK"){
                            //alert("1");
                            Materialize.toast("Punto del orden del dia creado exitosamente 1!", 3500);
                            $scope.ordenN = {}; // Limpiamos el scope
                            getJuntaUnica();
                            getOrdenByJunta();
                            $("#new").hide();
                            $("#main").show(); 
                        }
                    });
                }else{
                    Materialize.toast("Punto del orden del dia creado exitosamente 2!", 3500);
                    $scope.ordenN = {}; // Limpiamos el scope
                    getJuntaUnica();
                    getOrdenByJunta();
                    $("#new").hide();
                    $("#main").show(); 
                }
            }
        })
    }


    function getOrdenByJunta() {
        //para obtener toda la orden del dia (todos los puntos de la orden del dia) de una junta
        $http.get(url_server+"orden/byJunta/"+idj).success(function(response) {
            if (response.status == "OK") {
                $scope.listOrden = response.data;
                getAcuerdosForOrden(response.data);
            }
        })
    }

    function getAcuerdosForOrden(data){
        $scope.allAcuerdosByEmpresa = [];
        $http.get(url_server+"acuerdo/listar/"+empresa).success(function(response){
            var acuerdos_orden = [];
            for (var i = 0; i < data.length ; i++) {
                for (var j = 0; j < response.data.length; j++) {
                    if(response.data[j].ACUPUN == data[i]._id){
                        acuerdos_orden.push(response.data[j]);
                    }
                }
            };
            $scope.allAcuerdosByEmpresa = acuerdos_orden;
        });
    }

    /* Obtenemos a todos los directivos */
    function getDirectivos() {
        $http.get(url_server+"user/usuario/2/"+empresa).success(function(response) {
            if(response.type) { // Si nos devuelve un OK la API...
                $scope.directivos = response.data;
            }
        })
    }

    $scope.guests = function(idEmp, nomEmp){
        //alert($scope.junta.JUNNUM);
        //return;
        var data = {
            //empresa:empresa,
            INVIDC:empresa,
            INVJUN:idj,
            INVEMP:idEmp,
            INVJNO:$scope.junta.JUNMOT,
            INVEMN:nomEmp,
            INVFEC:$scope.junta.JUNFEC,
            INVHOR:$scope.junta.JUNHOR
        }

        var contador = 0;
        var bandera = 0;
        for (var i = 0 ; i < $scope.invitados.length ; i++) {
            if($scope.invitados[i].INVEMP == idEmp){
            //if($scope.invitados[i]._id == object._id){
                bandera = 1;
                $scope.invitados.splice(i,1);
            }else{
                contador++;
            }
        }
        
        if(bandera == 0 && (contador == $scope.invitados.length)){
            $scope.invitados.push(data);
        }
    }

    $scope.enviarInvitaciones = function(){
        //alert("Send Invitaciones");
        //alert("Termine de guardar los datos"); 
        for(i in $scope.invitados){
            socket.emit("nueva_junta", idj, $scope.invitados[i].INVEMP, $scope.junta.JUNMOT);
            $http.post(url_server+"invit/crear", $scope.invitados[i]).success(function(response) {
                //alert($scope.invitados[i].INVEMP)
                if(response.status === "OK") { // Si nos devuelve un OK la API...
                    console.log("Guardado con exito");
                }
            });
        }

        var data = {
            id:idj,
            bandera:1
        }
        //var idNuevo.id = response.data._id;
        $http.put(url_server+"junta/actualizarEstado",data).success(function(response){
            if(response.status == "OK"){
                console.log("Actualizacion de Estado de 0 a 1 exitosa idj "+idj+" len "+$scope.invitados.length);
                getJuntaUnica();
                getInvitados();
                Materialize.toast("Invitaciones enviadas exitosamente!", 3500);
                $("#confirmInvit").hide(); 
                $("#sup").show();
            }
        });

    }

    function getInvitados(){
        $scope.allInv = [];
        $http.get(url_server+"invit/findByJunta/"+idj).success(function(response) {
            if(response.status == "OK") { // Si nos devuelve un OK la API...
                $scope.allInv = response.data;
            }
        })
    }

    //Para un punto especifico de la orden del dia
    function getOrdenUnica() {
        //alert(idO);
        //para obtener los datos de un punto de la orden del dia en especifico
        $http.get(url_server+"orden/find/"+ido).success(function(response) {
            if(response.type) { // Si nos devuelve un OK la API...
                //alert("response "+response.data[0].ORDCON)
                if(response.data[0] != undefined){
                    //alert("no tiene nada")
                    $scope.orden = response.data[0];
                    //id = response.data[0].ORDJUN;
                    //alert("junta = "+id)
                    //getJuntaUnica();
                }
                //$scope.orden = response.data[0];
                //getDirectivos();
                //getJuntas();
            }else{
                console.log("ERROR en getOrdenUnica")
            }
        });
    }

    $scope.nuevoAcuerdo = function(){
        //alert("empresa "+empresa+" idJ "+id+" idO "+idO);
        $("#msjError").empty();
        $scope.acuerdoN.ACUIDC = empresa;
        //$scope.acuerdoN.ACUIDE = $scope.usuario._id;
        $scope.acuerdoN.ACUPUN = ido;
        $scope.acuerdoN.ACUJUN = idj;
        //$scope.acuerdoN.ACUSTA = 'A';//Asignada
        $scope.acuerdoN.ACUSTA = '';//Asignada
        $scope.acuerdoN.ACUENT = '';

        //alert("nuevo acuerdo");
        //var fec_limiteAcuerdo = $("#fecha").val();
        if ($("#fecha").val() == ""){
            //alert("->"+fec_limiteAcuerdo);
            $("#msjError").append('<div class="alert alert-danger"><i class="fa fa-calendar"></i> Seleccione una Fecha Limite</div>');
            return;
        }
        //alert(fec_junta);
        $scope.acuerdoN.ACUTIM = $("#fecha").val();
        //alert($scope.juntaN.JUNFEC);
        //la fecha del acuerdo se transforma asi, esto para poder hacer los reportes, buscando mas facil la info. en un rango de datos
        //var datos = $scope.acuerdoN.ACUTIM;
        var datos = $scope.acuerdoN.ACUTIM.split("/");
        //var dia = datII[1] - 1;
        var fechaISO = new Date(datos[2],(datos[1]-1),datos[0]).toISOString();//mes 
        //$scope.juntaN.fechaJ = fechaISO;
        $scope.acuerdoN.ACUFEC = fechaISO;
        $scope.acuerdoN.ACUST1 = 'C';//Azul --- en proceso
        $scope.acuerdoN.ACUST2 = 'C';//Azul --- en proceso
        $scope.acuerdoN.ACUCON = $scope.consecutivo;
        //$scope.acuerdoN.ACUCON = 1;
        // Hacemos un POST a la API para dar de alta nuestro nuevo ToDo
        $http.post(url_server+"acuerdo/crear", $scope.acuerdoN).success(function(response) {
            if(response.status === "OK") { // Si nos devuelve un OK la API...
                Materialize.toast("Se creo el acuerdo "+$scope.acuerdoN.ACUCON+"!", 3500);
                $scope.acuerdoN = {}; // Limpiamos el scope
                //getJuntaUnica();
                getAcuerdoByOrden();
                $("#new").hide();
                $("#main").show(); 
            }
        });

    }

    function getAcuerdoByOrden(){
        //alert("getAcuerdoByOrden "+ido);
        //if(idO != undefined){
        $http.get(url_server+"acuerdo/findByOrden/"+ido).success(function(response){
            if (response.type) {
                if (response.data.length == 0) {
                    nuevaClave = 1;
                }else{
                    nuevaClave = conteoAcuerdo(response.data);
                }
                $scope.acuerdoByOrden = response.data;
                //alert("nuevaClave "+nuevaClave+" scope "+$scope.acuerdoByOrden);
                $scope.consecutivo = nuevaClave;
            }else{
                console.log("Error en getAcuerdoByOrden");
            }           
        });
    //}
    }

     function getAcuerdoByJunta(){
        $scope.acuerdosByJunta = [];
        //alert("getAcuerdoByJunta");
        $http.get(url_server+"acuerdo/findByJunta/"+idj).success(function(response){
            if (response.type) {
                //$scope.tamAcuerdosByJunta = response.data.length;
                $scope.acuerdosByJunta = response.data;
            }else{
                console.log("Error en getAcuerdoByJunta");
            }
        });
    }

    $scope.eliminarAcuerdo = function(idA) {
        $http.delete(url_server+"acuerdo/eliminar", { params : {identificador: idA}}).success(function(response) {
            if(response.status === "OK") { // Si la API nos devuelve un OK...
                Materialize.toast("Acuerdo "+$scope.oneAcuerdo.ACUCON+" eliminado!", 3500);
                recorrerConsecutivo();
            }
        });
    }

    //funcion que actualiza los consectuivos de los acuerdos cuando uno es eliminado
    function recorrerConsecutivo(){
        $http.get(url_server+"acuerdo/findByOrden/"+ido).success(function(response){
            var datos = response.data;
            var indices = [];
            //var tam = response.data.length;
            if(response.data.length > 0){
                var j = 0;
                for( j = 0 ; j < response.data.length ; j++){
                    //indices.push(datos[j].ORDCON);1434
                    indices.push(datos[j].ACUCON);
                }
                //alert("indices "+indices)
                if(response.data.length == 1){
                    if(datos[0].ACUCON != 1){
                        updateIndices(datos[0],1);
                    }
                }else{
                    var index = 0;
                    var bandera = 0;
                    for(j = 0 ; j < response.data.length ; j++){
                        index = indices.indexOf((j+1));
                        if(index < 0){
                            //alert("No encontro a "+(j+1)+" consecutivo "+datos[j].ORDCON)
                            updateIndices(datos[j],(j+1));
                            bandera = 1;
                        }else{
                            //alert("Eencontro a "+(j+1)+" consecutivo "+datos[j].ORDCON)
                            if(bandera == 1){
                                //alert("se empezará actualizar todo man!")
                                updateIndices(datos[j],(j+1));
                            }
                        }
                    }
                }   
            }
            getAcuerdoByOrden();
            getOrdenUnica();
            $("#eliminarAcuerdo").hide();
            $("#main").show();
        });
    }

    function recorrerConsecutivoOrden(){
        var idJunta = $scope.junta._id;
        //alert("recorrerConsecutivo ---> "+idJunta);
        $http.get(url_server+"orden/allOrden", { params : {identificador: idJunta}}).success(function(response){
            //alert("entro")
            var datos = response.data;
            var indices = [];
            var tam = response.data.length;
            if(tam > 0){
                var j = 0;
                for( j = 0 ; j < tam ; j++){
                    indices.push(datos[j].ORDCON);
                }
                //alert("indices "+indices)
                if(tam == 1){
                    if(datos[0].ORDCON != 1){
                        updateIndicesOrden(datos[0],1);
                    }
                }else{
                    var index = 0;
                    var bandera = 0;
                    for(j = 0 ; j < tam ; j++){
                        index = indices.indexOf((j+1));
                        if(index < 0){
                            //alert("No encontro a "+(j+1)+" consecutivo "+datos[j].ORDCON)
                            updateIndicesOrden(datos[j],(j+1));
                            bandera = 1;
                        }else{
                            //alert("Eencontro a "+(j+1)+" consecutivo "+datos[j].ORDCON)
                            if(bandera == 1){
                                //alert("se empezará actualizar todo man!")
                                updateIndicesOrden(datos[j],(j+1));
                            }
                        }
                    }
                }   
            }
            getOrdenByJunta(); // Actualizamos la lista de ToDo's
            getJuntaUnica();
            $("#eliminarOrden").hide();
            $("#main").show();
        });
    }


    function updateIndices(datos,ind){
        //alert("updateIndices "+datos._id+" ind "+ind);
        $http.get(url_server+'acuerdo/actualizarConsecutivo', { params : {acuerdo: datos._id, consec:ind}}).success(function(datos){//A ---> Acordado --- cafe
            if(datos.type){
                console.log("Consecutivo Actualizado_A (Y)")
            }
        });
    }

    function updateIndicesOrden(datos,ind){
        $http.get(url_server+'orden/actualizarConsecutivo', { params : {orden: datos._id, consec:ind}}).success(function(datos){//A ---> Acordado --- cafe
            if(datos.type){
                console.log("Consecutivo Actualizado (Y)");
            }
        });
    }

    $scope.cerrarJunta = function(){
        var auxIdj = id.split("/");
        //alert("aa close "+id);
        for(var i = 0 ; i < $scope.listOrden.length ; i++){
            actualizarStatusOrden($scope.listOrden[i]._id,"O");//O es acordado
        }
        
        $http.get(url_server+'junta/actualizarStatus', { params : {junta: auxIdj[0], status:'O'}}).success(function(datos){//A ---> Acordado --- cafe
        //$http.get(url_server+'junta/actualizarStatus', { params : {junta: id, status:'O'}}).success(function(datos){//A ---> Acordado --- cafe
            if(datos.type){
                alert("type ==> id "+id);
                Materialize.toast("Junta Acordada!", 3500);
                getJuntaUnica();
                $("#acordar").hide();
                $("#main").show();
            }
        })
    }
    
    $scope.enviarAcuerdos = function(){
        var auxIdj = id.split("/");
    //$scope.enviarAcuerdos = function(sendAcuerdos){
        //alert("enviarAcuerdos "+$scope.allAcuerdosByEmpresa.length);
        for(var i = 0 ; i < $scope.listOrden.length ; i++){
            //alert("Orden._id "+$scope.listOrden[i]._id);
            actualizarStatusOrden($scope.listOrden[i]._id,"A");//A es asignada
        }
        var supervisores = [];
        //Actualizar el status del acuerdo para que pueda ser visualizado por el supervisor
        for(var i = 0 ; i < $scope.allAcuerdosByEmpresa.length ; i++){
        //for(var i = 0 ; i < sendAcuerdos.length ; i++){
            if(i == 0){
                supervisores.push($scope.allAcuerdosByEmpresa[i].ACUEMP);
            }else{
                var index = 0;
                index = supervisores.indexOf($scope.allAcuerdosByEmpresa[i].ACUEMP);
                if(index < 0){
                    //alert("No esta ese wey en el arreglo")
                    supervisores.push(allAcuerdosByEmpresa[i].ACUEMP);
                }
            }
            //socket.emit("nuevo_acuerdo", $scope.allAcuerdosByEmpresa[i]);
            actualizarStatusAcuerdo($scope.allAcuerdosByEmpresa[i]._id,"A");//A es asignada
        }
        for(var i = 0 ; i < supervisores.length ; i++){
            socket.emit("nuevo_acuerdo", supervisores[i]);
        }
        $http.get(url_server+'junta/actualizarStatus', { params : {junta: auxIdj[0], status:'A'}}).success(function(datos){//A ---> Acordado --- cafe
            if(datos.type){
                Materialize.toast("Se enviaron los Acuerdos!", 3500);
                getJuntaUnica();
                $("#cerrar").hide();
                $("#main").show();
            }
        });
    }
    
    function actualizarStatusAcuerdo(id,status){
        $http.get(url_server+'acuerdo/actualizarStatus', { params : {acuerdo: id, status:status}}).success(function(datos){//A ---> Acordado --- cafe
            if(datos.type){
                console.log("actualizado con exito acuerdo ");
            }
        });   
    }

    function actualizarStatusOrden(idO,status){
        console.log("ido "+idO+" status "+status);
        $http.get(url_server+'orden/actualizarStatus', { params : {orden: idO, status:status}}).success(function(datos){//A ---> Acordado --- cafe
            if(datos.type){
                console.log("actualizado con exito orden");
            }else{
                console.log("NOOOOOO actualizado con exito");
            }
        });   
    }

    $scope.updateOrden = function() {
    //$scope.updateOrden = function(ordenA) {
        var orden = $scope.oneOrden;
        orden.id = orden._id; // Pasamos la _id a id para mayor comodidad del lado del servidor a manejar el dato.
        delete orden._id; // Lo borramos para evitar posibles intentos de modificación de un ID en la base de datos
        $http.put(url_server+"orden/actualizar", orden).success(function(response) {
            if(response.status === "OK") {
                $scope.oneOrden = [];
                Materialize.toast("Orden Editada Exitosamente!", 3500);
                //getOrdenUnica(); // Actualizamos la lista de ToDo's
                getOrdenByJunta(); // Actualizamos la lista de ToDo's
                $("#editOrden").hide();
                $("#main").show();
            }
        });
    }

    $scope.deleteOrden = function() {
        if($scope.listOrden.length == 1 && $scope.junta.STATINV == 0){//Si es el ultimo punto de la orden del dia, y NO se han enviado invitaciones...actualizar el estatus de STAORD en 0
            $http.delete(url_server+"orden/eliminar", { params : {identificador: $scope.oneOrden._id}}).success(function(response) {
                if(response.status === "OK") { // Si la API nos devuelve un OK...
                    var idNuevo = {
                        id:idj,
                        bandera:2
                    }
                    //var idNuevo.id = response.data._id;
                    $http.put(url_server+"junta/actualizarEstado",idNuevo).success(function(response){
                        if(response.status == "OK"){
                            //alert("1");
                            $scope.oneOrden = [];
                            Materialize.toast("Orden Eliminada Exitosamente nelse!", 3500);
                            recorrerConsecutivoOrden();
                        }
                    });
                    //getJuntaUnica();
                }
            });
        }else if($scope.listOrden.length == 1 && $scope.junta.STATINV == 1){//Si es el ultimo punto de la orden del dia, y YA se han enviado invitaciones...entonces no puedes dejar a la junta sin ningun punto para la orden del dia
            Materialize.toast("<b style='font-size:8pt;'>Oops!, no puede dejar a esta junta sin un punto de la orden del día!</b>", 3650);
            $("#eliminarOrden").hide();
            $("#main").show();   
        }else{
            $http.delete(url_server+"orden/eliminar", { params : {identificador: $scope.oneOrden._id}}).success(function(response) {
                if(response.status === "OK") { // Si la API nos devuelve un OK...
                    $scope.oneOrden = [];
                    Materialize.toast("Orden Eliminada Exitosamente else!", 3500);
                    recorrerConsecutivoOrden();
                    //getJuntaUnica();
                }
            });    
        }
        //if($scope.listOrden.length > 1){
            /*var idOrden = $scope.oneOrden._id;
            $http.delete(url_server+"orden/eliminar", { params : {identificador: idOrden}}).success(function(response) {
                if(response.status === "OK") { // Si la API nos devuelve un OK...
                    $scope.oneOrden = [];
                    Materialize.toast("Orden Eliminada Exitosamente!", 3500);
                    recorrerConsecutivoOrden();
                    //getJuntaUnica();
                }
            });*/
        /*}else{
            Materialize.toast("No puede eliminar !", 3650);
            $("#eliminarOrden").hide();
            $("#main").show();
        }*/
    }

    function conteoAcuerdo(data){
        var contador = 1;
        var nuevaClave = -1;
        var booleano = true;
        var bandera;
        while(booleano){
            bandera = 0;
            for (var i = 0; i < data.length ; i++) {
                if(data[i].ACUCON == contador){
                //if(data[i].ORDNUM == contador){
                    bandera = 1;
                }
            }
            if (bandera == 1) {
                contador++;
                booleano = true;
            }else{
                booleano = false;
            }
        }
        return contador;
    }

    function conteoPuntos(data){
        var contador = 1;
        var nuevaClave = -1;
        var booleano = true;
        var bandera;
        while(booleano){
            bandera = 0;
            for (var i = 0; i < data.length ; i++) {
                if(data[i].ORDCON == contador){
                //if(data[i].ORDNUM == contador){
                    bandera = 1;
                }
            }
            if (bandera == 1) {
                contador++;
                booleano = true;
            }else{
                booleano = false;
            }
        }
        return contador;
    }

    //Funcion que obtiene la fecha actual
    function getToday(){
        // Obtenemos la fecha de hoy con el formato dd/mm/yyyy
        var today = new Date()
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd
        } 
        if(mm<10){
            mm='0'+mm
        } 
        var today = dd+'/'+mm+'/'+yyyy;
        //alert(today);
        return today;
    }

    // Funcion que obtiene la diferencia de dos fechas en dias
    function restaFechas(f1,f2){
        var fecha1 = f1.split('/'); 
        var fecha2 = f2.split('/'); 
        var diferencia = Date.UTC(fecha2[2],fecha2[1]-1,fecha2[0]) - Date.UTC(fecha1[2],fecha1[1]-1,fecha1[0]);
        return Math.floor(diferencia / (1000 * 60 * 60 * 24));
    }

    $scope.logout = function(){
        localStorage.removeItem("usuario")
        window.location.href = '../../index.html'
    }

}]);