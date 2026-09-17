-- ==============================================================================
-- LEXORA — SKRIP AKUN PENGUJIAN & PERBAIKAN TRIGGER AUTH
-- Jalankan skrip ini di SQL Editor Supabase untuk memperbaiki trigger auth
-- dan membuat akun testing Admin serta Member yang langsung siap login.
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Perbarui trigger handle_new_user agar aman dari masalah search_path Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    new_member_num TEXT;
    user_role_val public.user_role;
BEGIN
    new_member_num := 'LX-' || LPAD(nextval('public.member_number_seq')::TEXT, 4, '0');
    
    BEGIN
        user_role_val := COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'member'::public.user_role);
    EXCEPTION WHEN OTHERS THEN
        user_role_val := 'member'::public.user_role;
    END;

    INSERT INTO public.profiles (id, full_name, role, member_number)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Member Lexora'),
        user_role_val,
        new_member_num
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Bersihkan akun testing sebelumnya jika ada data parsial / bermasalah
DELETE FROM auth.identities WHERE user_id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222') OR identity_data->>'email' IN ('admin@lexora.id', 'member@lexora.id');
DELETE FROM public.profiles WHERE id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222') OR id IN (SELECT id FROM auth.users WHERE email IN ('admin@lexora.id', 'member@lexora.id'));
DELETE FROM auth.users WHERE id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222') OR email IN ('admin@lexora.id', 'member@lexora.id');

-- 3. Masukkan ke auth.users
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    role,
    aud,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
) VALUES 
(
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'admin@lexora.id',
    crypt('admin12345', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Pustakawan Utama","role":"admin"}',
    now(),
    now(),
    'authenticated',
    'authenticated',
    '',
    '',
    '',
    ''
),
(
    '22222222-2222-2222-2222-222222222222',
    '00000000-0000-0000-0000-000000000000',
    'member@lexora.id',
    crypt('member12345', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Pras Santoso","role":"member"}',
    now(),
    now(),
    'authenticated',
    'authenticated',
    '',
    '',
    '',
    ''
);

-- 4. Masukkan ke auth.identities (Diperlukan oleh GoTrue Supabase untuk query login)
INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
) VALUES
(
    '11111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    json_build_object('sub', '11111111-1111-1111-1111-111111111111', 'email', 'admin@lexora.id')::jsonb,
    'email',
    '11111111-1111-1111-1111-111111111111',
    now(),
    now(),
    now()
),
(
    '22222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222',
    json_build_object('sub', '22222222-2222-2222-2222-222222222222', 'email', 'member@lexora.id')::jsonb,
    'email',
    '22222222-2222-2222-2222-222222222222',
    now(),
    now(),
    now()
);

-- 5. Pastikan role di public.profiles sinkron
UPDATE public.profiles SET role = 'admin', full_name = 'Pustakawan Utama' WHERE id = '11111111-1111-1111-1111-111111111111';
UPDATE public.profiles SET role = 'member', full_name = 'Pras Santoso' WHERE id = '22222222-2222-2222-2222-222222222222';
