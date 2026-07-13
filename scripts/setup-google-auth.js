#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { execSync } = require("child_process");

// ANSI color escapes for beautiful console branding
const BLUE = "\x1b[34m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => {
  return new Promise((resolve) => rl.question(query, resolve));
};

async function main() {
  console.log(`\n${BLUE}${BOLD}====================================================`);
  console.log(`   Supabase Google OAuth End-to-End Configuration   `);
  console.log(`====================================================${RESET}\n`);

  console.log(`${BOLD}This script will guide you to configure Google OAuth end-to-end.${RESET}\n`);
  
  console.log(`Select your target environment:`);
  console.log(`  ${GREEN}1)${RESET} Hosted Project (Production/Staging: ${BOLD}ljfiuakvxzdzsrsubrnh${RESET})`);
  console.log(`  ${GREEN}2)${RESET} Local Development (Supabase CLI Emulator)`);
  console.log("");
  
  const envChoice = await askQuestion(`${BOLD}Enter choice (1 or 2): ${RESET}`);

  if (envChoice.trim() === "1") {
    await setupHostedOAuth();
  } else if (envChoice.trim() === "2") {
    await setupLocalOAuth();
  } else {
    console.log(`\n${RED}Invalid choice. Exiting setup.${RESET}\n`);
    rl.close();
  }
}

async function setupHostedOAuth() {
  const projectRef = "ljfiuakvxzdzsrsubrnh";
  const callbackUrl = `https://${projectRef}.supabase.co/auth/v1/callback`;
  const gcpConsoleUrl = "https://console.cloud.google.com/apis/credentials";
  const supabaseConsoleUrl = `https://supabase.com/dashboard/project/${projectRef}/auth/providers`;

  console.log(`\n${BLUE}${BOLD}--- HOSTED GOOGLE OAUTH CONFIGURATION ---${RESET}\n`);
  console.log(`${BOLD}Step 1: Get credentials from Google Cloud Console${RESET}`);
  console.log(`  1. Open Google Credentials Console: ${YELLOW}${gcpConsoleUrl}${RESET}`);
  console.log(`  2. Click ${BOLD}Create Credentials${RESET} > ${BOLD}OAuth client ID${RESET}.`);
  console.log(`  3. Choose Application Type: ${BOLD}Web application${RESET}.`);
  console.log(`  4. Set the name to "Vocab Mania - Production".`);
  console.log(`  5. Add ${BOLD}Authorized redirect URIs${RESET}:`);
  console.log(`     👉 ${GREEN}${callbackUrl}${RESET}\n`);
  
  console.log(`${BOLD}Step 2: Save Credentials to Hosted Supabase Dashboard${RESET}`);
  console.log(`  1. Open Supabase Dashboard Auth settings: ${YELLOW}${supabaseConsoleUrl}${RESET}`);
  console.log(`  2. Scroll down and expand the ${BOLD}Google${RESET} section.`);
  console.log(`  3. Enable the Google provider.`);
  console.log(`  4. Paste your ${BOLD}Client ID${RESET} and ${BOLD}Client Secret${RESET} copy-pasted from Google.`);
  console.log(`  5. Click Save.\n`);

  console.log(`${BOLD}Step 3: Verification URL Redirect Configs${RESET}`);
  console.log(`  - The app routes redirect automatically to: ${GREEN}/auth/callback${RESET}`);
  console.log(`  - Standard callback redirects users directly into: ${GREEN}/learn${RESET}\n`);

  const openChoice = await askQuestion(`${BOLD}Would you like to open the setup links in your default browser? (y/n): ${RESET}`);
  if (openChoice.trim().toLowerCase() === "y") {
    console.log(`\nOpening links...`);
    try {
      const openCmd = process.platform === "darwin" ? "open" : (process.platform === "win32" ? "start" : "xdg-open");
      execSync(`${openCmd} "${gcpConsoleUrl}"`);
      execSync(`${openCmd} "${supabaseConsoleUrl}"`);
      console.log(`${GREEN}Opened Google Console and Supabase Dashboard tabs successfully!${RESET}\n`);
    } catch (e) {
      console.log(`${RED}Failed to open browser: ${e.message}${RESET}`);
    }
  }

  console.log(`\n${GREEN}${BOLD}✔ Hosted Google Sign-in Setup Completed!${RESET}`);
  console.log(`Once you enter the Client ID and Secret in the Supabase Dashboard, users can login via Google.\n`);
  rl.close();
}

