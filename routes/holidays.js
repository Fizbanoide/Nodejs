exports.add = function(req, res)
{
  var input = JSON.parse(JSON.stringify(req.body));
  req.getConnection(function(err, connection)
  {
    var data = {
      HOLIDAYS_DAYS        : input.days,
      HOLIDAYS_START_DATE  : input.startDate,
      HOLIDAYS_END_DATE    : input.endDate,
      USER_ID     : input.user,
      HOLIDAYS_UNPAID_DAYS : input.unpaidDays,
      HOLIDAYS_VALIDATED   : input.validated
    };
	console.log(data);
    connection.query("INSERT INTO T_HOLIDAYS set ?", data, function(err)
    {
      if(err)
        console.log("Error inserting : %s", err);
    });
  });
}

exports.accept = function(req, res)
{
  var id = req.params.id;
  req.getConnection(function(err, connection)
  {
    connection.query("UPDATE T_HOLIDAYS SET HOLIDAYS_VALIDATED = 1 WHERE HOLIDAYS_ID = "+id, function(err)
    {
      if(err)
        console.log("Error updating : %s",err);
    });
  });
}

exports.reject = function(req, res)
{
  var id = req.params.id;
  req.getConnection(function(err, connection)
  {
    connection.query("UPDATE T_HOLIDAYS SET HOLIDAYS_VALIDATED = 2 WHERE HOLIDAYS_ID = "+id, function(err)
    {
      if(err)
        console.log("Error updating : %s",err);
    });
  });
}
