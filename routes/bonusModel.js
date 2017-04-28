exports.add = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    req.getConnection(function (err, connection) {
        var data = {
            
            BONUS_MODEL_VALUE : input.form.VALUE,
            BONUS_MODEL_VALUE_MAX : input.form.VALUE_MAX,
            BONUS_MODEL_LABEL : input.form.LABEL,
            BONUS_MODEL_PERIOD : input.form.PERIOD_TYPE*input.form.PERIOD_NUMBER,
            BONUS_MODEL_DATE_START : input.form.DATE_START,
			BONUS_MODEL_DATE_MODIF : 0,
			BONUS_MODEL_ACTIVE : 1
        
        };
		
        var query = connection.query("INSERT INTO T_BONUS_MODEL set ? ",data, function(err, rows)
        {
			console.log(data);
          if (err)
              console.log("Error inserting : %s ",err );
         
          res.json(rows);
          
        });
        
       // console.log(query.sql); get raw query
    
    });
};

exports.edit = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    req.getConnection(function (err, connection) {
        
        var data = {
            
            BONUS_MODEL_ID : input.bonusModelId,
            BONUS_MODEL_VALUE_MAX : input.bonusModelValueMax,
            BONUS_MODEL_VALUE : input.bonusModelValue,
            BONUS_MODEL_LABEL : input.bonusModelLabel,
            BONUS_MODEL_PERIOD : input.bonusModelPeriod,
            BONUS_MODEL_ACTIVE : input.bonusModelActive
        
        };
        
        connection.query("SELECT * FROM T_BONUS_MODEL  WHERE BONUS_MODEL_ID = ? ",input.bonusModelId, function(err, rows)
        {
  
            if (err)
              console.log("Error inserting : %s ",err );
          
            if(input.bonusModelValueMax !== null)
            {
                connection.query("UPDATE T_BONUS_MODEL set BONUS_MODEL_VALUE_MAX = ? WHERE BONUS_MODEL_ID = ? ",[input.bonusModelValueMax,input.bonusModelId], function(err)
                {
                    if (err)
                        console.log("Error updating : %s", err);
                });
                connection.query("SELECT * FROM T_BONUS WHERE BONUS_MODEL_ID = ? ",[input.bonusModelId], function(err, rows)
                {
                    if(err)
                        console.log("Error getting : %s", err);
                
                    for (var i = 0, len = rows.length; i < len; i++) {
                        if(rows[i].BONUS_VALUE > input.bonusModelValueMax)
                        {
                            rows[i].BONUS_VALUE = input.bonusModelValueMax;
                            connection.query("UPDATE T_BONUS SET ? WHERE BONUS_ID = ?", [rows[i], rows[i].BONUS_ID], function(err) {
                                if(err)
                                    console.log("Error updating : %s", err);
                            });
                        }
                    }
                
                });
            }
            
            if(input.bonusModelValue !== null)
            {
                connection.query("SELECT * FROM T_BONUS_MODEL WHERE BONUS_MODEL_ID = ? ",[input.bonusModelId], function(err, rows)
                {
                    
                    if(err || rows[0].BONUS_MODEL_VALUE_MAX < input.bonusModelValue)
                    {
                        console.log("Error getting : %s", err);
                        return;
                    }
                    connection.query("UPDATE T_BONUS_MODEL set BONUS_MODEL_VALUE = ? WHERE BONUS_MODEL_ID = ? ",[input.bonusModelValue,input.bonusModelId], function(err)
                    {
                        if (err)
                            console.log("Error updating : %s", err);
                    });
                });
                
            }
            
            if(input.bonusModelLabel !== null)
            {
                connection.query("UPDATE T_BONUS_MODEL set BONUS_MODEL_LABEL = ? WHERE BONUS_MODEL_ID = ? ",[input.bonusModelLabel,input.bonusModelId], function(err)
                {
                    if (err)
                        console.log("Error updating : %s", err);
                });
            }
            
            if(input.bonusModelPeriod !== null)
            {
                connection.query("UPDATE T_BONUS_MODEL set BONUS_MODEL_PERIOD = ? WHERE BONUS_MODEL_ID = ? ",[input.bonusModelPeriod,input.bonusModelId], function(err)
                {
                    if (err)
                        console.log("Error updating : %s", err);
                });
                
                connection.query("SELECT * FROM T_BONUS WHERE BONUS_MODEL_ID = ? ",[input.bonusModelId], function(err, rows)
                {
                    if(err)
                        console.log("Error getting : %s", err);
                
                    for (var i = 0, len = rows.length; i < len; i++) {
                        
                        var bonus;
                        if(rows[i].BONUS_DATE_START + input.bonusModelPeriod < Math.floor(Date.now() / 1000))
                        {
                            connection.query("UPDATE T_BONUS SET BONUS_ACTIVE = 0 WHERE BONUS_ID = ?", [rows[i].BONUS_ID], function(err) {
                                if(err)
                                    console.log("Error updating : %s", err);
                            });
                            
                            connection.query("SELECT * FROM T_BONUS WHERE BONUS_ID = ?", [rows[i].BONUS_ID], function (err, rows) {
                                
                                if(err)
                                    console.log("Error adding : %s", err);
                                bonus = rows;
                                bonus.BONUS_DATE_START = rows[i].BONUS_DATE_START + input.bonusModelPeriod;
                                bonus.BONUS_DATE_CREATION = Math.floor(Date.now() / 1000);
                                
                            });
                            
                            connection.query("SELECT * FROM T_BONUS_MODEL WHERE BONUS_MODEL_ID = ?", [rows[i].BONUS_MODEL_ID], function (err, rows) {
                                
                                if(err)
                                    console.log("Error adding : %s", err);
                                    
                                bonus.BONUS_VALUE = rows.BONUS_MODEL_VALUE;                                
                            });
                            
                            connection.query("INSERT INTO T_ADDRESS set ? ",bonus, function(err)
                            {
  
                                if (err)
                                    console.log("Error inserting : %s ",err );
                  
                            });
                            
                        }
                    }
                
                });
            }
          
          
            res.json(rows);
          
        });
        
       // console.log(query.sql); get raw query
    
    });
};