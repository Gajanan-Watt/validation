const app = require("./index");

const connect = require("./config/db")

app.listen(5678, async function() {
    await connect();
    console.log("listening on part 5678");
    
});

