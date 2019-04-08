app.controller('homeController',['$scope','$firebaseArray','$firebaseAuth','cartService','$window','incDecService','$firebaseObject','$timeout','$state',function($scope,$firebaseArray,$firebaseAuth,cartService,$window,incDecService,$firebaseObject,$timeout,$state){
    
    
    var modal = new Custombox.modal({
      content: {
        effect: 'fadein',
        target: '#loginpop'
      }
    });

// Open
modal.open();
    
    $scope.toShowRedirect = function(){
        var toShow = $scope.toShow.charAt(0).toUpperCase() + $scope.toShow.slice(1);
        $state.go('productList',{category:"Raw", subcat: toShow});
    }
    
    $scope.email = "";
    
    $scope.redirectCheckout = function(){
        $state.go('checkoutDate',{email: $scope.email});
    }
    
     var authen = $firebaseAuth();
    
    
    $scope.signInWithFacebook = function(){
        authen.$signInWithRedirect("facebook").then(function() {
            // Never called because of page redirect
            // Instead, use $onAuthStateChanged() to detect successful authentication
        }).catch(function(error) {
          console.error("Authentication failed:", error);
        });
    }
    
    $scope.signInWithGoogle = function(){
        authen.$signInWithRedirect("google").then(function() {
            // Never called because of page redirect
            // Instead, use $onAuthStateChanged() to detect successful authentication
        }).catch(function(error) {
          console.error("Authentication failed:", error);
        });
    }
    
    $scope.showLoginModal = function(){
        $('.loganModal').css("display","block");
    }
    
    $scope.hideLoginModal = function(){
        $('.loganModal').css("display","none");
    }
    
    $scope.toggleHelp = false;

    $scope.toggle = function(){
        $scope.toggleHelp = !$scope.toggleHelp;
    }
    
    $("div .closeIt").click(function(){
        $scope.toggleHelp = false;
        $scope.$apply();
        console.log("clicked")
    })
    
    $scope.quantity = 1;
    
    $scope.itemInc = function(name){
        if(!$scope.loggedIn){
            uid = "";
        }
        else{
            uid = $scope.user.uid;
        }
        $scope.myCartData = incDecService.increment($scope.loggedIn,uid,$scope.myCartData,name);
    }
    
    $scope.itemDec = function(name){
        if(!$scope.loggedIn){
            uid = "";
        }
        else{
            uid = $scope.user.uid;
        }
        $scope.myCartData = incDecService.decrement($scope.loggedIn,uid,$scope.myCartData,name);
    }
    
    $scope.removeItem = function(name){
        if(!$scope.loggedIn){
            uid = "";
        }
        else{
            uid = $scope.user.uid;
        }
        $scope.myCartData = incDecService.removeProduct($scope.loggedIn,uid,$scope.myCartData,name);
    }
    
    $scope.logout = function(){
        authen.$signOut();
    }
    
    /*---------------------------------------------------------------------------------------------*/
    
    var authen = $firebaseAuth();
    
    authen.$onAuthStateChanged(function(firebaseUser){
        if(firebaseUser){
            $scope.loggedIn = true;
            $scope.user = firebaseUser;
                var ref = firebase.database().ref('users/cart/' + $scope.user.uid);
                var refObject = $firebaseObject(ref);
                $scope.myPromise = refObject.$loaded().then(
                    function(data){
                        if(!data.quantity){
                            var toSave = {
                                quantity:0,
                                products: 'null',
                                total: 0
                            }
                            $scope.myCartData = toSave;
                            firebase.database().ref('users/cart/' + $scope.user.uid).set(toSave).then(
                                function(){
                                    console.log("Data saved first time");   
                                }
                            )
                        }
                        else{
                            $scope.myCartData = data;
                        }
                    },
                    function(){
                        console.log("Error occured");
                    }
                )

            $timeout(function(){
                console.log($scope.myCartData);
            },10000)
            
        }
        else{
            $scope.loggedIn = false;
            var cartData = $window.localStorage['cart'];
            if(!cartData){
                var toSave = {
                    quantity:0,
                    products: 'null',
                    total: 0
                }
                $window.localStorage['cart'] = JSON.stringify(toSave);
                console.log(toSave);
                $scope.myCartData = toSave;
            }
            else{
                cartData = JSON.parse(cartData);
                $scope.myCartData = cartData;
            }
            console.log($scope.myCartData);
        }
    })
    
    
    
  
    
    var chickref = firebase.database().ref("products/Raw/Chicken").limitToLast(3);
    var chickObject = $firebaseArray(chickref);
    $scope.myPromise = chickObject.$loaded().then(
        function(data){
            $scope.chicken = data;
        }
    )
    
    var fishref = firebase.database().ref("products/Raw/Fish").limitToLast(3);
    var chickObject = $firebaseArray(fishref);
    $scope.myPromise = chickObject.$loaded().then(
        function(data){
            $scope.fish = data;
        }
    )
    
    var prawnsref = firebase.database().ref("products/Raw/Prawns").limitToLast(3);
    var chickObject = $firebaseArray(prawnsref);
    $scope.myPromise = chickObject.$loaded().then(
        function(data){
            $scope.prawns = data;
        }
    )
    
    var marref = firebase.database().ref("products/Raw/Marinated").limitToLast(3);
    var marObject = $firebaseArray(marref);
    $scope.myPromise = chickObject.$loaded().then(
        function(data){
            $scope.marinated = data;
        }
    )
    
    /*----------------------------------------------------------------------------------*/
    
    $scope.toShow = "chicken";
    
    $scope.mobNavShow = false;
    
    $scope.invertMobNav = function(){
        console.log('Running')
        $scope.mobNavShow = !$scope.mobNavShow;
    }
    
    $scope.changeCategory = function(id){
        $scope.toShow = id;
        $scope.enableCat = false;
    }
    
    /*Mob cart show*/
    
    $scope.mobCartShow = false;
    $scope.mobCartShowToggle = function(){
        $scope.mobCartShow = !$scope.mobCartShow;
    }
    
    //ends here
    
    $scope.enableCat = false;
    
    $scope.enableCategories = function(){
        console.log('run')
        $scope.enableCat = !$scope.enableCat;
    }
    
    // Checkout Part
    
    $scope.showCheckoutModal = function(){
        $('.checkoutModal').css("display","block");
    }
    
    $scope.hideCheckoutModal = function(){
        $('.checkoutModal').css("display","none");
    }
    
    $scope.decide = function(){
        if($scope.loggedIn){
            $state.go('checkoutDate',{email:"null@f.c"});
        }
        else{
            $scope.showCheckoutModal();
        }
    }
    
}])

app.controller('navController',['$scope','$firebaseAuth',function($scope,$firebaseAuth){
    var authen = $firebaseAuth();
    
    authen.$onAuthStateChanged(function(firebaseUser){
        if(firebaseUser){
            $scope.user = firebaseUser
        }
    })
    
    $scope.logout = function(){
        authen.$signOut();
    }
    
}])

app.controller('adminPostController',['$scope','$firebaseStorage','$firebaseAuth','$state','$window','$firebaseObject','$firebaseArray',function($scope,$firebaseStorage,$firebaseAuth,$state,$window,$firebaseObject,$firebaseArray){
    
    var ref1 = firebase.database().ref('drivers');
            var refObject1 = $firebaseArray(ref1);
            refObject1.$loaded().then(
                function(data){
                    $scope.list = data;
                    console.log($scope.list)
                }
            )
    
    $scope.uploading = false;
    
    var authen = $firebaseAuth();
    
    authen.$onAuthStateChanged(function(firebaseUser){
        if(firebaseUser){
            $scope.loggedIn = true;
            var ref = firebase.database().ref('admin/' + firebaseUser.uid);
            var refObject = $firebaseObject(ref);
            refObject.$loaded().then(
                function(data){
                    if(!data.$value){
                        //alert('Invalid credentials');
                        authen.$signOut();
                    }
                }
            )
            console.log(firebaseUser);
            $scope.user = firebaseUser;
        }
        else{
            $state.go('adminLogin');
        }
    })
    
    $scope.subcat = "";
    
    $scope.formData = {
        name: "",
        email :"",
        password: "",
        route: "",
    }
    
    
    $scope.authObj = $firebaseAuth();
    
    
    $scope.sendData = function(){
        
        $scope.formData.route = parseInt($scope.formData.route);
        
        $scope.authObj.$createUserWithEmailAndPassword($scope.formData.email, $scope.formData.password)
          .then(function(firebaseUser) {
            firebase.database().ref('parents/' + firebaseUser.uid).set($scope.formData.route).then(
                function(){
                    firebase.database().ref('parentsName/' + firebaseUser.uid).set($scope.formData.name).then(
                        function(){
                            alert("Please reauthenticate to add data");
                            $scope.authObj.$signOut();
                        }
                    )
                }
            )
                
            console.log("User " + firebaseUser.uid + " created successfully!");
          }).catch(function(error) {
            console.error("Error: ", error);
          });
    }
    
    
    
}])

