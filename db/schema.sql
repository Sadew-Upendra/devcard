CREATE TABLE IF NOT EXISTS players (
  login         text PRIMARY KEY,            -- lowercase
  display_login text NOT NULL,
  country       text,                        -- lowercase ISO code
  top_language  text,
  score         double precision NOT NULL,   -- unrounded rating, used for ranking
  overall       smallint NOT NULL,
  tier          text NOT NULL,
  card          jsonb NOT NULL,              -- full DevCard, doubles as 24h cache
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS players_score_idx
  ON players (score DESC);
CREATE INDEX IF NOT EXISTS players_country_score_idx
  ON players (country, score DESC);
CREATE INDEX IF NOT EXISTS players_lang_score_idx
  ON players (top_language, score DESC);