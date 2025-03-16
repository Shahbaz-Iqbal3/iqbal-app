-- Add username field to users table (if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'username'
    ) THEN
        ALTER TABLE public.users ADD COLUMN username TEXT UNIQUE;
        
        -- Update existing users to have a username based on their name or email
        UPDATE public.users
        SET username = COALESCE(
            name,
            SPLIT_PART(email, '@', 1) || '_' || SUBSTRING(id::text, 1, 8)
        )
        WHERE username IS NULL;
        
        -- Add a constraint to ensure username is not null after initial setup
        ALTER TABLE public.users ALTER COLUMN username SET NOT NULL;
        
        -- Create a trigger function to automatically set username for new users
        CREATE OR REPLACE FUNCTION public.handle_new_user_username()
        RETURNS TRIGGER AS $$
        BEGIN
            -- If username is not provided, generate one from name or email
            IF NEW.username IS NULL THEN
                NEW.username := COALESCE(
                    NEW.name,
                    SPLIT_PART(NEW.email, '@', 1) || '_' || SUBSTRING(NEW.id::text, 1, 8)
                );
            END IF;
            
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
        
        -- Create trigger to run the function before insert
        DROP TRIGGER IF EXISTS set_username_on_insert ON public.users;
        CREATE TRIGGER set_username_on_insert
        BEFORE INSERT ON public.users
        FOR EACH ROW
        EXECUTE FUNCTION public.handle_new_user_username();
    END IF;
END
$$; 