app.controller('adminPostDriverController',['$scope','$firebaseStorage','$firebaseAuth','$state','$window','$firebaseObject','$firebaseArray',function($scope,$firebaseStorage,$firebaseAuth,$state,$window,$firebaseObject,$firebaseArray){
    
    
    $scope.uploading = false;
    
    var authen = $firebaseAuth();
    
    authen.$onAuthStateChanged(function(firebaseUser){
        if(firebaseUser){
            $scope.loggedIn = true;
            var ref = firebase.database().ref('admin/' + firebaseUser.uid);
            var refObject = $firebaseObject(ref);
            refObject.$loaded().then(
                function(data){
                    if(!data.$value){
                        //alert('Invalid credentials');
                        authen.$signOut();
                    }
                }
            )
            console.log(firebaseUser);
            $scope.user = firebaseUser;
        }
        else{
            $state.go('adminLogin');
        }
    })
    
    $scope.subcat = "";
    
    $scope.formData = {
        name: "",
        email :"",
        password: "",
        route: "",
    }
    
    
    $scope.authObj = $firebaseAuth();
    
    
    $scope.sendData = function(){
        
        $scope.formData.route = parseInt($scope.formData.route);
        
        $scope.authObj.$createUserWithEmailAndPassword($scope.formData.email, $scope.formData.password)
          .then(function(firebaseUser) {
            firebase.database().ref('drivers/' + firebaseUser.uid).set($scope.formData.route).then(
                function(){
                    firebase.database().ref('driversName/' + firebaseUser.uid).set($scope.formData.name).then(
                        function(){
                            alert("Please reauthenticate to add data");
                            $scope.authObj.$signOut();
                        }
                    )
                }
            )
                
            console.log("User " + firebaseUser.uid + " created successfully!");
          }).catch(function(error) {
            console.error("Error: ", error);
          });
    }
    
    
    
}])


app.controller('adminPutController',['$scope','$firebaseObject','$firebaseAuth','$state','$stateParams','$firebaseStorage',function($scope,$firebaseObject,$firebaseAuth,$state,$stateParams,$firebaseStorage){
    
    $scope.toggle = false;
    
    $scope.uploading = false;
    
    $scope.toggleIt = function(){
        $scope.toggle = !$scope.toggle;
    }
    
    $scope.formData = {
        name: "",
        short :"",
        price: "",
        mrp: "",
        description: "",
        stock : true,
        category : "",
        subcat : "",
        image : "",
    }
    
    var authen = $firebaseAuth();
    
    authen.$onAuthStateChanged(function(firebaseUser){
        if(firebaseUser){
            $scope.loggedIn = true;
            console.log(firebaseUser)
            $scope.user = firebaseUser
        }
        else{
            $state.go('adminLogin');
        }
    })
    
    $scope.subcat = "";
    
    var category = $stateParams.category;
    var subcat = $stateParams.subcat;
    var id = $stateParams.id;
    
    var ref = firebase.database().ref('products/' + category + '/' + subcat + '/' + id);
    var refObject = $firebaseObject(ref);
    
    refObject.$loaded().then(
        function(data){
            $scope.formData.name = data.name;
            $scope.formData.short = data.short;
            $scope.formData.price = data.price;
            $scope.formData.mrp = data.mrp;
            $scope.formData.description = data.description;
            $scope.formData.category = data.category;
            $scope.formData.subcat = data.subcat;
            $scope.formData.image = data.image;
            
            oldCategory = data.category;
            oldSubcat = data.sub;
            
        }
    )
    
    
    
    $scope.sendData = function(){
        
        $scope.uploading = true;
            
            if(!$scope.toggle){
                firebase.database().ref('products/' + $scope.formData.category + '/' +            $scope.formData.subcat + '/' + id).set($scope.formData).then(
                    function(){
                        if((oldCategory != $scope.formData.category) || (oldSubcat != $scope.formData.subcat)){
                            firebase.database().ref('products/' + oldCategory + '/' + oldSubcat + '/' + id).remove().then(
                                function(){
                                    alert("Duplicate data removed successfully");
                                }
                            )
                        }
                        alert("Data saved successfully");
                        console.log("Data saved successfully");
                    },
                    function(){
                        console.log("Error");
                    }
                )
            }
            
            else{
                var image = document.getElementById("onlyImage").files;
                var storage = firebase.storage().ref('products/' + $scope.formData.category + '/' + $scope.formData.subcat + '/' + id);
                var storageObject = $firebaseStorage(storage);
                var uploadTask = storageObject.$put(image[0],{contentType: "image/jpeg"});

                uploadTask.$progress(function(snapshot) {
                  $scope.percentUploaded = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                });

                uploadTask.$complete(function(snapshot) {
                    console.log(snapshot.downloadURL);
                    $scope.formData.image = snapshot.downloadURL;

                    firebase.database().ref('products/' + $scope.formData.category + '/' +            $scope.formData.subcat + '/' + id).set($scope.formData).then(
                        function(){
                            if((oldCategory != $scope.formData.category) || (oldSubcat != $scope.formData.subcat)){
                                firebase.database().ref('products/' + oldCategory + '/' + oldSubcat + '/' + id).remove().then(
                                    function(){
                                        alert("Duplicate data removed successfully");
                                    }
                                )
                            }
                            alert("Data saved successfully");
                            console.log("Data saved successfully");
                        },
                        function(){
                            console.log("Error");
                        }
                    )


                });
            }
        
            
    }
    
    
    
}])

app.controller('adminLoginController',['$scope','$firebaseAuth','$state','$firebaseObject',function($scope,$firebaseAuth,$state,$firebaseObject){
    
    $scope.message = "";
    
    
    var refObject = $firebaseAuth();
    
    $scope.formData = {
        email : "",
        password : "",
    }
    
    $scope.sendData = function(){
        $scope.message = "Please wait .....";
        refObject.$signInWithEmailAndPassword($scope.formData.email,$scope.formData.password).then(
            function(user){
                if(user){
                    var uid = user.uid;
                    var ref = firebase.database().ref('admin/' + uid);
                    var refObject = $firebaseObject(ref);
                    refObject.$loaded().then(
                        function(data){
                            console.log(data);
                            if((data.$value != true)){
                                var authen = $firebaseAuth();
                                authen.$signOut();
                                $scope.message = "Sorry you are not an admin.";
                                console.log("Sorry you are not an admin.");
                            }
                            else{
                                $state.go('adminBase.adminPost');
                            }
                        }
                    )
                }
            }
            ,function(){
                $scope.message = "Invalid id/password";
            }
        )
    }
    
}])

app.controller('chickenController',['$scope','$firebaseAuth','$firebaseArray','updateDelete','$state',function($scope,$firebaseAuth,$firebaseArray,updateDelete,$state){
    
    var authen = $firebaseAuth();
    
    authen.$onAuthStateChanged(function(firebaseUser){
        if(firebaseUser){
            $scope.loggedIn = true;
            console.log(firebaseUser)
            $scope.user = firebaseUser
        }
        else{
            $state.go('adminLogin');
        }
    })
    
    $scope.removeProduct = function(category1, subcat1, id1){
        updateDelete.delete(category1, subcat1, id1);
    }
    
    $scope.updateProduct = function(category1, subcat1, id1){
        updateDelete.update(category1, subcat1, id1);
    }
    
    var ref = firebase.database().ref('products/Raw/Chicken');
    var refObject = $firebaseArray(ref);
    refObject.$loaded().then(
        function(data){
            $scope.datum = data;
            console.log(data);
        }
    )
    
}])

