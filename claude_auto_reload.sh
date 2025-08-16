#!/bin/bash

# קובץ ההקשר המלא
CONTEXT_FILE="CLAUDE_CONTEXT_FULL.md"

echo "Starting Claude Code CLI with automatic reload of $CONTEXT_FILE after /clear."
echo "Type /exit to quit."

# הפעלה אינטראקטיבית של claude CLI עם טיפול ב-/clear
while true; do
    read -p "> " input_line

    if [[ "$input_line" == "/exit" ]]; then
        echo "Exiting Claude CLI."
        break
    elif [[ "$input_line" == "/clear" ]]; then
        echo "Clearing context and reloading $CONTEXT_FILE..."
        # ניקוי הקשר ב-Claude Code באמצעות הפקודה /clear
        printf "/clear\n" | claude

        # טעינת ההקשר המלא
        if [ -f "$CONTEXT_FILE" ]; then
            echo "Loading context from $CONTEXT_FILE..."
            cat "$CONTEXT_FILE" | claude
            echo "Context reloaded."
        else
            echo "Warning: $CONTEXT_FILE not found."
        fi
    else
        # העברת הקלט ל-Claude Code
        echo "$input_line" | claude
    fi
done
