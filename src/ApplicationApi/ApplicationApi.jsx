export const myApplicationPromise = email => {
  return fetch(
    `https://the-spice-slice-server.vercel.app/applications?email=${email}`,
    {
      credentials: 'include',
    },
  ).then(res => res.json());
};

export const myCreatePromise = email => {
  return fetch(
    `https://the-spice-slice-server.vercel.app/foods?email=${email}`,
    {
      credentials: 'include',
    },
  ).then(res => res.json());
};
