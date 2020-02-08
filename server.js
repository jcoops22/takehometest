// This works for the sample Text, but I'm sure not for all CSV, then again the sample text
//  wasn't true CSV so that part was a bit confusing. Thank you for the opportunity!

const server = require("http").createServer();
const port = 5555;
server.on("request", (req, res) => {
  req.on("data", chunk => {
    // turn request into string
    let str = chunk.toString();

    // split it up into an array
    let chars = str.split("");

    let inquotes = false;
    let inNumber = false;
    let quote = '"';
    let comma = ",";
    chars.forEach((letter, ind, arr) => {
      // if we find a quote, turn it into a bracket
      if (letter === quote) {
        // are we in quotes logic
        if (!inquotes) {
          inquotes = true;
          arr.splice(ind, 1, "[");
        } else if (inquotes) {
          inquotes = false;
          arr.splice(ind, 1, "]");
        }
      }
      // if there is a comma
      if (letter === comma) {
        // if we are not in quotes
        if (!inquotes) {
          // are we in a number
          if (inNumber) {
            inNumber = false;
            arr.splice(ind, 0, "]");
          } // is the next letter a number?
          else if (!isNaN(arr[ind + 1])) {
            inNumber = true;
            arr.splice(ind, 1, "[");
          } // if not in a number or quotes delete the comma
          else {
            arr.splice(ind, 1, "");
          }
        }
      }
    });
    // quote logic left a quote at the end of the text
    let end = chars.length - 1;
    chars.splice(end, 1, "]");
    // put it back together
    let together = chars.join("");
    req.on("end", () => {
      console.log("data received");
    });
    res.end(together);
  });
});
// service
server.listen(port, "localhost", () => {
  console.log(`running on ${port}`);
});
