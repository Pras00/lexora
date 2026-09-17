-- ==============================================================================
-- LEXORA — SISTEM INFORMASI PERPUSTAKAAN
-- Supabase PostgreSQL Database Migration Script
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'member');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_status AS ENUM ('active', 'suspended', 'blocked');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE book_status AS ENUM ('active', 'inactive');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE request_status AS ENUM ('pending', 'approved', 'rejected', 'expired', 'cancelled', 'not_picked_up', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE request_item_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE pass_status AS ENUM ('active', 'used', 'expired', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE loan_status AS ENUM ('active', 'completed', 'overdue');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE loan_item_status AS ENUM ('borrowed', 'returned', 'overdue', 'lost', 'damaged');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE damage_level AS ENUM ('none', 'minor', 'major', 'lost');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE extension_status AS ENUM ('pending', 'approved', 'rejected', 'auto_approved');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE waitlist_status AS ENUM ('waiting', 'notified', 'fulfilled', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE fine_type AS ENUM ('overdue', 'damage_minor', 'damage_major', 'lost');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE fine_status AS ENUM ('unpaid', 'paid');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. SEQUENCES UNTUK IDENTIFIER OTOMATIS
CREATE SEQUENCE IF NOT EXISTS member_number_seq START 1;
CREATE SEQUENCE IF NOT EXISTS request_number_seq START 1;

-- 4. TABEL PROFILES (Terhubung ke Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role DEFAULT 'member' NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    member_number TEXT UNIQUE NOT NULL,
    status user_status DEFAULT 'active' NOT NULL,
    no_show_count INT DEFAULT 0 NOT NULL,
    suspended_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 5. TABEL CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 6. TABEL BOOKS
CREATE TABLE IF NOT EXISTS public.books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT UNIQUE NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE RESTRICT NOT NULL,
    publisher TEXT,
    published_year INT,
    description TEXT,
    cover_url TEXT,
    price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total_stock INT DEFAULT 1 NOT NULL CHECK (total_stock >= 0),
    available_stock INT DEFAULT 1 NOT NULL CHECK (available_stock >= 0 AND available_stock <= total_stock),
    status book_status DEFAULT 'active' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 7. TABEL LOAN REQUESTS
CREATE TABLE IF NOT EXISTS public.loan_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    status request_status DEFAULT 'pending' NOT NULL,
    admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    admin_notes TEXT,
    requested_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    processed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL,
    pickup_deadline TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 8. TABEL LOAN REQUEST ITEMS
CREATE TABLE IF NOT EXISTS public.loan_request_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES public.loan_requests(id) ON DELETE CASCADE NOT NULL,
    book_id UUID REFERENCES public.books(id) ON DELETE RESTRICT NOT NULL,
    status request_item_status DEFAULT 'pending' NOT NULL,
    rejection_reason TEXT
);

-- 9. TABEL PICKUP PASSES
CREATE TABLE IF NOT EXISTS public.pickup_passes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID UNIQUE REFERENCES public.loan_requests(id) ON DELETE CASCADE NOT NULL,
    pickup_code TEXT UNIQUE NOT NULL,
    status pass_status DEFAULT 'active' NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 10. TABEL LOANS
CREATE TABLE IF NOT EXISTS public.loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID UNIQUE REFERENCES public.loan_requests(id) ON DELETE RESTRICT NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT NOT NULL,
    pickup_confirmed_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    status loan_status DEFAULT 'active' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 11. TABEL LOAN ITEMS
CREATE TABLE IF NOT EXISTS public.loan_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_id UUID REFERENCES public.loans(id) ON DELETE CASCADE NOT NULL,
    book_id UUID REFERENCES public.books(id) ON DELETE RESTRICT NOT NULL,
    due_date TIMESTAMPTZ NOT NULL,
    status loan_item_status DEFAULT 'borrowed' NOT NULL,
    extension_count INT DEFAULT 0 NOT NULL,
    returned_at TIMESTAMPTZ,
    damage_level damage_level DEFAULT 'none' NOT NULL,
    replacement_cost NUMERIC(12, 2) DEFAULT 0 NOT NULL,
    admin_notes TEXT
);

-- 12. TABEL LOAN EXTENSIONS
CREATE TABLE IF NOT EXISTS public.loan_extensions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_item_id UUID REFERENCES public.loan_items(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    status extension_status DEFAULT 'pending' NOT NULL,
    old_due_date TIMESTAMPTZ NOT NULL,
    new_due_date TIMESTAMPTZ NOT NULL,
    admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    requested_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    processed_at TIMESTAMPTZ
);

-- 13. TABEL WAITLIST
CREATE TABLE IF NOT EXISTS public.waitlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    book_id UUID REFERENCES public.books(id) ON DELETE CASCADE NOT NULL,
    status waitlist_status DEFAULT 'waiting' NOT NULL,
    position INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(user_id, book_id)
);

-- 14. TABEL FINES
CREATE TABLE IF NOT EXISTS public.fines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loan_item_id UUID REFERENCES public.loan_items(id) ON DELETE RESTRICT NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT NOT NULL,
    type fine_type NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    status fine_status DEFAULT 'unpaid' NOT NULL,
    days_overdue INT DEFAULT 0,
    paid_at TIMESTAMPTZ,
    confirmed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 15. TABEL NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false NOT NULL,
    related_id UUID,
    related_type TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ==============================================================================
-- 16. HELPER FUNCTIONS & TRIGGERS
-- ==============================================================================

-- Trigger: Otomatis buat Profile saat User mendaftar di auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    new_member_num TEXT;
BEGIN
    new_member_num := 'LX-' || LPAD(nextval('member_number_seq')::TEXT, 4, '0');
    
    INSERT INTO public.profiles (id, full_name, role, member_number)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Member Lexora'),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'member'::user_role),
        new_member_num
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger: Otomatis generate request_number (BR-YYYY-00001)
CREATE OR REPLACE FUNCTION public.set_request_number()
RETURNS TRIGGER AS $$
DECLARE
    current_yr TEXT;
    seq_val TEXT;
BEGIN
    IF NEW.request_number IS NULL OR NEW.request_number = '' THEN
        current_yr := TO_CHAR(now(), 'YYYY');
        seq_val := LPAD(nextval('request_number_seq')::TEXT, 5, '0');
        NEW.request_number := 'BR-' || current_yr || '-' || seq_val;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_request_number ON public.loan_requests;
CREATE TRIGGER trg_set_request_number
    BEFORE INSERT ON public.loan_requests
    FOR EACH ROW EXECUTE FUNCTION public.set_request_number();

-- ==============================================================================
-- 17. ATOMIC TRANSACTION: APPROVE LOAN REQUEST & DECREMENT STOCK
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.approve_loan_request(
    p_request_id UUID,
    p_admin_id UUID,
    p_approved_book_ids UUID[],
    p_pickup_deadline TIMESTAMPTZ,
    p_pickup_code TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    b_id UUID;
    req_status request_status;
    curr_stock INT;
BEGIN
    -- Validasi status request saat ini
    SELECT status INTO req_status FROM public.loan_requests WHERE id = p_request_id FOR UPDATE;
    IF req_status != 'pending' THEN
        RAISE EXCEPTION 'Pengajuan ini sudah tidak berstatus pending.';
    END IF;

    -- Validasi dan kurangi stok tiap buku secara atomik
    FOREACH b_id IN ARRAY p_approved_book_ids
    LOOP
        SELECT available_stock INTO curr_stock FROM public.books WHERE id = b_id FOR UPDATE;
        IF curr_stock <= 0 THEN
            RAISE EXCEPTION 'Stok buku % sudah habis.', b_id;
        END IF;

        UPDATE public.books
        SET available_stock = available_stock - 1,
            updated_at = now()
        WHERE id = b_id;

        UPDATE public.loan_request_items
        SET status = 'approved'
        WHERE request_id = p_request_id AND book_id = b_id;
    END LOOP;

    -- Tandai buku yang tidak disetujui sebagai rejected
    UPDATE public.loan_request_items
    SET status = 'rejected', rejection_reason = 'Stok tidak mencukupi atau tidak disetujui petugas.'
    WHERE request_id = p_request_id AND status = 'pending';

    -- Update status loan_request menjadi approved
    UPDATE public.loan_requests
    SET status = 'approved',
        admin_id = p_admin_id,
        processed_at = now(),
        pickup_deadline = p_pickup_deadline
    WHERE id = p_request_id;

    -- Terbitkan Pickup Pass
    INSERT INTO public.pickup_passes (request_id, pickup_code, status, expires_at)
    VALUES (p_request_id, p_pickup_code, 'active', p_pickup_deadline);

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 18. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_request_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_extensions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper function: cek apakah current user adalah admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id OR public.is_admin());

-- Categories & Books Policies (Read public/auth, write admin)
CREATE POLICY "Public can view categories" ON public.categories
    FOR SELECT USING (true);
CREATE POLICY "Admin can manage categories" ON public.categories
    FOR ALL USING (public.is_admin());

CREATE POLICY "Public can view active books" ON public.books
    FOR SELECT USING (true);
CREATE POLICY "Admin can manage books" ON public.books
    FOR ALL USING (public.is_admin());

-- Loan Requests Policies
CREATE POLICY "Users can view own requests" ON public.loan_requests
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can create loan request" ON public.loan_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin can update loan request" ON public.loan_requests
    FOR UPDATE USING (public.is_admin() OR auth.uid() = user_id);

-- Loan Request Items
CREATE POLICY "Users can view request items" ON public.loan_request_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.loan_requests r 
            WHERE r.id = loan_request_items.request_id AND (r.user_id = auth.uid() OR public.is_admin())
        )
    );
