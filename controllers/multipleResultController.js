const Result = require("../models/result");
const { runSimulations } = require("../scripts//multipleSession");

exports.startTest = async (req, res) => {
  const {
    S,
    BR,
    PS,
    TOS,
    sleep,
    LP,
    urls,
    clicks,
    cName,
    fName,
    maxConcurrentDrivers,
  } = req.body;

  if (
    !S ||
    !BR ||
    !PS ||
    !TOS ||
    !sleep ||
    !LP ||
    !urls ||
    !maxConcurrentDrivers
  ) {
    return res.status(400).json({
      error:
        "Please provide all required fields: S, BR, PS, TOS, sleep, LP, urls",
    });
  }

  try {
    // Simulate user behavior
    const userActions = await runSimulations(
      S,
      BR,
      PS,
      TOS,
      sleep,
      LP,
      urls,
      clicks,
      cName,
      fName,
      maxConcurrentDrivers
    );

    // // Save result to the database
    // const result = new Result({
    //   url: LP,
    //   browser: "chrome", // Or any browser logic if needed
    //   userActions, // This should be dynamically generated based on actions
    // });

    // await result.save();

    return res.status(200).json({ message: "Script started" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while running the test" });
  }
};
