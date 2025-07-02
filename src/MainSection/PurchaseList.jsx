import React, { Suspense, use } from 'react';

import { AuthContext } from '../Auth/AuthContext';

import Table from './Table';
import { myApplicationPromise } from '../ApplicationApi/ApplicationApi';
import Loading from '../Loading/Loading';

const PurchaseList = () => {
  const { user } = use(AuthContext);
  return (
    <div>
      <h2 className="text-3xl text-center font-bold py-4">Purchase List</h2>

      <Suspense fallback={<Loading></Loading>}>
        {' '}
        <Table myApplicationPromise={myApplicationPromise(user.email)}></Table>
      </Suspense>
    </div>
  );
};

export default PurchaseList;
