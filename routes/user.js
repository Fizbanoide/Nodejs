exports.add = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    req.getConnection(function (err, connection) {
        		
		var addressData = {
			ADDRESS_STREET: input.ADDRESS_STREET,
			ADDRESS_CITY: input.ADDRESS_CITY,
			ADDRESS_ZIPCODE: input.ADDRESS_ZIPCODE,
			ADDRESS_COUNTRY: input.ADDRESS_COUNTRY
		};
		
		connection.query("INSERT INTO T_ADDRESS set ? ", addressData, function(err, result)
		{
			if(err)
				console.log("Error inserting : %s ", err);
		});
		var addressId = result.insertId;
		
		var contatData = {
			CONTACT_PHONE: input.CONTACT_PHONE,
			CONTACT_MAIL: input.CONTACT_MAIL
		};
        
		connection.query("INSERT INTO T_CONTACT set ? ", contactData, function(err, result2)
		{
			if(err)
				console.log("Error inserting : %s ", err);
		});
		
		var contactId = result2.insertId;
		
		var userData = {
            
            USER_FIRSTNAME: input.USER_FIRSTNAME,
            USER_LASTNAME: input.USER_LASTNAME,
            USER_LOGIN: input.USER_LOGIN,
            USER_PASSWORD: input.USER_PASSWORD,
            USER_STATUS: input.USER_STATUS,
            USER_ACTIVE: 1,
            ADDRESS_ID: addressId,
            CONTACT_ID: contactId,
            PROFILE_ID: input.profile,
            COMP_ID: input.compid,
            USER_DATE_CREATION: Date.now()/1000
        
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

