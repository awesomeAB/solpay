import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from "utils/supabase-client"

const handler = (req: NextApiRequest, res: NextApiResponse) => {
    supabase.auth.api.setAuthCookie(req, res);
};

export default handler;