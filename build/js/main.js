"use strict";!function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a="function"==typeof require&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}for(var i="function"==typeof require&&require,o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require,module,exports){function init(){data.load().then(function(response){var globalProducts=response.products,globalCategories=response.categories;"Proxy"in window?shopCart=new Proxy([],{set:function(target,property,value){return target[property]=new Proxy([value],cartHandler),cart.update(),!0},get:function(target,property){return target[property]},deleteProperty:function(target,property){return delete target[property],cart.update(),!0}}):alert("Your browser doesnt support Proxies, this could generate errors."),products.init(shopCart,globalProducts,globalCategories),cart.init(shopCart,globalProducts),filters.init(globalCategories),order.init(globalProducts),search.init(globalProducts)})}var shopCart=[],data=require("./modules/data"),products=require("./modules/products"),filters=require("./modules/filters"),cart=require("./modules/cart"),order=require("./modules/order"),search=require("./modules/search"),cartHandler={set:function(target,key,value){return target[key]=value,!0},get:function(target,property){return cart.update(),target[property]}};init()},{"./modules/cart":3,"./modules/data":4,"./modules/filters":5,"./modules/order":6,"./modules/products":7,"./modules/search":8}],2:[function(require,module,exports){var constants={categoriesClass:{drinks:"glass",lunch:"cutlery",food:"apple",sea:"tint"}};module.exports=constants},{}],3:[function(require,module,exports){function deleteProduct(event){var id=event.target.getAttribute("cart-id");delete cart[id],totalProducts=0,cart.forEach(function(productTemp){totalProducts+=productTemp[0].quantity}),$cart.setAttribute("count",totalProducts),totalProducts>0?$cart.classList.remove("empty"):$cart.classList.add("empty")}function generateProducts(){if(!throttle){for(throttle=!0;container.firstChild;)container.removeChild(container.firstChild);"content"in document.createElement("template")&&!function(){var template=document.querySelector("#cart-product");cart.forEach(function(productTemp,index){productTemp[0]&&!function(){var product=productTemp[0],productData=products.find(function(productFind){return productFind.id===parseInt(product.id)});template.content.querySelector(".cart-product-quantity").textContent=product.quantity,template.content.querySelector(".cart-product-image img").src=productData.img,template.content.querySelector(".cart-product-name").textContent=productData.name;var box=document.importNode(template.content,!0);box.querySelector(".cart-product-delete").addEventListener("click",deleteProduct),box.querySelector(".cart-product-delete").setAttribute("cart-id",index),container.appendChild(box)}()})}(),throttle=!1}}function openCart(){generateProducts(),$cartBox.classList.toggle("is-show")}function init(shopCart,globalProducts){cart=shopCart,products=globalProducts,$button.addEventListener("click",openCart)}var cart=void 0,products=void 0,throttle=!1,totalProducts=0,container=document.querySelector(".cart"),$button=document.querySelector(".header-cart"),$cart=document.querySelector(".header-cart"),$cartBox=document.querySelector(".cart");module.exports={init:init,update:generateProducts}},{}],4:[function(require,module,exports){function getUrl(){var hashParameters=window.location.hash.slice(1).split("&"),url=!1;return hashParameters.forEach(function(rawValue){var value=rawValue.split("=");value[0]&&"url"===value[0]&&(url=value[1])}),url}function loadData(){var url=getUrl();return url?console.info("Using custom data url:",url):console.info("Using default data url"),fetch(url?url:"data/products.json",{method:"get"}).then(function(response){return 200!==response.status?(console.error("ERROR, status code:",response.status),!1):response.json().then(function(data){return categories=data.categories,products=data.products,{categories:categories,products:products}})}).catch(function(error){return console.error("ERROR",error),!1})}var categories=void 0,products=void 0;module.exports={load:loadData}},{}],5:[function(require,module,exports){function addCustomFilter(event){var button=event.target,filter={name:button.getAttribute("custom-filter"),value:button.getAttribute("filter-value"),price:button.getAttribute("filter-price"),type:button.getAttribute("filter-type")};"price"===filter.name?priceFilter[filter.price]?delete priceFilter[filter.price]:priceFilter[filter.price]={type:filter.type,price:filter.price}:customFilters[filter.name]?customFilters[filter.name]!==filter.value?customFilters[filter.name]=filter.value:delete customFilters[filter.name]:customFilters[filter.name]=filter.value,button.classList.toggle("is-selected")}function addFilter(event){var button=event.target,category=button.getAttribute("filter-id");button.classList.toggle("is-selected"),filters.includes(category)?filters.splice(filters.indexOf(category),1):filters.push(category)}function applyFilters(){var products=document.querySelectorAll(".product");products.forEach(function(product){var categories=product.getAttribute("categories").split(","),isShowCategories=!0,isShowCustom=!0,isShowPrice=!0,isShow=!0;filters.length>0&&(isShowCategories=categories.reduce(function(last,category){return filters.includes(category)||last},!1)),Object.keys(customFilters).length>0&&(isShowCustom=Object.keys(customFilters).reduce(function(last,filter){var value=product.getAttribute(filter);return value===customFilters[filter]||last},!1)),isShowPrice=!(Object.keys(priceFilter).length>0)||Object.keys(priceFilter).reduce(function(last,filter){var value=product.getAttribute("price"),result=!0;return result=">"===priceFilter[filter].type?parseInt(value)>=parseInt(filter):parseInt(value)<=parseInt(filter),result||last},!1),isShow=isShowCategories&&isShowCustom&&isShowPrice,isShow?product.classList.remove("is-hide"):product.classList.add("is-hide")})}function createFilters(){container.classList.contains("loaded")||!function(){var template=document.querySelector("#filter");categories.forEach(function(category){template.content.querySelector(".filter-label").textContent=category.name;var box=document.importNode(template.content,!0),icon=document.createElement("i");icon.classList.add("fa"),icon.classList.add("fa-"+categoriesClass[category.name]),box.querySelector(".filter-icon").appendChild(icon),box.querySelector(".filter").setAttribute("filter-id",category.categori_id),box.querySelector(".filter").addEventListener("click",addFilter),container.appendChild(box)}),container.classList.add("loaded")}(),filtersContainer.classList.toggle("is-hide")}function init(globalCategories){categories=globalCategories,button.addEventListener("click",createFilters),applyButton.addEventListener("click",applyFilters),customFiltersButtons.forEach(function(buttonFilter){buttonFilter.addEventListener("click",addCustomFilter)})}var categoriesClass=require("./../core/constants").categoriesClass,button=document.querySelector(".header-button"),applyButton=document.querySelector(".filters-button-apply"),container=document.querySelector(".filters-list"),filtersContainer=document.querySelector(".filters"),customFiltersButtons=document.querySelectorAll(".filter-custom"),customFilters={},filters=[],priceFilter={},categories=void 0;module.exports={init:init}},{"./../core/constants":2}],6:[function(require,module,exports){function nameASC(productA,productB){var nameA=productA.name.toUpperCase(),nameB=productB.name.toUpperCase();return nameA<nameB?-1:nameA>nameB?1:0}function nameDES(productA,productB){var nameA=productA.name.toUpperCase(),nameB=productB.name.toUpperCase();return nameA<nameB?1:nameA>nameB?-1:0}function priceASC(productA,productB){var priceA=1e3*parseFloat(productA.price,10),priceB=1e3*parseFloat(productB.price,10);return priceA>priceB?1:priceA<priceB?-1:0}function priceDES(productA,productB){var priceA=1e3*parseFloat(productA.price,10),priceB=1e3*parseFloat(productB.price,10);return priceA<priceB?1:priceA>priceB?-1:0}function setOrder(arrayOrder){arrayOrder.forEach(function(product,index){var $box=document.querySelector("#product-"+product.id);$box.style.order=index})}function sortProducts(event){var $currentButton=event.target,$icon=$currentButton.querySelector(".fa"),iconClass="",array=void 0;switch($buttons.forEach(function($button){var $buttonIcon=$button.querySelector(".fa");$button.classList.remove("is-active"),$buttonIcon.classList.remove("fa-caret-up","fa-caret-down")}),$currentButton.classList.add("is-active"),order.type=$currentButton.getAttribute("type"),order.direction=order.direction&&"asc"===order.direction?"des":"asc",order.type+"|"+order.direction){case"name|asc":array=products.sort(nameASC),iconClass="up";break;case"name|des":array=products.sort(nameDES),iconClass="down";break;case"price|asc":array=products.sort(priceASC),iconClass="up";break;case"price|des":array=products.sort(priceDES),iconClass="down";break;default:array=products.sort(nameASC),iconClass="up"}$icon&&$icon.classList.add("fa-caret-"+iconClass),setOrder(array)}function init(globalProducts){products=globalProducts,$buttons.forEach(function($tempButton){$tempButton.addEventListener("click",sortProducts)})}var products=void 0,order={type:null,direction:null},$buttons=document.querySelectorAll(".order-sort-icon");module.exports={init:init}},{}],7:[function(require,module,exports){function addToCart(event){var button=event.target,id=button.getAttribute("product-id"),product=void 0;product={id:id,quantity:1};var exist=cart.filter(function(productTemp){return productTemp[0].id===id});exist[0]?exist[0][0].quantity++:cart.push(product),totalProducts=0,cart.forEach(function(productTemp){totalProducts+=productTemp[0].quantity}),$cart.setAttribute("count",totalProducts),totalProducts>0?$cart.classList.remove("empty"):$cart.classList.add("empty")}function generateProducts(){var container=document.querySelector(".products");"content"in document.createElement("template")&&!function(){var template=document.querySelector("#product");products.forEach(function(product){template.content.querySelector(".product-price").textContent="$"+product.price,template.content.querySelector(".product-image img").src=product.img,template.content.querySelector(".product-name").textContent=product.name,template.content.querySelector(".product-details").textContent=product.description,template.content.querySelector(".product-button-add").setAttribute("product-id",product.id),template.content.querySelector(".product").setAttribute("id","product-"+product.id);var box=document.importNode(template.content,!0);product.categories.forEach(function(category){var categoryData=categories.find(function(categoryTemp){return categoryTemp.categori_id===category}),categoryClass=categoriesClass[categoryData.name],icon=document.createElement("i");icon.classList.add("fa"),icon.classList.add("fa-"+categoryClass),box.querySelector(".product-categories").appendChild(icon),box.querySelector(".product").getAttribute("categories")?box.querySelector(".product").setAttribute("categories",box.querySelector(".product").getAttribute("categories")+","+category):box.querySelector(".product").setAttribute("categories",category)}),box.querySelector(".product").setAttribute("available",product.available),box.querySelector(".product").setAttribute("not-available",!product.available),box.querySelector(".product").setAttribute("best-seller",product.best_seller),box.querySelector(".product").setAttribute("price",1e3*parseFloat(product.price,10)),box.querySelector(".product-button-add").addEventListener("click",addToCart),container.appendChild(box)})}()}function init(shopCart,globalProducts,globalCategories){cart=shopCart,products=globalProducts,categories=globalCategories,generateProducts()}var products=void 0,categories=void 0,cart=void 0,totalProducts=0,categoriesClass=require("./../core/constants").categoriesClass,$cart=document.querySelector(".header-cart");module.exports={init:init}},{"./../core/constants":2}],8:[function(require,module,exports){function searchProducts(){var searchValue=$searchInput.value.toLowerCase();products.forEach(function(product){var regExp=new RegExp(searchValue),productName=product.name.toLowerCase(),isShow=regExp.test(productName),$box=document.querySelector("#product-"+product.id);isShow?$box.classList.remove("is-hide"):$box.classList.add("is-hide")})}function init(globalProducts){products=globalProducts,$searchInput=document.querySelector(".order-search-input"),$searchInput.addEventListener("keyup",searchProducts)}var products=void 0,$searchInput=void 0;module.exports={init:init}},{}]},{},[1]);
//# sourceMappingURL=main.js.map