app.controller('fishController',['$scope','$firebaseAuth','$firebaseArray','updateDelete','$state',function($scope,$firebaseAuth,$firebaseArray,updateDelete,$state){
    
    var authen = $firebaseAuth();
    
    authen.$onAuthStateChanged(function(firebaseUser){
        if(firebaseUser){
            $scope.loggedIn = true;
            console.log(firebaseUser)
            $scope.user = firebaseUser
        }
        else{
            $state.go('adminLogin');
        }
    })
    
    $scope.removeProduct = function(category1, subcat1, id1){
        updateDelete.delete(category1, subcat1, id1);
    }
    
    $scope.updateProduct = function(category1, subcat1, id1){
        updateDelete.update(category1, subcat1, id1);
    }
    
    var ref = firebase.database().ref('products/Raw/Fish');
    var refObject = $firebaseArray(ref);
    refObject.$loaded().then(
        function(data){
            $scope.datum = data;
            console.log(data);
        }
    )
    
}])

app.controller('prawnsController',['$scope','$firebaseAuth','$firebaseArray','updateDelete','$state',function($scope,$firebaseAuth,$firebaseArray,updateDelete,$state){
    
    var authen = $firebaseAuth();
    
    authen.$onAuthStateChanged(function(firebaseUser){
        if(firebaseUser){
            $scope.loggedIn = true;
            console.log(firebaseUser)
            $scope.user = firebaseUser
        }
        else{
            $state.go('adminLogin');
        }
    })
    
    $scope.removeProduct = function(category1, subcat1, id1){
        updateDelete.delete(category1, subcat1, id1);
    }
    
    $scope.updateProduct = function(category1, subcat1, id1){
        updateDelete.update(category1, subcat1, id1);
    }
    
    var ref = firebase.database().ref('products/Raw/Prawns');
    var refObject = $firebaseArray(ref);
    refObject.$loaded().then(
        function(data){
            $scope.datum = data;
            console.log(data);
        }
    )
    
}])

app.controller('marinatedController',['$scope','$firebaseAuth','$firebaseArray','updateDelete','$state',function($scope,$firebaseAuth,$firebaseArray,updateDelete,$state){
    
    var authen = $firebaseAuth();
    
    authen.$onAuthStateChanged(function(firebaseUser){
        if(firebaseUser){
            $scope.loggedIn = true;
            console.log(firebaseUser)
            $scope.user = firebaseUser
        }
        else{
            $state.go('adminLogin');
        }
    })
    
    $scope.removeProduct = function(category1, subcat1, id1){
        updateDelete.delete(category1, subcat1, id1);
    }
    
    $scope.updateProduct = function(category1, subcat1, id1){
        updateDelete.update(category1, subcat1, id1);
    }
    
    var ref = firebase.database().ref('products/Marinated/Chicken');
    var refObject = $firebaseArray(ref);
    refObject.$loaded().then(
        function(data){
            $scope.chicken = data;
            console.log(data);
        }
    )
    
    var ref1 = firebase.database().ref('products/Marinated/Fish');
    var refObject1 = $firebaseArray(ref1);
    refObject1.$loaded().then(
        function(data1){
            $scope.fish = data1;
            console.log(data1);
        }
    )
    
    var ref2 = firebase.database().ref('products/Marinated/Prawns');
    var refObject2 = $firebaseArray(ref2);
    refObject2.$loaded().then(
        function(data2){
            $scope.prawns = data2;
            console.log(data2);
        }
    )
    
}])

app.controller('singleController',['$scope','$firebaseObject','$stateParams','cartService','$firebaseAuth','$window','incDecService','$timeout','$state',function($scope,$firebaseObject,$stateParams,cartService,$firebaseAuth,$window,incDecService,$timeout,$state){
    
    
    
    var authen = $firebaseAuth();
    
    $scope.email = "";
    
    $scope.redirectCheckout = function(){
        $state.go('checkoutDate',{email: $scope.email});
    }
    
    $scope.signInWithFacebook = function(){
        authen.$signInWithRedirect("facebook").then(function() {
            // Never called because of page redirect
            // Instead, use $onAuthStateChanged() to detect successful authentication
        }).catch(function(error) {
          console.error("Authentication failed:", error);
        });
    }
    
    $scope.signInWithGoogle = function(){
        authen.$signInWithRedirect("google").then(function() {
            // Never called because of page redirect
            // Instead, use $onAuthStateChanged() to detect successful authentication
        }).catch(function(error) {
          console.error("Authentication failed:", error);
        });
    }
    
    $scope.showLoginModal = function(){
        $('.loginModal').css("display","block");
    }
    
    $scope.hideLoginModal = function(){
        $('.loginModal').css("display","none");
    }
    
    $scope.toggleHelp = false;

    $scope.toggle = function(){
        $scope.toggleHelp = !$scope.toggleHelp;
    }
    
    $("div .closeIt").click(function(){
        $scope.toggleHelp = false;
        $scope.$apply();
        console.log("clicked")
    })
    
    $scope.quantity = 1;
    
    $scope.itemInc = function(name){
        if(!$scope.loggedIn){
            uid = "";
        }
        else{
            uid = $scope.user.uid;
        }
        $scope.myCartData = incDecService.increment($scope.loggedIn,uid,$scope.myCartData,name);
    }
    
    $scope.itemDec = function(name){
        if(!$scope.loggedIn){
            uid = "";
        }
        else{
            uid = $scope.user.uid;
        }
        $scope.myCartData = incDecService.decrement($scope.loggedIn,uid,$scope.myCartData,name);
    }
    
    $scope.removeItem = function(name){
        if(!$scope.loggedIn){
            uid = "";
        }
        else{
            uid = $scope.user.uid;
        }
        $scope.myCartData = incDecService.removeProduct($scope.loggedIn,uid,$scope.myCartData,name);
    }
    
    $scope.logout = function(){
        authen.$signOut();
    }
    
    
    
    //---------------------------------------------------------------------------------------------------
    
    $scope.incQuantity = function(){
        console.log('run')
        $scope.quantity = $scope.quantity + 1;
    }
    
    $scope.decQuantity = function(){
        if($scope.quantity >= 2){
            $scope.quantity = $scope.quantity - 1;
        }
    }
    
    authen.$onAuthStateChanged(function(firebaseUser){
        if(firebaseUser){
            $scope.loggedIn = true;
            $scope.user = firebaseUser;
                var ref = firebase.database().ref('users/cart/' + $scope.user.uid);
                var refObject = $firebaseObject(ref);
                $scope.myPromise = refObject.$loaded().then(
                    function(data){
                        if(!data.quantity){
                            var toSave = {
                                quantity:0,
                                products: 'null',
                                total: 0
                            }
                            $scope.myCartData = toSave;
                            firebase.database().ref('users/cart/' + $scope.user.uid).set(toSave).then(
                                function(){
                                    console.log("Data saved first time");   
                                }
                            )
                        }
                        else{
                            $scope.myCartData = data;
                        }
                    },
                    function(){
                        console.log("Error occured");
                    }
                )

            $timeout(function(){
                console.log($scope.myCartData);
            },10000)
            
        }
        else{
            $scope.loggedIn = false;
            var cartData = $window.localStorage['cart'];
            if(!cartData){
                var toSave = {
                    quantity:0,
                    products: 'null',
                    total: 0
                }
                $window.localStorage['cart'] = JSON.stringify(toSave);
                console.log(toSave);
                $scope.myCartData = toSave;
            }
            else{
                cartData = JSON.parse(cartData);
                $scope.myCartData = cartData;
            }
            console.log($scope.myCartData);
        }
    })
    
    
    var id = $stateParams.id;
    var category = $stateParams.category;
    var subcat = $stateParams.subcat;
    
    var ref = firebase.database().ref('products/' + category + '/' + subcat + '/' + id);
    var refObject = $firebaseObject(ref);
    $scope.myPromise = refObject.$loaded().then(
        function(data){
            $scope.datum = data;
        
            console.log(data)
        }
    )
    
    $scope.addToCart = function(){
        
        add = true;
        
        if($scope.myCartData.quantity > 0){
            for(i = 0; i < $scope.myCartData.products.length; i++){
                if($scope.datum.name == $scope.myCartData.products[i].name){
                    add = false;
                    console.log("dup");
                    alert("Item already in cart")
                    break;
                }
            }
        }
        
        if(add){
            var quantity = $scope.myCartData.quantity + 1;
            var total = $scope.myCartData.total + ($scope.quantity * $scope.datum.price);
            if($scope.myCartData.products == "null"){
                var products = [];
            }
            else{
                var products = $scope.myCartData.products;
            }
            var product = {
                category : $scope.datum.category,
                description : $scope.datum.description,
                image : $scope.datum.image,
                mrp : $scope.datum.mrp,
                name : $scope.datum.name,
                price : $scope.datum.price,
                short : $scope.datum.short,
                subcat : $scope.datum.subcat,
                stock : $scope.datum.stock,
                quantity : $scope.quantity,
                id : $scope.datum.$id
            };
            products.push(product);
            $scope.myCartData = {quantity:quantity, total: total, products: products};
            if($scope.loggedIn){
                firebase.database().ref('users/cart/' + $scope.user.uid).set({quantity:quantity, total: total, products: products}).then(
                    function(){
                        console.log("Data saved successfully");
                    }
                )
            }
            else{
                $window.localStorage['cart'] = JSON.stringify({quantity:quantity, total: total, products: products});
                $scope.myCartData = {quantity:quantity, total: total, products: products};
            }
        }
    }
    
    //---------------------------------------------------------------------------------
    
     $scope.toShow = "chicken";
    
    $scope.mobNavShow = false;
    
    $scope.invertMobNav = function(){
        console.log('Running')
        $scope.mobNavShow = !$scope.mobNavShow;
    }
    
    $scope.changeCategory = function(id){
        $scope.toShow = id;
        $scope.enableCat = false;
    }
    
    /*Mob cart show*/
    
    $scope.mobCartShow = false;
    $scope.mobCartShowToggle = function(){
        $scope.mobCartShow = !$scope.mobCartShow;
    }
    
    //ends here
    
    $scope.enableCat = false;
    
    $scope.enableCategories = function(){
        console.log('run')
        $scope.enableCat = !$scope.enableCat;
    }
    
    // Checkout Part
    
    $scope.showCheckoutModal = function(){
        $('.checkoutModal').css("display","block");
    }
    
    $scope.hideCheckoutModal = function(){
        $('.checkoutModal').css("display","none");
    }
    
    $scope.decide = function(){
        if($scope.loggedIn){
            $state.go('checkoutDate',{email:"null@f.c"});
        }
        else{
            $scope.showCheckoutModal();
        }
    }
    
    
    
}])

