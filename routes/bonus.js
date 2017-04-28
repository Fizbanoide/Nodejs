
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
  var value = parseInt(req.body);
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
	console.log(input);
    connection.query("SELECT * FROM T_BONUS_MODEL WHERE BONUS_MODEL_ID = "+input.form.BONUS_MODEL, function(err, rows)
    {
      if(err)
        console.log("Error selecting : %s ", err);
	  var d = Date.now();
      var result = JSON.parse(JSON.stringify(rows));
	  var data = {
			BONUS_VALUE		  : result[0].BONUS_MODEL_VALUE,
			BONUS_MODEL_ID      : input.form.BONUS_MODEL,
			USER_ID       	  : input.form.USER,
			BONUS_DATE_START    : input.form.DATE_START,
			BONUS_PERCENTAGE 	  : result[0].BONUS_MODEL_VALUE/result[0].BONUS_MODEL_VALUE_MAX*100
		};
		console.log(data);
      connection.query("INSERT INTO T_BONUS set ?", data, function(err)
      {
        if(err)
          console.log("Error inserting : %s", err);
	  });
    });
  });
}
