#!/bin/bash
cd "$(dirname "$0")"

source ~/.venv/solana/bin/activate
python process.py