app.controller('productListController',['$scope','$firebaseArray','$stateParams','cartService','$firebaseAuth','$window','incDecService','$timeout','$stateParams','$state','$firebaseObject',function($scope,$firebaseArray,$stateParams,cartService,$firebaseAuth,$window,incDecService,$timeout,$stateParams,$state,$firebaseObject){
    
    
    $.getScript('//cdn.jsdelivr.net/isotope/1.5.25/jquery.isotope.min.js',function(){

      /* activate jquery isotope */
      $('#posts').imagesLoaded( function(){
        $('#posts').isotope({
          itemSelector : '.item'
        });
      });

    });
    
    $scope.email = "";
    
    $scope.redirectCheckout = function(){
        $state.go('checkoutDate',{email: $scope.email});
    }
    
    var authen = $firebaseAuth();
    
    $scope.signInWithFacebook = function(redirect = false){
        if(redirect == true){
            $window.localStorage['navfreshCheckout'] = "true";
        }
        authen.$signInWithRedirect("facebook").then(function() {
            // Never called because of page redirect
            // Instead, use $onAuthStateChanged() to detect successful authentication
        }).catch(function(error) {
          console.error("Authentication failed:", error);
        });
    }
    
    $scope.signInWithGoogle = function(redirect = false){
        if(redirect == true){
            $window.localStorage['navfreshCheckout'] = "true";
        }
        authen.$signInWithRedirect("google").then(function() {
            // Never called because of page redirect
            // Instead, use $onAuthStateChanged() to detect successful authentication
        }).catch(function(error) {
          console.error("Authentication failed:", error);
        });
    }
    
    $scope.showLoginModal = function(){
        $('.loganModal').css("display","block");
    }
    
    $scope.hideLoginModal = function(){
        $('.loganModal').css("display","none");
    }
    
    
    
    $scope.toggleHelp = false;

    $scope.toggle = function(){
        $scope.toggleHelp = !$scope.toggleHelp;
    }
    
    $("div .closeIt").click(function(){
        $scope.toggleHelp = false;
        $scope.$apply();
        console.log("clicked")
    })
    
    $scope.quantity = 1;
    
    $scope.itemInc = function(name){
        if(!$scope.loggedIn){
            uid = "";
        }
        else{
            uid = $scope.user.uid;
        }
        $scope.myCartData = incDecService.increment($scope.loggedIn,uid,$scope.myCartData,name);
    }
    
    $scope.itemDec = function(name){
        if(!$scope.loggedIn){
            uid = "";
        }
        else{
            uid = $scope.user.uid;
        }
        $scope.myCartData = incDecService.decrement($scope.loggedIn,uid,$scope.myCartData,name);
    }
    
    $scope.removeItem = function(name){
        if(!$scope.loggedIn){
            uid = "";
        }
        else{
            uid = $scope.user.uid;
        }
        $scope.myCartData = incDecService.removeProduct($scope.loggedIn,uid,$scope.myCartData,name);
    }
    
    $scope.logout = function(){
        authen.$signOut();
    }
    
    
    
    //---------------------------------------------------------------------------------------------------
    
    $scope.incQuantity = function(){
        console.log('run')
        $scope.quantity = $scope.quantity + 1;
    }
    
    $scope.decQuantity = function(){
        if($scope.quantity >= 2){
            $scope.quantity = $scope.quantity - 1;
        }
    }
    
    
    
    authen.$onAuthStateChanged(function(firebaseUser){
        if(firebaseUser){
            var navfreshCheckout = $window.localStorage['navfreshCheckout'];
            if(navfreshCheckout == "true"){
                var products = [];
                var quantity = 0;
                var total = 0;
                var myCartData = JSON.parse($window.localStorage['cart']);
                console.log(myCartData);
                var product = {};
                for(let item in myCartData.products){
                    console.log(myCartData.products[item]);
                    product[myCartData.products[item].id] = {};
                    var ref = firebase.database().ref('products/' + myCartData.products[item].category + '/' + myCartData.products[item].subcat + '/' + myCartData.products[item].id);
                    var refObject = $firebaseObject(ref);
                    $scope.myPromise = refObject.$loaded().then(
                        function(data){
                            console.log(product);
                            product[myCartData.products[item].id].category = data.category;
                            product[myCartData.products[item].id].id = data.$id;
                            product[myCartData.products[item].id].description = data.description;
                            product[myCartData.products[item].id].image = data.image;
                            product[myCartData.products[item].id].mrp = data.mrp;
                            product[myCartData.products[item].id].name = data.name;
                            product[myCartData.products[item].id].price = data.price;
                            product[myCartData.products[item].id].short = data.short;
                            product[myCartData.products[item].id].subcat = data.subcat;
                            product[myCartData.products[item].id].quantity = myCartData.products[item].quantity;
                            products.push(product[myCartData.products[item].id]);
                            total = total + (product[myCartData.products[item].id].price * product[myCartData.products[item].id].quantity); 
                            quantity = quantity + 1;
                        }
                    )
                }
                
                timout = function(){
                    $timeout(function(){
                        if(quantity == myCartData.quantity){
                            console.log(products);
                            console.log(total);
                            console.log(quantity);
                            firebase.database().ref('users/cart/' + firebaseUser.uid).set({products: products, quantity: quantity, total: total}).then(
                                function(){
                                    console.log("data saved")
                                }
                            )
                        }
                        else{
                            timout();
                        }
                    },2000)
                }
                
                timout();
                
                $window.localStorage['navfreshCheckout'] = "false";
                return;
                
            }
            $scope.loggedIn = true;
            $scope.user = firebaseUser;
                var ref = firebase.database().ref('users/cart/' + $scope.user.uid);
                var refObject = $firebaseObject(ref);
                $scope.myPromise = $scope.myPromise = refObject.$loaded().then(
                    function(data){
                        if(!data.quantity){
                            var toSave = {
                                quantity:0,
                                products: 'null',
                                total: 0
                            }
                            $scope.myCartData = toSave;
                            firebase.database().ref('users/cart/' + $scope.user.uid).set(toSave).then(
                                function(){
                                    console.log("Data saved first time");   
                                }
                            )
                        }
                        else{
                            $scope.myCartData = data;
                        }
                    },
                    function(){
                        console.log("Error occured");
                    }
                )

            $timeout(function(){
                console.log($scope.myCartData);
            },10000)
            
        }
        else{
            $scope.loggedIn = false;
            var cartData = $window.localStorage['cart'];
            if(!cartData){
                var toSave = {
                    quantity:0,
                    products: 'null',
                    total: 0
                }
                $window.localStorage['cart'] = JSON.stringify(toSave);
                console.log(toSave);
                $scope.myCartData = toSave;
            }
            else{
                cartData = JSON.parse(cartData);
                $scope.myCartData = cartData;
            }
            console.log($scope.myCartData);
        }
    })
    
    
    
    var category = $stateParams.category;
    var subcat = $stateParams.subcat;

    $scope.sub = subcat;
    
    $scope.notMarinated = false;
    
    if(subcat != "Marinated"){
        var ref = firebase.database().ref('products/' + category + '/' + subcat);
        var refObject = $firebaseArray(ref);
        $scope.myPromise = refObject.$loaded().then(
            function(data){
                $scope.datum = data;
                console.log(data)
            }
        )
    }
    else{
        $scope.isMarinated = true;
        
        var ref = firebase.database().ref('products/' + subcat + '/' + 'Chicken');
        var refObject = $firebaseArray(ref);
        $scope.myPromise = refObject.$loaded().then(
            function(data){
                $scope.chicken = data;
                console.log(data)
            }
        )
        
        var ref1 = firebase.database().ref('products/' + subcat + '/' + 'Fish');
        var refObject1 = $firebaseArray(ref1);
        $scope.myPromise = refObject1.$loaded().then(
            function(data){
                $scope.fish = data;
                console.log(data)
            }
        )
        
        var ref2 = firebase.database().ref('products/' + subcat + '/' + 'Prawns');
        var refObject2 = $firebaseArray(ref2);
        $scope.myPromise = refObject2.$loaded().then(
            function(data){
                $scope.prawns = data;
                console.log(data)
            }
        )
    }
    
    
    $scope.addToCart = function(item){
        
        add = true;
        
        if($scope.myCartData.quantity > 0){
            for(i = 0; i < $scope.myCartData.products.length; i++){
                if(item.name == $scope.myCartData.products[i].name){
                    add = false;
                    console.log("dup");
                    alert("Item already in cart")
                    break;
                }
            }
        }
        
        if(add){
            var quantity = $scope.myCartData.quantity + 1;
            var total = $scope.myCartData.total + ($scope.quantity * item.price);
            if($scope.myCartData.products == "null"){
                var products = [];
            }
            else{
                var products = $scope.myCartData.products;
            }
            var product = {
                category : item.category,
                description : item.description,
                image : item.image,
                mrp : item.mrp,
                name : item.name,
                price : item.price,
                short : item.short,
                subcat : item.subcat,
                stock : item.stock,
                quantity : $scope.quantity,
                id : item.$id,
            };
            products.push(product);
            $scope.myCartData = {quantity:quantity, total: total, products: products};
            if($scope.loggedIn){
                firebase.database().ref('users/cart/' + $scope.user.uid).set({quantity:quantity, total: total, products: products}).then(
                    function(){
                        console.log("Data saved successfully");
                    }
                )
            }
            else{
                $window.localStorage['cart'] = JSON.stringify({quantity:quantity, total: total, products: products});
                $scope.myCartData = {quantity:quantity, total: total, products: products};
            }
        }
    }
    
    //---------------------------------------------------------------------------------
    
     $scope.toShow = "chicken";
    
    $scope.mobNavShow = false;
    
    $scope.invertMobNav = function(){
        console.log('Running')
        $scope.mobNavShow = !$scope.mobNavShow;
    }
    
    $scope.changeCategory = function(id){
        $scope.toShow = id;
        $scope.enableCat = false;
    }
    
    /*Mob cart show*/
    
    $scope.mobCartShow = false;
    $scope.mobCartShowToggle = function(){
        $scope.mobCartShow = !$scope.mobCartShow;
    }
    
    //ends here
    
    $scope.enableCat = false;
    
    $scope.enableCategories = function(){
        console.log('run')
        $scope.enableCat = !$scope.enableCat;
    }
    
    // The checkout part
    
    $scope.showCheckoutModal = function(){
        $('.checkoutModal').css("display","block");
    }
    
    $scope.hideCheckoutModal = function(){
        $('.checkoutModal').css("display","none");
    }
    
    $scope.decide = function(){
        if($scope.loggedIn){
            $state.go('checkoutDate',{email:"null@f.c"});
        }
        else{
            $scope.showCheckoutModal();
        }
    }
    
    
}])

