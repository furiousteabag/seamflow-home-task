import "server-only";
import { createAnthropic } from "@ai-sdk/anthropic";
import { env } from "@/env";

const anthropic = createAnthropic({ apiKey: env.ANTHROPIC_API_KEY });

export const model = anthropic("claude-sonnet-5-5");
export const fastModel = anthropic("claude-haiku-5-5");
