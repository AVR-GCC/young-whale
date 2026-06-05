-- Seed platform_config with default values

INSERT INTO platform_config (key, value, description) VALUES
  ('ai_model',
   '"accounts/fireworks/models/gpt-oss-120b"',
   'Fireworks AI model used for token classification'),

  ('ai_prompt_system',
   '"You are a crypto token classifier. Analyze the token data provided and return a JSON object only. No explanation, no markdown, just raw JSON."',
   'System prompt sent to AI for token classification'),

  ('available_models',
   '["accounts/fireworks/models/gpt-oss-120b", "accounts/fireworks/models/llama-v3p1-405b-instruct", "accounts/fireworks/models/qwen2p5-72b-instruct"]',
   'Available AI models for the admin dropdown'),
