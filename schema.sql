CREATE EXTENSION plv8;
CREATE POLICY buckets_policy ON storage.buckets FOR ALL TO PUBLIC USING (true) WITH CHECK (true);

INSERT INTO storage.buckets (id, name) VALUES ('USER_AVATAR', 'USER_AVATAR');

UPDATE storage.buckets SET public = true;


CREATE OR REPLACE FUNCTION get_team_onboarding(
    input_data JSON
)
RETURNS JSON
SET search_path = ''
AS $$
let returnData = {
    data:[],
    count:0
}
plv8.subtransaction(function() {
  const { userId, page, limit,} = input_data;

  const offset = (page - 1) * limit;

  const teams = plv8.execute(`SELECT * FROM team_schema.team_table LIMIT $1 OFFSET $2`, [limit, offset])

  const teamcount = plv8.execute(`SELECT COUNT(*) FROM team_schema.team_table`)[0].count

  returnData.data = teams;
  returnData.count = Number(teamcount)
})
return returnData;
$$ LANGUAGE plv8;

GRANT ALL ON ALL TABLES IN SCHEMA user_schema TO PUBLIC;
GRANT ALL ON ALL TABLES IN SCHEMA user_schema TO POSTGRES;
GRANT ALL ON SCHEMA user_schema TO postgres;
GRANT ALL ON SCHEMA user_schema TO public;

GRANT ALL ON ALL TABLES IN SCHEMA team_schema TO PUBLIC;
GRANT ALL ON ALL TABLES IN SCHEMA team_schema TO POSTGRES;
GRANT ALL ON SCHEMA team_schema TO postgres;
GRANT ALL ON SCHEMA team_schema TO public;

GRANT ALL ON ALL TABLES IN SCHEMA task_schema TO PUBLIC;
GRANT ALL ON ALL TABLES IN SCHEMA task_schema TO POSTGRES;
GRANT ALL ON SCHEMA task_schema TO postgres;
GRANT ALL ON SCHEMA task_schema TO public;

GRANT ALL ON ALL TABLES IN SCHEMA public TO PUBLIC;
GRANT ALL ON ALL TABLES IN SCHEMA public TO POSTGRES;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;