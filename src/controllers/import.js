var router = require('../router.js'),
    lazy    = require("lazy"),
    fs  = require("fs"),
    Transaction = require('./transaction.js')
    

router.registerUploader('import', importFile);
module.exports = {
	importFile : importFile
};

function importFile(reply, request) {
    var file = request.payload.fileUpload && request.payload.fileUpload.path ? request.payload.fileUpload.path : false;
    if(file == false || fs.existsSync(file) == false) {
      reply(false);
      return false;
    }
    
    var stream = fs.createReadStream(file);
    
    var records = [];
    
    new lazy(stream)
    .lines
    .forEach(function(line){
        records.push(csvLineToObject(line));
    });
    
    stream.on('end', function(){
      stream.destroy();
      importRecordArray(records, reply);
    });
}

function csvLineToObject(data){
  var data = data.toString();
  data.replace('\r','');
  var keys = ["acct", "date", "check", "description", "debit", "credit", "status", "balance" ];
  var keyIndex = 0;
  var TransactionObject = {
    acct : "",
    date : "",
    check: "",
    description : "",
    debit : "",
    credit : "",
    status : "",
    balance : ""
  };
  
  var inString = false;
  
  for(var i = 0; i < data.length;i++){
   
   if(data[i] == "\"" && inString == true){
     inString = false;
     continue;
    }  
   if(data[i] == "\"" && inString == false){
     inString = true;
     continue;
   }
   
   if(data[i] == "," && inString == false){
    keyIndex++;
    continue;
   }
   
   TransactionObject[keys[keyIndex]]+=data[i];
  }
  return TransactionObject;
}

function importRecordArray(records, reply){
  index = records.length;

  var response = {
  	rowsImported : 0,
  	errors : 0,
  	attemptedRows : index
  };
  
  next();

  function next(){
    index--;
   
    updateTransactions(records[index], cb)
  }
  
  function cb(ok){
  	if(ok == true) {
  		response.rowsImported++;
  	}else{
  		response.errors++;
  	}
  	if(index == 1) {
  		reply(true);
  	}else{
  		next();
  	}

  }

  function updateTransactions(record, cb) {
    if(record == undefined || record.date == undefined) cb(true);

    var dateParts = record.date.split('/');
    var transaction = {
        description : record.description
      , categoryId : 2
      , date : dateParts[2] + "/" + dateParts[0] + "/"+ dateParts[1]
      , debit : record.debit
      , credit : record.credit
      , balance : record.balance
      , check : record.check
    };

    Transaction.createIfNotExists(cb, transaction);
  }

}
