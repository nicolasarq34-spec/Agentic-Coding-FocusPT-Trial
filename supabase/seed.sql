-- Fake demo data, loaded by `npx supabase db reset`. Local development only. Never real people.
--
-- Everyone below logs in with the same dev-only password: coachlab-dev
--   Trainer:  tara.trainer@example.com
--   Clients:  cleo.client@example.com, cam.client@example.com, cora.client@example.com
--
-- We add people the way Supabase Auth would: a row in auth.users (email, hashed password,
-- role and name as metadata) and a row in auth.identities (what makes email + password log-in work).
-- The on_auth_user_created trigger then creates each profile, exactly as it does at sign-up.
-- Fixed ids keep the data the same after every reset.
-- Clients aren't linked to the trainer yet (trainer_id stays empty until feature 4).

with people (id, email, role, name) as (
  values
    ('00000000-0000-4000-a000-000000000001'::uuid, 'tara.trainer@example.com', 'trainer', 'Tara Trainer'),
    ('00000000-0000-4000-a000-000000000002'::uuid, 'cleo.client@example.com', 'client', 'Cleo Client'),
    ('00000000-0000-4000-a000-000000000003'::uuid, 'cam.client@example.com', 'client', 'Cam Client'),
    ('00000000-0000-4000-a000-000000000004'::uuid, 'cora.client@example.com', 'client', 'Cora Client')
),
new_users as (
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    -- Supabase Auth expects these to be empty text, not missing (null).
    confirmation_token, recovery_token, email_change_token_new, email_change
  )
  select
    '00000000-0000-0000-0000-000000000000', id, 'authenticated', 'authenticated', email,
    extensions.crypt('coachlab-dev', extensions.gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}',
    jsonb_build_object('role', role, 'name', name), now(), now(),
    '', '', '', ''
  from people
  returning id, email
)
insert into auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
select
  id::text, id,
  jsonb_build_object('sub', id::text, 'email', email, 'email_verified', true),
  'email', now(), now(), now()
from new_users;
