export const myApplicationPromise = email => {
  return fetch(`http://localhost:3000/applications?email=${email}`, {
    credentials: 'include',
  }).then(res => res.json());
};

export const myCreatePromise = email => {
  return fetch(`http://localhost:3000/foods?email=${email}`, {
    credentials: 'include',
  }).then(res => res.json());
};