app.controller('aboutUsController',['$scope','$firebaseAuth','$firebaseObject','$window','$state',function($scope,$firebaseAuth, $firebaseObject, $window, $state){
    
    $scope.toShowRedirect = function(){
        var toShow = $scope.toShow.charAt(0).toUpperCase() + $scope.toShow.slice(1);
        $state.go('productList',{category:"Raw", subcat: toShow});
    }
    
    $scope.email = "";
    
    $scope.redirectCheckout = function(){
        $state.go('checkoutDate',{email: $scope.email});
    }
    
     var authen = $firebaseAuth();
    
    
    $scope.signInWithFacebook = function(){
        authen.$signInWithRedirect("facebook").then(function() {
            // Never called because of page redirect
            // Instead, use $onAuthStateChanged() to detect successful authentication
        }).catch(function(error) {
          console.error("Authentication failed:", error);
        });
    }
    
    $scope.signInWithGoogle = function(){
        authen.$signInWithRedirect("google").then(function() {
            // Never called because of page redirect
            // Instead, use $onAuthStateChanged() to detect successful authentication
        }).catch(function(error) {
          console.error("Authentication failed:", error);
        });
    }
    
    $scope.showLoginModal = function(){
        $('.loganModal').css("display","block");
    }
    
    $scope.hideLoginModal = function(){
        $('.loganModal').css("display","none");
    }
    
    $scope.toggleHelp = false;

    $scope.toggle = function(){
        $scope.toggleHelp = !$scope.toggleHelp;
    }
    
    $("div .closeIt").click(function(){
        $scope.toggleHelp = false;
        $scope.$apply();
        console.log("clicked")
    })
    
    $scope.quantity = 1;
    
    $scope.itemInc = function(name){
        if(!$scope.loggedIn){
            uid = "";
        }
        else{
            uid = $scope.user.uid;
        }
        $scope.myCartData = incDecService.increment($scope.loggedIn,uid,$scope.myCartData,name);
    }
    
    $scope.itemDec = function(name){
        if(!$scope.loggedIn){
            uid = "";
        }
        else{
            uid = $scope.user.uid;
        }
        $scope.myCartData = incDecService.decrement($scope.loggedIn,uid,$scope.myCartData,name);
    }
    
    $scope.removeItem = function(name){
        if(!$scope.loggedIn){
            uid = "";
        }
        else{
            uid = $scope.user.uid;
        }
        $scope.myCartData = incDecService.removeProduct($scope.loggedIn,uid,$scope.myCartData,name);
    }
    
    $scope.logout = function(){
        authen.$signOut();
    }
    
    /*---------------------------------------------------------------------------------------------*/
    
    var authen = $firebaseAuth();
    
    authen.$onAuthStateChanged(function(firebaseUser){
        if(firebaseUser){
            $scope.loggedIn = true;
            $scope.user = firebaseUser;
                var ref = firebase.database().ref('users/cart/' + $scope.user.uid);
                var refObject = $firebaseObject(ref);
                refObject.$loaded().then(
                    function(data){
                        if(!data.quantity){
                            var toSave = {
                                quantity:0,
                                products: 'null',
                                total: 0
                            }
                            $scope.myCartData = toSave;
                            firebase.database().ref('users/cart/' + $scope.user.uid).set(toSave).then(
                                function(){
                                    console.log("Data saved first time");   
                                }
                            )
                        }
                        else{
                            $scope.myCartData = data;
                        }
                    },
                    function(){
                        console.log("Error occured");
                    }
                )

            $timeout(function(){
                console.log($scope.myCartData);
            },10000)
            
        }
        else{
            $scope.loggedIn = false;
            var cartData = $window.localStorage['cart'];
            if(!cartData){
                var toSave = {
                    quantity:0,
                    products: 'null',
                    total: 0
                }
                $window.localStorage['cart'] = JSON.stringify(toSave);
                console.log(toSave);
                $scope.myCartData = toSave;
            }
            else{
                cartData = JSON.parse(cartData);
                $scope.myCartData = cartData;
            }
            console.log($scope.myCartData);
        }
    })
    
    $scope.toShow = "chicken";
    
    $scope.mobNavShow = false;
    
    $scope.invertMobNav = function(){
        console.log('Running')
        $scope.mobNavShow = !$scope.mobNavShow;
    }
    
    $scope.changeCategory = function(id){
        $scope.toShow = id;
        $scope.enableCat = false;
    }
    
    /*Mob cart show*/
    
    $scope.mobCartShow = false;
    $scope.mobCartShowToggle = function(){
        $scope.mobCartShow = !$scope.mobCartShow;
    }
    
    //ends here
    
    $scope.enableCat = false;
    
    $scope.enableCategories = function(){
        console.log('run')
        $scope.enableCat = !$scope.enableCat;
    }
    
    // Checkout Part
    
    $scope.showCheckoutModal = function(){
        $('.checkoutModal').css("display","block");
    }
    
    $scope.hideCheckoutModal = function(){
        $('.checkoutModal').css("display","none");
    }
    
    $scope.decide = function(){
        if($scope.loggedIn){
            $state.go('checkoutDate',{email:"null@f.c"});
        }
        else{
            $scope.showCheckoutModal();
        }
    }
    
     
    
}])