CREATE POLICY "Users can create request items" ON public.loan_request_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.loan_requests r 
            WHERE r.id = loan_request_items.request_id AND r.user_id = auth.uid()
        )
    );

-- Pickup Passes
CREATE POLICY "Users can view own pickup pass" ON public.pickup_passes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.loan_requests r 
            WHERE r.id = pickup_passes.request_id AND (r.user_id = auth.uid() OR public.is_admin())
        )
    );
CREATE POLICY "Admin can update pickup pass" ON public.pickup_passes
    FOR UPDATE USING (public.is_admin());

-- Loans & Loan Items
CREATE POLICY "Users can view own loans" ON public.loans
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Admin can manage loans" ON public.loans
    FOR ALL USING (public.is_admin());

-- Loan Items
CREATE POLICY "Users can view own loan items" ON public.loan_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.loans l 
            WHERE l.id = loan_items.loan_id AND (l.user_id = auth.uid() OR public.is_admin())
        )
    );
CREATE POLICY "Admin can manage loan items" ON public.loan_items
    FOR ALL USING (public.is_admin());

-- Fines
CREATE POLICY "Users can view own fines" ON public.fines
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Admin can manage fines" ON public.fines
    FOR ALL USING (public.is_admin());

-- Notifications
CREATE POLICY "Users can view and manage own notifications" ON public.notifications
    FOR ALL USING (auth.uid() = user_id);
