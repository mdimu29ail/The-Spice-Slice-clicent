export const myApplicationPromise = email => {
  return fetch(
    `https://spice-slice-server-lac.vercel.app/applications?email=${email}`,
    {
      credentials: 'include',
    },
  ).then(res => res.json());
};

export const myCreatePromise = email => {
  return fetch(
    `https://spice-slice-server-lac.vercel.app/foods?email=${email}`,
    {
      credentials: 'include',
    },
  ).then(res => res.json());
};
