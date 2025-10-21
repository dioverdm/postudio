const { spawnSync } = require('child_process');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const pythonPath = process.env.PYTHON_PATH || 'python';

function getEmbeddingPython(text) {
  const process = spawnSync(pythonPath, ['scripts/embed_text.py'], {
    input: text,
    encoding: 'utf-8',
  });

  try {
    const result = JSON.parse(process.stdout.trim());
    if (result.error) {
      console.error('⚠️ Python error:', result.error);
      return null;
    }
    return result.embedding;
  } catch (err) {
    console.error('⚠️ Python output parse error:\n', process.stdout);
    return null;
  }
}

async function ingest() {
  const folder = path.join(__dirname, 'knowledge');
  const filenames = fs.readdirSync(folder);

  for (const fname of filenames) {
    console.log('📄 Processing', fname, '...');

    const fullpath = path.join(folder, fname);
    const text = fs.readFileSync(fullpath, 'utf8');

    const embedding = getEmbeddingPython(text);
    if (!embedding) continue;

    const { error } = await supabase.from('documents').insert([
      {
        content: text,
        embedding,
        metadata: { source: fname },
      },
    ]);

    if (error) {
      console.error('❌ Error inserting', fname, error.message);
    } else {
      console.log('✅ Inserted', fname);
    }
  }

  console.log('🎉 Ingestion complete!');
}

ingest();
