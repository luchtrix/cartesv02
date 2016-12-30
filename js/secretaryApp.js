var app = angular.module('secreto', ['ngRoute']);
var url_server = 'http://192.168.0.104:3001/';
//var socket = io.connect(url_server);

// INICIO Configurando rutas
app.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'views/home.html',
				controller: 'HomeCtrl',
				controllerAs: 'home'
			})
			.when('/juntas', {
				templateUrl: 'views/juntas.html',
				controller: 'JuntasCtrl',
				controllerAs: 'juntas'
			})
			/*.when('/Torteria', {
				templateUrl: 'views/torteria.html',
				controller: 'TorCtrl',
				controllerAs: 'tor'
			})
			.when('/productos', {
				templateUrl: 'views/productos.html',
				controller: 'ProductoCtrl',
				controllerAs: 'productos'
			})
			.when('/pedido', {
				templateUrl: 'views/pedido.html',
				controller: 'PedidoCtrl',
				controllerAs: 'pedido'
			})
			.when('/lista', {
				templateUrl: 'views/lista.html',
				controller: 'ListaCtrl',
				controllerAs: 'lista'
			})
			.when('/detalles', {
				templateUrl: 'views/detalles.html',
				controller: 'DetallesCtrl',
				controllerAs: 'detalles'
			})*/
		$locationProvider.html5Mode(false);
}]);
// F I N Configurando rutas

app.controller('HomeCtrl', ['$scope', '$http', '$location', function($scope, $http, $location){
	alert("controlador principal "+$location.path())
	/*//----------------------------------------------------
    var usuario = localStorage.getItem("usuario")///----------------------------------nuevo|
    $scope.usuario = JSON.parse(usuario);//NUEVO                                           |  
    var empresa = $scope.usuario.EMPIDC;//id de la empresa a la que esta relacionado       |
    // ------------------------------------------------------------------------------------*/

}]);

app.controller('JuntasCtrl', ['$scope', '$http', '$location', function($scope, $http, $location){
	//----------------------------------------------------
    /*var usuario = localStorage.getItem("usuario")///----------------------------------nuevo|
    $scope.usuario = JSON.parse(usuario);//NUEVO                                           |  
    var empresa = $scope.usuario.EMPIDC;//id de la empresa a la que esta relacionado       |
    // ------------------------------------------------------------------------------------*/
    alert("controlador principal para juntas...>"+$location.path())
}]);