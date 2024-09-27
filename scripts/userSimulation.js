const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const userAgents = require("./userAgent");
const proxyList = require("./proxy_list.json");
const fs = require("fs");
const axios = require("axios");
const locations = require("./IndiaLatLong");

async function initializeDriver(i) {
  let options = new chrome.Options();
  options.addArguments("--disable-gpu");
  options.addArguments("--no-sandbox");
  options.addArguments("--disable-dev-shm-usage");
  options.addArguments("--enable-logging");
  options.addArguments("--v=1");
  // options.addArguments("--headless");

  //    Apply random proxy
  // const proxy = await getVerifiedProxy();
  // const proxy = getRandomProxy();
  // options.addArguments(
  //   `--proxy-server=http://${proxy.username}:${proxy.password}@${proxy.ip}:${proxy.port}`
  // );

  // Set a new random user agent for each user
  const randomUserAgent =
    userAgents[Math.floor(Math.random() * userAgents.length)];
  options.addArguments(`--user-agent=${randomUserAgent}`);

  // const randomLocation =
  //   locations[Math.floor(Math.random() * locations.length)];

  // options.addArguments(
  //   `--disable-blink-features=BlockCredentialedSubresources`,
  //   `--geolocation-override-latitude=${randomLocation.latitude}`,
  //   `--geolocation-override-longitude=${randomLocation.longitude}`,
  //   "--allow-geolocation"
  // );

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  const devTools = await driver.createCDPConnection("page");

  console.log(`Driver initialized for user ${i + 1}`);
  await driver.manage().setTimeouts({ pageLoad: 120000, script: 30000 });
  return driver;
}

async function performScroll(driver, scrollCount) {
  let total_time = 0;
  for (let j = 0; j < scrollCount; j++) {
    const randomHeight = Math.floor(Math.random() * 500) + 700; // Random scroll height

    let s_t1 = getRandomDelay(3000, 15000);
    await driver.sleep(s_t1);
    total_time += s_t1;

    await driver.executeScript(`window.scrollBy(0, ${randomHeight});`);

    let s_t2 = getRandomDelay(3000, 20000);
    await driver.sleep(s_t2);
    total_time += s_t2;
  }
  return total_time;
}

async function performBounce(driver, sleep, i, logFile) {
  try {
    let s_t01 = getRandomDelay(3000, 8000);
    await driver.sleep(s_t01);

    const randomHeight = Math.floor(Math.random() * 500) + 400;

    await driver.executeScript(`window.scrollBy(0, ${randomHeight});`);

    console.log(`User ${i + 1} bounced.`);
    //driver.sleep(sleep * 1000);
    logFile.write(`Count ${i + 1}, Bounce, ${new Date().toISOString()}\n`);
  } catch (error) {
    console.error(`Error during bounce for user ${i + 1}: ${error.message}`);
    logFile.write(`Error during bounce for user ${i + 1}: ${error.message}\n`);
  }
}

async function performInteraction(
  driver,
  page_scroll,
  time_of_session,
  urls,
  sleep,
  i,
  logFile,
  clicks
) {
  let actions = [];
  let total_time = 0;

  try {
    let s_t01 = getRandomDelay(3000, 5000);
    await driver.sleep(s_t01);
    total_time += s_t01;

    for (const click of clicks) {
      try {
        let specificAnchor1 = await driver.wait(
          until.elementLocated(By.css(click)),
          30000
        );
        await driver.executeScript(
          "arguments[0].scrollIntoView(true);",
          specificAnchor1
        );
        await driver.wait(until.elementIsVisible(specificAnchor1), 15000);

        // Click the specific element
        await specificAnchor1.click();
        actions.push(`Click : ${click}`);
        console.log(`Click : ${click}`);

        total_time += await performScroll(driver, 1);
      } catch (error) {
        console.error(`Error during click  ${i + 1}: ${error.message}`);
      }
    }

    // Scroll to the element and ensure it is visible

    // await driver.wait(until.elementLocated(By.css("a")), 30000);
    // let anchorTags = await driver.findElements(By.css("a"));

    // for (let anchor of anchorTags) {
    //   console.log("anchorTags  " + anchorTags.href);
    //   let href = await anchor.getAttribute("href");
    //   if (href && href.includes("traveling-on-a-budget-tips-and-tricks")) {
    //     await anchor.click();
    //     actions.push("Click : traveling-on-a-budget-tips-and-tricks");
    //     console.log("Click : traveling-on-a-budget-tips-and-tricks");
    //     break;
    //   }
    // }

    let timeOnPage = getRandomDelay(5000, time_of_session * 1000);
    await driver.sleep(timeOnPage);
    total_time += timeOnPage;

    total_time += await performScroll(driver, page_scroll);
    actions.push("Scroll");

    for (const url of urls) {
      await safeNavigate(driver, url);

      await driver.sleep(sleep * 1000);
      total_time += sleep * 1000;

      total_time += await performScroll(driver, 1);
      actions.push(`Visit: ${url}`);
    }

    logFile.write(
      `Count ${
        i + 1
      }, Interaction, ${new Date().toISOString()}, Time: ${formatTime(
        total_time
      )}\n`
    );

    actions.push(`Time: ${formatTime(total_time)}`);

    return actions;
  } catch (error) {
    console.error(
      `Error during interaction for user ${i + 1}: ${error.message}`
    );
    logFile.write(
      `Error during interaction for user ${i + 1}: ${error.message}\n`
    );
  }
}

