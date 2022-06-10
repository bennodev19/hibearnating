import type { NextApiRequest, NextApiResponse } from 'next';
import packageJson from '../../../package.json';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.send({
    version: packageJson.version,
    note: 'This is no public API!',
  });
}
