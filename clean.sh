#!/bin/bash

echo "Cleaning up folders..."

find . \( -name "node_modules" -o -name ".next" -o -name "dist" -o -name "build" -o -name ".turbo" \) -type d -prune -exec rm -rf '{}' +

echo "Cleanup complete."
