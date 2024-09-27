const Result = require("../models/result");
const { simulateUser } = require("../scripts/userSimulation");

exports.startTest = async (req, res) => {
  const { S, BR, PS, TOS, sleep, LP, urls, clicks, cName, fName } = req.body;

  if (!S || !BR || !PS || !TOS || !sleep || !LP || !urls || !cName || !fName) {
    return res.status(400).json({
      error:
        "Please provide all required fields: S, BR, PS, TOS, sleep, LP, urls, cName, fName",
    });
  }

  try {
    // Simulate user behavior
    const userActions = await simulateUser(
      S,
      BR,
      PS,
      TOS,
      sleep,
      LP,
      urls,
      clicks,
      cName,
      fName
    );

    // Save result to the database
    const result = new Result({
      url: LP,
      browser: "chrome", // Or any browser logic if needed
      userActions, // This should be dynamically generated based on actions
    });

    await result.save();

    return res
      .status(200)
      .json({ message: "Test completed successfully", result });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while running the test" });
  }
};
