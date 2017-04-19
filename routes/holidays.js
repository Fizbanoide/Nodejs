exports.add = function(req, res)
{
  var input = JSON.parse(JSON.stringify(req.body));
  req.getConnection(function(err, connection)
  {
    var data = {
      h_days        : input.days,
      h_start_date  : input.startDate,
      h_end_date    : input.endDate,
      h_user_id     : input.user,
      h_unpaid_days : input.unpaidDays,
      h_validated   : input.validated
    };
    connection.query("INSERT INTO T_HOLIDAYS (HOLIDAYS_DAYS, HOLIDAYS_START_DATE, HOLIDAYS_END_DATE, USER_ID, HOLIDAYS_UNPAID_DAYS, HOLIDAYS_VALIDATED) VALUES ("+data.h_days+","+data.h_start_date+","+data.h_end_date+","+data.h_user_id+","+data.h_unpaid_days+","+data.h_validated+")",function(err)
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
