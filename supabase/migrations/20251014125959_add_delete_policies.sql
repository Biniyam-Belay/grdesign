-- Add delete policies for blogs and projects

-- Allow authenticated users to delete blogs
CREATE POLICY "Allow authenticated delete on blogs" 
ON blogs FOR DELETE 
TO authenticated 
USING (true);

-- Allow authenticated users to delete projects  
CREATE POLICY "Allow authenticated delete on projects"
ON projects FOR DELETE
TO authenticated 
USING (true);
