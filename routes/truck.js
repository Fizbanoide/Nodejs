exports.add = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    console.log(input);
    req.getConnection(function (err, connection) {
        
        var data = {
            
            TRUCK_REGISTRATION : input.registration,
            TRUCK_KILOMETERS : input.kilometers,
            USER_ID : input.userid,
            TRAILER_ID : null,
            TRUCK_ALERT : null,
            TRUCK_ACTIVE : 1
        
        };
        
        var query = connection.query("INSERT INTO T_TRUCK set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         
          res.json(data);
          
        });
        
       // console.log(query.sql); get raw query
    
    });
};