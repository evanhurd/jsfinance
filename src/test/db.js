var assert = require("assert");

describe('Database', function(){

	var db = require('../db')
		, Mocha = require('mocha')
		, Transaction = require('../models/transaction.js')
	 	, Money = require('../models/money.js')
		, Category = require('../models/category.js')
		, MoneyTransfer = require('../controllers/MoneyTransfer.js')
		require('../models/model_links.js');
		require('../models/hooks.js');

	var testData = {};

	it('Connect And Create Database Schema', function(done){
		/*db.sequelize
	    .query('SET FOREIGN_KEY_CHECKS = 0', null, {raw: true})
	    .success(function(results) {
	        DB.sequelize.sync({force: true});
	    });*/
		db.sync({force:true, logging:true})
		.then(function(){ done(); })
		.catch(function(err){
			throw Error(err);
		});
	});

	it('Create Root Category', function(done){
		Category.create({name:'Root', description: 'This is the root category!'})
			.then(function(category){
				testData.rootCategory = category;
				done();
			})
			.catch(function(err){
				throw Error(err);
			})
	});

	it('Create Child Category', function(done){
		testData.rootCategory.createChild({name:'Child', description: 'Children are awesome'})
		.then(function(category){
			testData.childCategory = category;
			done();
		})
		.catch(function(err){
			throw Error(err);
		});
	});

	it('Get Root Category\'s Children', function(done){

		Category.findOne({ where: {name:'Root'}, include:[Category] })
		.then(function(category){
			testData.rootCategory = category;
			if(category.categories.length == 1 ) {
				done();
				testData.childCategory = category.categories[0];
			}else{
				done(Error('Root Category did not have one child!'));
			}			
		})
		.catch(function(err){
			throw Error(err);
		});
	});

	it('Create Transaction', function(done){

		Transaction.create({description: 'New Transaction!!', debit:0, credit: 20})
		.then(function(transaction){
			testData.transaction = transaction;
			setTimeout(function(){
				transaction.getMoney().then(function(monies) {
					testData.money = monies[0];
					assert.equal(monies.length,1 , 'There should be one monies in the transaction');
					assert.equal(monies[0].debit,transaction.debit , 'The transaction\'s debit and the money\'s debit should be the same');
					assert.equal(monies[0].credit,transaction.credit , 'The transaction\'s credit and the money\'s credit should be the same');
					done();
				});
			},0);
		})
		.catch(function(err){
			throw Error(err);
		});
	});

	it('Put money into Category', function(done){
		testData.transaction.getMoney().then(function(monies) {
			testData.rootCategory.addMoney(monies[0]).then(function(){
				done();
			})
			.catch(function(err){
				throw Error(err);
			});
		})
		.catch(function(err){
			throw Error(err);
		});
	});

	it('Transfer the whole amount', function(done){
		MoneyTransfer({
			money : testData.money.id,
			amount : 20,
			category : testData.childCategory.id

		}, function(money, transfer){
			assert.equal(money.id, 1 , 'Money id should be 1');
			assert.equal(money.categoryId, 2 , 'Category id should be 2');
			assert.equal(transfer.credit, 20 , 'transfer amount should be 20.00');
			assert.equal(transfer.categoryId, 2 , 'transfer category should be 2');
			done();
		});
	});

	it('Transfer a partial amount', function(done){
		MoneyTransfer({
			money : testData.money.id,
			amount : 10,
			category : testData.rootCategory.id

		}, function(money, transfer){
			assert.equal(money.id, 2 , 'Money id should be 2');
			assert.equal(money.categoryId, 1 , 'Category id should be 1');
			assert.equal(transfer.credit, 10 , 'transfer amount should be 20.00');
			assert.equal(transfer.categoryId, 1 , 'transfer category should be 1');
			done();
		});
	});
});
