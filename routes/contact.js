exports.add = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    
    req.getConnection(function (err, connection) {
        
        var data = {
            
            CONTACT_PHONE : input.phone,
            CONTACT_MAIL : input.mail
        
        };
        
        var query = connection.query("INSERT INTO T_CONTACT set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         
          res.json(data);
          
        });
        
       // console.log(query.sql); get raw query
    
    });
};