app.controller('privacyPolicyController',['$scope','$firebaseAuth','$firebaseObject','$window','$state',function($scope,$firebaseAuth, $firebaseObject, $window, $state){
    
    $scope.toShowRedirect = function(){
        var toShow = $scope.toShow.charAt(0).toUpperCase() + $scope.toShow.slice(1);
        $state.go('productList',{category:"Raw", subcat: toShow});
    }
    
    $scope.email = "";
    
    $scope.redirectCheckout = function(){
        $state.go('checkoutDate',{email: $scope.email});
    }
    
     var authen = $firebaseAuth();
    
    
    $scope.signInWithFacebook = function(){
        authen.$signInWithRedirect("facebook").then(function() {
            // Never called because of page redirect
            // Instead, use $onAuthStateChanged() to detect successful authentication
        }).catch(function(error) {
          console.error("Authentication failed:", error);
        });
    }
    
    $scope.signInWithGoogle = function(){
        authen.$signInWithRedirect("google").then(function() {
            // Never called because of page redirect
            // Instead, use $onAuthStateChanged() to detect successful authentication
        }).catch(function(error) {
          console.error("Authentication failed:", error);
        });
    }
    
    $scope.showLoginModal = function(){
        $('.loganModal').css("display","block");
    }
    
    $scope.hideLoginModal = function(){
        $('.loganModal').css("display","none");
    }
    
    $scope.toggleHelp = false;

    $scope.toggle = function(){
        $scope.toggleHelp = !$scope.toggleHelp;
    }
    
    $("div .closeIt").click(function(){
        $scope.toggleHelp = false;
        $scope.$apply();
        console.log("clicked")
    })
    
    $scope.quantity = 1;
    
    $scope.itemInc = function(name){
        if(!$scope.loggedIn){
            uid = "";
        }
        else{
            uid = $scope.user.uid;
        }
        $scope.myCartData = incDecService.increment($scope.loggedIn,uid,$scope.myCartData,name);
    }
    
    $scope.itemDec = function(name){
        if(!$scope.loggedIn){
            uid = "";
        }
        else{
            uid = $scope.user.uid;
        }
        $scope.myCartData = incDecService.decrement($scope.loggedIn,uid,$scope.myCartData,name);
    }
    
    $scope.removeItem = function(name){
        if(!$scope.loggedIn){
            uid = "";
        }
        else{
            uid = $scope.user.uid;
        }
        $scope.myCartData = incDecService.removeProduct($scope.loggedIn,uid,$scope.myCartData,name);
    }
    
    $scope.logout = function(){
        authen.$signOut();
    }
    
    /*---------------------------------------------------------------------------------------------*/
    
    var authen = $firebaseAuth();
    
    authen.$onAuthStateChanged(function(firebaseUser){
        if(firebaseUser){
            $scope.loggedIn = true;
            $scope.user = firebaseUser;
                var ref = firebase.database().ref('users/cart/' + $scope.user.uid);
                var refObject = $firebaseObject(ref);
                refObject.$loaded().then(
                    function(data){
                        if(!data.quantity){
                            var toSave = {
                                quantity:0,
                                products: 'null',
                                total: 0
                            }
                            $scope.myCartData = toSave;
                            firebase.database().ref('users/cart/' + $scope.user.uid).set(toSave).then(
                                function(){
                                    console.log("Data saved first time");   
                                }
                            )
                        }
                        else{
                            $scope.myCartData = data;
                        }
                    },
                    function(){
                        console.log("Error occured");
                    }
                )

            $timeout(function(){
                console.log($scope.myCartData);
            },10000)
            
        }
        else{
            $scope.loggedIn = false;
            var cartData = $window.localStorage['cart'];
            if(!cartData){
                var toSave = {
                    quantity:0,
                    products: 'null',
                    total: 0
                }
                $window.localStorage['cart'] = JSON.stringify(toSave);
                console.log(toSave);
                $scope.myCartData = toSave;
            }
            else{
                cartData = JSON.parse(cartData);
                $scope.myCartData = cartData;
            }
            console.log($scope.myCartData);
        }
    })
    
    $scope.toShow = "chicken";
    
    $scope.mobNavShow = false;
    
    $scope.invertMobNav = function(){
        console.log('Running')
        $scope.mobNavShow = !$scope.mobNavShow;
    }
    
    $scope.changeCategory = function(id){
        $scope.toShow = id;
        $scope.enableCat = false;
    }
    
    /*Mob cart show*/
    
    $scope.mobCartShow = false;
    $scope.mobCartShowToggle = function(){
        $scope.mobCartShow = !$scope.mobCartShow;
    }
    
    //ends here
    
    $scope.enableCat = false;
    
    $scope.enableCategories = function(){
        console.log('run')
        $scope.enableCat = !$scope.enableCat;
    }
    
    // Checkout Part
    
    $scope.showCheckoutModal = function(){
        $('.checkoutModal').css("display","block");
    }
    
    $scope.hideCheckoutModal = function(){
        $('.checkoutModal').css("display","none");
    }
    
    $scope.decide = function(){
        if($scope.loggedIn){
            $state.go('checkoutDate',{email:"null@f.c"});
        }
        else{
            $scope.showCheckoutModal();
        }
    }
    
     
    
}])

