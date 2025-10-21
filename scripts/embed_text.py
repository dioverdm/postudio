# scripts/embed_text.py
import sys
import json
from sentence_transformers import SentenceTransformer

def main():
    try:
        text = sys.stdin.read().strip()
        if not text:
            print(json.dumps({"error": "no_input"}))
            return

        model = SentenceTransformer("BAAI/bge-large-en-v1.5")
        embedding = model.encode(text).tolist()
        print(json.dumps(embedding))

    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
