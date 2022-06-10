import React from 'react';
import { useRouter } from 'next/router';

const OkayBear = () => {
  const router = useRouter();
  const { id } = router.query;

  return <p>Okay Bear; {id}</p>;
};

export default OkayBear;
