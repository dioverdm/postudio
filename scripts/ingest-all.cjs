// scripts/ingest-all.cjs
const { spawnSync } = require("child_process");
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const pythonPath = process.env.PYTHON_PATH || "python";

function getEmbeddingPython(text) {
  if (!text?.trim()) return null;

  const process = spawnSync(pythonPath, ["scripts/embed_text.py"], {
    input: text.trim(),
    encoding: "utf-8",
  });

  const stdout = process.stdout.trim();
  if (!stdout) return null;

  try {
    const result = JSON.parse(stdout);
    if (result.error) {
      console.error("⚠️ Python error:", result.error);
      return null;
    }
    return result;
  } catch {
    console.error("⚠️ Python parse error:", stdout.slice(0, 200));
    return null;
  }
}

// 🧩 Split Instruction/Response
function parseInstructionBlocks(text) {
  const blocks = [];
  const pattern =
    /### Instruction:\s*([\s\S]*?)\n+### Response:\s*([\s\S]*?)(?:---|$)/g;
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const instruction = match[1].trim();
    const response = match[2].trim();
    if (instruction && response) {
      blocks.push({ instruction, response });
    }
  }
  return blocks;
}

async function ingestAll() {
  const folder = path.join(__dirname, "knowledge");
  const filenames = fs.readdirSync(folder).filter((f) => f.endsWith(".txt"));

  console.log(`📂 Found ${filenames.length} text file(s).\n`);

  for (const fname of filenames) {
    console.log(`📄 Processing ${fname} ...`);
    const fullpath = path.join(folder, fname);
    const text = fs.readFileSync(fullpath, "utf8");
    const blocks = parseInstructionBlocks(text);

    if (blocks.length === 0) {
      console.log("⚠️ No instruction/response pairs found.\n");
      continue;
    }

    console.log(`🧱 Found ${blocks.length} Instruction/Response pair(s).`);

    for (const [i, b] of blocks.entries()) {
      const combinedText = `Instruction: ${b.instruction}\nResponse: ${b.response}`;
      const embedding = getEmbeddingPython(combinedText);
      if (!embedding) {
        console.error("❌ Skipping due to embedding error.\n");
        continue;
      }

      const { error } = await supabase
        .from("documents")
        .upsert(
          [
            {
              content: b.response,
              embedding,
              metadata: {
                instruction: b.instruction,
                source: fname,
              },
              source: `${fname}-${i}`,
            },
          ],
          { onConflict: "source" }
        );

      if (error) {
        console.error("❌ Error inserting", fname, error.message);
      } else {
        console.log(`✅ Upserted ${fname} block ${i + 1}\n`);
      }
    }
  }

  console.log("🎉 Ingestion complete!");
}

ingestAll();
