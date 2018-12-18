// module.exports = function(app,io) {
//     app.put('/foo', function(req, res) {
    
//         /* 
    
//           do stuff to update the foo resource 
    
//           ...
    
//          */
    
    
//         // now broadcast the updated foo..
    
//         console.log("PUT OK!");
    
//         io.sockets.emit('update'); // how?
//         res.json({result: "update sent over IO"});
    
//     });
//     }