async function setupLocalOAuth() {
  console.log(`\n${BLUE}${BOLD}--- LOCAL CLI EMULATOR CONFIGURATION ---${RESET}\n`);
  
  const configPath = path.join(__dirname, "../supabase/config.toml");
  
  if (!fs.existsSync(configPath)) {
    console.log(`${YELLOW}No supabase config.toml found. Initializing supabase config...${RESET}`);
    try {
      execSync("supabase init", { stdio: "inherit" });
      console.log(`${GREEN}Initialized local Supabase setup!${RESET}\n`);
    } catch (err) {
      console.log(`${RED}Failed to run 'supabase init': ${err.message}${RESET}`);
      console.log(`Please make sure the Supabase CLI is authenticated/installed correctly.`);
      rl.close();
      return;
    }
  }

  console.log(`${BOLD}To configure local OAuth, we need to create GCP client credentials for localhost.${RESET}`);
  console.log(`  1. Open Google Credentials Console: ${YELLOW}https://console.cloud.google.com/apis/credentials${RESET}`);
  console.log(`  2. Click ${BOLD}Create Credentials${RESET} > ${BOLD}OAuth client ID${RESET}.`);
  console.log(`  3. Choose Application Type: ${BOLD}Web application${RESET}.`);
  console.log(`  4. Set the name to "Vocab Mania - Local Dev".`);
  console.log(`  5. Add ${BOLD}Authorized redirect URIs${RESET}:`);
  console.log(`     👉 ${GREEN}http://127.0.0.1:54321/auth/v1/callback${RESET}\n`);

  const clientId = await askQuestion(`${BOLD}Enter Google Client ID: ${RESET}`);
  const clientSecret = await askQuestion(`${BOLD}Enter Google Client Secret: ${RESET}`);

  if (!clientId || !clientSecret) {
    console.log(`\n${RED}Client ID and Secret cannot be empty. Exiting setup.${RESET}\n`);
    rl.close();
    return;
  }

  // Update supabase/config.toml
  try {
    let configContent = fs.readFileSync(configPath, "utf8");

    // Replace or insert the google oauth config block
    const oauthPattern = /\[auth\.external\.google\][\s\S]*?(?=\n\[|\n#|$)/;
    const newOauthBlock = `[auth.external.google]
enabled = true
client_id = "${clientId.trim()}"
secret = "${clientSecret.trim()}"
redirect_uri = "http://127.0.0.1:54321/auth/v1/callback"`;

    if (oauthPattern.test(configContent)) {
      configContent = configContent.replace(oauthPattern, newOauthBlock);
    } else {
      configContent += `\n\n${newOauthBlock}\n`;
    }

    fs.writeFileSync(configPath, configContent, "utf8");
    console.log(`\n${GREEN}✔ Updated supabase/config.toml with credentials successfully!${RESET}\n`);

    const restartChoice = await askQuestion(`${BOLD}Would you like to restart the local Supabase containers to apply changes? (y/n): ${RESET}`);
    if (restartChoice.trim().toLowerCase() === "y") {
      console.log(`\nRestarting Supabase emulator containers...`);
      execSync("supabase stop --no-backup && supabase start", { stdio: "inherit" });
      console.log(`\n${GREEN}✔ Supabase restarted with Google OAuth active!${RESET}\n`);
    } else {
      console.log(`\n${YELLOW}Please run 'supabase stop && supabase start' manually to activate the credentials.${RESET}\n`);
    }

  } catch (err) {
    console.log(`\n${RED}Error updating config.toml: ${err.message}${RESET}\n`);
  }

  rl.close();
}

main();
