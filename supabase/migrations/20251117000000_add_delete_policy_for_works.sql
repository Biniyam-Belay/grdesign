-- Add delete policy for works

-- Allow authenticated users to delete works
CREATE POLICY "Allow authenticated delete on works" 
ON works FOR DELETE 
TO authenticated 
USING (true);
