import { spawnSync } from "child_process";

export function getLocalEmbedding(text) {
  const pythonPath = process.env.PYTHON_PATH || "python";
  const result = spawnSync(
    pythonPath,
    ["scripts/embed_text.py"],
    { input: text, encoding: "utf-8" }
  );

  if (result.error) {
    console.error("Python execution error:", result.error);
    return null;
  }

  if (!result.stdout.trim()) {
    console.error("No output from Python:", result.stderr);
    return null;
  }

  try {
    return JSON.parse(result.stdout);
  } catch (err) {
    console.error("Embedding parse error:", err);
    console.log("Raw output:", result.stdout);
    return null;
  }
}
