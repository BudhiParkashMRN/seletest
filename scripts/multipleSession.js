const { Builder, Browser, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const firefox = require("selenium-webdriver/firefox");
const userAgents = require("./userAgent");
const proxyList = require("./proxy_list.json");
const fs = require("fs");
const axios = require("axios");
const path = require("path");
const { Mutex } = require("async-mutex");
const mutex = new Mutex();

async function initializeDriver(i) {
  try {
    let firefoxoptions = new firefox.Options();
    firefoxoptions.addArguments("--headless");

    let options = new chrome.Options();
    options.addArguments("--headless");
    // options.addArguments("--disable-gpu"); // Disable GPU rendering
    options.addArguments("--no-sandbox"); // Bypass OS security model
    // options.addArguments("--disable-dev-shm-usage"); // Overcome limited resource problems
    //options.addArguments(`--user-data-dir=${tempDirPath}`);
    // options.addArguments("--blink-settings=imagesEnabled=false");

    const randomUserAgent =
      userAgents[Math.floor(Math.random() * userAgents.length)];
    firefoxoptions.addArguments(`--user-agent=${randomUserAgent}`);

    let driver = await new Builder()
      .forBrowser(Browser.FIREFOX)
      .setFirefoxOptions(firefoxoptions)
      .build();

    console.log(`Driver initialized for user ${i + 1}`);
    await driver.manage().setTimeouts({ pageLoad: 120000, script: 30000 });
    return driver;
  } catch (error) {
    console.log("intialized error ---------" + error.message);
  }
}

async function performScroll(driver, scrollCount) {
  let total_time = 0;
  for (let j = 0; j < scrollCount; j++) {
    const randomHeight = Math.floor(Math.random() * 500) + 700;
    let s_t1 = getRandomDelay(2000, 15000);
    await driver.sleep(s_t1);
    total_time += s_t1;
    await driver.executeScript(`window.scrollBy(0, ${randomHeight});`);
    let s_t2 = getRandomDelay(2000, 25000);
    await driver.sleep(s_t2);
    total_time += s_t2;
  }
  return total_time;
}

async function performBounce(driver, sleep, i) {
  try {
    let s_t01 = getRandomDelay(2000, 12000);
    await driver.sleep(s_t01);

    const randomHeight = Math.floor(Math.random() * 500) + 400;
    await driver.executeScript(`window.scrollBy(0, ${randomHeight});`);
    console.log(`User ${i + 1} bounced.`);
  } catch (error) {
    console.error(`Error during bounce for user ${i + 1}: ${error.message}`);
  }
}

async function performInteraction(
  driver,
  page_scroll,
  time_of_session,
  urls,
  sleep,
  i,
  clicks,
  cookiesFolderPath
) {
  let total_time = 0;

  try {
    let timeOnPage = getRandomDelay(2000, time_of_session * 1000);
    await driver.sleep(timeOnPage);
    total_time += timeOnPage;

    total_time += await performScroll(driver, page_scroll);

    for (const url of urls) {
      await safeNavigate(driver, url);
      await driver.sleep(sleep * 1000);
      total_time += sleep * 1000;
      total_time += await performScroll(driver, page_scroll);
    }

    console.log(`Time: ${formatTime(total_time)}`);
  } catch (error) {
    console.error(
      `Error during interaction for user ${i + 1}: ${error.message}`
    );
  }
}

function createSemaphore(maxConcurrent) {
  let active = 0;
  const queue = [];
  let isDeleting = false; // Flag to check if deletion is in progress

  const runNext = async () => {
    // If deletion is in progress, skip running new tasks
    if (isDeleting || queue.length === 0 || active >= maxConcurrent) return;

    const task = queue.shift();
    active++;
    try {
      await task();
    } finally {
      active--;
      runNext();
    }
  };

  const startDeletion = async (deleteFunction) => {
    isDeleting = true; // Set the flag to indicate deletion is in progress
    await deleteFunction();
    isDeleting = false; // Reset the flag after deletion
    runNext(); // Resume processing the queue
  };

  return {
    addTask: async (task) => {
      queue.push(task);
      runNext();
    },
    startDeletion, // Expose the deletion function
  };
}

async function runSimulations(
  session,
  bounceRate,
  pageScroll,
  timeOfSession,
  sleep,
  landingPage,
  urls,
  clicks,
  cName,
  fName,
  maxConcurrentDrivers
) {
  let totalSessions = 0;
  const cookiesFolderPath = path.join(__dirname, cName);
  const parentDir = path.join(__dirname, "chromeTemp__" + cName);

  // Create cookies folder if it doesn't exist
  if (!fs.existsSync(cookiesFolderPath)) {
    fs.mkdirSync(cookiesFolderPath);
  }

  // Create an array of session indices
  const sessionIndices = Array.from({ length: session }, (_, index) => index);

  // Shuffle session indices to mix session order
  sessionIndices.sort(() => Math.random() - 0.5);

  // Randomly select bounce session indices
  const bounceIndices = new Set(sessionIndices.slice(0, bounceRate));

  // Shuffle the entire session array again to mix bounce and non-bounce sessions
  sessionIndices.sort(() => Math.random() - 0.5);

  // Create a semaphore with the maximum concurrent drivers
  const limitConcurrency = createSemaphore(maxConcurrentDrivers);

  // Create tasks with limited concurrency
  const tasks = sessionIndices.map((i) =>
    limitConcurrency.addTask(async () => {
      let driver;
      try {
        // const tempDirPath = path.join(parentDir, `session_${i}`);

        // // Ensure the temp directory exists
        // if (!fs.existsSync(tempDirPath)) {
        //   fs.mkdirSync(tempDirPath, { recursive: true });
        // }

        driver = await initializeDriver(i);
        await driver.get(landingPage);

        // Check if this session is a bounce session or regular session
        if (bounceIndices.has(i)) {
          await performBounce(driver, sleep, i);
        } else {
          await performInteraction(
            driver,
            pageScroll,
            timeOfSession,
            urls,
            sleep,
            i,
            clicks,
            cookiesFolderPath
          );
        }

        // Increment totalSessions in a mutex-protected section
        await mutex.runExclusive(() => {
          totalSessions++;
          console.log("Session No.-------------" + totalSessions);
        });

        // if (totalSessions % 100 === 0) {
        //   console.log("Delete block");
        //   await pause(90000);
        //   // Call startDeletion to handle the delete process
        //   await limitConcurrency.startDeletion(() =>
        //     deleteParentDir(parentDir)
        //   );
        // }
      } catch (error) {
        console.error(`Error for session ${i + 1}: ${error.message}`);
      } finally {
        // Quit driver and manage totalSessions
        if (driver) {
          try {
            await driver.quit();
            console.log(`Driver for session ${i + 1} quit`);
          } catch (err) {
            console.error(
              `Error quitting driver for session ${i + 1}: ${err.message}`
            );
          }
        }
      }
    })
  );

  // Wait for all tasks to complete
  await Promise.all(tasks);
}

const pause = (duration) =>
  new Promise((resolve) => setTimeout(resolve, duration));

function getRandomDelay(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatTime(ms) {
  let totalSeconds = Math.floor(ms / 1000);
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

async function safeNavigate(driver, url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await driver.get(url);
      return true;
    } catch (error) {
      if (i === retries - 1) throw error;
      await driver.sleep(1000);
    }
  }
}

async function verifyProxy(proxy) {
  try {
    const response = await axios.get("http://google.com", {
      proxy: {
        host: proxy.ip,
        port: proxy.port,
        auth: {
          username: proxy.username,
          password: proxy.password,
        },
      },
      timeout: 5000, // 5 seconds timeout
    });
    console.log("Proxy verified");
    return response.status === 200;
  } catch (error) {
    console.log("Proxy verification failed");
    return false;
  }
}

async function getVerifiedProxy() {
  for (let i = 0; i < proxyList.length; i++) {
    const proxy = proxyList[Math.floor(Math.random() * proxyList.length)];
    const isValid = await verifyProxy(proxy); // Verify the proxy
    if (isValid) {
      console.log("Valid proxy available");
      return proxy;
    }
  }
  console.log("No valid proxies available");
  throw new Error("No valid proxies available");
}

// Function to delete the entire parent directory
async function deleteParentDir(parentDir) {
  try {
    console.log("Delete Start");
    if (fs.existsSync(parentDir)) {
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Delay to ensure any open handles are closed
      fs.rmSync(parentDir, { recursive: true, force: true });
      console.log(`Deleted directory: ${parentDir}`);
    }
  } catch (error) {
    console.error(`Failed to delete directory ${parentDir}: ${error.message}`);
  }
}
module.exports = {
  runSimulations,
};
