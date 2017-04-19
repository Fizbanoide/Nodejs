exports.show = function(req, res)
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
