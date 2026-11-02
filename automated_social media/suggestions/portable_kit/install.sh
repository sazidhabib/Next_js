#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "  Installing Universal Agent Skills (Taste, Security, Gravitas)  "
echo "=========================================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_SKILLS="$SCRIPT_DIR/skills"

# 1. Install to OpenCode
OPENCODE_DIR="$HOME/.config/opencode/skills"
mkdir -p "$OPENCODE_DIR"
cp -r "$SOURCE_SKILLS/"* "$OPENCODE_DIR/"
echo "[✓] Installed to OpenCode ($OPENCODE_DIR)"

# 2. Install to Antigravity
ANTIGRAVITY_DIR="$HOME/.gemini/config/skills"
mkdir -p "$ANTIGRAVITY_DIR"
cp -r "$SOURCE_SKILLS/"* "$ANTIGRAVITY_DIR/"
echo "[✓] Installed to Antigravity ($ANTIGRAVITY_DIR)"

# 3. Install to Global ~/.agents
AGENTS_DIR="$HOME/.agents/skills"
mkdir -p "$AGENTS_DIR"
cp -r "$SOURCE_SKILLS/"* "$AGENTS_DIR/"
echo "[✓] Installed to Global Agents ($AGENTS_DIR)"

echo ""
echo "Setup Complete! All agents on this machine now have access to high-standard skills."
