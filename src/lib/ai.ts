import "server-only";
import { anthropic } from "@ai-sdk/anthropic";

// Reads ANTHROPIC_API_KEY from the environment at call time
export const model = anthropic("claude-sonnet-5-5");
export const fastModel = anthropic("claude-haiku-5-5");
