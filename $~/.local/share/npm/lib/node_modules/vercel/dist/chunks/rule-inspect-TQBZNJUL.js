import { createRequire as __createRequire } from 'node:module';
import { fileURLToPath as __fileURLToPath } from 'node:url';
import { dirname as __dirname_ } from 'node:path';
const require = __createRequire(import.meta.url);
const __filename = __fileURLToPath(import.meta.url);
const __dirname = __dirname_(__filename);
import {
  emitRulesArgParseError,
  handleRulesApiError,
  parseRulesFlagsAndScope,
  rulesItemPath
} from "./chunk-VWXC5XIE.js";
import "./chunk-POF76PSB.js";
import "./chunk-HTOH3MSD.js";
import {
  validateJsonOutput
} from "./chunk-XPKWKPWA.js";
import {
  rulesInspectSubcommand
} from "./chunk-2R5WYHZW.js";
import {
  AGENT_REASON
} from "./chunk-L6Q2EQPI.js";
import "./chunk-ILYEE673.js";
import "./chunk-GIJMTTDG.js";
import "./chunk-4CIXZOP4.js";
import {
  buildCommandWithGlobalFlags,
  outputAgentError
} from "./chunk-7OUZIPHA.js";
import "./chunk-CO5D46AG.js";
import "./chunk-N2T234LO.js";
import {
  getFlagsSpecification,
  parseArguments,
  printError
} from "./chunk-XQUJUKTN.js";
import {
  isAPIError,
  packageName
} from "./chunk-IDFKAJW3.js";
import "./chunk-P4QNYOFB.js";
import {
  output_manager_default
} from "./chunk-ZQKJVHXY.js";
import "./chunk-S7KYDPEM.js";
import "./chunk-TZ2YI2VH.js";

// src/commands/alerts/rules/rule-inspect.ts
async function ruleInspect(client, argv) {
  let parsedArgs;
  try {
    parsedArgs = parseArguments(
      argv,
      getFlagsSpecification(rulesInspectSubcommand.options)
    );
  } catch (e) {
    emitRulesArgParseError(
      client,
      e,
      "alerts rules inspect <ruleId> --project <name-or-id>"
    );
    printError(e);
    return 1;
  }
  const ruleId = parsedArgs.args[0];
  const fr = validateJsonOutput(parsedArgs.flags);
  if (!fr.valid) {
    outputAgentError(
      client,
      {
        status: "error",
        reason: AGENT_REASON.INVALID_ARGUMENTS,
        message: fr.error
      },
      1
    );
    output_manager_default.error(fr.error);
    return 1;
  }
  if (!ruleId) {
    outputAgentError(
      client,
      {
        status: "error",
        reason: AGENT_REASON.MISSING_ARGUMENTS,
        message: `Missing rule id. Example: ${packageName} alerts rules inspect <ruleId>`,
        next: [
          {
            command: buildCommandWithGlobalFlags(
              client.argv,
              "alerts rules inspect <ruleId>"
            ),
            when: "Replace <ruleId> with an id from `alerts rules ls`"
          },
          {
            command: buildCommandWithGlobalFlags(
              client.argv,
              "alerts rules ls"
            ),
            when: "List rule ids in the current scope"
          }
        ]
      },
      1
    );
    output_manager_default.error("Usage: `vercel alerts rules inspect <ruleId>`");
    return 1;
  }
  const scope = await parseRulesFlagsAndScope(
    client,
    {
      "--project": parsedArgs.flags["--project"],
      "--all": parsedArgs.flags["--all"]
    },
    fr.jsonOutput
  );
  if (typeof scope === "number") {
    return scope;
  }
  const path = rulesItemPath(scope, ruleId);
  output_manager_default.spinner("Fetching alert rule...");
  try {
    const rule = await client.fetch(path);
    if (fr.jsonOutput) {
      client.stdout.write(`${JSON.stringify({ rule }, null, 2)}
`);
    } else {
      client.stdout.write(`${JSON.stringify(rule, null, 2)}
`);
    }
    return 0;
  } catch (err) {
    if (isAPIError(err)) {
      return handleRulesApiError(client, err, fr.jsonOutput);
    }
    throw err;
  } finally {
    output_manager_default.stopSpinner();
  }
}
export {
  ruleInspect as default
};
