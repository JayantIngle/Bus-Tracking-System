app.service('updateDelete',['$firebaseObject','$state',function($firebaseObject,$state){
    
    this.update = function(category1,subcat1,id1){
        $state.go('adminBase.adminPut',{category:category1, subcat: subcat1, id: id1});
    }
    
    this.delete = function(category1,subcat1,id1){
        
        var response = confirm("Are you sure you want to delete this product ? ");
        if(response){
            firebase.database().ref('products/' + category1 + '/' + subcat1 + '/' + id1).remove().then(
                function(){
                    alert("Data removed successfully");
                }
            )
        }
    }
}])



app.service('cartService',['$firebaseAuth','$firebaseObject','$window',function($firebaseAuth,$firebaseObject,$window){
    
   
    
}])


app.service('incDecService',['$firebaseObject','$window',function($firebaseObject,$window){
    
    this.increment = function(loggedIn,uid,myCartData,name){
        var quantity = myCartData.quantity;
        var products = myCartData.products;
        var total = myCartData.total;
        for(i = 0; i < quantity; i++){
            if(products[i].name == name){
                var itemQuantity = products[i].quantity;
                products[i].quantity = itemQuantity + 1;
                total = total + products[i].price;
                break;
            }
        }
        if(loggedIn){
            firebase.database().ref('users/cart/' + uid).set({quantity: quantity, products: products, total: total}).then(
                function(){
                    console.log('Item incremented');
                }
            )
            return {quantity: quantity, products: products, total: total}
        }
        else{
            $window.localStorage['cart'] = JSON.stringify({quantity: quantity, products: products, total: total});
            retorn = {quantity: quantity, products: products, total: total}
            console.log('Item incremented');
            return retorn;
        }
    }
    
    this.decrement = function(loggedIn,uid,myCartData,name){
        var quantity = myCartData.quantity;
        var products = myCartData.products;
        var total = myCartData.total;
        for(i = 0; i < quantity; i++){
            if(products[i].name == name){
                var itemQuantity = products[i].quantity;
                if(products[i].quantity >= 2){
                    products[i].quantity = itemQuantity - 1;
                    total = total - products[i].price;
                    break;
                }
            }      
        }
        if(loggedIn){
            firebase.database().ref('users/cart/' + uid).set({quantity: quantity, products: products, total: total}).then(
                function(){
                    console.log('Item incremented');
                }
            )
            return {quantity: quantity, products: products, total: total}
        }
        else{
            $window.localStorage['cart'] = JSON.stringify({quantity: quantity, products: products, total: total});
            retorn = {quantity: quantity, products: products, total: total}
            console.log('Item incremented');
            return retorn;
        }
    }
    
    this.removeProduct = function(loggedIn,uid,myCartData,name){
        var quantity = myCartData.quantity - 1;
        var total = myCartData.total;
        for(i = 0; i < myCartData.products.length; i++){
            if(myCartData.products[i].name == name){
                total = total - (myCartData.products[i].quantity * myCartData.products[i].price);
                myCartData.products.splice(i,1);
            }
        }
        var products = myCartData.products;
        
        if(loggedIn){
            firebase.database().ref('users/cart/' + uid).set({quantity: quantity, products: products, total: total}).then(
                function(){
                    console.log('Item removed');
                }
            )
            retorn = {quantity: quantity, products: products, total: total};
            return retorn;
        }
        else{
            $window.localStorage['cart'] = JSON.stringify({quantity: quantity, products: products, total: total});
            retorn = {quantity: quantity, products: products, total: total}
            console.log('Item incremented');
            return retorn;
        }
    }
    
}])