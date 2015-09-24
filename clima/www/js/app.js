
var db = null;

var clima = angular.module('clima', ['ionic', 'ngCordova']).run(function($ionicPlatform, $cordovaSQLite) {
  $ionicPlatform.ready(function() {
      console.log("Run");
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
      
    // Criar Banco de Dados
    db = $cordovaSQLite.openDB({name:"my.db"});
    $cordovaSQLite.execute(db,"CREATE TABLE IF NOT EXISTS clima (id INTEGER PRIMARY KEY, nomeCidade text, siglaPais text, " 
                           + "iconeClima text, descricao text, temperatura float, vento float, umidade text, pressao text, latitude text, "
                           + "longitude text)");
  });
        console.log("Bando Criado");
})


    
// CONTROLLER
clima.controller("climaController", ["$scope", "$cordovaSQLite", "$ionicLoading", "$ionicListDelegate", "climaService", climaController]);

clima.service("climaService",["$http", "$rootScope", climaService]);

function climaController($scope, $cordovaSQLite, $ionicLoading, $ionicListDelegate, climaService){
    
    $ionicLoading.show({
        template: "Carregando dados..."
    });
    
    $scope.dadosClima = [];     
    $scope.nomeCidade = "";
    $scope.siglaPais = "";
    $scope.iconeClima = "";
    $scope.descricao = "";
    $scope.temperatura = "";
    $scope.vento = "";
    $scope.humidade = "";
    $scope.pressao = "";
    $scope.latitude = "";
    $scope.longitude = "";
    
    //PASSA OS DADOS OBTIDOS DO JSON PARA A VARIÁVEL DADOSCLIMA
    $scope.$on("clima.dadosClima", function(_, result){
            console.log("setando dados nas variaveis do DadosCLima");
        this.dadosClima = result;
        
        this.nomeCidade = dadosClima.name;
        this.siglaPais = dadosClima.sys.country;
        this.iconeClima = "http://openweathermap.org/img/w/" + dadosClima.weather[0].icon + ".png";
        this.descricao = dadosClima.weather[0].description;
        this.temperatura = (parseFloat(dadosClima.main.temp) - 273.15).toFixed(2);
        this.vento = (parseFloat(dadosClima.wind.speed) * 1.609344).toFixed(2);
        this.humidade = dadosClima.main.humidity;
        this.pressao = dadosClima.main.pressure;
        this.latitude = dadosClima.coord.lat;
        this.longitude = dadosClima.coord.lon;
            
        console.log(this.dadosClima.name);        
          
        $ionicLoading.hide();      
        $scope.$broadcast("scroll.infiniteScrollComplete");
		$scope.$broadcast("scroll.refreshComplete");
    });

    climaService.loadDadosClima();     
    
    
    // INSERT    
    $scope.insert = function(result) {
            console.log("Entrei no INSERT");
            var query = "insert into clima (nomeCidade, siglaPais, iconeClima, descricao, temperatura, vento, humidade, "
            + "pressao, latitude, longitude) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $cordovaSQLite.execute(db, query, [ result.name, result.sys.country, result.weather[0].icon, result.weather[0].description, 
                                               (parseFloat(result.main.temp) - 273.15).toFixed(2), 
                                               (parseFloat(result.wind.speed) * 1.609344).toFixed(2), result.main.humidity, 
                                               result.main.pressure, result.coord.lat, result.coord.lon]).then(
                function(result){ 
                    console.log("INSERI");
                }, function(error){
                    console.log(error);
                }
            ); // FIM DO THEN
        }; // FIM DO INSERT
    
    
    // SELECT
    $scope.select = function(){
        console.log("Entrei no Select");
        $scope.linhaID = sqlite3_last_insert_rowid ( db );
        var query = "select * from clima where RowID = ?";
        $cordovaSQLite.execute(db,query,[$scope.linhaID]).then(function(dados) {
            if(dados.rows.length > 0){
                for(var i = 0; i < dados.rows.length; i++) {
                    this.dadosClima.push({name: result.rows.item(i).firstname, lastname: result.rows.item(i).lastname});
                    
                    this.nomeCidade = result.rows.item(i).nomeCidade;
                    this.siglaPais = result.rows.item(i).siglaPais;
                    console.log(result.rows.item(i).iconeClima);
                    this.iconeClima = "http://openweathermap.org/img/w/" + result.rows.item(i).iconeClima + ".png";
                    this.descricao = result.rows.item(i).descricao;
                    this.temperatura = (parseFloat(result.rows.item(i).temperatura) - 273.15).toFixed(2);
                    this.vento = (parseFloat(result.rows.item(i).vento) * 1.609344).toFixed(2);
                    this.humidade = result.rows.item(i).humidade;
                    this.pressao = result.rows.item(i).pressao;
                    this.latitude = result.rows.item(i).latitude;
                    this.longitude = result.rows.item(i).longitude;
                }
                console.log(result.rows.length + " rows found.");
            } else {
                console.log(result.rows.length + "0 rows found!");
            }
        }, function(error){
            console.log(error);
        });
    } // FIM DO SELECT

    
} // FIM DO CONTROLLER


// SERVICE
function climaService($http, $rootScope){
    console.log("Entrei no Service");
    this.loadDadosClima = function(){
        $http.get("http://api.openweathermap.org/data/2.5/weather?q=Promissao,br").success(function(result){           
            $rootScope.$broadcast("clima.insert", result);
             $rootScope.$broadcast("clima.dadosClima", result);
             console.log("Certo");
        }).error(function(){
            $rootScope.$broadcast("clima.select");
            console.log("Errado");
        });
    }
    
} // FIM DO SERVICE