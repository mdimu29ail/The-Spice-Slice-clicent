import React, { Suspense, use } from 'react';

import { AuthContext } from '../Auth/AuthContext';

import Table from './Table';
import { myApplicationPromise } from '../ApplicationApi/ApplicationApi';

const PurchaseList = () => {
  const { user } = use(AuthContext);
  return (
    <div>
      <h2 className="text-3xl text-center font-bold py-4">Purchase List</h2>

      <Suspense
        fallback={
          <div className="w-full h-screen flex justify-center items-center">
            <span className="loading loading-spinner text-primary"></span>
            <span className="loading loading-spinner text-secondary"></span>
            <span className="loading loading-spinner text-accent"></span>
            <span className="loading loading-spinner text-neutral"></span>
            <span className="loading loading-spinner text-info"></span>
            <span className="loading loading-spinner text-success"></span>
            <span className="loading loading-spinner text-warning"></span>
            <span className="loading loading-spinner text-error"></span>
          </div>
        }
      >
        {' '}
        <Table myApplicationPromise={myApplicationPromise(user.email)}></Table>
      </Suspense>
    </div>
  );
};

export default PurchaseList;
