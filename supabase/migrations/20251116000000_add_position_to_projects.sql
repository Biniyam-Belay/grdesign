ALTER TABLE projects ADD COLUMN "position" INTEGER;

UPDATE projects
SET "position" = p.rn
FROM (
    SELECT id, ROW_NUMBER() OVER (ORDER BY title) as rn
    FROM projects
) as p
WHERE projects.id = p.id;

ALTER TABLE projects ALTER COLUMN "position" SET NOT NULL;