async function simulateUser(
  session,
  bounce_rate,
  page_scroll,
  time_of_session,
  sleep,
  landing_page,
  urls,
  clicks,
  cName,
  fName
) {
  let userActions = [];
  const logFile = fs.createWriteStream(fName, { flags: "a" });
  logFile.write("-------- INSTANCE REBOOTED --------\n");

  const sessionIndices = Array.from({ length: session }, (_, index) => index);
  sessionIndices.sort(() => Math.random() - 0.5); // Shuffle the array

  const bounceIndices = new Set(sessionIndices.slice(0, bounce_rate));

  for (let i = 0; i < session; i++) {
    let driver;
    try {
      driver = await initializeDriver(i);
      await safeNavigate(driver, landing_page);
      let actions;

      if (bounceIndices.has(i)) {
        await performBounce(driver, sleep, i, logFile);
      } else {
        actions = await performInteraction(
          driver,
          page_scroll,
          time_of_session,
          urls,
          sleep,
          i,
          logFile,
          clicks
        );
      }

      userActions.push({ userId: i + 1, actions });
    } catch (error) {
      console.error(`General error for session ${i + 1}: ${error.message}`);
    } finally {
      if (driver) {
        await driver.quit();
        console.log(`Driver quit for user ${i + 1}`);
      }
    }
  }

  logFile.end();
  console.log("User simulation completed");

  return userActions;
}

function getRandomDelay(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatTime(ms) {
  let totalSeconds = Math.floor(ms / 1000);
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

// Safely navigate to a URL with retry logic
async function safeNavigate(driver, url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await driver.get(url);
      return true;
    } catch (error) {
      if (i === retries - 1) throw error;
      await driver.sleep(1000); // Wait before retrying
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
    console.log("proxy verified");
    return response.status === 200;
  } catch (error) {
    console.log("proxy verified failed");
    return false;
  }
}

// Function to select and verify a random proxy from the list
async function getVerifiedProxy() {
  for (let i = 0; i < proxyList.length; i++) {
    const proxy = proxyList[Math.floor(Math.random() * proxyList.length)];
    const isValid = await verifyProxy(proxy); // Verify the proxy
    if (isValid) {
      console.log("return valid proxies available");
      return proxy;
    }
  }
  console.log("No valid proxies available");
  throw new Error("No valid proxies available");
}

// Select a random proxy
// function getRandomProxy() {
//   const randomIndex = Math.floor(Math.random() * proxyList.length);
//   return proxyList[randomIndex];
// }

// Function to save cookies to a file
async function saveCookies(driver, cookieFile) {
  const cookies = await driver.manage().getCookies();
  fs.writeFileSync(cookieFile, JSON.stringify(cookies, null, 2));
}

// Function to load cookies from a file
async function loadCookies(driver, cookieFile) {
  if (fs.existsSync(cookieFile)) {
    const cookies = JSON.parse(fs.readFileSync(cookieFile, "utf8"));
    for (let cookie of cookies) {
      await driver.manage().addCookie(cookie);
    }
  }
}

// Delete cookies
async function deleteCookies(driver) {
  await driver.manage().deleteAllCookies();
  console.log(`Cookies deleted`);
}

async function setGeoLocation(driver, latitude, longitude) {
  // Get the debugging URL from ChromeDriver
  const debuggingUrl = await driver.getDevToolsUrl();
  const client = await CDP({ target: debuggingUrl });

  // Set geo-location using the Chrome DevTools Protocol
  await client.Emulation.setGeolocationOverride({
    latitude: latitude,
    longitude: longitude,
    accuracy: 100,
  });

  await client.close();
}

module.exports = {
  simulateUser,
};