app.controller('contactusController',['$scope','$firebaseAuth','$firebaseObject','$window','$state',function($scope,$firebaseAuth, $firebaseObject, $window, $state){
    
    $scope.toShowRedirect = function(){
        var toShow = $scope.toShow.charAt(0).toUpperCase() + $scope.toShow.slice(1);
        $state.go('productList',{category:"Raw", subcat: toShow});
    }
    
    $scope.email = "";
    
    $scope.redirectCheckout = function(){
        $state.go('checkoutDate',{email: $scope.email});
    }
    
     var authen = $firebaseAuth();
    
    
    $scope.signInWithFacebook = function(){
        authen.$signInWithRedirect("facebook").then(function() {
            // Never called because of page redirect
            // Instead, use $onAuthStateChanged() to detect successful authentication
        }).catch(function(error) {
          console.error("Authentication failed:", error);
        });
    }
    
    $scope.signInWithGoogle = function(){
        authen.$signInWithRedirect("google").then(function() {
            // Never called because of page redirect
            // Instead, use $onAuthStateChanged() to detect successful authentication
        }).catch(function(error) {
          console.error("Authentication failed:", error);
        });
    }
    
    $scope.showLoginModal = function(){
        $('.loganModal').css("display","block");
    }
    
    $scope.hideLoginModal = function(){
        $('.loganModal').css("display","none");
    }
    
    $scope.toggleHelp = false;

    $scope.toggle = function(){
        $scope.toggleHelp = !$scope.toggleHelp;
    }
    
    $("div .closeIt").click(function(){
        $scope.toggleHelp = false;
        $scope.$apply();
        console.log("clicked")
    })
    
    $scope.quantity = 1;
    
    $scope.itemInc = function(name){
        if(!$scope.loggedIn){
            uid = "";
        }
        else{
            uid = $scope.user.uid;
        }
        $scope.myCartData = incDecService.increment($scope.loggedIn,uid,$scope.myCartData,name);
    }
    
    $scope.itemDec = function(name){
        if(!$scope.loggedIn){
            uid = "";
        }
        else{
            uid = $scope.user.uid;
        }
        $scope.myCartData = incDecService.decrement($scope.loggedIn,uid,$scope.myCartData,name);
    }
    
    $scope.removeItem = function(name){
        if(!$scope.loggedIn){
            uid = "";
        }
        else{
            uid = $scope.user.uid;
        }
        $scope.myCartData = incDecService.removeProduct($scope.loggedIn,uid,$scope.myCartData,name);
    }
    
    $scope.logout = function(){
        authen.$signOut();
    }
    
    /*---------------------------------------------------------------------------------------------*/
    
    var authen = $firebaseAuth();
    
    authen.$onAuthStateChanged(function(firebaseUser){
        if(firebaseUser){
            $scope.loggedIn = true;
            $scope.user = firebaseUser;
                var ref = firebase.database().ref('users/cart/' + $scope.user.uid);
                var refObject = $firebaseObject(ref);
                refObject.$loaded().then(
                    function(data){
                        if(!data.quantity){
                            var toSave = {
                                quantity:0,
                                products: 'null',
                                total: 0
                            }
                            $scope.myCartData = toSave;
                            firebase.database().ref('users/cart/' + $scope.user.uid).set(toSave).then(
                                function(){
                                    console.log("Data saved first time");   
                                }
                            )
                        }
                        else{
                            $scope.myCartData = data;
                        }
                    },
                    function(){
                        console.log("Error occured");
                    }
                )

            $timeout(function(){
                console.log($scope.myCartData);
            },10000)
            
        }
        else{
            $scope.loggedIn = false;
            var cartData = $window.localStorage['cart'];
            if(!cartData){
                var toSave = {
                    quantity:0,
                    products: 'null',
                    total: 0
                }
                $window.localStorage['cart'] = JSON.stringify(toSave);
                console.log(toSave);
                $scope.myCartData = toSave;
            }
            else{
                cartData = JSON.parse(cartData);
                $scope.myCartData = cartData;
            }
            console.log($scope.myCartData);
        }
    })
    
    $scope.toShow = "chicken";
    
    $scope.mobNavShow = false;
    
    $scope.invertMobNav = function(){
        console.log('Running')
        $scope.mobNavShow = !$scope.mobNavShow;
    }
    
    $scope.changeCategory = function(id){
        $scope.toShow = id;
        $scope.enableCat = false;
    }
    
    /*Mob cart show*/
    
    $scope.mobCartShow = false;
    $scope.mobCartShowToggle = function(){
        $scope.mobCartShow = !$scope.mobCartShow;
    }
    
    //ends here
    
    $scope.enableCat = false;
    
    $scope.enableCategories = function(){
        console.log('run')
        $scope.enableCat = !$scope.enableCat;
    }
    
    // Checkout Part
    
    $scope.showCheckoutModal = function(){
        $('.checkoutModal').css("display","block");
    }
    
    $scope.hideCheckoutModal = function(){
        $('.checkoutModal').css("display","none");
    }
    
    $scope.decide = function(){
        if($scope.loggedIn){
            $state.go('checkoutDate',{email:"null@f.c"});
        }
        else{
            $scope.showCheckoutModal();
        }
    }
    
     
    
}])


app.controller('tncController',['$scope','$firebaseAuth','$firebaseObject','$window','$state',function($scope,$firebaseAuth, $firebaseObject, $window, $state){
    
    $scope.toShowRedirect = function(){
        var toShow = $scope.toShow.charAt(0).toUpperCase() + $scope.toShow.slice(1);
        $state.go('productList',{category:"Raw", subcat: toShow});
    }
    
    $scope.email = "";
    
    $scope.redirectCheckout = function(){
        $state.go('checkoutDate',{email: $scope.email});
    }
    
     var authen = $firebaseAuth();
    
    
    $scope.signInWithFacebook = function(){
        authen.$signInWithRedirect("facebook").then(function() {
            // Never called because of page redirect
            // Instead, use $onAuthStateChanged() to detect successful authentication
        }).catch(function(error) {
          console.error("Authentication failed:", error);
        });
    }
    
    $scope.signInWithGoogle = function(){
        authen.$signInWithRedirect("google").then(function() {
            // Never called because of page redirect
            // Instead, use $onAuthStateChanged() to detect successful authentication
        }).catch(function(error) {
          console.error("Authentication failed:", error);
        });
    }
    
    $scope.showLoginModal = function(){
        $('.loganModal').css("display","block");
    }
    
    $scope.hideLoginModal = function(){
        $('.loganModal').css("display","none");
    }
    
    $scope.toggleHelp = false;

    $scope.toggle = function(){
        $scope.toggleHelp = !$scope.toggleHelp;
    }
    
    $("div .closeIt").click(function(){
        $scope.toggleHelp = false;
        $scope.$apply();
        console.log("clicked")
    })
    
    $scope.quantity = 1;
    
    $scope.itemInc = function(name){
        if(!$scope.loggedIn){
            uid = "";
        }
        else{
            uid = $scope.user.uid;
        }
        $scope.myCartData = incDecService.increment($scope.loggedIn,uid,$scope.myCartData,name);
    }
    
    $scope.itemDec = function(name){
        if(!$scope.loggedIn){
            uid = "";
        }
        else{
            uid = $scope.user.uid;
        }
        $scope.myCartData = incDecService.decrement($scope.loggedIn,uid,$scope.myCartData,name);
    }
    
    $scope.removeItem = function(name){
        if(!$scope.loggedIn){
            uid = "";
        }
        else{
            uid = $scope.user.uid;
        }
        $scope.myCartData = incDecService.removeProduct($scope.loggedIn,uid,$scope.myCartData,name);
    }
    
    $scope.logout = function(){
        authen.$signOut();
    }
    
    /*---------------------------------------------------------------------------------------------*/
    
    var authen = $firebaseAuth();
    
    authen.$onAuthStateChanged(function(firebaseUser){
        if(firebaseUser){
            $scope.loggedIn = true;
            $scope.user = firebaseUser;
                var ref = firebase.database().ref('users/cart/' + $scope.user.uid);
                var refObject = $firebaseObject(ref);
                refObject.$loaded().then(
                    function(data){
                        if(!data.quantity){
                            var toSave = {
                                quantity:0,
                                products: 'null',
                                total: 0
                            }
                            $scope.myCartData = toSave;
                            firebase.database().ref('users/cart/' + $scope.user.uid).set(toSave).then(
                                function(){
                                    console.log("Data saved first time");   
                                }
                            )
                        }
                        else{
                            $scope.myCartData = data;
                        }
                    },
                    function(){
                        console.log("Error occured");
                    }
                )

            $timeout(function(){
                console.log($scope.myCartData);
            },10000)
            
        }
        else{
            $scope.loggedIn = false;
            var cartData = $window.localStorage['cart'];
            if(!cartData){
                var toSave = {
                    quantity:0,
                    products: 'null',
                    total: 0
                }
                $window.localStorage['cart'] = JSON.stringify(toSave);
                console.log(toSave);
                $scope.myCartData = toSave;
            }
            else{
                cartData = JSON.parse(cartData);
                $scope.myCartData = cartData;
            }
            console.log($scope.myCartData);
        }
    })
    
    $scope.toShow = "chicken";
    
    $scope.mobNavShow = false;
    
    $scope.invertMobNav = function(){
        console.log('Running')
        $scope.mobNavShow = !$scope.mobNavShow;
    }
    
    $scope.changeCategory = function(id){
        $scope.toShow = id;
        $scope.enableCat = false;
    }
    
    /*Mob cart show*/
    
    $scope.mobCartShow = false;
    $scope.mobCartShowToggle = function(){
        $scope.mobCartShow = !$scope.mobCartShow;
    }
    
    //ends here
    
    $scope.enableCat = false;
    
    $scope.enableCategories = function(){
        console.log('run')
        $scope.enableCat = !$scope.enableCat;
    }
    
    // Checkout Part
    
    $scope.showCheckoutModal = function(){
        $('.checkoutModal').css("display","block");
    }
    
    $scope.hideCheckoutModal = function(){
        $('.checkoutModal').css("display","none");
    }
    
    $scope.decide = function(){
        if($scope.loggedIn){
            $state.go('checkoutDate',{email:"null@f.c"});
        }
        else{
            $scope.showCheckoutModal();
        }
    }
    
     
    
}])




