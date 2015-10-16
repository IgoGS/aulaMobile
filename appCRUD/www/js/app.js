// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var appCRUD = angular.module("appCRUD", ["ionic"])
/*.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });  
})**/

appCRUD.service("serviceCRUD", ["$http","$rootScope",serviceCRUD]);

appCRUD.controller("controllerCRUD",["$scope", "serviceCRUD", controllerCRUD]);

function controllerCRUD($scope, serviceCRUD){
    
    $scope.dadosOpitions = [    
      {id: '1', name: '10'},
      {id: '2', name: '12'},
      {id: '3', name: '14'},
      {id: '4', name: '16'},
      {id: '5', name: '18'},
      {id: '6', name: 'Livre'}
    ];
       
    
    $scope.series = [];
    
    $scope.$on("appCRUD.listarSeries", function(_, result){
        console.log("LISTANDO");
        result.forEach(
            function(cadaResult){
                console.log(cadaResult.id, cadaResult.titulo, cadaResult.poster, 

cadaResult.idClassificacao, cadaResult.nomeClassificacao);
                
                $scope.series.push({
                    id : cadaResult.id,
                    titulo : cadaResult.titulo,
                    poster : cadaResult.poster,
                    idClassificacao : cadaResult.idClassificacao,
                    nomeClassificacao : cadaResult.nomeClassificacao
                });
            }
        );
    });
    
    $scope.$on("appCRUD.atualizarLista", function(_,_){       
        $scope.selecionar("","","","Livre");
        $scope.series = [];
        $scope.selectClassificacao = "";
       serviceCRUD.loadSeries();        
         
              
    }) // FIM DO ATUALIZAR LISTA
    
    $scope.deletar = function(titulo){       
        serviceCRUD.deletarSerie(titulo);
    } // FIM DO DELETE
    
    
    $scope.atualizar = function(id, titulo, poster, nomeClassificacao){       
        serviceCRUD.atualizarSerie(id, titulo, poster, nomeClassificacao);
    } // FIM DO ATUALIZAR
    
    $scope.inserir = function(titulo, poster, nomeClassificacao){       
        serviceCRUD.inserirSerie(titulo, poster, nomeClassificacao);
    } // FIM DO INSERIR
    
    $scope.selecionar = function(id, titulo, poster, nomeClassificacao){
        $scope.idInput = id;
        $scope.tituloInput = titulo;
        $scope.posterInput = poster;
        $scope.selectClassificacao = nomeClassificacao;
    }// FIM DO SELECIONAR
    
    serviceCRUD.loadSeries();
    
} //FIM DO CONTROLLER


///////////////////////////////////////////////////////////////


function serviceCRUD($http, $rootScope){
    
    this.loadSeries = function(){
        console.log("OBTENDO DADOS");        
        $http.get("http://localhost:8080/WStesteWEB/ws/series").success(
            function(result){
                $rootScope.$broadcast("appCRUD.listarSeries", result);
                console.log("LISTADOS");
            }
        ).error(
            function(result){
                    console.log("URL INVÁLIDA");                    
                    $rootScope.$broadcast("appCRUD.listarSeries","erro");      
            }
        );
    }
    
    this.deletarSerie = function(id){        
        console.log("DELETANDO");
        $http.get("http://localhost:8080/WStesteWEB/ws/series/deletar/" + id).success(
            function(){
                $rootScope.$broadcast("appCRUD.atualizarLista");
                console.log("DELETADO");
            }
        ).error(
            function(result){
                    console.log("Url inválida");                    
                    $rootScope.$broadcast("appCRUD.listarSeries","erro");      
            }
        );        
    }
    
    this.atualizarSerie = function(id, titulo, poster, nomeClassificacao){        
        console.log("ATUALIZANDO");
        $http.get("http://localhost:8080/WStesteWEB/ws/series/atualizar/" + id + "&" + titulo + "&" + poster + "&" + nomeClassificacao).success(
            function(){
                $rootScope.$broadcast("appCRUD.atualizarLista");
                console.log("ATUALIZADO");
            }
        ).error(
            function(result){
                    console.log("Url inválida");                    
                    $rootScope.$broadcast("appCRUD.listarSeries","erro");      
            }
        );        
    }
    
    this.inserirSerie = function(titulo, poster, nomeClassificacao){        
        console.log("INSERINDO");
        console.log(titulo, poster, nomeClassificacao);
        $http.get("http://localhost:8080/WStesteWEB/ws/series/inserir/" + titulo + "&" + poster + "&" + nomeClassificacao).success(
            function(){
                $rootScope.$broadcast("appCRUD.atualizarLista");
                console.log("INSERIDO");
            }
        ).error(
            function(result){
                    console.log("Url inválida");                    
                    $rootScope.$broadcast("appCRUD.listarSeries","erro");      
            }
        );        
    }

    
    
}; // FIM DO SERVICE