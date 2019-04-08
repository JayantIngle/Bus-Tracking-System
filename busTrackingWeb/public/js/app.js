
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCDBWcqAXRzf05ZL2-nVD04LWVPYJg07x8",
    authDomain: "bustracking12.firebaseapp.com",
    databaseURL: "https://bustracking12.firebaseio.com",
    projectId: "bustracking12",
    storageBucket: "bustracking12.appspot.com",
    messagingSenderId: "645168680771"
  };
  firebase.initializeApp(config);



var app = angular.module('mainApp',['firebase','ui.router','500tech.simple-calendar','cgBusy']);

app.config(function($stateProvider,$urlRouterProvider){
    
    
    $stateProvider.state('adminBase',{
        url : '/admin',
        abstract:true,
        views : {
            'nav' :{
                templateUrl : "templates/navbar.html",
                controller : "navController"
            },
            'content':{
                templateUrl : "",
                controller : ''
            },
        }
    });
    
     $stateProvider.state('adminBase.adminPost',{
        url : '/post',
        views : {
            'content@':{
                templateUrl : "templates/adminPost.html",
                controller : 'adminPostController'
            }
        }
    });
    
    $stateProvider.state('adminBase.adminPostDriver',{
        url : '/driver',
        views : {
            'content@':{
                templateUrl : "templates/adminPostDriver.html",
                controller : 'adminPostDriverController'
            }
        }
    });
    
    $stateProvider.state('adminBase.viewParent',{
        url : '/viewParent',
        views : {
            'content@':{
                templateUrl : "templates/viewParent.html",
                controller : 'viewParentController'
            }
        }
    });
    
    $stateProvider.state('adminLogin',{
        url : '/adminLogin',
        views : {
            'content@':{
                templateUrl : "templates/adminLogin.html",
                controller : 'adminLoginController'
            }
        }
    });
    
    $stateProvider.state('adminBase.adminPut',{
        url : '/put/:category/:subcat/:id',
        views : {
            'content@':{
                templateUrl : "templates/adminPut.html",
                controller : 'adminPutController'
            }
        }
    });
    
    $stateProvider.state('adminBase.adminSearch',{
        url : '/post',
        views : {
            'content@':{
                templateUrl : "templates/adminSearch.html",
                controller : 'adminSearchController'
            }
        }
    });
    
    $stateProvider.state('adminBase.chicken',{
        url : '/chicken',
        views : {
            'content@':{
                templateUrl : "templates/chicken.html",
                controller : 'chickenController'
            }
        }
    });
    
    $stateProvider.state('adminBase.fish',{
        url : '/fish',
        views : {
            'content@':{
                templateUrl : "templates/fish.html",
                controller : 'fishController'
            }
        }
    });
    
    $stateProvider.state('adminBase.prawns',{
        url : '/prawns',
        views : {
            'content@':{
                templateUrl : "templates/prawns.html",
                controller : 'prawnsController'
            }
        }
    });
    
    $stateProvider.state('adminBase.marinated',{
        url : '/marinated',
        views : {
            'content@':{
                templateUrl : "templates/marinated.html",
                controller : 'marinatedController'
            }
        }
    });
    
    
    
    $urlRouterProvider.otherwise('/admin/post');
    
})