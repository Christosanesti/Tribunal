#!/bin/sh
# Seed the database
# This script runs the Prisma seed
cd "$(dirname "$0")"
npm run db:seed
