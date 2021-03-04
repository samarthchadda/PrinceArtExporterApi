module.exports.verifyToken = function verifyToken(req,res,next)
{
    const token = req.body.token;
    // console.log(token);
    
    if(token !== 'undefined' || token!=null)
    {
          //set the token
        req.token = token;

        next();

    }else{
        //Forbidden  (can send 403 status)
        res.sendStatus(403);
        // res.json({message:"Forbidden"})
    }
    
}