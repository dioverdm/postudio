// injest-faq.cjs
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

// 🧠 Run Python embedding generator
function getEmbeddingPython(text) {
  const process = spawnSync(pythonPath, ["scripts/embed_text.py"], {
    input: text,
    encoding: "utf-8",
  });

  try {
    const result = JSON.parse(process.stdout.trim());
    if (result.error) {
      console.error("⚠️ Python error:", result.error);
      return null;
    }
    return result;
  } catch (err) {
    console.error("⚠️ Embedding parse error:\n", process.stdout);
    return null;
  }
}

// 📂 Ingest the FAQ document
async function ingestFAQ() {
  const filePath = path.join(__dirname, "knowledge", "faq.txt");

  if (!fs.existsSync(filePath)) {
    console.error("❌ faq.txt not found in /knowledge folder");
    process.exit(1);
  }

  console.log("📄 Reading FAQ file...");
  const text = fs.readFileSync(filePath, "utf8");

  // 🧩 Split Q&A pairs
  const sections = text.split(/\nQ:/).slice(1);
  const chunks = sections.map((section) => {
    const [questionPart, answerPart] = section.split(/\nA:/);
    const question = `Q: ${questionPart.trim()}`;
    const answer = `A: ${answerPart ? answerPart.trim() : ""}`;
    return `${question}\n${answer}`;
  });

  console.log(`🧱 Found ${chunks.length} Q&A pairs.`);

  // 🧠 Generate embeddings for each Q&A
  for (const chunk of chunks) {
    console.log("🧠 Embedding Q&A chunk...");
    const embedding = getEmbeddingPython(chunk);
    if (!embedding) {
      console.error("❌ Skipping chunk due to embedding error.");
      continue;
    }

    const { error } = await supabase.from("documents").insert([
      {
        content: chunk,
        embedding,
        metadata: { category: "faq", source: "faq.txt" },
      },
    ]);

    if (error) {
      console.error("❌ Supabase insert error:", error.message);
    } else {
      console.log("✅ Inserted FAQ chunk successfully.");
    }
  }

  console.log("🎉 FAQ ingestion complete!");
}

ingestFAQ();
