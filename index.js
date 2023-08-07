import express from "express";
import axios from "axios";
import fs, { stat } from "fs";
import bodyParser from "body-parser";

// List of trian station with data
let rawdata = fs.readFileSync("station-list.json");
let stationList = JSON.parse(rawdata);
var EWL = [];
var NSL = [];
var CCL = [];
var CEL = [];
var DTL = [];
var NEL = [];
var TEL = [];
var lineListing = ["EW", "NS", "CC", "CE", "DT", "NE", "TE"];
var displayString = "";

// function to populate the EWL/NSL/CCL.... listings
function listingPopulator() {
  for (let lineIndex = 0; lineIndex < lineListing.length; lineIndex++) {
    var lineName = lineListing[lineIndex];
    for (let i = 0; i < stationList.length; i++) {
      var stationCode = stationList[i].Code;
      var arrayPushed = {};
      if (stationCode.includes(lineName)) {
        var interimStationCode = stringCleaner(stationCode, lineName);
        arrayPushed["Code"] = interimStationCode;
        arrayPushed["Station Name"] = stationList[i]["Station Name"];
        if (lineName === "EW") {
          EWL.push(arrayPushed);
        } else if (lineName === "NS") {
          NSL.push(arrayPushed);
        } else if (lineName === "CC") {
          CCL.push(arrayPushed);
        } else if (lineName === "CE") {
          CEL.push(arrayPushed);
        } else if (lineName === "DT") {
          DTL.push(arrayPushed);
        } else if (lineName === "NE") {
          NEL.push(arrayPushed);
        } else if (lineName === "TE") {
          TEL.push(arrayPushed);
        }
      }
    }
  }
}

// Function to clean up stationCode to one station per array pair
function stringCleaner(stationCode, lineCode) {
  try {
    let stringIndex = stationCode.indexOf(lineCode);
    if (stringIndex < 0) {
      return "No station on this line";
    } else if (stationCode[stringIndex + 3] != " ") {
      return stationCode.slice(stringIndex, stringIndex + 4);
    } else {
      return stationCode.slice(stringIndex, stringIndex + 3);
    }
  } catch (error) {
    console.log("error");
  }
}

//comparative function to sort the array based on the station code
function compareStationcode(a, b) {
  if (
    parseInt(a.Code.match(/(\d+)/)[0], 10) <
    parseInt(b.Code.match(/(\d+)/)[0], 10)
  ) {
    return -1;
  } else {
    return 1;
  }
}

// Sort the line arrays
listingPopulator();
EWL.sort(compareStationcode);
NSL.sort(compareStationcode);
CCL.sort(compareStationcode);
CEL.sort(compareStationcode);
DTL.sort(compareStationcode);
NEL.sort(compareStationcode);
TEL.sort(compareStationcode);

// config for Axios
let config = {
  headers: {
    AccountKey: "HlElM1Q8Rz6Cac65V7myrw==",
  },
  params: { TrainLine: "EWL" },
};

//Axios call to the LTA API
async function getCrowd() {
  try {
    const response = await axios.get(
      "http://datamall2.mytransport.sg/ltaodataservice/PCDRealTime",
      config
    );
    return response.data.value;
  } catch (error) {
    console.error(error);
  }
}

//Express Calls
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = 3000;
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect("/EWL");
});

app.get("/EWL", (req, res) => {
  console.log("Changing Tabs");
  res.render("index.ejs", { stationList: EWL, displayString: displayString });
});

app.get("/NSL", (req, res) => {
  console.log("Changing Tabs");
  res.render("index.ejs", { stationList: NSL, displayString: displayString });
});

app.get("/CCL", (req, res) => {
  console.log("Changing Tabs");
  res.render("index.ejs", { stationList: CCL, displayString: displayString });
});

app.get("/CEL", (req, res) => {
  console.log("Changing Tabs");
  res.render("index.ejs", { stationList: CEL, displayString: displayString });
});

app.get("/DTL", (req, res) => {
  console.log("Changing Tabs");
  res.render("index.ejs", { stationList: DTL, displayString: displayString });
});

app.get("/NEL", (req, res) => {
  console.log("Changing Tabs");
  res.render("index.ejs", { stationList: NEL, displayString: displayString });
});

app.get("/TEL", (req, res) => {
  console.log("Changing Tabs");
  res.render("index.ejs", { stationList: TEL, displayString: displayString });
});

