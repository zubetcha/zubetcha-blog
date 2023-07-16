import type { NextApiRequest, NextApiResponse } from 'next';

import { getCategories } from '@lib/db';

type Data = {
  categories: { id: string; name: string }[];
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const categories = await getCategories();

  res.status(200).json({ categories });
};

export default handler;
