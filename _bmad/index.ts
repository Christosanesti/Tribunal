// This file sets up the BMAD system for Tribunal
// BMAD = Build-Measure-Adjust-Document

import { defineConfig } from "@antfu/bmad";

export default defineConfig({
  project: {
    name: "Tribunal",
    version: "1.0.0",
  },
  discovery: {
    principles: ["fairness", "efficiency", "accessibility", "automation"],
  },
  fairness: {
    framework: {
      principles: ["balanced outcomes", "transparency", "neutrality"],
    },
  },
  sprint: {
    duration: "2 weeks",
    cadence: "weekly",
  },
});
