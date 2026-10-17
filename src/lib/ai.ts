import "server-only";
import { anthropic } from "@ai-sdk/anthropic";

export const CLASSIFIER_MODEL_ID = "claude-haiku-5-5";

// Reads ANTHROPIC_API_KEY from the environment at call time
export const classifierModel = anthropic(CLASSIFIER_MODEL_ID);
