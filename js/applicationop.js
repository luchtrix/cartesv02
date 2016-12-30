var app = angular.module('secreto', []);
//var url_server = 'http://192.168.0.104:3001/';
var url_server = 'http://192.168.0.32:3001/';
var socket = io.connect(url_server);

$(document).ready(function (){
    $("#new").hide();
});

app.controller('operadorCtrl', ['$scope', '$http', function($scope, $http){
    //----------------------------------------------------
    var now = moment();//instanciando el objeto moment
    var usuario = localStorage.getItem("usuario")///----------------------------------nuevo|
    $scope.usuario = JSON.parse(usuario);// toda la informacion acerca del usuario
    var empresa = $scope.usuario.EMPIDC;//id de la empresa a la que esta relacionado       |

    $scope.viewForm = function(){
        $("#new").show();
        $("#main").hide();
    }

    $("#hideForm").click(function(){
        $("#new").hide();
        $("#main").show();
    })

    getTareas();

    function getTareas(){
        $scope.tareas = []
        $http.get(url_server+"tarea/buscar/"+$scope.usuario._id).success(function(response) {
            if(response.type) { // Si nos devuelve un OK la API...
                //$scope.tareas = response.data;
                for( var i = 0 ; i < response.data.length ; i++ ){
                    if(response.data[i].TARSTA != ''){
                        $scope.tareas.push(response.data[i]);
                    }
                }
                //alert("tareas "+$scope.tareas.length);
                /*response.data.forEach(function(t) {
                    var eficacia = ''
                    if (t.TARSTA == 'T') {
                        var dias_diferencia = restaFechas(t.date, t.TARES2)
                        if (dias_diferencia != NaN) {
                            if (efic < 0) {
                                var efic = ((dias_diferencia * -1) * 100) / parseInt(t.TARCAN)
                                eficacia = efic.toString()+"%"
                            }else{
                                var efic = 100 + ((dias_diferencia * 100) / parseInt(t.TARCAN))
                                eficacia = efic.toString()+"%"
                            }
                            //$scope.eficacia[$scope.eficacia.length] = efic.toString()+"%";
                        }else{
                            //$scope.eficacia[$scope.eficacia.length] = "Indeterminada"
                            eficacia = "Indeterminada"
                        }
                    }else{
                        eficacia = "Indeterminada"
                    }
                    var datos = {
                        _id: t._id,
                        TARDES: t.TARDES,
                        TARIMP: t.TARIMP,
                        date: t.date,
                        finish: t.finish,
                        TARCAN: t.TARCAN,
                        TARENT: t.TARENT,
                        TARSTA: t.TARSTA,
                        TARES2: t.TARES2,
                        eficacia: eficacia
                    }
                    //$scope.tareas[$scope.tareas.length] = datos;
                    $scope.tareas.push(datos);
                });*/
                /*var total_acuerdos = response.data.length;
                $("#num-notifications").html(total_acuerdos);*/
            }
        })
    }

    function getUrlParameter(sParam) {
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

    var id = getUrlParameter('id');//id del acuerdo
    // Llamamos a la función para obtener la lista de usuario al cargar la pantalla
    if (id != undefined) {
        getOneTarea();
        //getTareas();
    }

    // Método para obtener información de una tarea específica
    function getOneTarea() {
        //alert("tam "+$scope.tareas.length);
        $scope.bloqueado = false;
        $scope.contador = 0;
        $http.get(url_server+"tarea/find/"+id).success(function(response) {
            if(response.type) { // Si nos devuelve un OK la API...
                $scope.tarea = response.data[0];
                $scope.dependencias = []
                // Comprobamos el estado de las dependencias en caso de existir
                for (var i=0;i<$scope.tarea.dependencias.length;i++){
                    //var dep = $scope.tarea.dependencias[i]
                    $http.get(url_server+"tarea/find/"+$scope.tarea.dependencias[i]).success(function(resp) {
                        if(resp.type) { // Si nos devuelve un OK la API...
                            $scope.dependencias.push(resp.data[0]);
                            if (resp.data[0].TARSTA != 'T' ) {
                                $scope.contador++;
                                $scope.bloqueado = true;
                            }
                        }
                    });
                }
                /*$scope.estado_de_tarea = ''
                switch($scope.tarea.TARSTA){
                    case 'A': $scope.estado_de_tarea = 'Asignada'
                    break;
                    case 'P': $scope.estado_de_tarea = 'En progreso'
                    break;
                    case 'D': $scope.estado_de_tarea = 'En destiempo'
                    break;
                    case 'V': $scope.estado_de_tarea = 'Verificando'
                    break;
                    case 'T': $scope.estado_de_tarea = 'Terminado'
                    break;
                }*/
            }
        });
    }

    $scope.enviarEntregable = function() {
        alert("entregable "+$scope.tarea.TARURL);
        var tarea = $scope.tarea
        tarea.id = tarea._id; // Pasamos la _id a id para mayor comodidad del lado del servidor a manejar el dato.
        delete tarea._id
        tarea.TARSTA = 'V';//Cambio de estatis a V (Verificando)...
        //tarea.TARES1 = '';//Descomentar cuando sepa yo para que es estas variables
        $http.put(url_server+"tarea/actualizar", tarea).success(function(response) {
            //socket.emit("cambio_status", tarea.TARSUP,tarea.id);
            socket.emit("cambio_status", tarea.TARSUP);
            Materialize.toast("Se ha enviado el entregable...Espere la respuesta!", 3500);
            getOneTarea();
            $("#new").hide();
            $("#main").show();
        });
    }

    // Funcion que obtiene la diferencia de dos fechas en dias
    function restaFechas(f1,f2){
        var fecha1 = f1.split('/'); 
        var fecha2 = f2.split('/'); 
        var diferencia = Date.UTC(fecha2[2],fecha2[1]-1,fecha2[0]) - Date.UTC(fecha1[2],fecha1[1]-1,fecha1[0]);
        return Math.floor(diferencia / (1000 * 60 * 60 * 24));
    }

    socket.on("aviso_fin_tareas", function (idOperador,mensaje) {
        //playBeep()
        //vibrate()
        if ($scope.usuario._id == idOperador) {
            Materialize.toast(mensaje,3560);
            getTareas();
        };
    });

    socket.on("aviso_validar_tarea", function (idOp,mensaje) {
        //playBeep()
        //vibrate()
        if ($scope.usuario._id == idOp) {
            Materialize.toast(mensaje,3650);
            if(id != undefined){
                getOneTarea();
            }
        };
    });

}]);