app.post("/", async (req, res) => {
  console.log(req.body);
  // if loop to set the config
  if (req.body.nameOfElement.includes("EW")) {
    config.params.TrainLine = "EWL";
  } else if (req.body.nameOfElement.includes("NS")) {
    config.params.TrainLine = "NSL";
  } else if (req.body.nameOfElement.includes("CCL")) {
    config.params.TrainLine = "CCL";
  } else if (req.body.nameOfElement.includes("CEL")) {
    config.params.TrainLine = "CEL";
  } else if (req.body.nameOfElement.includes("DTL")) {
    config.params.TrainLine = "DTL";
  } else if (req.body.nameOfElement.includes("NEL")) {
    config.params.TrainLine = "NEL";
  } else if (req.body.nameOfElement.includes("TEL")) {
    config.params.TrainLine = "TEL";
  }
  var crowdData = await getCrowd();
  console.log(crowdData);
  var crowdlevel = "";
  var updatedTime = "";
  var stationName = "";

  // For loop to loop through the API data to find the crowd level, crowd timing
  for (let i = 0; i < crowdData.length; i++) {
    if (crowdData[i].Station === req.body.nameOfElement) {
      crowdlevel = crowdData[i].CrowdLevel;
      updatedTime = crowdData[i].StartTime.split("T")[1].split("+")[0];
    }
  }
  // For loop to find station name based on the request in our maseter station lisitng.
  for (let j = 0; j < EWL.length; j++) {
    if (EWL[j].Code === req.body.nameOfElement) {
      stationName = EWL[j]["Station Name"];
      break;
    }
  }
  for (let j = 0; j < NSL.length; j++) {
    if (NSL[j].Code === req.body.nameOfElement) {
      stationName = NSL[j]["Station Name"];
    }
  }
  for (let j = 0; j < CCL.length; j++) {
    if (CCL[j].Code === req.body.nameOfElement) {
      stationName = CCL[j]["Station Name"];
    }
  }
  for (let j = 0; j < CEL.length; j++) {
    if (CEL[j].Code === req.body.nameOfElement) {
      stationName = CEL[j]["Station Name"];
    }
  }
  for (let j = 0; j < DTL.length; j++) {
    if (DTL[j].Code === req.body.nameOfElement) {
      stationName = DTL[j]["Station Name"];
    }
  }
  for (let j = 0; j < NEL.length; j++) {
    if (NEL[j].Code === req.body.nameOfElement) {
      stationName = NEL[j]["Station Name"];
    }
  }
  for (let j = 0; j < TEL.length; j++) {
    if (TEL[j].Code === req.body.nameOfElement) {
      stationName = TEL[j]["Station Name"];
    }
  }

  // To generate the display string
  if (crowdlevel === "l") {
    displayString = `${stationName} is pretty empty right now. Reading taken at: ${updatedTime}`;
  } else if (crowdlevel === "m") {
    displayString = `${stationName} is pretty mid right now. Reading taken at: ${updatedTime}`;
  } else if (crowdlevel === "h") {
    displayString = `${stationName} is pretty flipping crowded right now. Reading taken at: ${updatedTime}`;
  } else {
    displayString =
      "We have encountered some issues and not able to find the platform crowdedness.";
  }

  // To render the ejs file

  if (req.body.nameOfElement.includes("EW")) {
    res.render("index.ejs", { stationList: EWL, displayString: displayString });
  } else if (req.body.nameOfElement.includes("NS")) {
    res.render("index.ejs", { stationList: NSL, displayString: displayString });
  } else if (req.body.nameOfElement.includes("CCL")) {
    res.render("index.ejs", { stationList: CCL, displayString: displayString });
  } else if (req.body.nameOfElement.includes("CEL")) {
    res.render("index.ejs", { stationList: CEL, displayString: displayString });
  } else if (req.body.nameOfElement.includes("DTL")) {
    res.render("index.ejs", { stationList: DTL, displayString: displayString });
  } else if (req.body.nameOfElement.includes("NEL")) {
    res.render("index.ejs", { stationList: NEL, displayString: displayString });
  } else if (req.body.nameOfElement.includes("TEL")) {
    res.render("index.ejs", { stationList: TEL, displayString: displayString });
  }
});

app.listen(port, () => console.log("Example app is listening on port 3000."));
