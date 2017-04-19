exports.add = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    
    req.getConnection(function (err, connection) {
        
        var data = {
            
            COMP_NAME : input.name,
            COMP_SIRET : input.siret,
            COMP_SIREN : input.siren,
            COMP_TVA_CEE : input.tvacee,
            ADDRESS_ID : input.addressid,
            CONTACT_ID : input.contactid,
            COMP_ACTIVE : 1,
            COMP_DATE_CREATION : input.date
        
        };
        
        var query = connection.query("INSERT INTO T_COMPANY set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         
          res.json(data);
          
        });
        
       // console.log(query.sql); get raw query
    
    });
};