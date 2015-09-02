(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
Classes
| Name              | Description                               | Type                | File     |
| Model             | Core Key/Value pair Model                 | QSModel             |          |
| Collection        | A Collection of Models                    | QSCollection        |          |
| OrderedCollection | A ordered/filtered subset of a Collection | QSOrderedCollection |          |
| ElementGroup      | A Group of Elements                       | QSElementGroup      |          |
| Element           | Any DOM element or QSElement              | -----------         |          |
| QSElement         | A sepial QSElement                        | QSElement           |          |
| ItemEvent         | A event object for changes to an item     | ItemEvent           | Model.js |
|                   |                                           |                     |          |
*/

var SubPub = require('./subpub.js');
var CollectionItem = require('./CollectionItem.js');
module.exports = Collection;

function Collection(){
	failInvalidModels(arguments);

	var self = this;
	this.allowedModels = arguments.length > 0 ? arguments : [];
	this.items = [];
	this.SubPub = new SubPub();
	this.__defineGetter__('length', function(){return this.items.length});
	this.sortFunction = null;
}

Collection.prototype.on = function(eventName, callBack) {
	this.SubPub.subscribe(eventName,callBack);
}

Collection.prototype.add = function(){
	var added = [];
	for(var i = 0; i < arguments.length;i++){
		var newItem = this.__addSingleItem(arguments[i]);
		if(newItem) added.push(newItem);
	}
	applySortMetaData(this);
	if(added.length > 0) this.event({type:'Add',items:added});
	return added;
}

Collection.prototype.event = function(eventProperties) {
	fireEvent(this, new CollectionEvent(this, eventProperties));
}

Collection.prototype.remove = function(){
	var removed = [];
	for(var i = 0; i < arguments.length;i++){
		var removedItem = this.__removeSingleItem(arguments[i]);
		if(removedItem) removed.push(removedItem);
	}
	applySortMetaData(this);
	if(removed.length > 0) this.event({type:'Remove',items:removed});
	return removed;
}

Collection.prototype.toString = function(){return "Collection";}

Collection.prototype.__addSingleItem = function(item){
	if(item.toString() == "CollectionItem"){
		item = item.Item;
	}
	if(this.isValidItem(item) == false) return false;
	var collectionItem = new CollectionItem(item, this);
	addGetterIndex(this);
	if(typeof this.sortFunction == 'function'){
		var insertIndex = findInsertIndex(this, item, this.sortFunction);
		this.items.splice(insertIndex,0,collectionItem);
	}else{
		this.items.push(collectionItem);
	}
	collectionItem.on("*", fireItemChangeEvent.bind(this, this, collectionItem));
	return collectionItem;
}

Collection.prototype.__removeSingleItem = function(item){
	var index = this.indexOfItem(item);
	if(index > -1){
		var collectionItem = this.items[index];
		this.items[index].destory();
		removeGetterIndex(this);
		this.items.splice(index,1);
		return collectionItem;
	}else{
		return false
	}
}

Collection.prototype.sort = function(sortFunction){
	this.sortFunction = sortFunction;
	this.items.sort(sortFunction);
	applySortMetaData(this);
	setTimeout(function(){
		this.event({type:'Sort',items:[]});
	}.bind(this), 10);
	return this;
}

Collection.prototype.indexOfItem = function(item){
	if(item.toString() == "CollectionItem"){
		return this.items.indexOf(item);
	}else{
		
		for(var i = 0; i < this.items.length; i++){
			if(this.items[i].Item == item){
				return i;
			}
		}
		return -1;
	}	
}

Collection.prototype.isValidItem = function(item){
	if(item.toString() == "CollectionItem"){
		item = item.Item;
	}
	if(this.allowedModels.length == 0) return true;

	for(var i = 0; i < this.allowedModels.length;i++){
		if(item instanceof this.allowedModels[i]) return true;
	}
	return false;
}


function failInvalidModels(models){
	for(var i = 0; i < models.length;i++) {
		if(models[i].toString() != "Model"){
			throw models[i].toString() + " is not a valid Model!";
		}
	}
}

function fireItemChangeEvent(collection, collectionItem, event){
	var item = collectionItem.Item;
	collection.SubPub.publish("*", event);
	collection.SubPub.publish(event.type, event);
	collection.SubPub.publish(event.type + ":" + item.toString(), event);
	collection.SubPub.publish(event.type + ":" + item.toString() + "." + event.key, event);
	collection.SubPub.publish(item.toString(), event);
	collection.SubPub.publish(item.toString() + "." + event.key, event);
}

function CollectionEvent(collection, properties) {
	var event = {
		  collection : collection
		, items : properties.items
		, type : properties.type || "Uknown"
	}
	return event;
}

function fireEvent(collection, event) {
	collection.SubPub.publish("*", event);
	collection.SubPub.publish(event.type, event);
}

function addGetterIndex(collection){
	collection.__defineGetter__(collection.items.length, indexGetter.bind(collection, collection,  collection.items.length));
	collection.__defineSetter__(collection.items.length, indexSetter.bind(collection, collection,  collection.items.length));
}

function removeGetterIndex(collection){
	if(collection.items.length > 0) {
		delete collection[collection.items.length-1];
	}
	
}

function indexGetter(collection, index){
	return collection.items[index];
}

function indexSetter(collection, index){
	return false;
}

function findInsertIndex(collection, item, sortFunction) {
	var len = collection.length;
	for(var i = 0; i < len; i++){
		var sortValue = sortFunction(item, collection.items[i]);
		if(sortValue == -1){ //a < b
			return i;
		}else if(sortValue == 1) { // a > b
			continue;
		}else{ //a == b
			return i+1;
		}
	}
	return len;
}

function applySortMetaData(collection){
	for(var i = collection.items.length - 1; i >= 0; i--) {
		collection.items[i]._previousItem = collection.items[i-1] || null;
		collection.items[i]._nextItem = collection.items[i+1] || null;
		collection.items[i]._index = i;
	}
}
},{"./CollectionItem.js":3,"./subpub.js":9}],2:[function(require,module,exports){
module.exports = CollectionElement;
var ElementCollection = require('./ElementCollection.js');
var ModelValue = require('./ModelValue.js');

function CollectionElement(collection, func){
	var ec = new ElementCollection();
	ec.collection = collection;
	ec.itemFunction = func;
	ec.SubPub = collection.SubPub.newGroup();
	ec.knownItems = [];

	ec.SubPub.subscribe('Add', onAddItems.bind(ec, ec));
	ec.SubPub.subscribe('Remove', onRemoveItems.bind(ec, ec));

	return ec;
}

function onAddItems(collectionElement, event){
	for(var i = 0; i < event.items.length; i++) {
		addItem(collectionElement, event.items[i]);
	}
}

function onRemoveItems(collectionElement, event){
	for(var i = 0; i < event.items.length; i++) {
		removeItem(collectionElement, event.items[i]);
	}
}


function addItem(collectionElement, item){
	var newElement = new collectionElement.itemFunction(item, new ModelValue(item));
	var foundIndex = getIndexOfNextKnowItem(item, collectionElement);
	if(foundIndex == null) {
		collectionElement.appendChild(newElement);
	}else{
		var nextSibling = collectionElement.children[foundIndex];
		collectionElement.insertBefore(newElement,nextSibling);
	}
	newElement.__collectionElementItem = item;
	item.SortMeta.SubPub.subscribe('_index', onIndexChange.bind(item,item, newElement, collectionElement));
}

function onIndexChange(item, element, collectionElement){
	var nextItemIndex = getIndexOfNextKnowItem(item, collectionElement);
	if(nextItemIndex >= 0 && nextItemIndex != null){
		var nextSibling = collectionElement.children[nextItemIndex];
		collectionElement.removeChild(element);
		collectionElement.insertBefore(element, nextSibling);
	}else{
		collectionElement.removeChild(element);
		collectionElement.appendChild(element);
	}
}

function removeItem(collectionElement, item){
	for(var i = 0; i < collectionElement.children.length; i++) {
		if(collectionElement.children[i].__collectionElementItem == item) {
			collectionElement.removeChild(collectionElement.children[i]);
		}
	}
}

function getIndexOfNextKnowItem(item, elementCollection){
	var nextItem = item._nextItem;
	while(nextItem){
		for(var i = 0; i < elementCollection.children.length; i++) {
			if(elementCollection.children[i].__collectionElementItem == nextItem) {
				return i;
			}
		}
		nextItem = nextItem._nextItem;
	}
	return null;
}

function getCurrentIndexOfItemElement(item, elementCollection){
	for(var i = 0; i < elementCollection.children.length; i++) {
		if(elementCollection.children[i].__collectionElementItem == nextItem) {
			return i;
		}
	}
	return false;
}

},{"./ElementCollection.js":4,"./ModelValue.js":6}],3:[function(require,module,exports){
var SubPub = require('./subpub.js');
module.exports = CollectionItem;

function CollectionItem(item, collection){
	var self = this;
	this.Item = item;
	this.Collection = collection;
	this.SubPub = item.SubPub.newGroup();
	this.SortMeta = {
		nextItem : null,
		previousItem : null,
		index : null,
		SubPub : new SubPub()
	}

	this.__defineGetter__('_nextItem', function(){
		return this.Collection[this.Collection.indexOfItem(this)+1] || null;
	});
	this.__defineGetter__('_previousItem', function(){
		return this.Collection[this.Collection.indexOfItem(this)-1] || null;
	});
	this.__defineGetter__('_index', function(){
		return this.Collection.indexOfItem(this);
	});

	this.__defineSetter__('_nextItem', function(value){
		if(this.SortMeta.nextItem != value) {
			this.SortMeta.nextItem = value;
			this.SortMeta.SubPub.publish('_nextItem', value);
		}
	});
	this.__defineSetter__('_previousItem', function(value){
		if(this.SortMeta.previousItem != value) {
			this.SortMeta.previousItem = value;
			this.SortMeta.SubPub.publish('_previousItem', value);
		}
	});
	this.__defineSetter__('_index', function(value){
		if(this.SortMeta.index != value) {
			this.SortMeta.index = value;
			this.SortMeta.SubPub.publish('_index', value);
		}
	});

	initItemKeys(this);
} 

CollectionItem.prototype.toString = function(){return "CollectionItem";}

CollectionItem.prototype.on = function(eventName, callBack) {
	this.SubPub.subscribe(eventName,callBack);
}

CollectionItem.prototype.destory = function(){
	this.SubPub.destroy();
	this.Item = undefined;
	this.SubPub = undefined;
	delete this.SubPub;
	delete this.Item;

}

function initItemKeys(collectionItem){
	var keys =  collectionItem.Item.Properties.Model.keys;
	for(var i = 0; i < keys.length;i++) {
		collectionItem.__defineGetter__(keys[i], get.bind(collectionItem, collectionItem, keys[i]));
		collectionItem.__defineSetter__(keys[i], set.bind(collectionItem, collectionItem, keys[i]));
	}
}

function get(collectionItem, key){
	return collectionItem.Item[key];
}

function set(collectionItem, key, value){
	collectionItem.Item[key] = value;
}
},{"./subpub.js":9}],4:[function(require,module,exports){
module.exports = ElementCollection;
var QuickStep = require('./QuickStep.js');

/*
var listA = document.createElement('div');document.body.appendChild(listA);
var listB = document.createElement('div');document.body.appendChild(listB);
var element1 = document.createElement('div');element1.innerHTML = '1';
var element2 = document.createElement('div');element2.innerHTML = '2';
var element3 = document.createElement('div');element3.innerHTML = '3';

var ec = new ElementCollection();
ec.insert(listA);
//ec.pushin();
ec.appendChild(element1);
ec.appendChild(element2);
ec.appendChild(element3);
//ec.pullout();
ec.remove();
ec.insert(listB);
*/

function ElementCollection(){
	this.inState = 0;
	this.placeHolder = document.createComment('ElementCollection');
	this.children = [];
	this.firstChild = null;
	this.lastChild = null;
	this.parentElement = null;
	return this;
}


ElementCollection.prototype.pushin = function(){
	this.inState = 1;
	this.reInsertNodes();
}


ElementCollection.prototype.pullout = function(){
	this.inState = 0;
	for(var i = this.children.length-1; i >= 0; i--){
		if(this.children[i].parentElement) {
			QuickStep.remove(this.children[i]);
			//this.children[i].parentElement.removeChild(this.children[i]);
		}
	}			
}

ElementCollection.prototype.reInsertNodes = function(){
	if(this.parentElement && this.inState == 1){
		var beforeNode = this.placeHolder;
		for(var i = this.children.length-1; i >= 0; i--){
			if(this.children[i].parentElement) {
				QuickStep.remove(this.children[i]);
				//this.children[i].remove();
			}
			QuickStep.insertBefore(this.children[i], beforeNode);
			//this.parentElement.insertBefore(this.children[i], beforeNode);
			beforeNode = this.children[i];
		}		
	}
	return this;
}

ElementCollection.prototype.remove = function(){
	if( this.inState == 1) {
		this.pullout();	
	}

	if(this.placeHolder.parentElement)this.placeHolder.parentElement.removeChild(this.placeHolder);
	this.parentElement = null;		
	return this;
}

ElementCollection.prototype.insert = function(parentElement, beforeElement){
	var beforeElement = arguments[1] || false;
	if(this.placeHolder.parentElement)this.placeHolder.parentElement.removeChild(this.placeHolder);
	this.parentElement = parentElement;

	if(beforeElement) {
		parentElement.insertBefore(this.placeHolder, beforeElement);
	}else{
		parentElement.appendChild(this.placeHolder);
	}

	if( this.inState == 0) {
		this.pushin();
	}

	return this;
}


ElementCollection.prototype.appendChild = function(element){
	if(!element.parentElement) {
		this.children.push(element);
		if(this.inState == 1){
			QuickStep.insertBefore(element,this.placeHolder);
			//this.parentElement.insertBefore(element,this.placeHolder);
		}		
	}
}

ElementCollection.prototype.removeChild = function(element){
	var foundIndex = this.children.indexOf(element);
	if(foundIndex >= 0) {
		this.children.splice(foundIndex,1);
		QuickStep.remove(element);
	}
}

ElementCollection.prototype.insertBefore = function(element, existingChild){
	var foundIndex = this.children.indexOf(existingChild);
	if(foundIndex >= 0 && !element.parentElement) {
		this.children.splice(foundIndex,0,element);
		if(this.inState == 1) {

			if(existingChild.parentElement == this.parentElement){
				QuickStep.insertBefore(element,existingChild);
				//this.parentElement.insertBefore(element, existingChild);	
			}else{
				QuickStep.insertBefore(element,this.placeHolder);
				//this.parentElement.insertBefore(element, this.placeHolder);
			}
		}
	}
}

function getType(element){
	if(element.ELEMENT_NODE == 1){
		return 'Element';
	}else if(element.toString == "ElementCollection"){
		return "ElementCollection";
	}else{
		return "Other";
	}
}

function getFirstOrElement(element){
	if(element.children.length ==0 ) return null;
	if(getType(element) == 'ElementCollection') {
		return getFirstOrElement(element.children[0]);
	}else{
		return element.children[0];
	}
}

function getLastOrElement(element){
	if(element.children.length ==0 ) return null;
	if(getType(element) == 'ElementCollection') {
		return getLastOrElement(element.children.length-1);
	}else{
		return this.children[element.children.length-1];
	}
}


ElementCollection.prototype.toString = function(){return "ElementCollection"};

QuickStep.on('ElementCollection',function(type,thing,target){
	thing.insert(target);
	return false;
});
},{"./QuickStep.js":7}],5:[function(require,module,exports){
var SubPub = require('./subpub.js');
module.exports = Model;

function Model(name, keys, settings) {
	function Item(model, keyValuePair){
		var self = this;
		var properties = {};
		self.Properties = properties;
		self.Event = ItemEvent.bind(self, self);
		self.SubPub = new SubPub();
		self.ParentSubPub = model.SubPub.newGroup();

		properties.keyValuePair = keyValuePair || {};
		properties.Model = model;
		initItemGettersAndSetters(self);
	}

	Item.keys = keys;
	Item.prototype.Settings = settings || {};
	Item.modelName= name;
	Item.prototype.toString = function() {return this.Properties.Model.modelName;};
	Item.prototype.event = function(eventProperties){
		fireEvent(this, new ItemEvent(this, eventProperties));
	};
	Item.prototype.on = on;
	Item.SubPub = new SubPub();
	Item.on = on;

	Item.__proto__.toString = function(){return "Model";}

	return Item.bind({},Item);
}

function on(eventName,callBack) {
	this.SubPub.subscribe(eventName, callBack);
}

function initItemGettersAndSetters(item) {
	for(var i = 0; i < item.Properties.Model.keys.length;i++) {
		var key = item.Properties.Model.keys[i];
		item.__defineGetter__(key, attemptKeyGet.bind(item, item, key));
		item.__defineSetter__(key, attemptKeySet.bind(item, item, key));
	}
}

function attemptKeyGet(item, key){
	return item.Properties.keyValuePair[key];
}

function attemptKeySet(item, key, value){
	item.Properties.keyValuePair[key] = value;
	item.event({
		  key : key
		, value : value
		, oldValue : item.Properties.keyValuePair[key]
	});
}


function ItemEvent(item, properties) {
	//console.log('TODO', 'Add property requirments.');
	//console.log('TODO', 'Add event time info.');
	var event = {
		  model : item.Properties.Model
		, item : item
		, type : properties.type || "Update"
		, key : properties.key || ""
		, value : properties.value  || ""
		, oldValue : properties.oldValue  || ""
	}

	return event;
}

function fireEvent(item, event) {
	item.SubPub.publish("*", event);
	item.SubPub.publish(event.key, event);
	item.SubPub.publish(event.type, event);
	
	item.ParentSubPub.publish("*", event);
	item.ParentSubPub.publish(event.type, event);
	item.ParentSubPub.publish(event.type + ":" + item.toString(), event);
	item.ParentSubPub.publish(event.type + ":" + item.toString() + "." + event.key, event);
	item.ParentSubPub.publish(item.toString(), event);
	item.ParentSubPub.publish(item.toString() + "." + event.key, event);
}

},{"./subpub.js":9}],6:[function(require,module,exports){
module.exports = ModelValue;
var QuickStep = require('./QuickStep.js');

function ModelValue(item){
	if(item.toString() == "CollectionItem"){
		this.metaSubPub = item.SortMeta.SubPub;
		this.SubPub = item.SubPub;
		this.item = item;
		this.modelKeys = item.Item.Properties.Model.keys;
	}else{
		this.metaSubPub = false;
		this.SubPub = item.SubPub;
		this.item = item;
		this.modelKeys = item.Properties.Model.keys;
	}
	
	this.stringTester = new createValueStringTester(this.item, this.modelKeys);
	return Value.bind(this);
}

function Value(valueString){
	var keysUsed = this.stringTester.test(valueString);
	return {
		item : this.item,
		keys : keysUsed,
		modelKeys : this.modelKeys,
		valueString : valueString,
		SubPub : this.SubPub,
		metaSubPub : this.metaSubPub ? this.metaSubPub.newGroup() : this.SubPub,
		stringTester : this.stringTester,
		toString : function(){return "ModelValue"}
	};
}


function createValueStringTester(item, keys){
	return (function(item){
		//var keys = item.Properties.Model.keys;
		var tester = {};
		var __currentTestKeys = [];

		tester.__get = function(key){
			if(__currentTestKeys.indexOf(key) < 0) __currentTestKeys.push(key);
		}

		for(var i in keys) {
			var key = keys[i];
			tester.__defineGetter__(key, tester.__get.bind(tester,key));
		}

		tester.__defineGetter__('_index', tester.__get.bind(tester,'_index'));
		tester.__defineGetter__('_previousItem', tester.__get.bind(tester,'_previousItem'));
		tester.__defineGetter__('_nextItem', tester.__get.bind(tester,'_nextItem'));

		tester.test = function(valueString){
			__currentTestKeys = [];
			with(this) {
				eval(valueString);
			}
			return __currentTestKeys;
		}
		return tester;
	})(item);
}

function bindKeys(modelValue, updateFunction, target, setting) {
	for(var i in modelValue.keys) {
		var key = modelValue.keys[i];
		if(key == '_index' || key == '_previousItem' || key == '_nextItem') {
			modelValue.metaSubPub.subscribe(key,updateFunction.bind(modelValue, modelValue, target, setting));
		}else{
			modelValue.item.on(key,updateFunction.bind(modelValue, modelValue, target, setting));
		}
	}
}

function evaluateValueString(item, valueString){
	with(item) {
		return eval(valueString);
	}
}

function updateTextNode(modelValue, target) {
	target.nodeValue = evaluateValueString(modelValue.item, modelValue.valueString);
}

function updateStyle(modelValue, target, setting) {
	target.style[setting] = evaluateValueString(modelValue.item, modelValue.valueString);
}

function updateAttribute(modelValue, target, setting) {
	target.setAttribute(setting, evaluateValueString(modelValue.item, modelValue.valueString));
}

function updateClass(modelValue, target) {
	target.setAttribute('class', evaluateValueString(modelValue.item, modelValue.valueString));
}

function applyEventToTarget(modelValue, target, event){

}

QuickStep.on('ModelValue',function(type,thing,target){
	var initialValue = evaluateValueString(thing.item, thing.valueString);
	var textNode = document.createTextNode(initialValue);
	bindKeys(thing, updateTextNode, textNode, null);
	target.appendChild(textNode);
	return false;
});

QuickStep.on('element.object.style.*=ModelValue',function(type,thing,target, setting){
	bindKeys(thing, updateStyle, target, setting);
	updateStyle(thing, target, setting); 
	return false;
});

QuickStep.on('element.object.attribute.*=ModelValue',function(type,thing,target, setting){
	bindKeys(thing, updateAttribute, target, setting);
	updateAttribute(thing, target, setting);
	return false;
});

QuickStep.on('element.object.attr.*=ModelValue',function(type,thing,target, setting){
	bindKeys(thing, updateAttribute, target, setting);
	updateAttribute(thing, target, setting);
	return false;
});

QuickStep.on('element.object.id=ModelValue',function(type,thing,target, setting){
	bindKeys(thing, updateAttribute, target, "id");
	updateAttribute(thing, target, "id");
	return false;
});

QuickStep.on('element.object.class=ModelValue',function(type,thing,target, setting){
	bindKeys(thing, updateClass, target);
	target.setAttribute('class', evaluateValueString(thing.item,thing.valueString));
	return false;
});

QuickStep.on('element.object.change=ModelValue',function(type,thing,target, setting){
	applyEventToTarget();
	return false;
});

},{"./QuickStep.js":7}],7:[function(require,module,exports){
// JavaScript Document
var QuickStep = {
	listeners : {
		array	: [],
		object : [],
		string : [],
		number: [],
		element: [],
		other : {}
	},
	on: function(type,method) {
		switch(type) {
			case 'array':
				QuickStep.listeners.array.push(
					{
						method : method
					}
				);
			break;
			case 'object':
				QuickStep.listeners.object.push(
					{
						method : method
					}
				);			
			break;
			case 'string':
				QuickStep.listeners.string.push(
					{
						method : method
					}
				);			
			break;
			case 'number':
				QuickStep.listeners.number.push(
					{
						method : method
					}
				);			
			break;
			case 'element':
				QuickStep.listeners.element.push(
					{
						method : method
					}
				);			
			break;
			default:
			if(QuickStep.listeners.other[type] === undefined){
				QuickStep.listeners.other[type] = [];
			}
			QuickStep.listeners.other[type].push(method);
			return QuickStep;
		}
		return QuickStep;
	},
	
	apply: function(element,args){
		element = ( QuickStep.getType(element) === 'string' ) ? document.createElement(element) : element;
		for(var i = 0; i < args.length;i++){
			QuickStep.trigger(QuickStep.getType(args[i]), args[i],element);
		}
		return element;
	},

	insertBefore: function(element,beforeElment){
		QuickStep.trigger(QuickStep.getType(beforeElment)+"<"+QuickStep.getType(element), element,beforeElment);
		return element;
	},

	remove: function(element){
		QuickStep.trigger('-'+QuickStep.getType(element), element,element)
		return element;
	},

	append: function(element, parent){
		QuickStep.trigger(QuickStep.getType(element), element,parent);
		return element;
	},
	
	trigger: function(type, thing,target){
		var setting = arguments[3];
		if( QuickStep.listeners[type] ){
			for(var i = QuickStep.listeners[type].length - 1; i >= 0; i--){
				listener = QuickStep.listeners[type][i];
				if(typeof listener.method === 'function' && listener.method.call(target,type,thing,target,setting) === false){
					return QuickStep;	
				}
			}			
		} else {
			if(QuickStep.listeners.other[type] !== undefined){
				for(var i = QuickStep.listeners.other[type].length - 1; i >= 0; i--){
					method = QuickStep.listeners.other[type][i];
					if(typeof method === 'function' && method.call(target,type,thing,target,setting) === false){
						return QuickStep;	
					}
				}
			}
		}
	},
	/**
	 * Thanks to : 
	 * http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
	 *  @param (any) Thing to be identified
	 *  @return (string) object type
	*/
	getType: function(thing) {

		
		if(thing === undefined)return undefined;
		if(thing === null) return null;
		if(thing && thing.nodeType == 8) return 'element';

		if(typeof thing == 'object' && thing.tagName && thing._localName){
			return "element";
		}

		var majorType = ({}).toString.call(thing).match(/([a-zA-Z]+)/)[1];
		var minorType = ({}).toString.call(thing).match(/\s([a-zA-Z]+)/)[1];
		if(majorType && minorType && majorType.toLowerCase() == "object" && minorType.toLowerCase().search('element') > 0){
			return 'element';
		}else if(typeof thing == 'object' && thing.toString() != "" && thing.toString() != ({}).toString()){
			return thing.toString();
		}else{
			return minorType.toLowerCase();
		}
	},
	
	"a":function(){return this.apply("a",arguments);},
	"abbr":function(){return this.apply("abbr",arguments);},
	"acronym":function(){return this.apply("acronym",arguments);},
	"address":function(){return this.apply("address",arguments);},
	"applet":function(){return this.apply("applet",arguments);},
	"area":function(){return this.apply("area",arguments);},
	"b":function(){return this.apply("b",arguments);},
	"base":function(){return this.apply("base",arguments);},
	"basefont":function(){return this.apply("basefont",arguments);},
	"bdo":function(){return this.apply("bdo",arguments);},
	"big":function(){return this.apply("big",arguments);},
	"blockquote":function(){return this.apply("blockquote",arguments);},
	"body":function(){return this.apply("body",arguments);},
	"br":function(){return this.apply("br",arguments);},
	"button":function(){return this.apply("button",arguments);},
	"caption":function(){return this.apply("caption",arguments);},
	"center":function(){return this.apply("center",arguments);},
	"cite":function(){return this.apply("cite",arguments);},
	"code":function(){return this.apply("code",arguments);},
	"col":function(){return this.apply("col",arguments);},
	"colgroup":function(){return this.apply("colgroup",arguments);},
	"dd":function(){return this.apply("dd",arguments);},
	"del":function(){return this.apply("del",arguments);},
	"dfn":function(){return this.apply("dfn",arguments);},
	"dir":function(){return this.apply("dir",arguments);},
	"div":function(){return this.apply("div",arguments);},
	"dl":function(){return this.apply("dl",arguments);},
	"dt":function(){return this.apply("dt",arguments);},
	"em":function(){return this.apply("em",arguments);},
	"fieldset":function(){return this.apply("fieldset",arguments);},
	"font":function(){return this.apply("font",arguments);},
	"form":function(){return this.apply("form",arguments);},
	"frame":function(){return this.apply("frame",arguments);},
	"frameset":function(){return this.apply("frameset",arguments);},
	"h1":function(){return this.apply("h1",arguments);},
	"h2":function(){return this.apply("h2",arguments);},
	"h3":function(){return this.apply("h3",arguments);},
	"h4":function(){return this.apply("h4",arguments);},
	"h5":function(){return this.apply("h5",arguments);},
	"h6":function(){return this.apply("h6",arguments);},
	"head":function(){return this.apply("head",arguments);},
	"hr":function(){return this.apply("hr",arguments);},
	"html":function(){return this.apply("html",arguments);},
	"i":function(){return this.apply("i",arguments);},
	"iframe":function(){return this.apply("iframe",arguments);},
	"img":function(){return this.apply("img",arguments);},
	"input":function(){return this.apply("input",arguments);},
	"ins":function(){return this.apply("ins",arguments);},
	"isindex":function(){return this.apply("isindex",arguments);},
	"kbd":function(){return this.apply("kbd",arguments);},
	"label":function(){return this.apply("label",arguments);},
	"legend":function(){return this.apply("legend",arguments);},
	"li":function(){return this.apply("li",arguments);},
	"link":function(){return this.apply("link",arguments);},
	"map":function(){return this.apply("map",arguments);},
	"menu":function(){return this.apply("menu",arguments);},
	"meta":function(){return this.apply("meta",arguments);},
	"noframes":function(){return this.apply("noframes",arguments);},
	"noscript":function(){return this.apply("noscript",arguments);},
	"object":function(){return this.apply("object",arguments);},
	"ol":function(){return this.apply("ol",arguments);},
	"optgroup":function(){return this.apply("optgroup",arguments);},
	"option":function(){return this.apply("option",arguments);},
	"p":function(){return this.apply("p",arguments);},
	"param":function(){return this.apply("param",arguments);},
	"pre":function(){return this.apply("pre",arguments);},
	"q":function(){return this.apply("q",arguments);},
	"s":function(){return this.apply("s",arguments);},
	"samp":function(){return this.apply("samp",arguments);},
	"script":function(){return this.apply("script",arguments);},
	"select":function(){return this.apply("select",arguments);},
	"small":function(){return this.apply("small",arguments);},
	"span":function(){return this.apply("span",arguments);},
	"strike":function(){return this.apply("strike",arguments);},
	"strong":function(){return this.apply("strong",arguments);},
	"style":function(){return this.apply("style",arguments);},
	"sub":function(){return this.apply("sub",arguments);},
	"sup":function(){return this.apply("sup",arguments);},
	"table":function(){return this.apply("table",arguments);},
	"tbody":function(){return this.apply("tbody",arguments);},
	"td":function(){return this.apply("td",arguments);},
	"textarea":function(){return this.apply("textarea",arguments);},
	"tfoot":function(){return this.apply("tfoot",arguments);},
	"th":function(){return this.apply("th",arguments);},
	"thead":function(){return this.apply("thead",arguments);},
	"title":function(){return this.apply("title",arguments);},
	"tr":function(){return this.apply("tr",arguments);},
	"tt":function(){return this.apply("tt",arguments);},
	"u":function(){return this.apply("u",arguments);},
	"ul":function(){return this.apply("ul",arguments);}
};

QuickStep.on('element',function(type,thing,target){
	target.appendChild(thing);
	return false;
});

QuickStep.on('-element',function(type,thing,target){
	if(thing.parentElement)thing.parentElement.removeChild(thing);
	return false;
});

QuickStep.on('element<element',function(type,thing,target){
	if(target.parentElement)target.parentElement.insertBefore(thing, target);
	return false;
});

QuickStep.on('string',function(type,thing,target){
	target.appendChild(document.createTextNode(thing));
	return false;
});
QuickStep.on('number',function(type,thing,target){
	target.appendChild(document.createTextNode(thing));
	return false;
});
QuickStep.on('array',function(type,thing,target){
	QuickStep.apply(target,thing);
	return false;
});
QuickStep.on('object',function(type,thing,target){
	for(var i in thing){
		QuickStep.trigger(QuickStep.getType(target)+'.object.'+i+"="+QuickStep.getType(thing[i]),thing[i],target);
	}
	return false;
});

QuickStep.on('[object Arguments]',function(type,thing,target){
	var argArray = [];
	for(var i = 0; i < thing.length;i++){
		argArray.push(thing[i]);
	}
	QuickStep.apply(target,argArray);
	return false;
});

QuickStep.on('element.object.style=object',function(type,thing,target){
	for(var i in thing){
		var type = QuickStep.getType(thing[i]);
		if(type == 'string' || type == "number"){
			target.style[i] = thing[i];
		}else{
			QuickStep.trigger("element.object.style."+i+"="+type,thing[i],target);
			QuickStep.trigger("element.object.style.*="+type,thing[i],target, i);
		}
	}
	return false;
});

QuickStep.on('element.object.attribute=object',function(type,thing,target){
	for(var i in thing){
		var type = QuickStep.getType(thing[i]);
		if(type == 'string' || type == "number"){
			target.setAttribute(i,thing[i]);
		}else{
			QuickStep.trigger("element.object.attribute."+i+"="+type,thing[i],target);
			QuickStep.trigger("element.object.attribute.*="+type,thing[i],target, i);
		}
	}
	return false;
});


QuickStep.on('element.object.attr=object',function(type,thing,target){
	for(var i in thing){
		var type = QuickStep.getType(thing[i]);
		if(type == 'string' || type == "number"){
			target.setAttribute(i,thing[i]);
		}else{
			QuickStep.trigger("element.object.attribute."+i+"="+type,thing[i],target);
			QuickStep.trigger("element.object.attribute.*="+type,thing[i],target, i);
		}
	}
	return false;
});

QuickStep.on('element.object.parent=element',function(type,thing,target){
	QuickStep.apply(thing,[target]);
	return false;
});
QuickStep.on('element.object.class=string',function(type,thing,target){
	target.className = thing;
	return false;
});

QuickStep.on('element.object.html=string',function(type,thing,target){
	target.innerHTML = thing;
	return false;
});

QuickStep.on('element.object.id=string',function(type,thing,target){
	target.setAttribute("id", thing);
	return false;
});

QuickStep.on('element.object.type=string',function(type,thing,target){
	target.setAttribute("type", thing);
	return false;
});

QuickStep.on('element.object.value=string',function(type,thing,target){
	target.setAttribute("value", thing);
	return false;
});

QuickStep.on('element.object.value=number',function(type,thing,target){
	target.setAttribute("value", thing);
	return false;
});

module.exports = QuickStep;
},{}],8:[function(require,module,exports){
var QuickStep = require('./QuickStep.js');
var Model = require('./Model.js');
var Collection = require('./Collection.js');
var CollectionElement = require('./CollectionElement.js');
var ModelValue = require('./ModelValue.js');

QuickStep.Model = Model;
QuickStep.Collection = Collection;
QuickStep.CollectionElement = CollectionElement;
QuickStep.ModelValue = ModelValue;
module.exports = QuickStep;
if(window)window.QuickStep = QuickStep;
},{"./Collection.js":1,"./CollectionElement.js":2,"./Model.js":5,"./ModelValue.js":6,"./QuickStep.js":7}],9:[function(require,module,exports){
module.exports = SubPub; 
var subpubId = 0;
function SubPub(){
	this.events = {};
	this.groups = [[]];
	subpubId++;
	this.id = subpubId;
	this.newGroup = function() {
		this.groups.push([]);
		return {
			  subscribe : subscribe.bind(this, this, this.groups.length-1)
			, publish : publish.bind(this, this)
			, unsubscribe : unsubscribe.bind(this, this, this.groups.length-1)
			, destroy : destroy.bind(this, this, this.groups.length -1)
		};
	};

	this.subscribe = subscribe.bind(this, this, 0);
	this.publish = publish.bind(this, this);
	this.unsubscribe = unsubscribe.bind(this, this, 0);
	this.destroy = destroy.bind(this, this, 0);
	return this;
}

function subscribe(subpub, eventGroup, eventName, callBack) {
	if(subpub.events[eventName] == undefined) subpub.events[eventName] = [];
	if(subpub.events[eventName].indexOf(callBack) > -1) return false;
	subpub.events[eventName].push(callBack);
	subpub.groups[eventGroup].push(callBack);
}

function publish(subpub, eventName, eventObject) {
	if(subpub.events[eventName] != undefined && subpub.events[eventName].length > 0) {
		var events = subpub.events[eventName];
		for(var i = 0; i < events.length; i++) {
			events[i](eventObject);
		}
	}
}

function unsubscribe(subpub, eventGroup, eventName, callBack) {
	if(subpub.groups[eventGroup] != undefined && subpub.groups[eventGroup].length > 0) {
		subpub.groups[eventGroup].splice(subpub.groups[eventGroup].indexOf(callBack),1);
	}

	if(subpub.events[eventName] != undefined && subpub.events[eventName].length > 0) {
		subpub.events[eventName].splice(subpub.events[eventName].indexOf(callBack),1);
	}
}

function destroy(subpub, eventGroup) {
	if(subpub.groups[eventGroup]) {
		var group = subpub.groups[eventGroup];
		for(var i = 0; i < group.length; i++) {
			for(event in subpub.events) {
				var ci = subpub.events[event].indexOf(group[i]);
				if(ci > -1) {
					subpub.events[event].splice(ci, 1);
				}
			}
		}
		subpub.groups[eventGroup] = null;
	}
}
},{}]},{},[8]);
