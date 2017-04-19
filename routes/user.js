<<<<<<< HEAD
exports.add = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    console.log(input);
    req.getConnection(function (err, connection) {
        
        var data = {
            
            USER_FIRSTNAME: input.firstname,
            USER_LASTNAME: input.lastname,
            USER_LOGIN: input.login,
            USER_PASSWORD: input.password,
            USER_STATUS: input.status,
            USER_ACTIVE: 1,
            USER_HOLIDAYS: input.holidays,
            ADDRESS_ID: 1,
            CONTACT_ID: 1,
            PROFILE_ID: input.profile,
            COMP_ID: input.compid,
            USER_DATE_CREATION: input.date
        
        };
        
        var query = connection.query("INSERT INTO T_USER set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         
          res.json(rows);
          
        });
        
       // console.log(query.sql); get raw query
    
    });
};

exports.show = function(req,res){
          
     var id = req.params.id;
    
     req.getConnection(function (err, connection) {
        
        connection.query("SELECT * FROM T_USER  WHERE USER_ID = ? ",[id], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.json(rows);
             
        });
        
     });
};

exports.showdrivers = function(req, res)
{
  req.getConnection(function(err, connection)
  {
    connection.query("SELECT * FROM T_USER WHERE PROFILE_ID = (SELECT PROFILE_ID FROM T_PROFILE WHERE LOWER(PROFILE_LABEL) = 'driver')", function(err, rows)
    {
      if(err)
        console.log("Error selecting : %s", err);
      res.json(rows);
    });
  });
}

