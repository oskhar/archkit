#!/bin/bash
# laboratory/scripts/git-metrics-hook.sh

BRANCH=$(git rev-parse --abbrev-ref HEAD)
LAST_COMMIT_DATE=$(git log -1 --format=%ct)
CURRENT_DATE=$(date +%s)
DIFF=$((CURRENT_DATE - LAST_COMMIT_DATE))

echo "Time since last commit: $DIFF seconds"

# Append metrics to a temporary file for later reporting
echo "{\"timestamp\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\", \"branch\": \"$BRANCH\", \"interval_sec\": $DIFF}" >> laboratory/results/commit-intervals.jsonl
