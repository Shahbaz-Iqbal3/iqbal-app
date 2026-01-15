-- Blog feature schema migration
-- Tables: posts, post_revisions, post_stanzas, moderation_actions

CREATE TABLE posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id uuid NOT NULL,
    slug text NOT NULL UNIQUE,
    title text NOT NULL,
    content_md text NOT NULL,
    content_html text,
    status text NOT NULL DEFAULT 'draft', -- draft|submitted|published|rejected
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_slug ON posts(slug);

CREATE TABLE post_revisions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
    content_md text NOT NULL,
    content_html text,
    created_at timestamptz NOT NULL DEFAULT now(),
    author_id uuid NOT NULL
);
CREATE INDEX idx_post_revisions_post_id ON post_revisions(post_id);

CREATE TABLE post_stanzas (
    post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
    stanza_id uuid NOT NULL,
    PRIMARY KEY (post_id, stanza_id)
);
CREATE INDEX idx_post_stanzas_stanza_id ON post_stanzas(stanza_id);

CREATE TABLE moderation_actions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
    action text NOT NULL, -- approve|reject
    reason text,
    moderator_id uuid NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_moderation_actions_post_id ON moderation_actions(post_id);

-- Row Level Security (RLS) policies (example, adjust for your app)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authors can manage their own posts" ON posts
    FOR ALL USING (auth.uid() = author_id);

CREATE POLICY "Admins can moderate posts" ON posts
    FOR UPDATE USING (auth.role() = 'admin');

-- Repeat similar RLS for other tables as needed
