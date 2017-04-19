exports.add = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    
    req.getConnection(function (err, connection) {
        
        var data = {
            
            ADDRESS_STREET    : input.street,
            ADDRESS_CITY : input.city,
            ADDRESS_ZIPCODE   : input.zipcode,
            ADDRESS_COUNTRY   : input.country 
        
        };
        
        var query = connection.query("INSERT INTO T_ADDRESS set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         
          res.json(data);
          
        });
        
       // console.log(query.sql); get raw query
    
    });
};