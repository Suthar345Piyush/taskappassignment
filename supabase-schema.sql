-- task-app db schema  


-- create task table 

CREATE TABLE tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending' , 'in_progress' , 'done')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);



-- enabling row level security  

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;



-- create policy - where user can only see their own tasks 

CREATE POLICY "Users can view own tasks"
  ON tasks
  FOR SELECT 
  USING (auth.uid() = user_id);




-- create policy - where user can only insert their own tasks 

CREATE POLICY "User can insert own tasks"
  ON tasks
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);



-- create policy - user can update their own tasks 

CREATE POLICY "User can update own tasks"
  ON tasks
  FOR UPDATE
  USING (auth.uid() = user_id);



-- create policy - user can delete their own tasks

CREATE POLICY "User can delete own tasks"
  ON tasks
  FOR DELETE
  USING (auth.uid() = user_id);





-- creating indexes for better performance 

CREATE INDEX tasks_user_id_idx ON tasks(user_id);
CREATE INDEX tasks_created_at_idx ON tasks(created_at);
CREATE INDEX tasks_status_idx ON tasks(status);



