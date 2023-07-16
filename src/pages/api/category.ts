import type { NextApiRequest, NextApiResponse } from 'next';

import { getCategories } from '@lib/db';
import type { Category } from '@type/post';

type Data = {
  categories: Category[];
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const categories = await getCategories();

  res.status(200).json({ categories });
};

export default handler;