app.controller('checkoutDateController',['$scope','$firebaseObject','$firebaseAuth','$firebaseArray','$window','$stateParams','$state',function($scope, $firebaseObject,$firebaseAuth,$firebaseArray,$window,$stateParams,$state){
    
    
    $scope.noAddress = true;
    
    $scope.netTotal = true;
    
    $scope.success = false;
    
    $scope.formData = {
        name : "",
        fNo : "",
        address : "",
        pincode : "",
        type: "",
        contact: "",
    }
    
    
    var authen = $firebaseAuth();
    var ifReload = function(){
        authen.$onAuthStateChanged(function(firebaseUser){
            console.log('run')
            if(firebaseUser){
                $scope.user = firebaseUser;
                $scope.loggedIn = true;
                console.log('logged in')
                var ref = firebase.database().ref('users/cart/' + firebaseUser.uid);
                var refObject = $firebaseObject(ref);
                $scope.myPromise = refObject.$loaded().then(
                    function(data){
                        $scope.myCartData = data;
                        console.log(data);
                    }
                )
                var ref = firebase.database().ref('users/address/' + firebaseUser.uid);
                var refObject = $firebaseArray(ref);
                $scope.myPromise = refObject.$loaded().then(
                    function(data){
                        $scope.address = data;
                        if(data){
                            $scope.noAddress = false;
                        }
                        console.log(data);
                    }
                )
            }
            else{
                var cart = $window.localStorage['cart'];
                if(cart){
                    $scope.myCartData = JSON.parse(cart);
                }
                else{
                    $state.go('home');
                }
                
                $scope.loggedIn = false;
                var address = $window.localStorage['navfreshAddress'];

                if(address){
                    $scope.address = JSON.parse(address);
                    $scope.noAddress = false;
                    console.log(address);
                }
            }
        })
    }
    
    ifReload();
    
    
    $scope.addAddress = function(){
        if($scope.loggedIn){
            var key = firebase.database().ref('users/address/' + $scope.user.uid).push().key;
            $scope.formData.id = key;
            $scope.myPromise = firebase.database().ref('users/address/' + $scope.user.uid + '/' + key).set($scope.formData).then(
                function(){
                    console.log("Address added successfully");
                }
            )
        }
        else{
            var rand = Math.floor((Math.random() * 100) + 1);
            $scope.formData.id = rand;
            var address = $window.localStorage['navfreshAddress'];
            if(address){
                address = JSON.parse(angular.toJson(address));
            }
            if(!address){
                address = [];
            }
            address.push($scope.formData);
            $window.localStorage['navfreshAddress'] = JSON.stringify(address, function(key,value){
                if(key === "$$hashKey"){
                    return undefined;
                }
                return value;
            });
        }
        $('#myModal').modal('hide');
        ifReload();
    }
    
    $scope.removeAddress = function(id){
        if($scope.loggedIn){
            for(i in $scope.address){
                if($scope.address[i].id == id){
                    $scope.address.splice(i,1);
                    break;
                }
            }
            
            $scope.myPromise = firebase.database().ref('users/address/' + $scope.user.uid + '/' + key).set($scope.address).then(
                function(){
                    console.log("Address added successfully");
                }
            )
        }
        else{
            for(i in $scope.address){
                if($scope.address[i].id == id){
                    $scope.address.splice(i,1);
                    break;
                }
            }
            $window.localStorage['navfreshAddress'] = JSON.stringify($scope.address);
        }
    }
    
    
    var months = ['January','Febuary','March','April','May','June','July','August','Septemter','October','November','December'];
    
    $scope.selectedDate = "";
    
    $scope.selectedTime = "Select Delivery time slot";
    
    $scope.timeDisable = {
        one : false,
        two : false,
        three : false,
        four : false,
    }
    
    $scope.cod = "cod";
    
    
    $scope.showTimeSlot = false;
    
    $scope.modeOn = false;
    
    $scope.showAddress = false;
    
    $scope.showDateSelection = true;
    
    $scope.heading = "Select Date/Time";
    
    $scope.modeOfPayment = function(address){
        $scope.selectedAddress = address;
        $scope.heading = "";
        $scope.showAddress = false;
        $scope.modeOn = true;
    }
    
    $scope.dateCheckout = function(){
        if($scope.selectedTime == "Select Delivery time slot"){
            alert("Please select a valid time slot");
        }
        else{
            $scope.showTimeSlot = false;
            $scope.showDateSelection = false;
            $scope.showAddress = true;
            $scope.heading = "Select Address";
        }
    }
    
    $scope.dateClick = function(data){
        console.log("run")
        console.log(data);
        $scope.selectedDate = data;
        $scope.showCalendar = false;
        $scope.inputShow = String($scope.selectedDate['day']) + ' ' + months[$scope.selectedDate['month']];
        var currentDate = new Date();
        var date = currentDate.getDate();
        console.log(date);
        console.log($scope.selectedDate.day);
        if(date == $scope.selectedDate.day){
            console.log("true")
            var hour = currentDate.getHours();
            console.log(hour)
            if(hour > 9){
                $scope.timeDisable.one = false;
            }
            if(hour > 12){
                $scope.timeDisable.two = false;
                $scope.timeDisable.one = false;
            }
            if(hour > 3){
                $scope.timeDisable.three = false;
                $scope.timeDisable.two = false;
                $scope.timeDisable.one = false;
            }
            if(hour > 6){
                $scope.timeDisable.four = false;
                $scope.timeDisable.three = false;
                $scope.timeDisable.two = false;
                $scope.timeDisable.one = false;
            }
            console.log($scope.timeDisable);
        }
        $scope.showTimeSlot = true;
    }
    
    var currentDate = new Date();
    var date = currentDate.getDate();
    var month = currentDate.getMonth();
    var year = currentDate.getFullYear();
    console.log(date)
    console.log(month)
    console.log(year)
    
    $scope.calendarOptions = {
        defaultDate: "2017-10-10",
    
        minDate: new Date(year,month,date),
        maxDate: new Date([2020, 12, 31]),
        dayNamesLength: 3, // How to display weekdays (1 for "M", 2 for "Mo", 3 for "Mon"; 9 will show full day names; default is 1)
        multiEventDates: true, // Set the calendar to render multiple events in the same day or only one event, default is false
        maxEventsPerDay: 1, // Set how many events should the calendar display before showing the 'More Events' message, default is 3;

        dateClick: $scope.dateClick,
      };
    
    $scope.events = [
      {title: 'NY', date: new Date([2015, 12, 31])},
      {title: 'ID', date: new Date([2015, 6, 4])}
    ];
    
    $scope.showCalendar = false;
    
    $scope.inputShow = "Click here to select a date"
    
    $scope.toggleCalendar = function(){
        $scope.showCalendar = !$scope.showCalendar;
    }
    
    var email = $stateParams.email;
    
    $scope.placeOrder = function(){
        
        delete $scope.selectedAddress['$$hashKey'];
        delete $scope.selectedAddress['$id'];
        delete $scope.selectedAddress['$priority'];
        for(i in $scope.myCartData.products){
            delete $scope.myCartData.products[i].$$hashkey;
            console.log( $scope.myCartData.products[i])
        }
        delete $scope.myCartData['$$conf'];
        delete $scope.myCartData['$id'];
        delete $scope.myCartData['$priority'];
        delete $scope.myCartData['$resolved'];
        console.log($scope.myCartData);
        console.log($scope.selectedAddress);
        var orderData = {date: $scope.selectedDate, time: $scope.selectedTime, address: $scope.selectedAddress, otime: currentDate, cart: $scope.myCartData}
        if($scope.loggedIn){
            
            var key = firebase.database().ref('users/orders/' + $scope.user.uid).push().key;
            $scope.myPromise = firebase.database().ref('users/orders/' + $scope.user.uid + '/' + key).set(orderData).then(
                function(){
                    console.log('Done dona done done');
                    $scope.modeOn = false;
                    $scope.netTotal = false;
                    $scope.success = true;
                    $scope.$apply();
                }
            )
        }
        else{
            orderData.email = email;
            var key = firebase.database().ref('guestUsers/orders').push().key;
            $scope.myPromise = firebase.database().ref('guestUsers/orders/' + key).set(orderData).then(
                function(){
                    console.log('Done dona done done guest');
                    $scope.modeOn = false;
                    $scope.netTotal = false;
                    $scope.success = true;
                    $scope.$apply();
                }
            )
        }
    }
    
    

}])



