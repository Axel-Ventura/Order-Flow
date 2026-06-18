-- ═══════════════════════════════════════════════════════════════
--  OrderFlow — Auth tables migration
--  Compatible con Esquema.sql (PKs BIGINT IDENTITY)
--  Ejecuta este script en Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────
--  PASO 1: Columnas adicionales en usuarios
--  (activo + updated_at que necesita el backend de autenticación)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.usuarios
  ADD COLUMN IF NOT EXISTS activo     BOOLEAN     NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- ─────────────────────────────────────────────────────────────
--  PASO 2: Insertar roles base (si no existen)
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.roles (nombre, descripcion)
VALUES
  ('admin',    'Administrador del sistema'),
  ('vendedor', 'Usuario vendedor'),
  ('cliente',  'Usuario comprador / cliente')
ON CONFLICT (nombre) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
--  PASO 3: Tabla refresh_tokens
--  Referencias a usuarios(id_usuario) BIGINT
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.refresh_tokens (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     BIGINT       NOT NULL
                REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE,
  token       TEXT         NOT NULL UNIQUE,
  expires_at  TIMESTAMPTZ  NOT NULL,
  is_revoked  BOOLEAN      NOT NULL DEFAULT FALSE,
  ip_address  TEXT,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
--  PASO 4: Índices para refresh_tokens
-- ─────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token    ON public.refresh_tokens(token);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id  ON public.refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires  ON public.refresh_tokens(expires_at);

-- ─────────────────────────────────────────────────────────────
--  PASO 5: Row Level Security en refresh_tokens
--  Solo el service role del backend opera sobre esta tabla
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.refresh_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Backend service only" ON public.refresh_tokens
  USING (TRUE)
  WITH CHECK (TRUE);

-- ─────────────────────────────────────────────────────────────
--  OPCIONAL: Job de limpieza automática con pg_cron
--  Habilitar en: Supabase → Database → Extensions → pg_cron
-- ─────────────────────────────────────────────────────────────
-- SELECT cron.schedule('cleanup-expired-tokens', '0 3 * * *', $$
--   DELETE FROM public.refresh_tokens
--   WHERE is_revoked = TRUE OR expires_at < NOW();
-- $$);

-- ─────────────────────────────────────────────────────────────
--  VERIFICACIÓN
-- ─────────────────────────────────────────────────────────────
-- SELECT column_name, data_type FROM information_schema.columns
--   WHERE table_name = 'refresh_tokens' ORDER BY ordinal_position;

-- SELECT column_name, data_type FROM information_schema.columns
--   WHERE table_name = 'usuarios' ORDER BY ordinal_position;
