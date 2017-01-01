var app = angular.module('secreto', [])
var url_server = 'http://192.168.0.104:3001/';
//var url_server = 'http://192.168.0.32:3001/';

/* Controlador para el login */
app.controller('loginCtrl', function($scope, $http){
	var usuario = localStorage.getItem('usuario')
	//alert("USER "+usuario);
	if (usuario != null) {
		var user = JSON.parse(usuario)
		if(user.EMPTIP === 2){
			window.location.href = 'views/supervisor/home.html';
		}else if (user.EMPTIP === 3) {
			window.location.href = 'views/operador/home.html'
		}else if (user.EMPTIP === 4) {
			window.location.href = 'views/secretario/home.html'
		}
	};
	$scope.datos = {}
	/* Funcion de login */
	$scope.login = function(){
		//alert("Login");
		$("#error").empty();
		$http.get(url_server+'signup', { params : {EMPCEE: $scope.datos.EMPCEE, EMPPAS: $scope.datos.EMPPAS, EMPRFC : $scope.datos.EMPRFC}}).success(function(datos){//Nomenclatura nueva
			if(!datos.type){
				$scope.mensaje = datos.data;
				$("#error").empty();
				$("#error").append('<div class="alert alert-danger" style="font-size:9pt;"><i class="fa fa-thumbs-up"></i> Error de Autenticación, verifique bien sus datos.</div>');
			}else{
				if(typeof(Storage) !== "undefined") {
					// Alamcenamos la información del usuario
					localStorage.setItem("usuario", JSON.stringify(datos.data));
				}
				$http.get(url_server+"puesto/buscar/"+datos.data.EMPPUE).success(function(response) {
			    	if(response.type) { // Si nos devuelve un OK la API...
			        	var data = response.data;
						if(data.PUENIV === 2){
							//alert("GERENTE");
							window.location.href = 'views/supervisor/home.html';
						}else if (data.PUENIV === 3) {
							//alert("OPERADOR")
							window.location.href = 'views/operador/home.html'
						}else if (data.PUENIV === 4) {
							//alert("SECRETARIO");
							window.location.href = 'views/secretario/home.html'
						}
			        }else{
						$("#error").empty();
						$("#error").append('<div class="alert alert-danger" style="font-size:9pt;"><i class="fa fa-thumbs-up"></i> Error de Autenticación, verifique bien sus datos.</div>');
			        }
			    });
			}
		}).error(function(data, status, headers, config){
			$("#error").empty();
			$("#error").append('<div class="alert alert-danger" style="font-size:9pt;"><i class="fa fa-thumbs-up"></i> Error de Autenticación, verifique bien sus datos.</div>');
		})
	}
});
