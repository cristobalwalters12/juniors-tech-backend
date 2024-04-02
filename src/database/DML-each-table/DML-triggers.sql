CREATE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE
    ON
        users
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE
    ON
        users
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE
    ON
        posts
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE
    ON
        comments
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_at();