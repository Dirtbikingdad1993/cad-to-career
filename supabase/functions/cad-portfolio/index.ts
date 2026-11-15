// Public GET is intentional. The handler authenticates every write itself.
import { createHandler } from './handler.mjs';
Deno.serve(createHandler({base:Deno.env.get('SUPABASE_URL') || '', service:Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''}));
