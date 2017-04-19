
exports.show = function(req, res)
{
  var id = req.params.id;
  req.getConnection(function(err, connection)
  {
    connection.query('SELECT * FROM T_BONUS WHERE USER_ID = ?',[id],
    function(err, rows)
    {
      if(err)
        console.log("Error Selecting : %s", err);
      res.json(rows);
    });
  });
};

exports.edit = function(req, res)
{
  var input = JSON.parse(JSON.stringify(req.body));
  req.getConnection(function(err, connection)
  {
    var data = {
      bonus_id    : input.bonus,
      bonus_value : input.value
    };
    connection.query("SELECT bm.BONUS_MODEL_VALUE_MAX FROM T_BONUS_MODEL bm, T_BONUS b WHERE bm.BONUS_MODEL_ID = b.BONUS_MODEL_ID AND b.BONUS_ID = "+data.bonus_id, function(err, rows)
    {
      if(err)
        console.log("Error selecting : %s ", err);
      var max = parseInt(JSON.parse(JSON.stringify(rows))[0].BONUS_MODEL_VALUE_MAX);
      if(data.bonus_value >= 0 && data.bonus_value <= max)
      {
        connection.query("UPDATE T_BONUS SET BONUS_VALUE = "+ data.bonus_value +" WHERE BONUS_ID = "+ data.bonus_id, function(err)
        {
          if(err)
            console.log("Error updating : %s", err);
        });
      }
      else
        console.log("Value out of bounds");
    });
  });
}


exports.add = function(req, res)
{
  var input = JSON.parse(JSON.stringify(req.body));
  req.getConnection(function(err, connection)
  {
    var data = {
      bonus_value         : input.value,
      bonus_date_start    : input.dateStart,
      bonus_date_creation : input.dateCreation,
      bonus_user_id       : input.user,
      bonus_model_id      : input.bonusModel,
      bonus_percentage    : input.percentage,
      bonus_active        : input.active
    };
    connection.query("SELECT BONUS_MODEL_VALUE_MAX FROM T_BONUS_MODEL WHERE BONUS_MODEL_ID = "+data.bonus_model_id, function(err, rows)
    {
      if(err)
        console.log("Error selecting : %s ", err);
      var max = parseInt(JSON.parse(JSON.stringify(rows))[0].BONUS_MODEL_VALUE_MAX);
      if(data.bonus_value >= 0 && data.bonus_value <= max)
      {
        connection.query("INSERT INTO T_BONUS (BONUS_VALUE, BONUS_DATE_START, BONUS_DATE_CREATION, USER_ID, BONUS_MODEL_ID, BONUS_PERCENTAGE, BONUS_ACTIVE) VALUES ("+data.bonus_value+","+ data.bonus_date_start+","+ data.bonus_date_creation+","+ data.bonus_user_id+","+ data.bonus_model_id+","+ data.bonus_percentage+","+ data.bonus_active+")",function(err)
        {
          if(err)
            console.log("Error inserting : %s", err);
        });
      }
      else
        console.log("Bonus value out of bounds");
    });
  });
}
